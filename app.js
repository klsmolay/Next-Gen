// Global state and configuration
const state = {
  isLoaded: false,
  currentSection: 'hero',
  testimonialIndex: 0,
  konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'],
  konamiInput: [],
  rainbowMode: false,
  mouseX: 0,
  mouseY: 0,
  particles: []
};

// Project data
const projectData = {
  'branding': {
    title: 'Brand Revolution',
    description: 'Complete brand transformation for a tech startup with modern visual identity and comprehensive guidelines.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'
  },
  'web': {
    title: 'Digital Odyssey', 
    description: 'Immersive website experience with WebGL animations and cutting-edge interactive elements.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=600&fit=crop'
  },
  'motion': {
    title: 'Neon Dreams',
    description: 'Futuristic motion graphics for a music video featuring cyberpunk aesthetics and fluid animations.',
    year: '2023', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop'
  },
  'web-2': {
    title: 'Cosmic Interface',
    description: 'Space-themed dashboard for data visualization with interactive 3D elements and real-time updates.',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop'
  },
  'motion-2': {
    title: 'Virtual Reality',
    description: 'VR environment design for training simulation with photorealistic 3D modeling and physics.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800&h=600&fit=crop'
  },
  'web-3': {
    title: 'Future Commerce',
    description: 'Next-gen shopping experience with AR integration and seamless mobile-first design.',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
  }
};

// Utility functions
const utils = {
  lerp: (start, end, factor) => start + (end - start) * factor,
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  random: (min, max) => Math.random() * (max - min) + min,
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Particle system for hero section
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 50;
    this.mouseInfluence = 150;
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: utils.random(-0.5, 0.5),
        vy: utils.random(-0.5, 0.5),
        size: utils.random(1, 3),
        opacity: utils.random(0.3, 0.8),
        originalX: 0,
        originalY: 0
      });
    }
    
    // Set original positions
    this.particles.forEach(particle => {
      particle.originalX = particle.x;
      particle.originalY = particle.y;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      // Mouse influence
      const dx = state.mouseX - particle.x;
      const dy = state.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.mouseInfluence) {
        const force = (this.mouseInfluence - distance) / this.mouseInfluence;
        particle.vx += dx * force * 0.01;
        particle.vy += dy * force * 0.01;
      }
      
      // Return to original position
      particle.vx += (particle.originalX - particle.x) * 0.002;
      particle.vy += (particle.originalY - particle.y) * 0.002;
      
      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = state.rainbowMode 
        ? `hsl(${(index + Date.now() * 0.01) % 360}, 70%, 60%)`
        : `rgba(42, 250, 223, ${particle.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.strokeStyle = state.rainbowMode
              ? `hsla(${(index + Date.now() * 0.01) % 360}, 70%, 60%, ${0.3 * (1 - distance / 100)})`
              : `rgba(42, 250, 223, ${0.3 * (1 - distance / 100)})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Skills constellation connections
class SkillsConnections {
  constructor() {
    this.canvas = document.getElementById('connections-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.skillNodes = [];
    
    this.resize();
    this.setupSkillNodes();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const container = document.querySelector('.skills-constellation');
    if (!container) return;
    
    this.canvas.width = container.offsetWidth;
    this.canvas.height = container.offsetHeight;
  }
  
  setupSkillNodes() {
    const nodes = document.querySelectorAll('.skill-node');
    const container = document.querySelector('.skills-constellation');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    
    this.skillNodes = Array.from(nodes).map(node => {
      const rect = node.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
        element: node
      };
    });
  }
  
  animate() {
    if (!this.ctx) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update node positions
    this.setupSkillNodes();
    
    // Draw connections between skills
    for (let i = 0; i < this.skillNodes.length; i++) {
      for (let j = i + 1; j < this.skillNodes.length; j++) {
        const node1 = this.skillNodes[i];
        const node2 = this.skillNodes[j];
        
        const dx = node2.x - node1.x;
        const dy = node2.y - node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 300) {
          const opacity = 0.3 * (1 - distance / 300);
          
          this.ctx.beginPath();
          this.ctx.moveTo(node1.x, node1.y);
          this.ctx.lineTo(node2.x, node2.y);
          this.ctx.strokeStyle = state.rainbowMode
            ? `hsla(${(i * 60 + Date.now() * 0.1) % 360}, 70%, 60%, ${opacity})`
            : `rgba(42, 250, 223, ${opacity})`;
          this.ctx.lineWidth = 2;
          this.ctx.stroke();
        }
      }
    }
    
    this.ctx.shadowBlur = 0;
    requestAnimationFrame(() => this.animate());
  }
}

