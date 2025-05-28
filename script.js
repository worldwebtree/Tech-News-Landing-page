// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: true,
        offset: 50
    });

    // Theme Toggle Functionality
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    // Search Functionality
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" class="search-bar" placeholder="Search news..." aria-label="Search news">
    `;
    document.querySelector('.hero').after(searchContainer);

    const searchBar = document.querySelector('.search-bar');
    const newsItems = document.querySelectorAll('.news-item');

    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        newsItems.forEach(item => {
            const title = item.querySelector('h2').textContent.toLowerCase();
            const description = item.querySelector('.description').textContent.toLowerCase();
            const source = item.querySelector('.source').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || source.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Category Filtering
    const categories = ['All', 'Technology', 'AI', 'Programming', 'Blockchain', 'Startup'];
    const categoryFilter = document.createElement('div');
    categoryFilter.className = 'category-filter';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        if (category === 'All') button.classList.add('active');
        categoryFilter.appendChild(button);
    });

    document.querySelector('.search-container').after(categoryFilter);

    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.textContent;
            newsItems.forEach(item => {
                if (category === 'All') {
                    item.style.display = 'block';
                } else {
                    const title = item.querySelector('h2').textContent.toLowerCase();
                    const description = item.querySelector('.description').textContent.toLowerCase();
                    const matchesCategory = title.includes(category.toLowerCase()) || 
                                         description.includes(category.toLowerCase());
                    item.style.display = matchesCategory ? 'block' : 'none';
                }
            });
        });
    });

    // Share Functionality
    const shareModal = document.createElement('div');
    shareModal.className = 'share-modal';
    shareModal.innerHTML = `
        <h3>Share Article</h3>
        <div class="share-options">
            <button class="share-option" data-platform="twitter"><i class="fab fa-twitter"></i> Twitter</button>
            <button class="share-option" data-platform="facebook"><i class="fab fa-facebook"></i> Facebook</button>
            <button class="share-option" data-platform="linkedin"><i class="fab fa-linkedin"></i> LinkedIn</button>
            <button class="share-option" data-platform="copy"><i class="fas fa-link"></i> Copy Link</button>
        </div>
    `;
    document.body.appendChild(shareModal);

    const shareOverlay = document.createElement('div');
    shareOverlay.className = 'share-modal-overlay';
    document.body.appendChild(shareOverlay);

    function openShareModal(title, url) {
        shareModal.classList.add('active');
        shareOverlay.classList.add('active');
        
        const shareOptions = shareModal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.onclick = () => {
                const platform = option.dataset.platform;
                shareArticle(platform, title, url);
            };
        });
    }

    function closeShareModal() {
        shareModal.classList.remove('active');
        shareOverlay.classList.remove('active');
    }

    shareOverlay.addEventListener('click', closeShareModal);

    function shareArticle(platform, title, url) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        if (platform === 'copy') {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
                closeShareModal();
            });
        } else if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            closeShareModal();
        }
    }

    // Add share buttons to news items
    newsItems.forEach(item => {
        const shareButton = document.createElement('button');
        shareButton.className = 'share-button';
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i>';
        const title = item.querySelector('h2').textContent;
        const url = item.querySelector('a').href;
        
        shareButton.addEventListener('click', () => openShareModal(title, url));
        item.querySelector('.news-actions').appendChild(shareButton);
    });

    // Mobile menu functionality
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('.navbar').appendChild(mobileMenuBtn);

    const navLinks = document.querySelector('.nav-links');
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Enhanced news item animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all news items with enhanced animations
    document.querySelectorAll('.news-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.98)';
        item.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(item);

        // Add hover effect for touch devices
        item.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        item.addEventListener('touchend', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced refresh button animation
    const refreshButton = document.querySelector('.refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            this.classList.add('loading');
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite';
            
            // Add loading spinner with enhanced animation
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            this.appendChild(spinner);
            
            // Simulate loading with a more realistic delay
            setTimeout(() => {
                this.classList.remove('loading');
                icon.style.animation = '';
                spinner.remove();
                
                // Add success animation
                this.classList.add('success');
                setTimeout(() => {
                    this.classList.remove('success');
                }, 1000);
            }, 1500);
        });
    }

    // Enhanced social media icons interaction
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Enhanced parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        });
    }

    // Enhanced typing effect for hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30 + Math.random() * 20); // Random delay for more natural typing
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Add scroll progress indicator
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });

    // Add CSS for scroll progress
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(to right, var(--primary-color), var(--accent-color));
            z-index: 1001;
            transition: width 0.1s ease;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading {
            pointer-events: none;
            opacity: 0.7;
        }
        .success {
            animation: success-pulse 0.5s ease;
        }
        @keyframes success-pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);

    // Add scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// Add CSS for scroll to top button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .loading {
        pointer-events: none;
        opacity: 0.7;
    }
    .scroll-top-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
    }
    .scroll-top-btn.show {
        opacity: 1;
        visibility: visible;
    }
    .scroll-top-btn:hover {
        background: var(--secondary-color);
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);

// Add smooth fade-in animation for the hero section
window.addEventListener('load', function() {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 1s ease';
        setTimeout(() => {
            hero.style.opacity = '1';
        }, 100);
    }
}); 