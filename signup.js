/**
 * Sangeet Distribution - Signup Page JavaScript
 * 
 * This file handles the signup functionality for new users
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseServices = window.sangeetApp.initializeFirebase();
    
    if (!firebaseServices) {
        console.error('Firebase services not available');
        return;
    }
    
    const { auth, db } = firebaseServices;
    
    // Account type selection
    const accountTypeCards = document.querySelectorAll('.account-type-card');
    const accountTypeInput = document.getElementById('account-type');
    
    accountTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            accountTypeCards.forEach(c => {
                c.classList.remove('border-accent', 'bg-accent-light');
            });
            
            // Add active class to selected card
            this.classList.add('border-accent', 'bg-accent-light');
            
            // Update hidden input value
            accountTypeInput.value = this.getAttribute('data-type');
        });
    });
    
    // Password validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    function validatePassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Check password strength
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasMinLength = password.length >= 8;
        
        // Create feedback element if it doesn't exist
        let feedbackElement = document.getElementById('password-feedback');
        if (!feedbackElement) {
            feedbackElement = document.createElement('div');
            feedbackElement.id = 'password-feedback';
            feedbackElement.classList.add('mt-2');
            passwordInput.parentNode.appendChild(feedbackElement);
        }
        
        // Update feedback
        if (password) {
            let feedback = '';
            let isValid = true;
            
            if (!hasMinLength) {
                feedback += '<div class="text-danger">• Password must be at least 8 characters</div>';
                isValid = false;
            }
            
            if (!hasUpperCase) {
                feedback += '<div class="text-danger">• Password must contain at least one uppercase letter</div>';
                isValid = false;
            }
            
            if (!hasLowerCase) {
                feedback += '<div class="text-danger">• Password must contain at least one lowercase letter</div>';
                isValid = false;
            }
            
            if (!hasNumbers) {
                feedback += '<div class="text-danger">• Password must contain at least one number</div>';
                isValid = false;
            }
            
            if (isValid) {
                feedback = '<div class="text-success">• Password meets all requirements</div>';
                passwordInput.classList.remove('border-danger');
                passwordInput.classList.add('border-success');
            } else {
                passwordInput.classList.remove('border-success');
                passwordInput.classList.add('border-danger');
            }
            
            feedbackElement.innerHTML = feedback;
        } else {
            feedbackElement.innerHTML = '';
            passwordInput.classList.remove('border-danger', 'border-success');
        }
        
        // Check if passwords match
        if (confirmPassword) {
            let matchFeedback = document.getElementById('password-match-feedback');
            if (!matchFeedback) {
                matchFeedback = document.createElement('div');
                matchFeedback.id = 'password-match-feedback';
                matchFeedback.classList.add('mt-2');
                confirmPasswordInput.parentNode.appendChild(matchFeedback);
            }
            
            if (password === confirmPassword) {
                matchFeedback.innerHTML = '<div class="text-success">• Passwords match</div>';
                confirmPasswordInput.classList.remove('border-danger');
                confirmPasswordInput.classList.add('border-success');
            } else {
                matchFeedback.innerHTML = '<div class="text-danger">• Passwords do not match</div>';
                confirmPasswordInput.classList.remove('border-success');
                confirmPasswordInput.classList.add('border-danger');
            }
        }
    }
    
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePassword);
    
    // Form submission
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const firstName = document.getElementById('first-name').value;
            const lastName = document.getElementById('last-name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const accountType = document.getElementById('account-type').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validate form
            let isValid = true;
            let errorMessage = '';
            
            if (!firstName || !lastName) {
                isValid = false;
                errorMessage = 'Please enter your full name';
            } else if (!email) {
                isValid = false;
                errorMessage = 'Please enter your email address';
            } else if (!password) {
                isValid = false;
                errorMessage = 'Please enter a password';
            } else if (password !== confirmPassword) {
                isValid = false;
                errorMessage = 'Passwords do not match';
            } else if (!termsAccepted) {
                isValid = false;
                errorMessage = 'You must accept the Terms of Service and Privacy Policy';
            }
            
            // Password strength validation
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasMinLength = password.length >= 8;
            
            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasMinLength) {
                isValid = false;
                errorMessage = 'Password does not meet the requirements';
            }
            
            // Display error message if validation fails
            if (!isValid) {
                // Create or update error element
                let errorElement = document.getElementById('signup-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'signup-error';
                    errorElement.classList.add('alert', 'alert-danger', 'mt-4');
                    signupForm.appendChild(errorElement);
                }
                
                errorElement.textContent = errorMessage;
                return;
            }
            
            // Show loading state
            const submitButton = signupForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';
            submitButton.disabled = true;
            
            try {
                // Create user with email and password
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;
                
                // Update user profile
                await user.updateProfile({
                    displayName: `${firstName} ${lastName}`
                });
                
                // Add user data to Firestore
                await db.collection('users').doc(user.uid).set({
                    firstName: firstName,
                    lastName: lastName,
                    displayName: `${firstName} ${lastName}`,
                    email: email,
                    accountType: accountType,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    role: accountType === 'label' ? 'label' : 'artist',
                    status: 'active'
                });
                
                // Redirect to dashboard
                window.location.href = 'dashboard/index.html';
            } catch (error) {
                console.error('Error creating account:', error);
                
                // Display error message
                let errorElement = document.getElementById('signup-error');
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = 'signup-error';
                    errorElement.classList.add('alert', 'alert-danger', 'mt-4');
                    signupForm.appendChild(errorElement);
                }
                
                let userFriendlyMessage = 'An error occurred during signup. Please try again.';
                
                if (error.code === 'auth/email-already-in-use') {
                    userFriendlyMessage = 'This email address is already in use. Please use a different email or try logging in.';
                } else if (error.code === 'auth/invalid-email') {
                    userFriendlyMessage = 'Please enter a valid email address.';
                } else if (error.code === 'auth/weak-password') {
                    userFriendlyMessage = 'Please choose a stronger password.';
                }
                
                errorElement.textContent = userFriendlyMessage;
                
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Google Sign Up
    const googleButton = document.querySelector('.btn-outline-dark:nth-child(1)');
    if (googleButton) {
        googleButton.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    const isNewUser = result.additionalUserInfo.isNewUser;
                    
                    if (isNewUser) {
                        // Add user data to Firestore for new users
                        return db.collection('users').doc(user.uid).set({
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            accountType: 'artist', // Default for social sign-ups
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            role: 'artist',
                            status: 'active'
                        }).then(() => {
                            // Redirect to dashboard
                            window.location.href = 'dashboard/index.html';
                        });
                    } else {
                        // Existing user, redirect to dashboard
                        window.location.href = 'dashboard/index.html';
                    }
                })
                .catch((error) => {
                    console.error('Google sign up error:', error);
                    
                    // Display error message
                    let errorElement = document.getElementById('signup-error');
                    if (!errorElement) {
                        errorElement = document.createElement('div');
                        errorElement.id = 'signup-error';
                        errorElement.classList.add('alert', 'alert-danger', 'mt-4');
                        document.getElementById('signup-form').appendChild(errorElement);
                    }
                    
                    errorElement.textContent = 'An error occurred during Google sign up. Please try again.';
                });
        });
    }
    
    // Facebook Sign Up
    const facebookButton = document.querySelector('.btn-outline-dark:nth-child(2)');
    if (facebookButton) {
        facebookButton.addEventListener('click', function() {
            const provider = new firebase.auth.FacebookAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    const user = result.user;
                    const isNewUser = result.additionalUserInfo.isNewUser;
                    
                    if (isNewUser) {
                        // Add user data to Firestore for new users
                        return db.collection('users').doc(user.uid).set({
                            displayName: user.displayName,
                            email: user.email,
                            photoURL: user.photoURL,
                            accountType: 'artist', // Default for social sign-ups
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            role: 'artist',
                            status: 'active'
                        }).then(() => {
                            // Redirect to dashboard
                            window.location.href = 'dashboard/index.html';
                        });
                    } else {
                        // Existing user, redirect to dashboard
                        window.location.href = 'dashboard/index.html';
                    }
                })
                .catch((error) => {
                    console.error('Facebook sign up error:', error);
                    
                    // Display error message
                    let errorElement = document.getElementById('signup-error');
                    if (!errorElement) {
                        errorElement = document.createElement('div');
                        errorElement.id = 'signup-error';
                        errorElement.classList.add('alert', 'alert-danger', 'mt-4');
                        document.getElementById('signup-form').appendChild(errorElement);
                    }
                    
                    errorElement.textContent = 'An error occurred during Facebook sign up. Please try again.';
                });
        });
    }
});
