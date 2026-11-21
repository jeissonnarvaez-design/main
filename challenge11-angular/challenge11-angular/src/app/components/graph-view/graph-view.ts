import {
  AfterViewInit, Component, ElementRef, OnDestroy, effect, input, output, viewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { Edge } from '../../models/graph';
import { SocialNode } from '../../models/social';

type SimNode = SocialNode & d3.SimulationNodeDatum;
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: SimNode;
  target: SimNode;
  kind: 'friend' | 'lives';
}

@Component({
  selector: 'app-graph-view',
  template: `<svg #svg></svg>`,
  styleUrl: './graph-view.css',
})
export class GraphView implements AfterViewInit, OnDestroy {
  readonly nodes = input.required<SocialNode[]>();
  readonly edges = input.required<Edge[]>();
  readonly highlight = input<Set<string> | null>(null);

  readonly nodeClick = output<SocialNode>();
  readonly backgroundClick = output<void>();

  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private svg!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private linkLayer!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private nodeLayer!: d3.Selection<SVGGElement, unknown, null, undefined>;
  private simulation?: d3.Simulation<SimNode, SimLink>;
  private readonly positions = new Map<string, { x: number; y: number }>();
  private resizeObserver?: ResizeObserver;
  private ready = false;
  private lastData?: SocialNode[];
  private lastEdges?: Edge[];

  constructor() {
    effect(() => {
      const nodes = this.nodes();
      const edges = this.edges();
      if (this.ready && (nodes !== this.lastData || edges !== this.lastEdges)) this.render(nodes, edges);
    });
    effect(() => {
      const ids = this.highlight();
      if (this.ready) this.applyHighlight(ids);
    });
  }

  ngAfterViewInit(): void {
    this.svg = d3.select(this.svgRef().nativeElement);
    const zoomLayer = this.svg.append('g');
    this.linkLayer = zoomLayer.append('g');
    this.nodeLayer = zoomLayer.append('g');

    this.svg.call(
      d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.3, 3])
        .on('zoom', (e) => zoomLayer.attr('transform', e.transform.toString())),
    );
    this.svg.on('click', (e: MouseEvent) => {
      if (e.target === this.svgRef().nativeElement) this.backgroundClick.emit();
    });

    this.ready = true;
    this.render(this.nodes(), this.edges());

    this.resizeObserver = new ResizeObserver(() => {
      const { width, height } = this.svgRef().nativeElement.getBoundingClientRect();
      this.simulation?.force('center', d3.forceCenter(width / 2, height / 2)).alpha(0.3).restart();
    });
    this.resizeObserver.observe(this.svgRef().nativeElement);
  }

  ngOnDestroy(): void {
    this.simulation?.stop();
    this.resizeObserver?.disconnect();
  }

  private render(data: SocialNode[], edges: Edge[]): void {
    this.lastData = data;
    this.lastEdges = edges;
    const { width, height } = this.svgRef().nativeElement.getBoundingClientRect();

    const nodes: SimNode[] = data.map((n) => ({ ...n, ...this.positions.get(n.id) }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const links: SimLink[] = edges.map((e) => {
      const source = byId.get(e.source)!;
      const target = byId.get(e.target)!;
      const kind = source.type === 'city' || target.type === 'city' ? 'lives' : 'friend';
      return { source, target, kind };
    });

    const link = this.linkLayer
      .selectAll<SVGLineElement, SimLink>('line')
      .data(links, (d) => d.source.id + '|' + d.target.id)
      .join('line')
      .attr('class', (d) => 'link ' + d.kind);

    const node = this.nodeLayer
      .selectAll<SVGGElement, SimNode>('g.node')
      .data(nodes, (d) => d.id)
      .join((enter) => {
        const g = enter.append('g');
        g.append('circle');
        g.append('text');
        return g;
      })
      .attr('class', (d) => 'node ' + d.type);

    node.select('circle').attr('r', (d) => (d.type === 'city' ? 22 : 12));
    node.select('text')
      .text((d) => (d.type === 'city' ? d.name : `${d.name} (${d.age})`))
      .attr('dy', (d) => (d.type === 'city' ? 36 : 26));

    node.on('click', (_e, d) => {
      const original = data.find((n) => n.id === d.id);
      if (original) this.nodeClick.emit(original);
    });

    node.call(
      d3.drag<SVGGElement, SimNode>()
        .on('start', (e, d) => {
          if (!e.active) this.simulation?.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => {
          if (!e.active) this.simulation?.alphaTarget(0);
          d.fx = null; d.fy = null;
        }),
    );

    this.simulation?.stop();
    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink<SimNode, SimLink>(links).distance((d) => (d.kind === 'lives' ? 70 : 110)))
      .force('charge', d3.forceManyBody<SimNode>().strength((d) => (d.type === 'city' ? -500 : -250)))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimNode>().radius((d) => (d.type === 'city' ? 40 : 24)))
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x!).attr('y1', (d) => d.source.y!)
          .attr('x2', (d) => d.target.x!).attr('y2', (d) => d.target.y!);
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
        nodes.forEach((n) => this.positions.set(n.id, { x: n.x!, y: n.y! }));
      });
    if (this.positions.size) this.simulation.alpha(0.4);

    for (const id of this.positions.keys()) if (!byId.has(id)) this.positions.delete(id);

    this.applyHighlight(this.highlight());
  }

  private applyHighlight(ids: Set<string> | null): void {
    this.nodeLayer.selectAll<SVGGElement, SimNode>('g.node')
      .classed('faded', (d) => (ids ? !ids.has(d.id) : false));
    this.linkLayer.selectAll<SVGLineElement, SimLink>('line')
      .classed('faded', (d) => (ids ? !(ids.has(d.source.id) && ids.has(d.target.id)) : false));
  }
}
