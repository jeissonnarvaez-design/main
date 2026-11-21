import { TestBed } from '@angular/core/testing';
import { SocialGraphService } from './social-graph.service';

describe('SocialGraphService', () => {
  let s: SocialGraphService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    s = TestBed.inject(SocialGraphService);
  });

  it('lista las personas que viven en una ciudad', () => {
    expect(s.peopleInCity('Medellín').map((p) => p.name)).toEqual(['Mateo', 'Laura', 'Andrés']);
  });

  it('una persona necesita una ciudad existente', () => {
    expect(() => s.addPerson('Pedro', 28, 'Pasto')).toThrowError(/no existe/);
    s.addPerson('Pedro', 28, 'Cali');
    expect(s.peopleInCity('Cali').map((p) => p.name)).toContain('Pedro');
  });

  it('moveTo mantiene una sola ciudad', () => {
    s.moveTo('Juan', 'Cali');
    expect(s.peopleInCity('Bogotá').map((p) => p.name)).not.toContain('Juan');
    expect(s.neighbors('person:juan').filter((n) => n.type === 'city').length).toBe(1);
  });

  it('eliminar una ciudad elimina a sus habitantes', () => {
    s.removeNode('city:cartagena');
    expect(s.findPerson('Camila')).toBeNull();
    expect(s.friendsOf('Andrés').map((p) => p.name)).toEqual(['Laura']);
  });
});
