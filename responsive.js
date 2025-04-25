/**
 * Sangeet Distribution - Mobile Navigation Enhancement
 * 
 * This file adds responsive navigation functionality for mobile devices
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
    if (mobileMenuToggle && mobileMenu) {
        // Create overlay for mobile menu
        const overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
        
        mobileMenuToggle.addEventListener('click', function() {
            if (mobileMenu.classList.contains('d-none')) {
                // Open menu
                mobileMenu.classList.remove('d-none');
                mobileMenu.classList.add('animate-fadeIn');
                overlay.classList.add('active');
                body.classList.add('sidebar-open');
                body.style.overflow = 'hidden'; // Prevent scrolling
            } else {
                // Close menu
                mobileMenu.classList.add('d-none');
                overlay.classList.remove('active');
                body.classList.remove('sidebar-open');
                body.style.overflow = ''; // Re-enable scrolling
            }
        });
        
        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            mobileMenu.classList.add('d-none');
            overlay.classList.remove('active');
            body.classList.remove('sidebar-open');
            body.style.overflow = ''; // Re-enable scrolling
        });
        
        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('d-none');
                overlay.classList.remove('active');
                body.classList.remove('sidebar-open');
                body.style.overflow = ''; // Re-enable scrolling
            });
        });
    }
    
    // Dashboard sidebar toggle functionality
    const dashboardToggleBtn = document.querySelector('.dashboard-toggle-btn');
    const dashboardSidebar = document.querySelector('.dashboard-sidebar');
    
    if (dashboardToggleBtn && dashboardSidebar) {
        // Create overlay for dashboard sidebar
        const sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'mobile-nav-overlay';
        document.body.appendChild(sidebarOverlay);
        
        dashboardToggleBtn.addEventListener('click', function() {
            dashboardSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            body.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', function() {
            dashboardSidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            body.classList.remove('sidebar-open');
        });
    }
    
    // Admin sidebar toggle functionality
    const adminToggleBtn = document.querySelector('.admin-toggle-btn');
    const adminSidebar = document.querySelector('.admin-sidebar');
    
    if (adminToggleBtn && adminSidebar) {
        // Create overlay for admin sidebar
        const adminSidebarOverlay = document.createElement('div');
        adminSidebarOverlay.className = 'mobile-nav-overlay';
        document.body.appendChild(adminSidebarOverlay);
        
        adminToggleBtn.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
            adminSidebarOverlay.classList.toggle('active');
            body.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking overlay
        adminSidebarOverlay.addEventListener('click', function() {
            adminSidebar.classList.remove('active');
            adminSidebarOverlay.classList.remove('active');
            body.classList.remove('sidebar-open');
        });
    }
    
    // Make tables responsive
    const tables = document.querySelectorAll('.table-responsive-card table');
    
    tables.forEach(table => {
        const headerCells = table.querySelectorAll('thead th');
        const headerTexts = Array.from(headerCells).map(cell => cell.textContent.trim());
        
        const bodyCells = table.querySelectorAll('tbody td');
        
        bodyCells.forEach((cell, index) => {
            const headerIndex = index % headerTexts.length;
            cell.setAttribute('data-label', headerTexts[headerIndex]);
        });
    });
    
    // Responsive file upload
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        // Skip if already enhanced
        if (input.parentElement.classList.contains('custom-file-upload')) {
            return;
        }
        
        const wrapper = document.createElement('label');
        wrapper.className = 'custom-file-upload w-100';
        
        const originalId = input.id;
        const originalName = input.name;
        
        // Create file name display
        const fileNameDisplay = document.createElement('span');
        fileNameDisplay.className = 'file-name';
        fileNameDisplay.textContent = 'Choose file...';
        
        // Add icon
        const icon = document.createElement('i');
        icon.className = 'fas fa-upload mr-2';
        
        // Replace input with enhanced version
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(icon);
        wrapper.appendChild(fileNameDisplay);
        wrapper.appendChild(input);
        
        // Update file name on change
        input.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                fileNameDisplay.textContent = this.files[0].name;
            } else {
                fileNameDisplay.textContent = 'Choose file...';
            }
        });
    });
    
    // Enhance select elements for mobile
    const selectElements = document.querySelectorAll('select');
    
    selectElements.forEach(select => {
        // Add a class for styling
        select.classList.add('form-select');
    });
    
    // Make iframes responsive
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
        // Skip if already wrapped
        if (iframe.parentElement.classList.contains('responsive-embed')) {
            return;
        }
        
        const wrapper = document.createElement('div');
        wrapper.className = 'responsive-embed';
        
        // Replace iframe with wrapped version
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
    });
    
    // Add touch-friendly enhancements for mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        
        // Increase tap target sizes for buttons and links
        const smallButtons = document.querySelectorAll('.btn-sm');
        smallButtons.forEach(button => {
            button.classList.remove('btn-sm');
        });
    }
    
    // Add responsive table data attributes for mobile view
    function setupResponsiveTables() {
        const tables = document.querySelectorAll('.table');
        
        tables.forEach(table => {
            // Skip if already processed
            if (table.classList.contains('responsive-processed')) {
                return;
            }
            
            const headerCells = table.querySelectorAll('thead th');
            const headerLabels = Array.from(headerCells).map(cell => cell.textContent.trim());
            
            const bodyRows = table.querySelectorAll('tbody tr');
            
            bodyRows.forEach(row => {
                const cells = row.querySelectorAll('td');
                
                cells.forEach((cell, index) => {
                    if (index < headerLabels.length) {
                        cell.setAttribute('data-label', headerLabels[index]);
                    }
                });
            });
            
            table.classList.add('responsive-processed');
        });
    }
    
    // Run responsive table setup
    setupResponsiveTables();
    
    // Re-run on dynamic content changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                setupResponsiveTables();
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});
