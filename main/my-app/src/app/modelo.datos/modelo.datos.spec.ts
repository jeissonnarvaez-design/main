import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeloDatos } from './modelo.datos';

describe('ModeloDatos', () => {
  let component: ModeloDatos;
  let fixture: ComponentFixture<ModeloDatos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeloDatos],
    }).compileComponents();

    fixture = TestBed.createComponent(ModeloDatos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
