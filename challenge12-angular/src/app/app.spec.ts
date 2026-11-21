import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('muestra el Top 2 de "air" al iniciar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const names = Array.from(compiled.querySelectorAll('.results .name')).map((e) => e.textContent);
    expect(names).toEqual(['air force', 'air max']);
  });
});
