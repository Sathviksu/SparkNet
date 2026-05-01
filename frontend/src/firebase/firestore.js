import {
  collection,
  doc,
  setDoc,
  getDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ─── Users ────────────────────────────────────────────────────
export const upsertUser = async (uid, data) => {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
};

export const getUser = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ─── Transactions ─────────────────────────────────────────────
export const saveTransaction = async (uid, txData) => {
  await addDoc(collection(db, 'transactions'), {
    uid,
    ...txData,
    timestamp: serverTimestamp(),
  });
};

export const getUserTransactions = async (uid, limitCount = 10) => {
  const q = query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const subscribeToUserTransactions = (uid, callback) => {
  const q = query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    orderBy('timestamp', 'desc'),
    limit(10)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

// ─── Price History ─────────────────────────────────────────────
export const savePricePoint = async (price_eth, price_inr) => {
  await addDoc(collection(db, 'priceHistory'), {
    price_eth,
    price_inr,
    timestamp: serverTimestamp(),
  });
};

export const getPriceHistory = async (limitCount = 50) => {
  const q = query(
    collection(db, 'priceHistory'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  // Return oldest first so the chart renders left → right
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
};

export const subscribeToPriceHistory = (callback, limitCount = 50) => {
  const q = query(
    collection(db, 'priceHistory'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })).reverse();
    callback(data);
  });
};

// ─── Producers ────────────────────────────────────────────────
export const saveProducer = async (tokenId, data) => {
  await setDoc(doc(db, 'producers', String(tokenId)), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

export const getProducers = async () => {
  const snap = await getDocs(collection(db, 'producers'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
