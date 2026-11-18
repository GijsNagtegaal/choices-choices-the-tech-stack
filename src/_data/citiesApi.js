const API_URL = "https://fdnd-agency.directus.app";

function slugify(value) {
  return value
    ? value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "";
}

async function request(endpoint, params = {}) {
  const url = new URL(endpoint, API_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    const body = await response.text();
    let message = response.statusText;

    try {
      const errorJson = JSON.parse(body);
      message = errorJson?.errors?.[0]?.message || body || message;
    } catch {
      message = body || message;
    }

    throw new Error(
      `Directus request failed (${response.status}) at ${url.pathname}: ${message}`
    );
  }

  const json = await response.json();
  if (!Array.isArray(json.data)) {
    throw new Error(`Directus returned an invalid city response at ${url.pathname}`);
  }

  return json.data;
}

export default async function getCities() {
  const cities = await request("/items/apa_cities", {
    fields: "id,name,slug,latitude,longitude",
    sort: "name"
  });

  return cities.map((city) => ({
    ...city,
    slug: city.slug || slugify(city.name)
  }));
}
