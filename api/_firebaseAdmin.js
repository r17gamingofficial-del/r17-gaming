import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const DEFAULT_PROJECT_ID = "r17gaming-b8d98";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeServiceAccount(parsed = {}) {
  return {
    ...parsed,
    projectId: parsed.projectId || parsed.project_id || DEFAULT_PROJECT_ID,
  };
}

function readLocalServiceAccountFile() {
  const filePath = path.resolve(__dirname, "..", "FIREBASE_SERVICE_ACCOUNT.json");
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8").trim();
  if (!raw) return null;

  return normalizeServiceAccount(JSON.parse(raw));
}

function parseServiceAccount() {
  const rawJson =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON ||
    "";

  if (rawJson) {
    return normalizeServiceAccount(JSON.parse(rawJson));
  }

  const localFileAccount = readLocalServiceAccountFile();
  if (localFileAccount) return localFileAccount;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    DEFAULT_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return normalizeServiceAccount({
      projectId,
      clientEmail,
      privateKey,
    });
  }

  return null;
}

function getAdminApp() {
  const existing = getApps();
  if (existing.length) return existing[0];

  const serviceAccount = parseServiceAccount();
  if (serviceAccount) {
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId || DEFAULT_PROJECT_ID,
    });
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY + FIREBASE_PROJECT_ID before using checkout APIs.",
  );
}

const adminApp = getAdminApp();

export const adminDb = getFirestore(adminApp);
