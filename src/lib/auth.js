import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt, admin } from "better-auth/plugins";

const stripTrailingSlash = (value) => value?.trim().replace(/\/+$/, "");

const defaultSiteUrl = process.env.VERCEL
  ? "https://studioclient.vercel.app"
  : "http://localhost:3000";

const siteUrl = stripTrailingSlash(
  process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    defaultSiteUrl
);

const vercelOrigins = [
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_URL,
]
  .filter(Boolean)
  .map((host) =>
    host.startsWith("http") ? host : `https://${host}`
  );

const extraTrustedOrigins = (process.env.AUTH_TRUSTED_ORIGINS || "")
  .split(",")
  .map(stripTrailingSlash)
  .filter(Boolean);

const trustedOrigins = [
  ...new Set(
    [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://studioclient.vercel.app",
      "https://studiospace-server-silk.vercel.app",
      siteUrl,
      ...vercelOrigins,
      ...extraTrustedOrigins,
    ]
      .map(stripTrailingSlash)
      .filter(Boolean)
  ),
];

const mongodbUri =
  process.env.BETTER_AUTH_MONGODB_URI || process.env.MONGODB_URI;

if (!mongodbUri) {
  throw new Error(
    "Missing MongoDB connection string. Set BETTER_AUTH_MONGODB_URI (or MONGODB_URI)."
  );
}

const client = new MongoClient(mongodbUri);
const db = client.db(process.env.AUTH_DB_NAME || "studioSpaceDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: siteUrl,
  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
    }),

    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }),
      },
    }),
  ],
});