// Custom cursor system
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.custom-cursor');
    this.trail = document.querySelector('.cursor-trail');
    this.particles = [];
    
    if (this.cursor && this.trail) {
      this.init();
    }
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      
      // Update cursor position
      if (this.cursor) {
        this.cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
      
      // Update trail with delay
      if (this.trail) {
        setTimeout(() => {
          this.trail.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
        }, 100);
      }
      
      // Add particle trail occasionally
      if (Math.random() < 0.1) {
        this.addParticle(e.clientX, e.clientY);
      }
    });
    
    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      if (this.cursor) this.cursor.style.opacity = '0';
      if (this.trail) this.trail.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      if (this.cursor) this.cursor.style.opacity = '1';
      if (this.trail) this.trail.style.opacity = '1';
    });
    
    // Cursor hover effects
    document.querySelectorAll('a, button, .project-card, .skill-node').forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (this.cursor) {
          this.cursor.style.transform += ' scale(1.5)';
          this.cursor.style.background = 'radial-gradient(circle, #FF0080, transparent)';
        }
      });
      
      element.addEventListener('mouseleave', () => {
        if (this.cursor) {
          this.cursor.style.transform = this.cursor.style.transform.replace(' scale(1.5)', '');
          this.cursor.style.background = 'radial-gradient(circle, #2AFADF, transparent)';
        }
      });
    });
  }
  
  addParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.background = state.rainbowMode
      ? `hsl(${Date.now() * 0.01 % 360}, 70%, 60%)`
      : '#2AFADF';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9997';
    particle.style.opacity = '0.8';
    
    document.body.appendChild(particle);
    
    // Animate particle
    let opacity = 0.8;
    let size = 4;
    const vx = utils.random(-2, 2);
    const vy = utils.random(-2, 2);
    let currentX = x;
    let currentY = y;
    
    const animateParticle = () => {
      opacity -= 0.02;
      size -= 0.1;
      currentX += vx;
      currentY += vy;
      
      particle.style.opacity = opacity;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = currentX + 'px';
      particle.style.top = currentY + 'px';
      
      if (opacity <= 0 || size <= 0) {
        particle.remove();
      } else {
        requestAnimationFrame(animateParticle);
      }
    };
    
    requestAnimationFrame(animateParticle);
  }
}

// Loading screen animation
class LoadingScreen {
  constructor() {
    this.loadingScreen = document.querySelector('.loading-screen');
    this.progressBar = document.querySelector('.loading-progress');
    
    if (this.loadingScreen) {
      this.init();
    } else {
      // If no loading screen, initialize app immediately
      this.initializeApp();
    }
  }
  
  init() {
    // Simulate loading time - reduced to 2 seconds for better UX
    setTimeout(() => {
      this.hide();
    }, 2000);
    
    // Also add click to skip loading
    this.loadingScreen.addEventListener('click', () => {
      this.hide();
    });
  }
  
  hide() {
    if (this.loadingScreen) {
      this.loadingScreen.style.opacity = '0';
      this.loadingScreen.style.visibility = 'hidden';
      
      setTimeout(() => {
        this.loadingScreen.style.display = 'none';
      }, 500);
    }
    
    state.isLoaded = true;
    
    // Initialize other systems after loading
    document.body.style.overflow = 'auto';
    this.initializeApp();
  }
  
