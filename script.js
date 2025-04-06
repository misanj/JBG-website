// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Contact form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            contactForm.classList.add('was-validated');
        }, false);
    }

    // Application form validation
    const applicationForm = document.getElementById('applicationForm');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(event) {
            if (!applicationForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            applicationForm.classList.add('was-validated');
            
            if (applicationForm.checkValidity()) {
                // Form submission handling
                event.preventDefault();
                const formData = new FormData(applicationForm);
                
                // Here you would typically send the data to your server
                fetch('submit_application.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Show success message
                        alert('Application submitted successfully!');
                        // Hide modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('applicationModal'));
                        modal.hide();
                        // Reset form
                        applicationForm.reset();
                        applicationForm.classList.remove('was-validated');
                    } else {
                        alert('There was an error submitting your application. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error submitting your application. Please try again.');
                });
            }
        }, false);
    }

    // Initialize application modal
    const applyBtn = document.getElementById('applyBtn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const applicationModal = new bootstrap.Modal(document.getElementById('applicationModal'));
            applicationModal.show();
        });
    }

    // Image optimization - lazy loading
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Social media links
    const socialLinks = {
        facebook: 'https://facebook.com/cleanmasterpro',
        twitter: 'https://twitter.com/cleanmasterpro',
        instagram: 'https://instagram.com/cleanmasterpro',
        linkedin: 'https://linkedin.com/company/cleanmasterpro'
    };

    document.querySelectorAll('.social-icons a').forEach(link => {
        const platform = link.querySelector('i').className.split('fa-')[1].split(' ')[0];
        if (socialLinks[platform]) {
            link.href = socialLinks[platform];
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
    });

    // Hero carousel autoplay
    const heroCarousel = document.getElementById('heroCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: 'carousel'
        });
    }
});
