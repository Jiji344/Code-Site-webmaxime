/* ===============================================
   PORTFOLIO PHOTOGRAPHER - JAVASCRIPT
   Version: 2.0 - Complètement refait
   =============================================== */

'use strict';

/* ===== NAVIGATION MOBILE ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Fonction pour fermer le menu
function closeMobileMenu() {
    if (hamburger) {
        hamburger.classList.remove('active');
    }
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
    }
    document.body.classList.remove('menu-open');
    // Rétablir le padding
    document.body.style.paddingRight = '';
    const header = document.querySelector('.header');
    if (header) {
        header.style.paddingRight = '';
    }
}

// Toggle du menu mobile
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Empêcher le scroll du body quand le menu est ouvert
        if (isActive) {
            // Calculer la largeur de la scrollbar pour éviter le décalage
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = scrollbarWidth + 'px';
            // Appliquer aussi au header fixe
            const header = document.querySelector('.header');
            if (header) {
                header.style.paddingRight = scrollbarWidth + 'px';
            }
            document.body.classList.add('menu-open');
        } else {
            document.body.style.paddingRight = '';
            const header = document.querySelector('.header');
            if (header) {
                header.style.paddingRight = '';
            }
            document.body.classList.remove('menu-open');
        }
    });
}

// Fermer le menu au clic sur l'overlay
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Fermer le menu au clic sur un lien
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Fermer le menu avec la touche Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

/* ===== SMOOTH SCROLLING ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#' || href.length <= 1) {
            return;
        }

        const targetId = href.slice(1);
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        e.preventDefault();

        // Vérifier si on clique sur #accueil alors qu'on est déjà en haut
        if (href === '#accueil' && window.scrollY < 100) {
            // Ne rien faire, on est déjà en haut
            return;
        }

        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

/* ===== INTERSECTION OBSERVER POUR LES ANIMATIONS ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Initialiser les éléments à observer
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.portfolio-item, .skill-item, .contact-item');

    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

/* ===== GESTION DU PORTFOLIO ===== */
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const portfolioAutoScroll = document.getElementById('portfolio-auto-scroll');
const portfolioNormalGrid = document.getElementById('portfolio-normal-grid');
const hasPortfolioLayouts = portfolioAutoScroll instanceof HTMLElement && portfolioNormalGrid instanceof HTMLElement;

