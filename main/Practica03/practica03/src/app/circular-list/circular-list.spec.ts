import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularList } from './circular-list';

describe('CircularList', () => {
  let component: CircularList;
  let fixture: ComponentFixture<CircularList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularList],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
