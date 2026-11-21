import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra las personas de la ciudad seleccionada', () => {
    const fixture = TestBed.createComponent(App);
    fixture.componentInstance.selectCity('Bogotá');
    fixture.detectChanges();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('.people li');
    expect(Array.from(items).map((li) => li.textContent?.trim())).toEqual(['Juan — 25 años', 'Sofía — 22 años']);
  });
});
