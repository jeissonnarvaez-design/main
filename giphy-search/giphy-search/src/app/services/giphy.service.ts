import { Injectable, computed, signal } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { giphyApi, httpErrorMessage } from '../core/http';
import { Gif, GiphyResponse, HttpClientKind, SearchParams } from '../models/giphy.models';

const PAGE_SIZE = 24;

@Injectable({ providedIn: 'root' })
export class GiphyService {
  readonly gifs = signal<Gif[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly total = signal(0);
  readonly query = signal('');
  readonly cliente = signal<HttpClientKind>('axios');

  readonly hayMas = computed(() => this.gifs().length < this.total());

  private controller?: AbortController;

  buscar(q: string) {
    this.query.set(q.trim());
    this.gifs.set([]);
    this.total.set(0);
    return this.cargarPagina(0);
  }

  cargarMas() {
    if (this.cargando() || !this.hayMas()) return Promise.resolve();
    return this.cargarPagina(this.gifs().length);
  }

  private async cargarPagina(offset: number) {
    const q = this.query();
    if (!q) return;

    this.controller?.abort();
    const controller = (this.controller = new AbortController());

    this.cargando.set(true);
    this.error.set(null);
    try {
      const params: SearchParams = { q, limit: PAGE_SIZE, offset, rating: 'g', lang: 'es' };
      const res =
        this.cliente() === 'axios'
          ? await this.searchConAxios(params, controller.signal)
          : await this.searchConFetch(params, controller.signal);

      const vistos = new Set(this.gifs().map((g) => g.id));
      this.gifs.update((prev) => [...prev, ...res.data.filter((g) => !vistos.has(g.id))]);
      this.total.set(res.pagination.total_count);
    } catch (e) {
      if (axios.isCancel(e) || (e as Error).name === 'AbortError') return;
      this.error.set((e as Error).message);
    } finally {
      if (this.controller === controller) this.cargando.set(false);
    }
  }

  private async searchConAxios(params: SearchParams, signal: AbortSignal) {
    const { data } = await giphyApi.get<GiphyResponse>('/gifs/search', { params, signal });
    return data;
  }

  private async searchConFetch(params: SearchParams, signal: AbortSignal) {
    const query = new URLSearchParams({
      api_key: environment.giphyApiKey,
      q: params.q,
      limit: String(params.limit),
      offset: String(params.offset),
      rating: params.rating ?? 'g',
      lang: params.lang ?? 'es',
    });

    let resp: Response;
    try {
      resp = await fetch(`${environment.giphyApiUrl}/gifs/search?${query}`, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
        headers: { Accept: 'application/json' },
      });
    } catch (e) {
      if ((e as Error).name === 'AbortError') throw e;
      if ((e as Error).name === 'TimeoutError') throw new Error(httpErrorMessage(undefined, 'ECONNABORTED'));
      throw new Error(httpErrorMessage());
    }

    if (!resp.ok) throw new Error(httpErrorMessage(resp.status));
    return (await resp.json()) as GiphyResponse;
  }
}
