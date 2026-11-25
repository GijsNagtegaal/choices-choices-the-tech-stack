import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DirectusService } from './directus.service';

describe('DirectusService', () => {
  let service: DirectusService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(DirectusService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('explains network and browser-blocked requests instead of reporting an unknown error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const citiesPromise = service.getCities();
    const request = httpTesting.expectOne(
      (req) => req.url === 'https://fdnd-agency.directus.app/items/apa_cities'
    );
    request.error(new ProgressEvent('error'));

    await expect(citiesPromise).rejects.toThrow(
      'Could not load data from Directus: The browser could not reach Directus. Check network connectivity and the browser console for CORS details.'
    );
    consoleError.mockRestore();
  });
});
