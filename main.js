/**
 * Sangeet Distribution - Main JavaScript
 * 
 * This file contains all the JavaScript functionality for the Sangeet Distribution platform
 * including animations, interactive elements, and UI components.
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('d-none')) {
                mobileMenu.classList.remove('d-none');
                mobileMenu.classList.add('animate-fadeIn');
                document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
            } else {
                mobileMenu.classList.add('d-none');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('d-none');
                document.body.style.overflow = ''; // Re-enable scrolling
            });
        });
    }
    
    // Pricing toggle (Monthly/Yearly)
    const monthlyBtn = document.getElementById('monthly-btn');
    const yearlyBtn = document.getElementById('yearly-btn');
    const pricingPrices = document.querySelectorAll('.pricing-price');
    const pricingPeriods = document.querySelectorAll('.pricing-period');
    
    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener('click', function() {
            monthlyBtn.classList.add('btn-accent');
            yearlyBtn.classList.remove('btn-accent');
            
            // Update pricing to monthly
            pricingPrices.forEach(price => {
                price.textContent = price.getAttribute('data-monthly');
            });
            
            pricingPeriods.forEach(period => {
                period.textContent = period.getAttribute('data-monthly');
            });
        });
        
        yearlyBtn.addEventListener('click', function() {
            yearlyBtn.classList.add('btn-accent');
            monthlyBtn.classList.remove('btn-accent');
            
            // Update pricing to yearly
            pricingPrices.forEach(price => {
                price.textContent = price.getAttribute('data-yearly');
            });
            
            pricingPeriods.forEach(period => {
                period.textContent = period.getAttribute('data-yearly');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements when they come into view
    const animateElements = document.querySelectorAll('.animate-slideInUp, .animate-slideInLeft, .animate-slideInRight');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll animation
    function handleScrollAnimation() {
        animateElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                element.classList.add('animated');
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0)';
            }
        });
    }
    
    // Set initial state for animated elements
    animateElements.forEach(element => {
        if (!element.classList.contains('animated')) {
            element.style.opacity = '0';
            
            if (element.classList.contains('animate-slideInUp')) {
                element.style.transform = 'translateY(30px)';
            } else if (element.classList.contains('animate-slideInLeft')) {
                element.style.transform = 'translateX(-30px)';
            } else if (element.classList.contains('animate-slideInRight')) {
                element.style.transform = 'translateX(30px)';
            }
            
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        }
    });
    
    // Run once on page load
    handleScrollAnimation();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimation);
    
    // Waveform animation
    const waveformBars = document.querySelectorAll('.waveform-bar');
    
    function animateWaveform() {
        waveformBars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 70) + 20; // Random height between 20% and 90%
            bar.style.height = `${randomHeight}%`;
        });
    }
    
    // Animate waveform every 500ms
    if (waveformBars.length > 0) {
        setInterval(animateWaveform, 500);
    }
    
    // Sticky header behavior
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('shadow-md');
            navbar.style.padding = '0.75rem 1.5rem';
        } else {
            navbar.classList.remove('shadow-md');
            navbar.style.padding = '1rem 1.5rem';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Initialize any tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        const tooltipText = tooltip.querySelector('.tooltip-text');
        
        tooltip.addEventListener('mouseenter', function() {
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        });
    });
    
    // Form validation (for contact forms, etc.)
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-danger');
                    
                    // Add error message if it doesn't exist
                    let errorMessage = field.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('text-danger')) {
                        errorMessage = document.createElement('div');
                        errorMessage.classList.add('text-danger', 'text-sm', 'mt-1');
                        errorMessage.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('border-danger');
                    
                    // Remove error message if it exists
                    const errorMessage = field.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('text-danger')) {
                        errorMessage.remove();
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Testimonial slider (simple version)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        
        // Only initialize slider for mobile view
        function initSlider() {
            if (window.innerWidth < 768 && testimonials.length > 1) {
                // Hide all testimonials except the first one
                testimonials.forEach((testimonial, index) => {
                    if (index !== 0) {
                        testimonial.style.display = 'none';
                    }
                });
                
                // Create navigation dots
                const dotsContainer = document.createElement('div');
                dotsContainer.classList.add('text-center', 'mt-4');
                
                testimonials.forEach((_, index) => {
                    const dot = document.createElement('span');
                    dot.classList.add('d-inline-block', 'mx-1', 'rounded-full', 'bg-gray-400');
                    dot.style.width = '8px';
                    dot.style.height = '8px';
                    
                    if (index === 0) {
                        dot.classList.add('bg-accent');
                    }
                    
                    dot.addEventListener('click', () => {
                        showTestimonial(index);
                    });
                    
                    dotsContainer.appendChild(dot);
                });
                
                testimonialSlider.appendChild(dotsContainer);
            } else {
                // Show all testimonials for desktop view
                testimonials.forEach(testimonial => {
                    testimonial.style.display = 'block';
                });
                
                // Remove navigation dots if they exist
                const dotsContainer = testimonialSlider.querySelector('.mt-4');
                if (dotsContainer) {
                    dotsContainer.remove();
                }
            }
        }
        
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                if (i === index) {
                    testimonial.style.display = 'block';
                } else {
                    testimonial.style.display = 'none';
                }
            });
            
            // Update dots
            const dots = testimonialSlider.querySelectorAll('.rounded-full');
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.add('bg-accent');
                    dot.classList.remove('bg-gray-400');
                } else {
                    dot.classList.add('bg-gray-400');
                    dot.classList.remove('bg-accent');
                }
            });
            
            currentIndex = index;
        }
        
        // Auto-rotate testimonials on mobile
        function autoRotateTestimonials() {
            if (window.innerWidth < 768 && testimonials.length > 1) {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            }
        }
        
        // Initialize slider
        initSlider();
        
        // Set up auto-rotation for mobile view
        let autoRotateInterval;
        
        function startAutoRotate() {
            if (window.innerWidth < 768) {
                autoRotateInterval = setInterval(autoRotateTestimonials, 5000);
            }
        }
        
        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }
        
        startAutoRotate();
        
        // Reinitialize slider on window resize
        window.addEventListener('resize', () => {
            stopAutoRotate();
            initSlider();
            startAutoRotate();
        });
    }
});

/**
 * Firebase Configuration and Initialization
 * This section handles the Firebase setup for authentication and data storage
 */
// Import Firebase modules
// Note: In a production environment, you would use npm/webpack to import these
// For this demo, we're using the Firebase CDN which exposes firebase globally

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

// Initialize Firebase when the script is loaded from the dashboard or admin pages
function initializeFirebase() {
    // Check if Firebase app is already initialized
    if (typeof firebase !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
            
            // Initialize Firebase Analytics
            firebase.analytics();
            
            // Initialize Firebase Auth
            const auth = firebase.auth();
            
            // Initialize Firestore
            const db = firebase.firestore();
            
            // Initialize Storage
            const storage = firebase.storage();
            
            return { auth, db, storage };
        } catch (error) {
            console.error("Firebase initialization error:", error);
        }
    } else {
        console.error("Firebase SDK not loaded");
    }
    
    return null;
}

// Export Firebase services for use in other scripts
window.sangeetApp = {
    initializeFirebase: initializeFirebase
};
