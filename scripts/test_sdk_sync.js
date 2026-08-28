const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection, doc, setDoc, getDocs, deleteDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyB3n4J9sv2hSWJKLhbBj2DZR3y5SUZMa3g",
  authDomain: "momsie-app.firebaseapp.com",
  projectId: "momsie-app",
  storageBucket: "momsie-app.firebasestorage.app",
  messagingSenderId: "5481212381",
  appId: "1:5481212381:web:b15aed69a1eb27516c6e34",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function runTest() {
  try {
    const cred = await signInWithEmailAndPassword(auth, "sync.admin@momsie.id", "MomsieAdmin123!");
    console.log("Logged in successfully as:", cred.user.email, "UID:", cred.user.uid);

    // Test write to users collection
    await setDoc(doc(db, "users", "test_doc_100"), {
      name: "Test User 100",
      email: "test100@gmail.com",
      updatedAt: new Date().toISOString()
    }, { merge: true });
    console.log("Successfully wrote test_doc_100 to users collection!");

    // Clean test doc
    await deleteDoc(doc(db, "users", "test_doc_100"));
    console.log("Test doc cleaned up.");
  } catch (err) {
    console.error("SDK Test Error:", err);
  }
}

runTest();
