import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoublyList } from './doubly-list';

describe('DoublyList', () => {
  let component: DoublyList;
  let fixture: ComponentFixture<DoublyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoublyList],
    }).compileComponents();

    fixture = TestBed.createComponent(DoublyList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