  initializeApp() {
    // Initialize all interactive elements
    try {
      new CustomCursor();
      
      const particleCanvas = document.getElementById('particle-canvas');
      if (particleCanvas) {
        new ParticleSystem(particleCanvas);
      }
      
      new SkillsConnections();
      new ScrollAnimations();
      new Navigation();
      new ProjectFilters();
      new TestimonialCarousel();
      new ContactForm();
      new RippleEffects();
      new MagneticElements();
      
      // Start typewriter animation
      this.startTypewriter();
      
      // Konami code listener
      this.initKonamiCode();
      
      console.log('Portfolio application initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }
  
  startTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
      typewriterElement.style.animation = 'typewriter 3s steps(20, end), blink-caret 0.75s step-end infinite';
      typewriterElement.style.animationDelay = '1s';
      typewriterElement.style.animationFillMode = 'forwards';
    }
  }
  
  initKonamiCode() {
    document.addEventListener('keydown', (e) => {
      state.konamiInput.push(e.code);
      state.konamiInput = state.konamiInput.slice(-10);
      
      if (JSON.stringify(state.konamiInput) === JSON.stringify(state.konamiCode)) {
        this.activateRainbowMode();
      }
    });
  }
  
  activateRainbowMode() {
    state.rainbowMode = !state.rainbowMode;
    document.body.style.filter = state.rainbowMode ? 'hue-rotate(0deg)' : '';
    
    if (state.rainbowMode) {
      document.body.style.animation = 'rainbow-mode 2s infinite linear';
      this.createCelebrationParticles();
    } else {
      document.body.style.animation = '';
    }
  }
  
  createCelebrationParticles() {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = '-10px';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        
        document.body.appendChild(particle);
        
        let y = -10;
        const speed = utils.random(2, 6);
        
        const fall = () => {
          y += speed;
          particle.style.top = y + 'px';
          
          if (y > window.innerHeight) {
            particle.remove();
          } else {
            requestAnimationFrame(fall);
          }
        };
        
        fall();
      }, i * 100);
    }
  }
}