// Fonction de filtrage
function handleFilter(filterValue) {
    filterButtons.forEach(btn => btn.classList.remove('active'));

    const activeButton = document.querySelector(`[data-filter="${filterValue}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    const isMobile = window.innerWidth <= 768;
    const useAutoScroll = hasPortfolioLayouts && filterValue === 'all' && !isMobile;

    if (hasPortfolioLayouts) {
        portfolioAutoScroll.style.display = useAutoScroll ? 'block' : 'none';
        portfolioNormalGrid.style.display = useAutoScroll ? 'none' : 'grid';
    }

    if (useAutoScroll) {
        return;
    }

    portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Event listeners pour les boutons de filtre
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        handleFilter(filterValue);
    });
});

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            const parent = img.parentElement;
            const placeholder = parent ? parent.querySelector('.placeholder-image') : null;
            if (placeholder) {
                img.style.display = 'none';
                placeholder.style.display = 'flex';
            }
        });
    });

    const isMobile = window.innerWidth <= 768;
    handleFilter('all');

    if (isMobile) {
        portfolioItems.forEach(item => {
            item.style.display = 'block';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
            item.style.visibility = 'visible';
        });

        if (hasPortfolioLayouts) {
            portfolioNormalGrid.style.visibility = 'visible';
        }
    }
});

// Gestion du redimensionnement
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            if (hasPortfolioLayouts) {
                portfolioAutoScroll.style.display = 'none';
                portfolioNormalGrid.style.display = 'grid';
                portfolioNormalGrid.style.visibility = 'visible';
            }

            portfolioItems.forEach(item => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.visibility = 'visible';
            });
        } else {
            const currentFilter = document.querySelector('.filter-btn.active');
            const filterValue = currentFilter ? currentFilter.getAttribute('data-filter') : 'all';
            handleFilter(filterValue || 'all');
        }
    }, 150);
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDescription = document.getElementById('lightbox-description');
const closeLightbox = document.querySelector('.close-lightbox');

function openLightbox(item) {
    if (!item || !lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) {
        return;
    }

    const title = item.querySelector('h3');
    const description = item.querySelector('p');
    const imagePlaceholder = item.querySelector('.placeholder-image');
    const image = item.querySelector('img');
    
    if (!title || !description) {
        console.warn('Éléments manquants dans l\'item du portfolio');
        return;
    }
    
    let imageSrc;
    if (image && image.src) {
        imageSrc = image.src;
    } else if (imagePlaceholder) {
        imageSrc = `data:image/svg+xml;base64,${btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#3A7894"/>
                <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
                    ${imagePlaceholder.textContent}
                </text>
            </svg>
        `)}`;
    } else {
        imageSrc = `data:image/svg+xml;base64,${btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#3A7894"/>
                <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
                    📸
                </text>
            </svg>
        `)}`;
    }
    
    lightboxImage.src = imageSrc;
    lightboxTitle.textContent = title.textContent;
    lightboxDescription.textContent = description.textContent;
    lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Event listeners pour portfolio items
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        openLightbox(item);
    });
});

// Event listener pour scroll items (délégation)
document.addEventListener('DOMContentLoaded', () => {
    const portfolioContainer = document.querySelector('.portfolio');
    if (portfolioContainer) {
        portfolioContainer.addEventListener('click', (e) => {
            const scrollItem = e.target.closest('.portfolio-scroll-item');
            if (scrollItem) {
                openLightbox(scrollItem);
            }
        });
    }
});

// Fermer le lightbox
if (closeLightbox && lightbox) {
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

/* ===== EFFET PARALLAXE HERO ===== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

/* ===== ANIMATIONS AU CHARGEMENT ===== */
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroDescription = document.querySelector('.hero-description');
    const ctaButton = document.querySelector('.cta-button');
    
    const animateElement = (element, delay) => {
        if (element) {
        setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, delay);
        }
    };
    
    animateElement(heroTitle, 200);
    animateElement(heroSubtitle, 400);
    animateElement(heroDescription, 600);
    animateElement(ctaButton, 800);
});

/* ===== CURSEUR OBJECTIF SIMPLE DESKTOP ===== */
let pointer = null;
let pointerVisible = false;
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

function initPointer() {
    if (window.innerWidth < 769) return;
    if (pointerVisible) return;
    
    // Créer le conteneur du curseur
    pointer = document.createElement('div');
    pointer.className = 'custom-pointer';

    // Créer la structure du curseur
    const cursorCore = document.createElement('div');
    cursorCore.className = 'cursor-core';
    
    const cursorRing = document.createElement('div');
    cursorRing.className = 'cursor-ring';
    
    const cursorOuterRing = document.createElement('div');
    cursorOuterRing.className = 'cursor-outer-ring';
    
    pointer.appendChild(cursorCore);
    pointer.appendChild(cursorRing);
    pointer.appendChild(cursorOuterRing);
    
    document.body.appendChild(pointer);
    pointerVisible = true;

    // Position initiale
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    cursorX = mouseX;
    cursorY = mouseY;
    pointer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    // Animation fluide avec requestAnimationFrame
    function animateCursor() {
        // Lerp plus rapide pour moins de latence
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;
        
        pointer.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Mouvement du curseur
    const moveHandler = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };

    // Effet au clic
    const downHandler = (e) => {
        pointer.classList.add('is-active');
        createClickExplosion(e.clientX, e.clientY);
    };
    
    const upHandler = () => {
        pointer.classList.remove('is-active');
    };

    // Effet au survol des éléments interactifs
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .filter-btn, .cta-button, .submit-btn, .hamburger, input, textarea');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            pointer.classList.add('is-hover');
        });
        
        el.addEventListener('mouseleave', () => {
            pointer.classList.remove('is-hover');
        });
    });

    document.addEventListener('mousemove', moveHandler, { passive: true });
    document.addEventListener('mousedown', downHandler);
    document.addEventListener('mouseup', upHandler);

    window.addEventListener('resize', () => {
        if (window.innerWidth < 769 && pointerVisible) {
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mousedown', downHandler);
            document.removeEventListener('mouseup', upHandler);
            pointer.remove();
            pointerVisible = false;
        }
    });
}

// Effet simple au clic (desktop)
function createClickExplosion(x, y) {
    // Onde de choc
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'translate(-50%, -50%)';
    
    document.body.appendChild(ripple);
    
    // Juste 4 particules
    for (let i = 0; i < 4; i++) {
        createExplosionParticle(x, y, i);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 500);
}

// Particules simples
function createExplosionParticle(x, y, index) {
    const particle = document.createElement('div');
    particle.className = 'click-particle';
    
    const angle = (index / 4) * Math.PI * 2;
    const distance = 40;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;
    
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    document.body.appendChild(particle);
    
    particle.animate([
        { 
            left: x + 'px', 
            top: y + 'px',
            opacity: 1
        },
        { 
            left: targetX + 'px', 
            top: targetY + 'px',
            opacity: 0
        }
    ], {
        duration: 400,
        easing: 'ease-out'
    });
    
    setTimeout(() => {
        particle.remove();
    }, 400);
}

// Initialiser le curseur dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPointer);
} else {
    initPointer();
}
window.addEventListener('load', initPointer);

/* ===== ANIMATION TOUCH MOBILE SIMPLE ===== */
let touchEffectsInitialized = false;
let touchClickFallbackAttached = false;

function initTouchEffects() {
    if (!touchEffectsInitialized) {
        // Touch events pour mobile
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            createSimpleTouchEffect(touch.clientX, touch.clientY);
        }, { passive: true });

        touchEffectsInitialized = true;
    }

    // Click events comme fallback (pour simulateurs et certains appareils)
    if (window.innerWidth < 769 && !touchClickFallbackAttached) {
        document.addEventListener('click', (e) => {
            createSimpleTouchEffect(e.clientX, e.clientY);
        });

        touchClickFallbackAttached = true;
    }
}

// Effet simple au touch (mobile) - juste un cercle qui s'agrandit
function createSimpleTouchEffect(x, y) {
    // Cercle simple qui s'agrandit
    const circle = document.createElement('div');
    circle.style.cssText = `
            position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
            border-radius: 50%;
        background: radial-gradient(circle, rgba(58, 120, 148, 0.6) 0%, rgba(58, 120, 148, 0.3) 50%, transparent 100%);
        border: 2px solid rgba(58, 120, 148, 0.8);
            pointer-events: none;
            z-index: 9999;
        transform: translate(-50%, -50%);
        `;
        
    document.body.appendChild(circle);
        
    // Animation simple d'expansion et fade
    circle.animate([
            { 
            width: '20px',
            height: '20px',
                opacity: 1, 
            borderWidth: '2px'
            },
            { 
            width: '80px',
            height: '80px',
                opacity: 0, 
                borderWidth: '0px' 
            }
        ], {
            duration: 600,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}

// Initialiser les effets touch immédiatement et au chargement
initTouchEffects();
window.addEventListener('load', initTouchEffects);

// S'assurer que les effets sont actifs après le DOM
document.addEventListener('DOMContentLoaded', initTouchEffects);

/* ===== SYSTÈME DE PARTICULES ===== */
function createParticleSystem() {
    if (document.getElementById('particle-system')) {
        return;
    }

    const particleContainer = document.createElement('div');
    particleContainer.id = 'particle-system';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.4 + 0.1;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(58, 120, 148, ${opacity});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: particleFloat 10s linear forwards;
        `;
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 10000);
    }
    
    // Créer des particules initiales réparties sur toute la hauteur
    function createInitialParticle() {
        const particle = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.4 + 0.1;
        const startY = Math.random() * 100; // Position initiale aléatoire sur toute la hauteur
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(58, 120, 148, ${opacity});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${startY}%;
            animation: particleFloat 10s linear forwards;
        `;
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 10000);
    }
    
    // Remplir l'écran avec des particules initiales
    for (let i = 0; i < 50; i++) {
        createInitialParticle();
    }
    
    // Puis créer des particules continues normalement
    setInterval(createParticle, 120);
}

// Attendre que le DOM soit chargé avant de créer le système de particules
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createParticleSystem);
} else {
    createParticleSystem();
}

/* ===== ANIMATION CROCODILE (Désactivée) ===== */
// L'animation Lottie du crocodile a été supprimée

/* ===== TRAÎNÉES DES SPHÈRES ===== */
function createSphereTrails() {
    const spheres = document.querySelectorAll('.light-sphere');
    const solarSystem = document.querySelector('.solar-system-2d');
    
    if (!solarSystem) return;
    
    const sphereColors = [
        '#3A7894', '#4D8FAA', '#2D5F73', '#5BA3C0',
        '#6FB6CD', '#4A8BA0', '#5AA7BD', '#397082'
    ];
    
    function createTrailParticle(sphere, color) {
        const rect = sphere.getBoundingClientRect();
        const solarRect = solarSystem.getBoundingClientRect();
        
        const x = rect.left + rect.width / 2 - solarRect.left;
        const y = rect.top + rect.height / 2 - solarRect.top;
        
        const particle = document.createElement('div');
        particle.className = 'sphere-trail-particle';
        particle.style.cssText = `
            left: ${x}px;
            top: ${y}px;
            background: ${color};
            box-shadow: 0 0 6px ${color}, 0 0 12px ${color}60;
            transform: translate(-50%, -50%);
        `;
        
        solarSystem.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    function startTrails() {
        spheres.forEach((sphere, index) => {
            const color = sphereColors[index];
            setInterval(() => {
                createTrailParticle(sphere, color);
            }, 80);
        });
    }
    
    startTrails();
}

setTimeout(() => {
    createSphereTrails();
}, 2000);

/* ===== CAMÉRA 3D QUI TOURNE AUTOUR DU CROCODILE ===== */
let camera3DInitialized = false;

function init3DCamera() {
    // Éviter les chargements multiples
    if (camera3DInitialized) {
        return;
    }
    
    const container = document.getElementById('camera-3d-container');
    
    if (!container) {
        console.log('⚠️ Container non disponible, nouvelle tentative...');
        setTimeout(init3DCamera, 100);
        return;
    }

    if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.log('⚠️ Dimensions du container invalides, nouvelle tentative...');
        setTimeout(init3DCamera, 100);
        return;
    }

    if (typeof THREE === 'undefined') {
        console.log('⚠️ Three.js non disponible, nouvelle tentative...');
        setTimeout(init3DCamera, 100);
        return;
    }
    
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.log('⚠️ GLTFLoader non disponible, nouvelle tentative...');
        setTimeout(init3DCamera, 100);
        return;
    }
    
    // Marquer comme initialisé
    camera3DInitialized = true;
    console.log('🚀 Initialisation des caméras 3D...');

    // Création de la scène
    const scene = new THREE.Scene();
    
    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 3);

    // Création du renderer avec transparence
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Haute résolution sur mobile
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Système d'éclairage optimisé
    
    // 1. Lumière ambiante douce pour l'éclairage de base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // 2. Lumière centrale verte et puissante (au centre de l'objectif)
    const centralLight = new THREE.PointLight(0x3A7894, 4, 15);
    centralLight.position.set(0, 0, 0);
    scene.add(centralLight);
    
    // 3. Lumière principale (key light) depuis l'avant-haut
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 3, 5);
    scene.add(keyLight);
    
    // 4. Lumière de remplissage (fill light) depuis le côté opposé
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, 1, 3);
    scene.add(fillLight);

    // Variables pour l'animation
    let cameraModel1 = null;
    let cameraModel2 = null;
    let angle = Math.PI / 2; // Démarrer en haut
    
    // Adapter la taille et position selon la taille d'écran
    const isMobile = window.innerWidth < 769;
    const radius = isMobile ? 0.65 : 0.45; // Distance du centre (orbite circulaire) - plus proche sur desktop
    const scale = isMobile ? 0.11 : 0.10; // Taille des caméras 3D
    const angleOffset = Math.PI; // Décalage de 180° entre les deux caméras

    // Chargement du modèle GLB
    const loader = new THREE.GLTFLoader();
    loader.load(
        './assets/camera.glb',
        function (gltf) {
            // Première caméra
            cameraModel1 = gltf.scene;
            cameraModel1.scale.set(scale, scale, scale);
            cameraModel1.position.set(0, radius, 0); // Position initiale en haut (cercle parfait)
            
            cameraModel1.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    // Améliorer la qualité du rendu sur tous les écrans
                    if (child.material) {
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            scene.add(cameraModel1);
            
            // Deuxième caméra (clone de la première)
            cameraModel2 = gltf.scene.clone();
            cameraModel2.scale.set(scale, scale, scale);
            
            // Position de départ décalée de 180°
            const angle2 = angle + angleOffset;
            cameraModel2.position.x = Math.cos(angle2) * radius;
            cameraModel2.position.y = Math.sin(angle2) * radius; // Même rayon pour un cercle parfait
            cameraModel2.position.z = 0; // Pas de mouvement sur l'axe Z (profondeur)
            
            cameraModel2.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    // Améliorer la qualité du rendu sur tous les écrans
                    if (child.material) {
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            scene.add(cameraModel2);
            console.log('📸 2 Caméras 3D chargées avec succès');
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% chargé');
        },
        function (error) {
            console.error('❌ Erreur de chargement de la caméra 3D:', error);
        }
    );

    // Animation automatique (sans scroll)
    function animate() {
        requestAnimationFrame(animate);

        if (cameraModel1 && cameraModel2) {
            // Rotation automatique continue
            angle += 0.005; // Vitesse de rotation constante
            
            // Première caméra - Orbite circulaire parfaite (sans profondeur)
            cameraModel1.position.x = Math.cos(angle) * radius;
            cameraModel1.position.y = Math.sin(angle) * radius; // Même rayon = cercle parfait
            cameraModel1.position.z = 0; // Pas de mouvement sur l'axe Z (profondeur)
            cameraModel1.lookAt(camera.position);
            
            // Rotation légère sur elle-même (effet Lottie)
            cameraModel1.rotation.y += 0.018;
            cameraModel1.rotation.x = Math.sin(angle * 2) * 0.18;
            cameraModel1.rotation.z = Math.cos(angle * 1.5) * 0.08;
            
            // Deuxième caméra - Décalée de 180°
            const angle2 = angle + angleOffset;
            cameraModel2.position.x = Math.cos(angle2) * radius;
            cameraModel2.position.y = Math.sin(angle2) * radius; // Même rayon = cercle parfait
            cameraModel2.position.z = 0; // Pas de mouvement sur l'axe Z (profondeur)
            cameraModel2.lookAt(camera.position);
            
            // Rotation légère sur elle-même (effet Lottie)
            cameraModel2.rotation.y += 0.018;
            cameraModel2.rotation.x = Math.sin(angle2 * 2) * 0.18;
            cameraModel2.rotation.z = Math.cos(angle2 * 1.5) * 0.08;
        }

        renderer.render(scene, camera);
    }

    animate();

    // Gestion du redimensionnement
    window.addEventListener('resize', () => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
    });
}

// Initialiser la caméra 3D immédiatement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init3DCamera);
} else {
    init3DCamera();
}

// Forcer le chargement au cas où
window.addEventListener('load', () => {
    const container = document.getElementById('camera-3d-container');
    if (container && !container.querySelector('canvas')) {
        init3DCamera();
    }
});

console.log('✅ Site chargé avec succès - Liquid Glass Theme');
