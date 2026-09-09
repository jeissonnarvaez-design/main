import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglyListComponent } from './singly-list';

describe('SinglyList', () => {
  let component: SinglyListComponent;
  let fixture: ComponentFixture<SinglyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinglyListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SinglyListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
