import Link from "next/link";
import { connection } from "next/server";
import styles from "./page.module.css";

const API_URL = "https://fdnd-agency.directus.app";

export const metadata = {
  title: "Air Quality",
  description: "Explore street-level air quality measurements by city.",
};

async function getCities() {
  const url = new URL("/items/apa_cities", API_URL);
  url.searchParams.set("fields", "id,name,slug,latitude,longitude,date_created");

  let response;
  try {
    response = await fetch(url, { cache: "no-store" });
  } catch (error) {
    console.error("Unable to reach Directus while loading cities:", error);
    throw new Error("Could not connect to Directus. Please try again later.", {
      cause: error,
    });
  }

  if (!response.ok) {
    const body = await response.text();
    let message = body || response.statusText;

    try {
      const errorJson = JSON.parse(body);
      message = errorJson?.errors?.[0]?.message || message;
    } catch {
      // Keep the response body as the error message when it is not JSON.
    }

    console.error(`Directus Error [${response.status}] at ${url.pathname}:`, message);
    throw new Error(`Could not load cities from Directus: ${message}`);
  }

  const json = await response.json();
  if (!Array.isArray(json.data)) {
    throw new Error("Directus returned an invalid city response.");
  }

  return json.data.map((city) => ({
    ...city,
    slug:
      city.slug ||
      city.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      "",
  }));
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M5 7h14M7 7l-4 8h8L7 7Zm10 0-4 8h8l-4-8ZM5 21h14" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="m19 9-5 5-4-4-5 5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default async function Home() {
  await connection();

  let cities = [];
  let error = "";
  try {
    cities = await getCities();
  } catch (loadError) {
    error =
      loadError instanceof Error
        ? loadError.message
        : "Unable to load cities from Directus.";
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <article className={styles.article}>
            <h2>What does this site show?</h2>
            <p>
              This platform helps residents, researchers, and policymakers
              understand air quality through reliable street-level measurements
              and clear insights.
            </p>
          </article>

          <article className={`${styles.article} ${styles.howToArticle}`}>
            <h2>How to use it</h2>
            <div className={styles.howTo}>
              <ul className={`${styles.iconList} ${styles.iconRail}`} aria-hidden="true">
                <li><MapIcon /></li>
                <li><ScaleIcon /></li>
                <li><GraphIcon /></li>
              </ul>
              <ul className={styles.textList}>
                <li>
                  <h3>Explore the map</h3>
                  <p>See air quality across the cities.</p>
                </li>
                <li>
                  <h3>Compare locations</h3>
                  <p>Find cleaner and more polluted areas.</p>
                </li>
                <li>
                  <h3>Read the air quality index</h3>
                  <p>Understand levels and take action.</p>
                </li>
              </ul>
            </div>
          </article>
        </section>

        <h2>Select the city you want info from</h2>

        <section className={styles.cityList} aria-label="Cities">
          {error ? (
            <p className={styles.error} role="alert">{error}</p>
          ) : cities.length ? (
            <ul>
              {cities.map((city) => (
                <li key={city.id}>
                  <Link href={`/${city.slug}/map`} className={styles.cityLink}>
                    <div>
                      <h3>{city.name}</h3>
                      <p>Africa</p>
                    </div>
                    <ChevronRightIcon />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No cities are currently available.</p>
          )}
        </section>
      </main>
    </div>
  );
}
