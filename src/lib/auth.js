import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt, admin } from "better-auth/plugins";

const client = new MongoClient(
  process.env.MONGODB_URI || process.env.BETTER_AUTH_MONGODB_URI
);
const db = client.db("studioSpaceDB");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,


  trustedOrigins: [
    "http://localhost:3000",
    "https://studiospace-client-9p5k.vercel.app",
  ],

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