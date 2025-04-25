// Firebase configuration and authentication setup
// This file initializes Firebase and provides authentication functions

// Initialize Firebase with the provided configuration
function initializeFirebase() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDJ7M2IJI16jWxegtilyDbkgfQNHtMI7Lo",
    authDomain: "sangeet-distribution-81eb3.firebaseapp.com",
    projectId: "sangeet-distribution-81eb3",
    storageBucket: "sangeet-distribution-81eb3.firebasestorage.app",
    messagingSenderId: "522922846685",
    appId: "1:522922846685:web:631ead8e6ccdbfc2a4ae34",
    measurementId: "G-6CX21QGNLE"
  };

  // Check if Firebase is already initialized
  if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Analytics
    if (firebase.analytics) {
      firebase.analytics();
    }
  }

  // Get Firebase services
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  return { auth, db, storage };
}

// User authentication functions
const authService = {
  // Register a new user
  async registerUser(email, password, userData) {
    try {
      const { auth, db } = initializeFirebase();
      
      // Create user with email and password
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Add user data to Firestore
      await db.collection('users').doc(user.uid).set({
        ...userData,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        role: 'artist', // Default role for new users
        status: 'active'
      });
      
      // Send email verification
      await user.sendEmailVerification();
      
      return { success: true, user };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Login user
  async loginUser(email, password) {
    try {
      const { auth } = initializeFirebase();
      
      // Sign in with email and password
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      return { success: true, user };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Logout user
  async logoutUser() {
    try {
      const { auth } = initializeFirebase();
      
      // Sign out
      await auth.signOut();
      
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Reset password
  async resetPassword(email) {
    try {
      const { auth } = initializeFirebase();
      
      // Send password reset email
      await auth.sendPasswordResetEmail(email);
      
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get current user
  getCurrentUser() {
    const { auth } = initializeFirebase();
    return auth.currentUser;
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    const { auth } = initializeFirebase();
    return !!auth.currentUser;
  },
  
  // Get user profile
  async getUserProfile(userId) {
    try {
      const { db } = initializeFirebase();
      
      // Get user document from Firestore
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        return { success: true, profile: userDoc.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Update user profile
  async updateUserProfile(userId, profileData) {
    try {
      const { db } = initializeFirebase();
      
      // Update user document in Firestore
      await db.collection('users').doc(userId).update({
        ...profileData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Check if user is admin
  async isAdmin(userId) {
    try {
      const { db } = initializeFirebase();
      
      // Get user document from Firestore
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (userDoc.exists) {
        const userData = userDoc.data();
        return { success: true, isAdmin: userData.role === 'admin' };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Listen for auth state changes
  onAuthStateChanged(callback) {
    const { auth } = initializeFirebase();
    return auth.onAuthStateChanged(callback);
  }
};

// Database service for Firestore operations
const dbService = {
  // Get Firestore instance
  getDb() {
    const { db } = initializeFirebase();
    return db;
  },
  
  // Get a collection reference
  collection(collectionName) {
    const db = this.getDb();
    return db.collection(collectionName);
  },
  
  // Get a document reference
  doc(collectionName, docId) {
    const db = this.getDb();
    return db.collection(collectionName).doc(docId);
  },
  
  // Add a document to a collection
  async addDoc(collectionName, data) {
    try {
      const collection = this.collection(collectionName);
      const docRef = await collection.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Set a document with a specific ID
  async setDoc(collectionName, docId, data) {
    try {
      const docRef = this.doc(collectionName, docId);
      await docRef.set({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error setting document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Update a document
  async updateDoc(collectionName, docId, data) {
    try {
      const docRef = this.doc(collectionName, docId);
      await docRef.update({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Delete a document
  async deleteDoc(collectionName, docId) {
    try {
      const docRef = this.doc(collectionName, docId);
      await docRef.delete();
      
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Get a document by ID
  async getDoc(collectionName, docId) {
    try {
      const docRef = this.doc(collectionName, docId);
      const doc = await docRef.get();
      
      if (doc.exists) {
        return { success: true, data: { id: doc.id, ...doc.data() } };
      } else {
        return { success: false, error: 'Document not found' };
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Query documents in a collection
  async queryDocs(collectionName, queryFn) {
    try {
      const collection = this.collection(collectionName);
      let query = collection;
      
      if (queryFn) {
        query = queryFn(collection);
      }
      
      const snapshot = await query.get();
      const docs = [];
      
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, docs };
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      return { success: false, error: error.message };
    }
  },
  
  // Listen for real-time updates to a document
  onDocSnapshot(collectionName, docId, callback) {
    const docRef = this.doc(collectionName, docId);
    return docRef.onSnapshot(doc => {
      if (doc.exists) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },
  
  // Listen for real-time updates to a collection
  onCollectionSnapshot(collectionName, queryFn, callback) {
    let query = this.collection(collectionName);
    
    if (queryFn) {
      query = queryFn(query);
    }
    
    return query.onSnapshot(snapshot => {
      const docs = [];
      
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      
      callback(docs);
    });
  }
};

// Storage service for Firebase Storage operations
const storageService = {
  // Get Storage instance
  getStorage() {
    const { storage } = initializeFirebase();
    return storage;
  },
  
  // Upload a file
  async uploadFile(path, file, metadata = {}) {
    try {
      const storage = this.getStorage();
      const storageRef = storage.ref();
      const fileRef = storageRef.child(path);
      
      // Upload file
      const snapshot = await fileRef.put(file, metadata);
      
      // Get download URL
      const downloadURL = await snapshot.ref.getDownloadURL();
      
      return { success: true, downloadURL, path };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Delete a file
  async deleteFile(path) {
    try {
      const storage = this.getStorage();
      const storageRef = storage.ref();
      const fileRef = storageRef.child(path);
      
      // Delete file
      await fileRef.delete();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get download URL for a file
  async getDownloadURL(path) {
    try {
      const storage = this.getStorage();
      const storageRef = storage.ref();
      const fileRef = storageRef.child(path);
      
      // Get download URL
      const downloadURL = await fileRef.getDownloadURL();
      
      return { success: true, downloadURL };
    } catch (error) {
      console.error('Error getting download URL:', error);
      return { success: false, error: error.message };
    }
  },
  
  // List files in a directory
  async listFiles(path) {
    try {
      const storage = this.getStorage();
      const storageRef = storage.ref();
      const dirRef = storageRef.child(path);
      
      // List files
      const result = await dirRef.listAll();
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const downloadURL = await itemRef.getDownloadURL();
          const metadata = await itemRef.getMetadata();
          
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            downloadURL,
            metadata
          };
        })
      );
      
      return { success: true, files };
    } catch (error) {
      console.error('Error listing files:', error);
      return { success: false, error: error.message };
    }
  }
};

// Export services
window.sangeetApp = {
  initializeFirebase,
  authService,
  dbService,
  storageService
};
