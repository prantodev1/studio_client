const DEVELOPMENT_API_URL = "http://localhost:5000/api";
const PRODUCTION_API_URL = "https://studiospace-server-silk.vercel.app/api";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL;

export const API_URL = (
  configuredApiUrl ||
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_API_URL
    : DEVELOPMENT_API_URL)
).replace(/\/+$/, "");
