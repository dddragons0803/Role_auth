import { initializeApp, applicationDefault, cert ,ServiceAccount, getApps, getApp} from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import serviceAccount from './serviceAccountKey.json';

const app = !getApps().length ? initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: 'xxxxxxxxxxxxxxxxxxx',
}) : getApp();

const bucket = getStorage(app).bucket();

export default bucket;
