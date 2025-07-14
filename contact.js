// Dark Mode Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const blurOverlay = document.getElementById('blurOverlay');

    // Dark mode toggle
    if (darkModeToggle) {
        // Set initial icon based on current theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const icon = darkModeToggle.querySelector('i');
        icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

        darkModeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Apply theme
            document.documentElement.setAttribute('data-theme', newTheme);

            // Save to all possible localStorage keys for consistency
            localStorage.setItem('sati_theme', newTheme);
            localStorage.setItem('light', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update icon
            icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        });
    }

    // Mobile menu toggle
    if (mobileMenuToggle && mobileNavMenu && blurOverlay) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileNavMenu.classList.toggle('show');
            blurOverlay.classList.toggle('show');
            document.body.classList.toggle('mobile-menu-open');

            // Update mobile menu toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            if (mobileNavMenu.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        blurOverlay.addEventListener('click', function () {
            mobileNavMenu.classList.remove('show');
            blurOverlay.classList.remove('show');
            document.body.classList.remove('mobile-menu-open');

            // Reset mobile menu toggle icon
            const icon = mobileMenuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });

        // Close mobile menu when clicking on navigation links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', function () {
                mobileNavMenu.classList.remove('show');
                blurOverlay.classList.remove('show');
                document.body.classList.remove('mobile-menu-open');

                // Reset mobile menu toggle icon
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
    }
});

// FAQ Toggle Functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            item.querySelector('.faq-answer').classList.remove('active');
        }
    });

    // Toggle current FAQ item
    faqItem.classList.toggle('active');
    answer.classList.toggle('active');
}

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const submitBtn = this.querySelector('.submit-btn');
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Hide previous messages
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;

        // Show success message
        successMsg.style.display = 'block';

        // Reset form
        this.reset();

        // Scroll to success message
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
});