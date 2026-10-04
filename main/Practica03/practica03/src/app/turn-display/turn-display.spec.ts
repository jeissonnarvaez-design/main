import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnDisplay } from './turn-display';

describe('TurnDisplay', () => {
  let component: TurnDisplay;
  let fixture: ComponentFixture<TurnDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(TurnDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
