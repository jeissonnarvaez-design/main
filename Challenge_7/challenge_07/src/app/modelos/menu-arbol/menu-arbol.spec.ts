import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuArbol } from './menu-arbol';

describe('MenuArbol', () => {
  let component: MenuArbol;
  let fixture: ComponentFixture<MenuArbol>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuArbol],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuArbol);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
