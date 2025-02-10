import admin, { ServiceAccount } from "firebase-admin";
import createLogger from "@config/logger";
import serviceAccount from './turistiando-credentials.json';

const log = createLogger({ fileName: "firestore" });

let firestoreRef: admin.firestore.Firestore | null = null;

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
  });
  firestoreRef = admin.firestore();
} catch (e) {
  log.error(e);
}

export default firestoreRef;