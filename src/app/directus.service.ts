import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

const API_URL = 'https://fdnd-agency.directus.app';

export interface City {
  id: number | string;
  name: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
}

interface DirectusCity {
  id: number | string;
  name: string;
  slug: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface DirectusResponse<T> {
  data: T[];
}

@Injectable({ providedIn: 'root' })
export class DirectusService {
  private readonly http = inject(HttpClient);

  async getCities(): Promise<City[]> {
    const records = await this.request<DirectusCity>('/items/apa_cities', {
      fields: 'id,name,slug,latitude,longitude,date_created'
    });

    return records.map((city) => ({
      id: city.id,
      name: city.name,
      slug: city.slug || slugify(city.name),
      latitude: city.latitude,
      longitude: city.longitude
    }));
  }

  private async request<T>(endpoint: string, params: Record<string, string>): Promise<T[]> {
    const searchParams = new HttpParams({ fromObject: params });
    const url = new URL(endpoint, API_URL);

    try {
      const response = await firstValueFrom(
        this.http.get<DirectusResponse<T>>(url.toString(), { params: searchParams })
      );
      if (!Array.isArray(response.data)) {
        throw new Error(`Directus returned an invalid response at ${url.pathname}.`);
      }
      return response.data;
    } catch (error: unknown) {
      if (error instanceof HttpErrorResponse) {
        const message = getDirectusErrorMessage(error);
        console.error(`Directus Error [${error.status}] at ${url.pathname}:`, message);
        throw new Error(`Could not load data from Directus: ${message}`, { cause: error });
      }
      throw error;
    }
  }
}

export function slugify(value: string | null | undefined): string {
  return value
    ? value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : '';
}

function getDirectusErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'The browser could not reach Directus. Check network connectivity and the browser console for CORS details.';
  }

  const body: unknown = error.error;
  if (typeof body === 'object' && body !== null && 'errors' in body) {
    const errors: unknown = body.errors;
    if (Array.isArray(errors) && errors[0] && typeof errors[0] === 'object') {
      const message: unknown = errors[0].message;
      if (typeof message === 'string') {
        return message;
      }
    }
  }
  if (typeof body === 'string' && body.length > 0) {
    return body;
  }
  return error.statusText || 'Unknown Directus error';
}
