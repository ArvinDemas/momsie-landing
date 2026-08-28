const { initializeApp } = require("firebase/app");
const { getFirestore, collection, setDoc, doc, deleteDoc, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g",
  authDomain: "momsie-app.firebaseapp.com",
  projectId: "momsie-app",
  storageBucket: "momsie-app.firebasestorage.app",
  messagingSenderId: "5481212381",
  appId: "1:5481212381:web:b15aed69a1eb27516c6e34",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  console.log("Testing Firestore connection to momsie-app...");
  try {
    const snap = await getDocs(collection(db, "users"));
    console.log("Current users doc count:", snap.docs.length);
  } catch (err) {
    console.error("Firestore test error:", err);
  }
}

testConnection();
