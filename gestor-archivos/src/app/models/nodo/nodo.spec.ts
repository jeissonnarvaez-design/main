import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nodo } from './nodo';

describe('Nodo', () => {
  let component: Nodo;
  let fixture: ComponentFixture<Nodo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nodo],
    }).compileComponents();

    fixture = TestBed.createComponent(Nodo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