// Scroll-based animations
class ScrollAnimations {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.progressBar = document.querySelector('.scroll-progress');
    this.init();
  }
  
  init() {
    // Intersection Observer for section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSection(entry.target);
          this.updateNavigation(entry.target.id);
        }
      });
    }, observerOptions);
    
    this.sections.forEach(section => {
      observer.observe(section);
    });
    
    // Scroll progress
    window.addEventListener('scroll', utils.debounce(() => {
      this.updateScrollProgress();
    }, 10));
    
    // Parallax effects
    window.addEventListener('scroll', utils.debounce(() => {
      this.updateParallax();
    }, 16));
  }
  
  animateSection(section) {
    const sectionId = section.id;
    
    switch (sectionId) {
      case 'about':
        this.animateAboutSection();
        break;
      case 'skills':
        this.animateSkillsSection();
        break;
      case 'projects':
        this.animateProjectsSection();
        break;
      case 'testimonials':
        this.animateTestimonialsSection();
        break;
      case 'contact':
        this.animateContactSection();
        break;
    }
  }
  
  animateAboutSection() {
    const splitContent = document.querySelector('.split-content');
    const statItems = document.querySelectorAll('.stat-item');
    
    if (splitContent && !splitContent.classList.contains('animate')) {
      splitContent.classList.add('animate');
    }
    
    // Animate stats counter
    statItems.forEach((item, index) => {
      if (!item.dataset.animated) {
        setTimeout(() => {
          this.animateCounter(item);
          item.dataset.animated = 'true';
        }, index * 200);
      }
    });
  }
  
  animateCounter(item) {
    const target = parseInt(item.dataset.target);
    const numberElement = item.querySelector('.stat-number');
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        numberElement.textContent = Math.floor(current) + (target > 50 ? '+' : '');
        requestAnimationFrame(updateCounter);
      } else {
        numberElement.textContent = target + (target > 50 ? '+' : '');
      }
    };
    
    updateCounter();
  }
  
  animateSkillsSection() {
    const skillNodes = document.querySelectorAll('.skill-node');
    skillNodes.forEach((node, index) => {
      if (!node.dataset.animated) {
        setTimeout(() => {
          node.style.transform = 'scale(1) translateY(0)';
          node.style.opacity = '1';
          node.dataset.animated = 'true';
        }, index * 100);
      }
    });
  }
  
  animateProjectsSection() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      if (!card.dataset.animated) {
        setTimeout(() => {
          card.style.transform = 'translateY(0) rotateX(0)';
          card.style.opacity = '1';
          card.dataset.animated = 'true';
        }, index * 150);
      }
    });
  }
  
  animateTestimonialsSection() {
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel && !carousel.dataset.animated) {
      carousel.style.opacity = '1';
      carousel.style.transform = 'translateY(0)';
      carousel.dataset.animated = 'true';
    }
  }
  
  animateContactSection() {
    const form = document.querySelector('.contact-form');
    const info = document.querySelector('.contact-info');
    
    if (form && !form.dataset.animated) {
      form.style.transform = 'translateX(0)';
      form.style.opacity = '1';
      form.dataset.animated = 'true';
    }
    
    if (info && !info.dataset.animated) {
      setTimeout(() => {
        info.style.transform = 'translateX(0)';
        info.style.opacity = '1';
        info.dataset.animated = 'true';
      }, 300);
    }
  }
  
  updateScrollProgress() {
    if (!this.progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    
    this.progressBar.style.transform = `scaleX(${scrollPercent})`;
  }
  
  updateParallax() {
    const scrollY = window.pageYOffset;
    
    // Floating elements parallax
    const floatingElements = document.querySelectorAll('.float-element');
    floatingElements.forEach((element, index) => {
      const speed = 0.5 + (index * 0.2);
      element.style.transform = `translateY(${scrollY * speed}px)`;
    });
    
    // Gradient mesh parallax
    const gradientMesh = document.querySelector('.gradient-mesh');
    if (gradientMesh) {
      gradientMesh.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  }
  
  updateNavigation(activeSection) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.dataset.section === activeSection) {
        item.classList.add('active');
      }
    });
    
    state.currentSection = activeSection;
  }
}

// Navigation system
class Navigation {
  constructor() {
    this.navItems = document.querySelectorAll('.nav-item');
    this.init();
  }
  
  init() {
    this.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        
        // Update active state immediately
        this.navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }
  
  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      const offsetTop = section.offsetTop - 100; // Account for any fixed headers
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// Project filtering system
class ProjectFilters {
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.projectCards = document.querySelectorAll('.project-card');
    this.init();
    this.setupProjectData();
  }
  
  setupProjectData() {
    // Add proper data attributes and content to project cards
    this.projectCards.forEach((card, index) => {
      const categories = ['branding', 'web', 'motion', 'web-2', 'motion-2', 'web-3'];
      const category = categories[index] || 'branding';
      const data = projectData[category];
      
      if (data) {
        // Set category for filtering
        if (category.includes('web')) {
          card.dataset.category = 'web';
        } else if (category.includes('motion')) {
          card.dataset.category = 'motion';
        } else {
          card.dataset.category = 'branding';
        }
        
        // Update content
        const img = card.querySelector('img');
        const title = card.querySelector('.project-overlay h3');
        const description = card.querySelector('.project-overlay p');
        const year = card.querySelector('.project-year');
        
        if (img && data.image) img.src = data.image;
        if (title) title.textContent = data.title;
        if (description) description.textContent = data.description;
        if (year) year.textContent = data.year;
        
        // Store project data for modal
        card.dataset.projectData = JSON.stringify(data);
      }
    });
  }
  
