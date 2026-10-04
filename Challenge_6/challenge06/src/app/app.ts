import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Arbol } from './arbol/arbol';
import * as d3 from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  titulo = 'Árbol Binario en Angular';
  
  miArbol: Arbol = new Arbol();
  
  enOrden: number[] = [];
  preOrden: number[] = [];
  postOrden: number[] = [];
  existe30: boolean = false;
  existe99: boolean = false;

  ngOnInit(): void {
    this.miArbol.agregarNodo(50, 500);
    this.miArbol.agregarNodo(30, 300);
    this.miArbol.agregarNodo(70, 700);
    this.miArbol.agregarNodo(20, 200);
    this.miArbol.agregarNodo(40, 400);
    this.miArbol.agregarNodo(60, 600);
    this.miArbol.agregarNodo(80, 800);
    this.miArbol.agregarNodo(10, 100);
    this.miArbol.agregarNodo(25, 250);

    this.enOrden = this.miArbol.recorridoEnOrden();
    this.preOrden = this.miArbol.recorridoPreOrden();
    this.postOrden = this.miArbol.recorridoPostOrden();

    this.existe30 = this.miArbol.contiene(30);
    this.existe99 = this.miArbol.contiene(99);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dibujarArbolD3();
    }, 0);
  }

  dibujarArbolD3(): void {
    if (!this.miArbol.raiz) {
      console.warn('El árbol está vacío');
      return;
    }

    const datosJerarquicos = this.convertirAJerarquia(this.miArbol.raiz);

    const width = 800;
    const height = 500;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    d3.select('#svg-arbol').selectAll('*').remove();

    const svg = d3.select('#svg-arbol')
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid #ccc')
      .style('background', '#fafafa');

    const root = d3.hierarchy(datosJerarquicos);
    const treeLayout = d3.tree<any>().size([
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ]);
    treeLayout(root);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)
      .attr('stroke', '#999')
      .attr('stroke-width', 2);

    g.selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', 20)
      .attr('fill', (d: any) => d.children ? '#2196F3' : '#4CAF50')
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    g.selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bold')
      .attr('font-size', '12px')
      .text((d: any) => d.data.id);
  }

  convertirAJerarquia(nodo: any): any {
    if (!nodo) return null;
    const hijos = [
      this.convertirAJerarquia(nodo.izquierdo),
      this.convertirAJerarquia(nodo.derecho)
    ].filter(c => c !== null);

    return {
      id: nodo.id,
      children: hijos.length > 0 ? hijos : undefined
    };
  }
}