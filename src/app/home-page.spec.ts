import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DirectusService } from './directus.service';
import { HomePage } from './home-page';

describe('HomePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        provideRouter([]),
        {
          provide: DirectusService,
          useValue: { getCities: () => new Promise(() => {}) }
        }
      ]
    });
  });

  it('renders city links to their map routes', () => {
    const fixture = TestBed.createComponent(HomePage);
    fixture.componentInstance.cities.set([
      {
        id: 1,
        name: 'Nairobi',
        slug: 'nairobi',
        latitude: -1.2864,
        longitude: 36.8172
      }
    ]);
    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.textContent).toContain('Nairobi');
    expect(link?.getAttribute('href')).toBe('/nairobi/map');
  });
});
