// Resources Data Structure
const resourcesData = {
    notes: [
        {
            id: 'ada-handwritten',
            title: 'ADA Handwritten Notes',
            description: 'Complete handwritten notes for Analysis and Design of Algorithms',
            previewUrl: '', // Will be provided by user
            downloadUrl: '', // Will be provided by user
            subject: 'Analysis and Design of Algorithm - Notes'
        },
        {
            id: 'cso-notes-sati',
            title: 'CSO Notes By SATI',
            description: 'Computer System Organization notes prepared by SATI faculty',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Computer System Organization - Notes'
        },
        {
            id: 'ada-notes-sati',
            title: 'ADA Notes By SATI',
            description: 'Analysis and Design of Algorithms notes by SATI faculty',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Analysis and Design of Algorithm - Notes'
        },
        {
            id: 'cso-handwritten',
            title: 'CSO Handwritten Notes',
            description: 'Handwritten notes for Computer System Organization',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Computer System Organization - Notes'
        },
        {
            id: 'cso-notes-rgpv',
            title: 'CSO Notes SATI RGPV',
            description: 'Computer System Organization notes as per RGPV syllabus',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Computer System Organization - Notes'
        }
    ],
    practical: [
        {
            id: 'java-practical',
            title: 'Java Programming Practical',
            description: 'Complete Java programming practical assignments',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Java Programming - Practical Assignment'
        },
        {
            id: 'dbms-practical',
            title: 'DBMS Practical Assignment',
            description: 'Database Management System practical exercises',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Database Management System - Practical Assignment'
        },
        {
            id: 'web-tech-practical',
            title: 'Web Technology Practical',
            description: 'Web development practical assignments',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Web Technology - Practical Assignment'
        }
    ],
    'test-papers': [
        {
            id: 'ada-test-1',
            title: 'ADA Test Paper 1',
            description: 'First internal test paper for Analysis and Design of Algorithms',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Analysis and Design of Algorithm - Test Paper'
        },
        {
            id: 'cso-test-1',
            title: 'CSO Test Paper 1',
            description: 'First internal test paper for Computer System Organization',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Computer System Organization - Test Paper'
        },
        {
            id: 'java-test-2',
            title: 'Java Test Paper 2',
            description: 'Second internal test paper for Java Programming',
            previewUrl: '',
            downloadUrl: '',
            subject: 'Java Programming - Test Paper'
        }
    ],
    syllabus: {
        cse: [
            {
                id: 'cs-302-syllabus',
                title: 'CS 302 Syllabus',
                description: 'Analysis and Design of Algorithms syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CS 302 - Analysis and Design of Algorithms Syllabus'
            },
            {
                id: 'cs-303-syllabus',
                title: 'CS 303 Syllabus',
                description: 'Computer System Organization syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CS 303 - Computer System Organization Syllabus'
            },
            {
                id: 'cs-304-syllabus',
                title: 'CS 304 Syllabus',
                description: 'Object Oriented Programming syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CS 304 - Object Oriented Programming Syllabus'
            }
        ],
        ece: [
            {
                id: 'ec-301-syllabus',
                title: 'EC 301 Syllabus',
                description: 'Electronic Devices and Circuits syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'EC 301 - Electronic Devices and Circuits Syllabus'
            },
            {
                id: 'ec-302-syllabus',
                title: 'EC 302 Syllabus',
                description: 'Digital Electronics syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'EC 302 - Digital Electronics Syllabus'
            }
        ],
        me: [
            {
                id: 'me-301-syllabus',
                title: 'ME 301 Syllabus',
                description: 'Thermodynamics syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'ME 301 - Thermodynamics Syllabus'
            },
            {
                id: 'me-302-syllabus',
                title: 'ME 302 Syllabus',
                description: 'Fluid Mechanics syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'ME 302 - Fluid Mechanics Syllabus'
            }
        ],
        ee: [
            {
                id: 'ee-301-syllabus',
                title: 'EE 301 Syllabus',
                description: 'Electrical Machines syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'EE 301 - Electrical Machines Syllabus'
            }
        ],
        ce: [
            {
                id: 'ce-301-syllabus',
                title: 'CE 301 Syllabus',
                description: 'Structural Analysis syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CE 301 - Structural Analysis Syllabus'
            }
        ],
        iot: [
            {
                id: 'iot-301-syllabus',
                title: 'IoT 301 Syllabus',
                description: 'Internet of Things Fundamentals syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'IoT 301 - Internet of Things Fundamentals Syllabus'
            }
        ],
        it: [
            {
                id: 'it-301-syllabus',
                title: 'IT 301 Syllabus',
                description: 'Information Technology Fundamentals syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'IT 301 - Information Technology Fundamentals Syllabus'
            }
        ],
        bct: [
            {
                id: 'bct-301-syllabus',
                title: 'BCT 301 Syllabus',
                description: 'Blockchain Technology syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'BCT 301 - Blockchain Technology Syllabus'
            }
        ],
        aiads: [
            {
                id: 'aiads-301-syllabus',
                title: 'AIADS 301 Syllabus',
                description: 'AI and Data Science Fundamentals syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'AIADS 301 - AI and Data Science Fundamentals Syllabus'
            }
        ],
        aiaml: [
            {
                id: 'aiaml-301-syllabus',
                title: 'AIAML 301 Syllabus',
                description: 'AI and Machine Learning Fundamentals syllabus',
                previewUrl: '',
                downloadUrl: '',
                subject: 'AIAML 301 - AI and Machine Learning Fundamentals Syllabus'
            }
        ]
    },
    pyqs: {
        cse: [
            {
                id: 'cs-302-dec-2023',
                title: 'CS&BC 302 Dec (2023)',
                description: 'Analysis and Design of Algorithms December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CS&BC 302 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'all-branch-mab-204-dec-2023',
                title: 'All Branch MAB 204 Dec (2023)',
                description: 'Mathematics December 2023 paper for all branches',
                previewUrl: '',
                downloadUrl: '',
                subject: 'All Branch MAB 204 Dec (2023) - Previous Year Question Paper'
            },
            {
                id: 'bc-304-may-2024',
                title: 'BC 304 May (2024)',
                description: 'Basic Computer May 2024 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'BC 304 May (2024) - Previous Year Question Paper'
            },
            {
                id: 'cse-bc-303-may-2024',
                title: 'CSE&BC 303 May (2024)',
                description: 'Computer System Organization May 2024 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CSE&BC 303 May (2024) - Previous Year Question Paper'
            }
        ],
        ece: [
            {
                id: 'ec-301-dec-2023',
                title: 'EC 301 Dec (2023)',
                description: 'Electronic Devices December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'EC 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        me: [
            {
                id: 'me-301-dec-2023',
                title: 'ME 301 Dec (2023)',
                description: 'Thermodynamics December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'ME 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        ee: [
            {
                id: 'ee-301-dec-2023',
                title: 'EE 301 Dec (2023)',
                description: 'Electrical Machines December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'EE 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        ce: [
            {
                id: 'ce-301-dec-2023',
                title: 'CE 301 Dec (2023)',
                description: 'Structural Analysis December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'CE 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        iot: [
            {
                id: 'iot-301-dec-2023',
                title: 'IoT 301 Dec (2023)',
                description: 'Internet of Things December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'IoT 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        it: [
            {
                id: 'it-301-dec-2023',
                title: 'IT 301 Dec (2023)',
                description: 'Information Technology December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'IT 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        bct: [
            {
                id: 'bct-301-dec-2023',
                title: 'BCT 301 Dec (2023)',
                description: 'Blockchain Technology December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'BCT 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        aiads: [
            {
                id: 'aiads-301-dec-2023',
                title: 'AIADS 301 Dec (2023)',
                description: 'AI and Data Science December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'AIADS 301 Dec (2023) - Previous Year Question Paper'
            }
        ],
        aiaml: [
            {
                id: 'aiaml-301-dec-2023',
                title: 'AIAML 301 Dec (2023)',
                description: 'AI and Machine Learning December 2023 paper',
                previewUrl: '',
                downloadUrl: '',
                subject: 'AIAML 301 Dec (2023) - Previous Year Question Paper'
            }
        ]
    }
};

// Global Variables
let currentCategory = 'notes';
let currentBranch = null;
let currentResource = null;
let filteredResources = [];

// DOM Elements
const menuItems = document.querySelectorAll('.menu-item');
const subMenuItems = document.querySelectorAll('.sub-menu-item');
const resourceList = document.getElementById('resourceList');
const previewTitle = document.getElementById('previewTitle');
const pdfPreview = document.getElementById('pdfPreview');
const loadingSpinner = document.getElementById('loadingSpinner');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const searchInput = document.getElementById('searchInput');
const darkModeToggle = document.getElementById('darkModeToggle');
const shareModal = document.getElementById('shareModal');
const closeModal = document.getElementById('closeModal');
const shareLink = document.getElementById('shareLink');
const copyLinkBtn = document.getElementById('copyLinkBtn');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadDefaultContent();
});

// Initialize page settings
function initializePage() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateDarkModeIcon(savedTheme === 'dark');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', handleMenuClick);
    });

    // Sub-menu item clicks
    subMenuItems.forEach(item => {
        item.addEventListener('click', handleSubMenuClick);
    });

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Action buttons
    downloadBtn.addEventListener('click', handleDownload);
    shareBtn.addEventListener('click', handleShare);

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Modal functionality
    closeModal.addEventListener('click', closeShareModal);
    copyLinkBtn.addEventListener('click', copyShareLink);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === shareModal) {
            closeShareModal();
        }
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialShare);
    });
}

// Handle menu item clicks
function handleMenuClick(event) {
    const menuItem = event.currentTarget;
    const category = menuItem.getAttribute('data-category');

    // Handle dropdown items
    if (menuItem.classList.contains('dropdown-item')) {
        toggleDropdown(category);
        return;
    }

    // Update active menu item
    menuItems.forEach(item => item.classList.remove('active'));
    menuItem.classList.add('active');

    // Update current category
    currentCategory = category;
    currentBranch = null;

    // Load resources for this category
    loadResources(category);
}

// Handle sub-menu item clicks
function handleSubMenuClick(event) {
    const subMenuItem = event.currentTarget;
    const category = subMenuItem.getAttribute('data-category');
    const branch = subMenuItem.getAttribute('data-branch');

    // Update active sub-menu item
    subMenuItems.forEach(item => item.classList.remove('active'));
    subMenuItem.classList.add('active');

    // Update current category and branch
    currentCategory = category;
    currentBranch = branch;

    // Load resources for this category and branch
    loadResources(category, branch);
}

// Toggle dropdown menus
function toggleDropdown(category) {
    const dropdown = document.getElementById(category + 'Dropdown');
    const menuItem = document.querySelector(`[data-category="${category}"]`);
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        menuItem.classList.remove('active');
    } else {
        // Close other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(dd => {
            dd.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open this dropdown
        dropdown.classList.add('show');
        menuItem.classList.add('active');
    }
}

// Load resources based on category and branch
function loadResources(category, branch = null) {
    let resources = [];

    if (category === 'syllabus' || category === 'pyqs') {
        if (branch && resourcesData[category][branch]) {
            resources = resourcesData[category][branch];
        }
    } else {
        resources = resourcesData[category] || [];
    }

    filteredResources = resources;
    displayResources(resources);

    // Load first resource by default
    if (resources.length > 0) {
        loadResource(resources[0]);
    } else {
        showEmptyState();
    }
}

// Display resources in the right sidebar
function displayResources(resources) {
    resourceList.innerHTML = '';

    if (resources.length === 0) {
        resourceList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No resources available</p>
            </div>
        `;
        return;
    }

    resources.forEach((resource, index) => {
        const resourceItem = document.createElement('div');
        resourceItem.className = `resource-item ${index === 0 ? 'active' : ''}`;
        resourceItem.setAttribute('data-resource-id', resource.id);
        
        resourceItem.innerHTML = `
            <h4 class="tooltip">${resource.title}
                <span class="tooltiptext">${resource.description}</span>
            </h4>
            <p>${resource.description}</p>
        `;

        resourceItem.addEventListener('click', () => {
            // Update active resource item
            document.querySelectorAll('.resource-item').forEach(item => {
                item.classList.remove('active');
            });
            resourceItem.classList.add('active');

            // Load this resource
            loadResource(resource);
        });

        resourceList.appendChild(resourceItem);
    });
}

// Load a specific resource in the preview area
function loadResource(resource) {
    currentResource = resource;
    
    // Update title
    previewTitle.textContent = resource.subject;

    // Show loading spinner
    showLoading();

    // Simulate loading delay (remove this in production)
    setTimeout(() => {
        if (resource.previewUrl) {
            loadPDFPreview(resource.previewUrl);
        } else {
            showPlaceholder();
        }
    }, 1000);

    // Update action buttons
    updateActionButtons(resource);
}

// Show loading state
function showLoading() {
    loadingSpinner.style.display = 'flex';
    pdfPreview.style.display = 'none';
}

// Load PDF preview
function loadPDFPreview(url) {
    pdfPreview.src = url;
    pdfPreview.onload = function() {
        loadingSpinner.style.display = 'none';
        pdfPreview.style.display = 'block';
    };
}

// Show placeholder when no preview URL is available
function showPlaceholder() {
    loadingSpinner.innerHTML = `
        <i class="fas fa-file-pdf"></i>
        <p>Preview will be available soon</p>
        <small>PDF preview links will be added by administrator</small>
    `;
}

// Show empty state
function showEmptyState() {
    previewTitle.textContent = 'Select a resource to preview';
    loadingSpinner.innerHTML = `
        <i class="fas fa-folder-open"></i>
        <p>No resources selected</p>
        <small>Choose a category and resource from the sidebar</small>
    `;
    loadingSpinner.style.display = 'flex';
    pdfPreview.style.display = 'none';
}

// Update action buttons based on current resource
function updateActionButtons(resource) {
    downloadBtn.onclick = () => {
        if (resource.downloadUrl) {
            window.open(resource.downloadUrl, '_blank');
        } else {
            showNotification('Download link not available yet', 'warning');
        }
    };

    shareBtn.onclick = () => {
        if (resource.previewUrl) {
            openShareModal(resource);
        } else {
            showNotification('Share link not available yet', 'warning');
        }
    };
}

// Handle search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (searchTerm === '') {
        displayResources(filteredResources);
        return;
    }

    const filtered = filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) ||
        resource.description.toLowerCase().includes(searchTerm)
    );

    displayResources(filtered);
}

// Handle download button click
function handleDownload() {
    if (currentResource && currentResource.downloadUrl) {
        window.open(currentResource.downloadUrl, '_blank');
    } else {
        showNotification('Download link not available yet', 'warning');
    }
}

// Handle share button click
function handleShare() {
    if (currentResource) {
        openShareModal(currentResource);
    }
}

// Open share modal
function openShareModal(resource) {
    const shareUrl = resource.previewUrl || window.location.href;
    shareLink.value = shareUrl;
    shareModal.style.display = 'block';
}

// Close share modal
function closeShareModal() {
    shareModal.style.display = 'none';
}

// Copy share link to clipboard
function copyShareLink() {
    shareLink.select();
    shareLink.setSelectionRange(0, 99999);
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

// Handle social media sharing
function handleSocialShare(event) {
    const platform = event.currentTarget.classList[1];
    const url = shareLink.value;
    const title = currentResource ? currentResource.title : 'SATI Resource';
    
    let shareUrl = '';
    
    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this resource: ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme === 'dark');
}

// Update dark mode icon
function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

// Load default content on page load
function loadDefaultContent() {
    // Set Notes as active by default
    const notesMenuItem = document.querySelector('[data-category="notes"]');
    if (notesMenuItem) {
        notesMenuItem.classList.add('active');
    }
    
    // Load notes resources
    loadResources('notes');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-hover);
        border-left: 4px solid var(--primary-color);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 2001;
        min-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left-color: var(--accent-color);
    }
    
    .notification-warning {
        border-left-color: #ff9800;
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: var(--accent-color);
    }
    
    .notification-warning i {
        color: #ff9800;
    }
`;

// Add notification styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Utility function to convert Google Drive links to embed format
function convertToEmbedUrl(driveUrl) {
    if (driveUrl.includes('drive.google.com')) {
        const fileId = driveUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (fileId) {
            return `https://drive.google.com/file/d/${fileId[1]}/preview`;
        }
    }
    return driveUrl;
}

// Function to update resource data (to be called when user provides links)
function updateResourceData(resourceId, previewUrl, downloadUrl) {
    // Find and update the resource in the data structure
    function findAndUpdate(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                if (item.id === resourceId) {
                    item.previewUrl = convertToEmbedUrl(previewUrl);
                    item.downloadUrl = downloadUrl;
                }
            });
        } else if (typeof obj === 'object') {
            Object.values(obj).forEach(value => {
                findAndUpdate(value);
            });
        }
    }
    
    findAndUpdate(resourcesData);
    
    // If this is the currently loaded resource, update the preview
    if (currentResource && currentResource.id === resourceId) {
        currentResource.previewUrl = convertToEmbedUrl(previewUrl);
        currentResource.downloadUrl = downloadUrl;
        loadPDFPreview(currentResource.previewUrl);
        updateActionButtons(currentResource);
    }
}

// Export function for external use
window.updateResourceData = updateResourceData;

// Function to show coming soon message for navbar links
function showComingSoon(pageName) {
    showNotification(`${pageName} page coming soon!`, 'info');
}

// Export function for external use
window.showComingSoon = showComingSoon;