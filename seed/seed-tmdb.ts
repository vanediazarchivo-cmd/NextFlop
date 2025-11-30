/**
 * SEED TMDB → MongoDB
 * Carga ~500 películas variadas en la colección "media".
 */

import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();

// Variables de entorno
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

if (!TMDB_API_KEY) {
  console.error("❌ Falta TMDB_API_KEY en .env");
  process.exit(1);
}

if (!MONGO_URI) {
  console.error("❌ Falta MONGO_URI en .env");
  process.exit(1);
}

// Lista de géneros variados
const GENRES = [
  28, 12, 16, 35, 80, 99, 18, 14, 27, 10749, 878, 53,
];

interface TMDBResponse {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

// Descarga películas por género
async function fetchMoviesByGenre(genreId: number, pages = 3) {
  const movies: any[] = [];

  for (let page = 1; page <= pages; page++) {
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&language=en-US&page=${page}&sort_by=popularity.desc`;

    const res = await fetch(url);
    const data = (await res.json()) as TMDBResponse;

    if (data && Array.isArray(data.results)) {
      movies.push(...data.results);
    }
  }

  return movies;
}

async function waitForMongo(uri: string, retries = 10, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      await client.close();
      return true;
    } catch (err) {
      console.log(`Mongo not ready yet (attempt ${i + 1}/${retries}), retrying in ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return false;
}

async function seed() {
  const ok = await waitForMongo(MONGO_URI!, 20, 2000);
  if (!ok) {
    console.error('❌ Could not connect to MongoDB after retries.')
    process.exit(1)
  }
  console.log("🚀 Conectando a Mongo...");
  const client = new MongoClient(MONGO_URI!);
  await client.connect();
  const db = client.db();
  const collection = db.collection("media");

  console.log("🧹 Limpiando colección 'media'...");
  await collection.deleteMany({});

  console.log("🎬 Descargando películas de TMDB...");

  let allMovies: any[] = [];

  for (const genre of GENRES) {
    console.log(`📡 Descargando género ${genre}...`);
    const movies = await fetchMoviesByGenre(genre, 3);
    allMovies.push(...movies);
  }

  // Quitar duplicados por movie.id
  const deduped = [
    ...new Map(allMovies.map((movie) => [movie.id, movie])).values(),
  ];

  // Tomar solo 500
  const finalMovies = deduped.slice(0, 500);

  console.log(`📀 Total de películas finales: ${finalMovies.length}`);

  console.log("💾 Guardando en Mongo...");

  const docs = finalMovies.map((m) => ({
    title: m.title,
    description: m.overview,
    type: "movie",
    genres: m.genre_ids?.map((id: number) => String(id)) ?? [],
    rating: 0,
    maturityRating: m.adult ? "+18" : "PG-13",
    releaseYear: m.release_date ? Number(m.release_date.split("-")[0]) : null,
    duration: `${Math.floor(Math.random() * (140 - 80) + 80)} min`,
    posterUrl: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : null,
    trailerUrl: null,
    isActive: true,
    viewCount: 0,
    averageRating: 0,
    totalRatings: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await collection.insertMany(docs);

  console.log("✅ Seed completado con éxito.");
  await client.close();
}

seed().catch((err) => {
  console.error("❌ Error ejecutando seed:", err);
  process.exit(1);
});
