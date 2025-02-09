import admin from 'firebase-admin';
import { ServerConfig } from '@config/config';
import createLogger from '@config/logger';
const log = createLogger({ fileName: 'firestore' });

const env = ServerConfig.env;

let serviceAccount;
const remoteEnvs = ['dev'];

try {
  serviceAccount = remoteEnvs.includes(env)
    ? null
    : require('../../codec-idired-config.json')
} catch (e) {
  log.error(e);
}

let firestoreRef: admin.firestore.Firestore | null = null;


try {
  admin.initializeApp({
    credential: remoteEnvs.includes(env)
      ? admin.credential.applicationDefault()
      : serviceAccount
        ? admin.credential.cert(serviceAccount)
        : undefined,
  });
  firestoreRef = admin.firestore();
} catch (e) {
  log.error(e);
  throw new Error();
}

export default firestoreRef;