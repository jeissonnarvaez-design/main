import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuNode } from './menu-node';

describe('MenuNode', () => {
  let component: MenuNode;
  let fixture: ComponentFixture<MenuNode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuNode],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuNode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
