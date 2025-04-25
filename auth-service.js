/**
 * Sangeet Distribution - Authentication Service
 * 
 * This file enhances the Firebase authentication with additional functionality
 * for user management, role-based access control, and profile management.
 */

// Wait for Firebase to be initialized
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase from main.js
    const firebaseServices = window.sangeetApp.initializeFirebase();
    
    if (!firebaseServices) {
        console.error('Firebase services not available');
        return;
    }
    
    const { auth, db } = firebaseServices;
    
    // Enhanced Authentication Service
    window.sangeetApp.authService = {
        // Current user state
        currentUser: null,
        
        // Initialize auth service
        init: function() {
            // Listen for auth state changes
            auth.onAuthStateChanged(user => {
                if (user) {
                    // User is signed in
                    this.currentUser = user;
                    
                    // Get additional user data from Firestore
                    this.getUserProfile(user.uid)
                        .then(profile => {
                            if (profile) {
                                // Merge profile data with user
                                this.currentUser.profile = profile;
                                
                                // Dispatch user authenticated event
                                const event = new CustomEvent('userAuthenticated', { 
                                    detail: { user: this.currentUser } 
                                });
                                document.dispatchEvent(event);
                                
                                // Redirect based on user role if on login/signup page
                                const path = window.location.pathname;
                                if (path.includes('login.html') || path.includes('signup.html')) {
                                    if (profile.role === 'admin') {
                                        window.location.href = 'admin/index.html';
                                    } else {
                                        window.location.href = 'dashboard/index.html';
                                    }
                                }
                            }
                        })
                        .catch(error => {
                            console.error('Error getting user profile:', error);
                        });
                } else {
                    // User is signed out
                    this.currentUser = null;
                    
                    // Dispatch user signed out event
                    const event = new CustomEvent('userSignedOut');
                    document.dispatchEvent(event);
                    
                    // Redirect to login if on protected page
                    const path = window.location.pathname;
                    if (path.includes('dashboard/') || path.includes('admin/')) {
                        window.location.href = path.includes('admin/') 
                            ? '../login.html' 
                            : '../login.html';
                    }
                }
            });
            
            return this;
        },
        
        // Register a new user
        registerUser: async function(email, password, userData) {
            try {
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
                
                // Update user profile
                await user.updateProfile({
                    displayName: userData.displayName || userData.firstName + ' ' + userData.lastName
                });
                
                return { success: true, user };
            } catch (error) {
                console.error('Error registering user:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Login user
        loginUser: async function(email, password) {
            try {
                // Sign in with email and password
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                return { success: true, user };
            } catch (error) {
                console.error('Error logging in:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Login with Google
        loginWithGoogle: async function() {
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                const isNewUser = result.additionalUserInfo.isNewUser;
                
                // If new user, create profile in Firestore
                if (isNewUser) {
                    await db.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        role: 'artist',
                        status: 'active'
                    });
                }
                
                return { success: true, user, isNewUser };
            } catch (error) {
                console.error('Error with Google login:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Login with Facebook
        loginWithFacebook: async function() {
            try {
                const provider = new firebase.auth.FacebookAuthProvider();
                const result = await auth.signInWithPopup(provider);
                const user = result.user;
                const isNewUser = result.additionalUserInfo.isNewUser;
                
                // If new user, create profile in Firestore
                if (isNewUser) {
                    await db.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        role: 'artist',
                        status: 'active'
                    });
                }
                
                return { success: true, user, isNewUser };
            } catch (error) {
                console.error('Error with Facebook login:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Logout user
        logoutUser: async function() {
            try {
                await auth.signOut();
                return { success: true };
            } catch (error) {
                console.error('Error logging out:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Reset password
        resetPassword: async function(email) {
            try {
                await auth.sendPasswordResetEmail(email);
                return { success: true };
            } catch (error) {
                console.error('Error resetting password:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Get current user
        getCurrentUser: function() {
            return this.currentUser;
        },
        
        // Check if user is authenticated
        isAuthenticated: function() {
            return !!this.currentUser;
        },
        
        // Get user profile from Firestore
        getUserProfile: async function(userId) {
            try {
                const doc = await db.collection('users').doc(userId).get();
                
                if (doc.exists) {
                    return doc.data();
                } else {
                    console.warn('No user profile found for:', userId);
                    return null;
                }
            } catch (error) {
                console.error('Error getting user profile:', error);
                throw error;
            }
        },
        
        // Update user profile
        updateUserProfile: async function(userId, profileData) {
            try {
                await db.collection('users').doc(userId).update({
                    ...profileData,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Update display name if provided
                if (profileData.displayName && auth.currentUser) {
                    await auth.currentUser.updateProfile({
                        displayName: profileData.displayName
                    });
                }
                
                return { success: true };
            } catch (error) {
                console.error('Error updating user profile:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Check if user is admin
        isAdmin: async function(userId) {
            try {
                const profile = await this.getUserProfile(userId);
                return { success: true, isAdmin: profile && profile.role === 'admin' };
            } catch (error) {
                console.error('Error checking admin status:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Update user password
        updatePassword: async function(newPassword) {
            try {
                if (!auth.currentUser) {
                    throw new Error('No authenticated user');
                }
                
                await auth.currentUser.updatePassword(newPassword);
                return { success: true };
            } catch (error) {
                console.error('Error updating password:', error);
                return { success: false, error: error.message };
            }
        },
        
        // Reauthenticate user (for sensitive operations)
        reauthenticate: async function(password) {
            try {
                if (!auth.currentUser) {
                    throw new Error('No authenticated user');
                }
                
                const credential = firebase.auth.EmailAuthProvider.credential(
                    auth.currentUser.email, 
                    password
                );
                
                await auth.currentUser.reauthenticateWithCredential(credential);
                return { success: true };
            } catch (error) {
                console.error('Error reauthenticating:', error);
                return { success: false, error: error.message };
            }
        }
    };
    
    // Initialize auth service
    window.sangeetApp.authService.init();
});