  init() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        this.filterProjects(filter);
        this.updateActiveButton(button);
      });
    });
    
    // Project card click handlers with improved modal functionality
    this.projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openProjectModal(card);
      });
      
      // Add cursor pointer
      card.style.cursor = 'pointer';
    });
  }
  
  filterProjects(filter) {
    this.projectCards.forEach((card, index) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        setTimeout(() => {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(50px) scale(0.8)';
          
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        }, index * 100);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-50px) scale(0.8)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 600);
      }
    });
  }
  
  updateActiveButton(activeButton) {
    this.filterButtons.forEach(button => {
      button.classList.remove('active');
    });
    activeButton.classList.add('active');
  }
  
  openProjectModal(card) {
    const modal = document.getElementById('project-modal');
    if (!modal) {
      console.error('Project modal not found');
      return;
    }
    
    try {
      const modalImage = document.getElementById('modal-image');
      const modalTitle = document.getElementById('modal-title');
      const modalDescription = document.getElementById('modal-description');
      const modalYear = document.getElementById('modal-year');
      
      // Get project data
      let projectData = null;
      if (card.dataset.projectData) {
        projectData = JSON.parse(card.dataset.projectData);
      } else {
        // Fallback to DOM elements
        const img = card.querySelector('img');
        const title = card.querySelector('.project-overlay h3');
        const description = card.querySelector('.project-overlay p');
        const year = card.querySelector('.project-year');
        
        projectData = {
          image: img ? img.src : '',
          title: title ? title.textContent : 'Project Title',
          description: description ? description.textContent : 'Project description',
          year: year ? year.textContent : '2024'
        };
      }
      
      // Populate modal
      if (modalImage && projectData.image) {
        modalImage.src = projectData.image;
        modalImage.alt = projectData.title;
      }
      if (modalTitle) modalTitle.textContent = projectData.title;
      if (modalDescription) modalDescription.textContent = projectData.description;
      if (modalYear) modalYear.textContent = projectData.year;
      
      // Show modal
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Setup close handlers
      this.setupModalCloseHandlers(modal);
      
      console.log('Modal opened successfully');
      
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }
  
  setupModalCloseHandlers(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    };
    
    // Remove old listeners and add new ones
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
    
    const newOverlay = modalOverlay.cloneNode(true);
    modalOverlay.parentNode.replaceChild(newOverlay, modalOverlay);
    
    newCloseBtn.addEventListener('click', closeModal);
    newOverlay.addEventListener('click', closeModal);
    
    // Keyboard close
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
  }
}

// Testimonial carousel
class TestimonialCarousel {
  constructor() {
    this.testimonials = document.querySelectorAll('.testimonial-item');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    this.currentIndex = 0;
    this.autoplayInterval = null;
    
    if (this.testimonials.length > 0) {
      this.init();
    }
  }
  
  init() {
    // Button handlers
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());
    
    // Dot handlers
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });
    
    // Auto-play
    this.startAutoplay();
    
    // Pause on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
      carousel.addEventListener('mouseenter', () => this.stopAutoplay());
      carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    this.updateCarousel();
  }
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    this.updateCarousel();
  }
  
  goTo(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }
  
  updateCarousel() {
    this.testimonials.forEach((item, index) => {
      item.classList.remove('active', 'prev', 'next');
      
      if (index === this.currentIndex) {
        item.classList.add('active');
      } else if (index === (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length) {
        item.classList.add('prev');
      } else if (index === (this.currentIndex + 1) % this.testimonials.length) {
        item.classList.add('next');
      }
    });
    
    // Update dots
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    state.testimonialIndex = this.currentIndex;
  }
  
  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }
  
  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }
}

// Contact form with particle effects
class ContactForm {
  constructor() {
    this.form = document.getElementById('contact-form');
    this.submitBtn = document.querySelector('.submit-button');
    this.inputs = document.querySelectorAll('.liquid-input');
    
    if (this.form && this.submitBtn) {
      this.init();
    }
  }
  
