// config/firebase.js
import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf-8")
);

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
});

export const messaging = getMessaging(firebaseApp);