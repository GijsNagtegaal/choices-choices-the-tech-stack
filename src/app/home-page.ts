import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { City, DirectusService } from './directus.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html'
})
export class HomePage implements OnInit {
  private readonly directus = inject(DirectusService);

  readonly cities = signal<City[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  async ngOnInit(): Promise<void> {
    try {
      this.cities.set(await this.directus.getCities());
    } catch (error: unknown) {
      this.error.set(error instanceof Error ? error.message : 'Unable to load cities.');
    } finally {
      this.loading.set(false);
    }
  }
}
