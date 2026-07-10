


// ==========================================
// Interactive Particle Canvas Background
// ==========================================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check boundary collisions
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Repulsion from mouse pointer
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const forceX = (dx / distance) * force * 3;
                    const forceY = (dy / distance) * force * 3;
                    
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = Math.floor((canvas.width * canvas.height) / 13000);
        numberOfParticles = Math.min(numberOfParticles, 120); // Cap particles for performance
        
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 0.5;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(15, 23, 42, 0.06)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < 110) {
                    opacityValue = (1 - (distance / 110)) * 0.08;
                    // Draw connection using CSS variable accent-rgb
                    const accentRgb = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '0, 242, 254';
                    ctx.strokeStyle = `rgba(${accentRgb}, ${opacityValue})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    // Resize listener
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
    animate();
}

// Navbar scroll effect + ScrollSpy Active Nav Tracking
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    
    // 1. Toggle scrolled navbar style
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // 2. ScrollSpy: Highlight active section in navigation
    const sections = document.querySelectorAll('section, header, [id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // Check if viewport is past section top with a small offset (150px)
        if (window.scrollY >= (sectionTop - 150)) {
            const id = section.getAttribute('id');
            if (id) current = id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });

    // 3. Dynamic Education Timeline Progress drawing
    updateTimelineProgress();
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
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
        }
    });
});

// Form submission
// Form submission
const contactForm = document.querySelector('.contact-form');
const result = document.getElementById('result');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        if (result) {
            result.innerHTML = "Please wait...";
            result.style.display = "block";
            result.style.marginTop = "1rem";
            result.style.textAlign = "center";
            result.style.fontWeight = "bold";
            result.style.color = "var(--text-primary)";
        }

        const formData = new FormData(contactForm);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    if (result) {
                        result.innerHTML = json.message;
                        result.style.color = "#00ff00"; // Green color
                    }
                    contactForm.reset();
                } else {
                    console.log(response);
                    if (result) {
                        result.innerHTML = json.message;
                        result.style.color = "#ff0000"; // Red color
                    }
                }
            })
            .catch(error => {
                console.log(error);
                if (result) {
                    result.innerHTML = "Something went wrong!";
                    result.style.color = "#ff0000";
                }
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;

                if (result) {
                    setTimeout(() => {
                        result.style.display = "none";
                    }, 5000);
                }
            });
    });
}

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Skill bars animation
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// Add active class to current nav link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
});

// Typing effect for hero subtitle
const typingText = document.querySelector('.typing-text');
if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    setTimeout(typeWriter, 500);
}

// Download Resume functionality
const downloadResumeBtn = document.getElementById('downloadResumeBtn');
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = 'assets/resume.pdf';
        link.download = 'Viral_Resume.pdf';

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

// ==========================================
// Dynamic Filtering Engine (Skills & Projects)
// ==========================================
function setupFilter(filterContainerSelector, gridItemsSelector) {
    const filterContainer = document.querySelector(filterContainerSelector);
    if (!filterContainer) return;

    const filterBtns = filterContainer.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll(gridItemsSelector);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons in this container
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            gridItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide');
                }
            });
        });
    });
}

// Initialize Filters
setupFilter('.skills-filter', '.skills .grid-item');
setupFilter('.projects-filter', '.projects-grid .grid-item');


// ==========================================
// Project Details Modal Implementation
// ==========================================
const projectDetailsData = {
    stock_predictor: {
        title: 'Stock Price Predictor',
        image: 'assets/images/stock_predictor.png',
        tags: ['Python', 'Scikit-learn', 'Pandas', 'Streamlit', 'ML'],
        description: 'An AI-powered application that predicts future stock prices using historical market data and sentiment analysis from financial news. It leverages advanced machine learning algorithms (regression, decision trees) to deliver robust financial forecasts, presented via a clean Streamlit interface with interactive charts. Built to showcase data modeling, ETL, and predictive analysis capabilities.',
        live: 'https://stock-price-predictor-1412.streamlit.app/',
        code: 'https://github.com/ViralNayi/Stock-price-predictor'
    },
    gate_tracker: {
        title: 'GATE Activity Tracker',
        image: 'assets/images/gate_tracker.png',
        tags: ['JavaScript', 'CSS3', 'Glassmorphism', 'Productivity', 'Local Storage'],
        description: 'A specialized productivity and study-session tracker designed for students preparing for competitive examinations. Features real-time task categorization, precise stopwatch counters, and custom visual logging stats to help students maximize focus. Built with high-fidelity glassmorphic design and local persistence.',
        live: 'https://gate-tracker-iota.vercel.app/',
        code: 'https://github.com/ViralNayi/GATE-tracker'
    },
    productivity_dashboard: {
        title: 'Productivity Dashboard',
        image: 'assets/images/productivity_dashboard.png',
        tags: ['TypeScript', 'JavaScript', 'HTML/CSS', 'Responsive Design'],
        description: 'A complete developer productivity panel featuring timeline planning, custom goals tracking, daily analytics dashboard, and layout settings. Deployed natively on Vercel, it emphasizes code cleanliness, performance optimization, and strong type safety using TypeScript.',
        live: 'https://v-dashboard14.vercel.app/',
        code: 'https://github.com/ViralNayi/productivity_dashboard'
    }
};

const projectModal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalTags = document.getElementById('modalTags');
const modalDescription = document.getElementById('modalDescription');
const modalLiveLink = document.getElementById('modalLiveLink');
const modalCodeLink = document.getElementById('modalCodeLink');
const modalClose = document.getElementById('modalClose');

if (projectModal) {
    // Open Modal Listener
    document.querySelectorAll('.open-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = projectDetailsData[projectId];

            if (data) {
                // Populate Modal Data
                modalImage.src = data.image;
                modalImage.alt = data.title;
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                
                // Set links
                modalLiveLink.href = data.live;
                modalCodeLink.href = data.code;

                // Clear and render tags
                modalTags.innerHTML = '';
                data.tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'tag';
                    span.textContent = tag;
                    modalTags.appendChild(span);
                });

                // Show Modal
                projectModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Lock body scroll
            }
        });
    });

    // Close Modal Listener
    const closeModalFunc = () => {
        projectModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock body scroll
    };

    if (modalClose) {
        modalClose.addEventListener('click', closeModalFunc);
    }

    // Close on click outside modal content
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModalFunc();
        }
    });

    // Close on Escape press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModalFunc();
        }
    });
}





// ==========================================
// Skill Visualizations: Dynamic Circular Progress
// ==========================================
document.addEventListener('DOMContentLoaded', () => {


    // ==========================================
    // Skill Visualizations: Dynamic Circular Progress
    // ==========================================
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const progressEl = card.querySelector('.skill-progress');
        const iconEl = card.querySelector('.skill-icon');
        const titleEl = card.querySelector('h3');
        const skillBarEl = card.querySelector('.skill-bar');
        
        if (!progressEl || !iconEl || !titleEl || !skillBarEl) return;
        
        // Extract percentage e.g., "90%" from style="width: 90%;"
        const percentStyle = progressEl.style.width;
        const percentage = parseInt(percentStyle) || 80;
        const color = progressEl.style.getPropertyValue('--skill-color') || 'var(--accent-primary)';
        
        // Re-structure: Create visual wrapper for the circular svg and absolute icon
        const visualWrapper = document.createElement('div');
        visualWrapper.className = 'skill-visual';
        
        // SVG circumference = 2 * PI * r = 2 * 3.14159 * 40 = 251.2
        const r = 40;
        const circ = 2 * Math.PI * r;
        
        // Setup SVG layout
        visualWrapper.innerHTML = `
            <svg class="skill-circle-svg" viewBox="0 0 100 100">
                <circle class="skill-circle-bg" cx="50" cy="50" r="${r}" fill="none" stroke-width="5" />
                <circle class="skill-circle-bar" cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${circ}" />
            </svg>
        `;
        
        // Move the icon into the center of visual wrapper
        const newIcon = iconEl.cloneNode(true);
        visualWrapper.appendChild(newIcon);
        
        // Replace old elements
        card.insertBefore(visualWrapper, titleEl);
        
        // Remove old icon and old progress bar
        iconEl.remove();
        skillBarEl.remove();
        
        // Store percentage on the progress bar circle for animation trigger
        const circleBar = visualWrapper.querySelector('.skill-circle-bar');
        circleBar.setAttribute('data-target-offset', circ * (1 - percentage / 100));
        circleBar.setAttribute('data-circ', circ);
    });
    
    // Intersection Observer to trigger progress circle animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const circleBar = card.querySelector('.skill-circle-bar');
                if (circleBar) {
                    const targetOffset = circleBar.getAttribute('data-target-offset');
                    circleBar.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    circleBar.style.strokeDashoffset = targetOffset;
                }
                obs.unobserve(card); // Animate once
            }
        });
    }, observerOptions);
    
    skillCards.forEach(card => observer.observe(card));
});

// ==========================================
// Double-Sided ID Card Flipping Logic
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const idCard = document.getElementById('portfolioIdCard');
    const idCardInner = document.getElementById('portfolioIdCardInner');

    if (idCard && idCardInner) {
        idCard.addEventListener('click', (e) => {
            // Prevent flipping if user clicked a link
            if (e.target.closest('.id-conn-item')) {
                return;
            }
            idCardInner.classList.toggle('flipped');
        });
    }
});


// ==========================================
// Viewport Scroll Reveal Animation Engine
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Select elements to reveal on scroll
    const targetCards = document.querySelectorAll(
        '.project-card, .terminal-card, .certificate-card, .timeline-item, ' +
        '.skills-dashboard > div, .about-stats > div, .contact-item, .contact-form'
    );
    
    // Add the base class to each element
    targetCards.forEach(card => card.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, { 
        threshold: 0.08, 
        rootMargin: '0px 0px -40px 0px' 
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));
    
    // Initialize education timeline progress bar on page load
    updateTimelineProgress();
});

// ==========================================
// Scroll-Driven Timeline Progress Animation
// ==========================================
function updateTimelineProgress() {
    const timeline = document.querySelector('.education-timeline');
    const progressLine = document.getElementById('timeline-progress');
    const items = document.querySelectorAll('.timeline-item');
    
    if (!timeline || !progressLine) return;
    
    const timelineRect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Start drawing when the timeline top crosses 70% of screen height
    const triggerStart = windowHeight * 0.7;
    
    let progressPercent = 0;
    
    if (timelineRect.top < triggerStart) {
        const totalHeight = timelineRect.height - 100; // Offset for spacing at bottom
        const currentScrolled = triggerStart - timelineRect.top;
        progressPercent = Math.min(Math.max((currentScrolled / totalHeight) * 100, 0), 100);
    }
    
    // Update progress bar element height
    progressLine.style.height = `${progressPercent}%`;
    
    // Toggle active status for crossed nodes
    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        // Trigger active class slightly before card center meets the viewport trigger
        if (itemRect.top < triggerStart - 30) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}
