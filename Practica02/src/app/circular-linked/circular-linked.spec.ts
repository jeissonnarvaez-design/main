import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularLinked } from './circular-linked';

describe('CircularLinked', () => {
  let component: CircularLinked;
  let fixture: ComponentFixture<CircularLinked>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CircularLinked],
    }).compileComponents();

    fixture = TestBed.createComponent(CircularLinked);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
