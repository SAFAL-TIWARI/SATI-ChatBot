// Simple Navigation Dropdown with Dynamic Labels
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdown();
});

function initializeDropdown() {
    // Handle dropdown item clicks for dynamic label changes
    const dropdownItems = document.querySelectorAll('.dropdown-item:not(.disabled)');
    const mobileDropdownItems = document.querySelectorAll('.mobile-dropdown-item:not(.disabled)');
    
    // Desktop dropdown items
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the dropdown toggle text
            updateDropdownLabel(itemText);
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Mobile dropdown items
    mobileDropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const itemText = this.textContent.trim();
            const href = this.getAttribute('href');
            
            // Update the mobile dropdown toggle text
            updateMobileDropdownLabel(itemText);
            
            // Navigate to the page
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    // Set current page active state
    setCurrentPageActive();
}

// Update desktop dropdown label
function updateDropdownLabel(newLabel) {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.innerHTML = `${newLabel} <i class="fas fa-chevron-down"></i>`;
    }
}

// Update mobile dropdown label
function updateMobileDropdownLabel(newLabel) {
    const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
    if (mobileDropdownToggle) {
        const spanElement = mobileDropdownToggle.querySelector('span');
        if (spanElement) {
            spanElement.textContent = newLabel;
        }
    }
}

// Set current page active state based on URL
function setCurrentPageActive() {
    const currentPath = window.location.pathname;
    
    // Handle materials page
    if (currentPath.includes('/resources/materials.html')) {
        updateDropdownLabel('Materials');
        updateMobileDropdownLabel('Materials');
    }
}