  init() {
    // Form submit handler
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Input focus effects
    this.inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const ripple = input.parentNode.querySelector('.input-ripple');
        if (ripple) ripple.style.transform = 'scaleX(1)';
      });
      
      input.addEventListener('blur', () => {
        const ripple = input.parentNode.querySelector('.input-ripple');
        if (ripple) ripple.style.transform = 'scaleX(0)';
      });
      
      // Floating label effect
      input.addEventListener('input', () => {
        const label = input.parentNode.querySelector('.floating-label');
        if (label) {
          if (input.value.length > 0) {
            label.style.transform = 'translateY(-2rem) scale(0.8)';
            label.style.color = '#2AFADF';
          } else {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = 'rgba(255, 255, 255, 0.6)';
          }
        }
      });
    });
  }
  
  handleSubmit() {
    console.log('Form submission triggered');
    
    // Basic form validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !message) {
      this.showError('Please fill in all fields');
      return;
    }
    
    // Simulate form submission
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<span>Sending...</span>';
    
    setTimeout(() => {
      this.createConfetti();
      this.submitBtn.innerHTML = '<span>Message Sent! 🎉</span>';
      this.submitBtn.style.background = 'linear-gradient(45deg, #00FFA3, #2AFADF)';
      
      // Show success message
      this.showSuccess('Your message has been sent successfully!');
      
      setTimeout(() => {
        this.form.reset();
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<span>Send Message</span>';
        this.submitBtn.style.background = 'linear-gradient(45deg, #FF0080, #2AFADF)';
        
        // Reset floating labels
        this.inputs.forEach(input => {
          const label = input.parentNode.querySelector('.floating-label');
          if (label) {
            label.style.transform = 'translateY(0) scale(1)';
            label.style.color = 'rgba(255, 255, 255, 0.6)';
          }
        });
      }, 3000);
    }, 2000);
  }
  
  showError(message) {
    console.error(message);
    // You could add a notification system here
  }
  
  showSuccess(message) {
    console.log(message);
    // You could add a notification system here
  }
  
  createConfetti() {
    const canvas = this.submitBtn.querySelector('.confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = this.submitBtn.offsetWidth;
    canvas.height = this.submitBtn.offsetHeight;
    
    const particles = [];
    const colors = ['#FF0080', '#2AFADF', '#FFD700', '#00FFA3', '#FF6F61'];
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: utils.random(-5, 5),
        vy: utils.random(-8, -2),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: utils.random(2, 4),
        gravity: 0.3,
        life: 60
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.life--;
        
        const alpha = particle.life / 60;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        ctx.restore();
        
        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      });
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}

// Ripple effects
class RippleEffects {
  constructor() {
    this.init();
  }
  
  init() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.ripple-button, .ripple-image')) {
        this.createRipple(e);
      }
    });
  }
  
  createRipple(e) {
    const target = e.target.closest('.ripple-button, .ripple-image');
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('div');
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.className = 'button-ripple';
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    target.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Magnetic elements
class MagneticElements {
  constructor() {
    this.magneticElements = document.querySelectorAll('.magnetic-element');
    this.init();
  }
  
  init() {
    this.magneticElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.activateMagnet(element);
      });
      
      element.addEventListener('mouseleave', () => {
        this.deactivateMagnet(element);
      });
      
      element.addEventListener('mousemove', (e) => {
        this.updateMagnetPosition(element, e);
      });
    });
  }
  
  activateMagnet(element) {
    element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  
  deactivateMagnet(element) {
    element.style.transform = 'translate(0, 0) scale(1)';
    element.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  
  updateMagnetPosition(element, e) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    
    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`;
  }
}

// Add rainbow mode CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow-mode {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing portfolio...');
  
  // Prevent scrolling during loading
  document.body.style.overflow = 'hidden';
  
  // Start loading screen
  new LoadingScreen();
});

// Smooth scrolling for all anchor links
document.addEventListener('DOMContentLoaded', () => {
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
});

// Handle window resize
window.addEventListener('resize', utils.debounce(() => {
  // Recalculate positions for responsive design
  const skillsConnections = window.skillsConnections;
  if (skillsConnections) {
    skillsConnections.resize();
  }
}, 250));