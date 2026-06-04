import { adminDb } from '../api/_firebaseAdmin.js';

async function check() {
  try {
    const docRef = adminDb.collection('storeProducts').doc('r17-pro-combat-jersey');
    const snap = await docRef.get();
    if (!snap.exists()) {
      console.log('MISSING');
      return;
    }
    console.log('FOUND', JSON.stringify(snap.data(), null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
  }
}

check();
