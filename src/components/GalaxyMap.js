// src/components/GalaxyMap.js - Galaxy Map Component

/**
 * GalaxyMap - Interactive galaxy visualization component
 * Manages the main galaxy view and planet interactions
 */

class GalaxyMap {
    constructor() {
        this.container = null;
        this.planets = [];
        this.selectedPlanet = null;
        this.isInitialized = false;
        this.animationFrame = null;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastMousePos = { x: 0, y: 0 };
        
        this.init();
    }

    /**
     * Initialize the galaxy map component
     */
    init() {
        this.findElements();
        this.setupEventListeners();
        this.setupPanAndZoom();
        this.isInitialized = true;
        
        // Listen for state changes
        StateManager.addListener((event, data) => {
            this.handleStateChange(event, data);
        });
        
        JSVLogger.info('🌌 GalaxyMap component initialized');
    }

    /**
     * Find and cache DOM elements
     */
    findElements() {
        this.container = document.getElementById('galaxy-map');
        
        if (!this.container) {
            JSVLogger.warn('⚠️ Galaxy map container not found');
            return;
        }
        
        // Create galaxy controls
        this.createGalaxyControls();
    }

    /**
     * Create galaxy navigation controls
     */
    createGalaxyControls() {
        const controlsHTML = `
            <div class="galaxy-controls">
                <button class="control-btn zoom-in" title="Zoom In" data-action="zoom-in">+</button>
                <button class="control-btn zoom-out" title="Zoom Out" data-action="zoom-out">-</button>
                <button class="control-btn reset-view" title="Reset View" data-action="reset">⌂</button>
                <button class="control-btn toggle-labels" title="Toggle Labels" data-action="labels">🏷️</button>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', controlsHTML);
        this.controls = this.container.querySelector('.galaxy-controls');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.container) return;

        // Planet click events (delegated)
        this.container.addEventListener('click', (e) => {
            const planet = e.target.closest('.planet');
            if (planet) {
                this.handlePlanetClick(planet, e);
            }
            
            const controlBtn = e.target.closest('.control-btn');
            if (controlBtn) {
                this.handleControlClick(controlBtn, e);
            }
        });

        // Planet hover events (delegated)
        this.container.addEventListener('mouseenter', (e) => {
            const planet = e.target.closest('.planet');
            if (planet) {
                this.handlePlanetHover(planet, true);
            }
        }, true);

        this.container.addEventListener('mouseleave', (e) => {
            const planet = e.target.closest('.planet');
            if (planet) {
                this.handlePlanetHover(planet, false);
            }
        }, true);

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e.key);
        });

        // Window resize
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));

        // Touch events for mobile
        this.setupTouchEvents();
    }

    /**
     * Setup pan and zoom functionality
     */
    setupPanAndZoom() {
        if (!this.container) return;

        // Mouse wheel for zooming
        this.container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleZoom(e.deltaY, e.clientX, e.clientY);
        });

        // Mouse drag for panning
        this.container.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('planet') || e.target.closest('.planet')) return;
            this.startPan(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.updatePan(e.clientX, e.clientY);
            }
        });

        document.addEventListener('mouseup', () => {
            this.endPan();
        });
    }

    /**
     * Setup touch events for mobile devices
     */
    setupTouchEvents() {
        let lastTouchDistance = 0;
        let lastTouchCenter = { x: 0, y: 0 };

        this.container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // Single touch - start panning
                const touch = e.touches[0];
                this.startPan(touch.clientX, touch.clientY);
            } else if (e.touches.length === 2) {
                // Dual touch - prepare for zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                lastTouchDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                lastTouchCenter = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };
            }
        });

        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            
            if (e.touches.length === 1 && this.isDragging) {
                // Single touch - pan
                const touch = e.touches[0];
                this.updatePan(touch.clientX, touch.clientY);
            } else if (e.touches.length === 2) {
                // Dual touch - zoom
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                
                const currentDistance = Math.sqrt(
                    Math.pow(touch2.clientX - touch1.clientX, 2) +
                    Math.pow(touch2.clientY - touch1.clientY, 2)
                );
                
                const currentCenter = {
                    x: (touch1.clientX + touch2.clientX) / 2,
                    y: (touch1.clientY + touch2.clientY) / 2
                };
                
                if (lastTouchDistance > 0) {
                    const zoomDelta = (lastTouchDistance - currentDistance) * 2;
                    this.handleZoom(zoomDelta, currentCenter.x, currentCenter.y);
                }
                
                lastTouchDistance = currentDistance;
                lastTouchCenter = currentCenter;
            }
        });

        this.container.addEventListener('touchend', (e) => {
            if (e.touches.length === 0) {
                this.endPan();
                lastTouchDistance = 0;
            }
        });
    }

    /**
     * Start panning operation
     */
    startPan(x, y) {
        this.isDragging = true;
        this.lastMousePos = { x, y };
        this.container.style.cursor = 'grabbing';
    }

    /**
     * Update panning position
     */
    updatePan(x, y) {
        if (!this.isDragging) return;

        const deltaX = x - this.lastMousePos.x;
        const deltaY = y - this.lastMousePos.y;

        this.panX += deltaX;
        this.panY += deltaY;

        this.applyTransform();
        this.lastMousePos = { x, y };
    }

    /**
     * End panning operation
     */
    endPan() {
        this.isDragging = false;
        this.container.style.cursor = '';
    }

    /**
     * Handle zoom operation
     */
    handleZoom(deltaY, centerX, centerY) {
        const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.5, Math.min(3, this.zoomLevel * zoomFactor));

        if (newZoom !== this.zoomLevel) {
            // Calculate zoom center relative to container
            const rect = this.container.getBoundingClientRect();
            const centerXRel = centerX - rect.left;
            const centerYRel = centerY - rect.top;

            // Adjust pan to zoom towards cursor/touch point
            this.panX = centerXRel - (centerXRel - this.panX) * (newZoom / this.zoomLevel);
            this.panY = centerYRel - (centerYRel - this.panY) * (newZoom / this.zoomLevel);

            this.zoomLevel = newZoom;
            this.applyTransform();
        }
    }

    /**
     * Apply current transform (pan and zoom)
     */
    applyTransform() {
        const galaxyContent = this.container.querySelector('.galaxy-content') || this.container;
        galaxyContent.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
    }

    /**
     * Handle planet click events
     */
    handlePlanetClick(planetElement, event) {
        event.preventDefault();
        
        const planetId = planetElement.dataset.planetId;
        if (!planetId) return;

        const progress = StateManager.getProgress();
        const isUnlocked = progress.unlockedPlanets.includes(planetId);

        if (!isUnlocked) {
            this.showLockedPlanetFeedback(planetElement);
            return;
        }

        // Select planet
        this.selectPlanet(planetElement);

        // Navigate to planet
        Navigation.navigateTo(`/planet/${planetId}`);

        // Play interaction sound
        this.playInteractionSound();
    }

    /**
     * Handle planet hover events
     */
    handlePlanetHover(planetElement, isEntering) {
        const planetId = planetElement.dataset.planetId;
        
        if (isEntering) {
            // Add hover effect
            planetElement.classList.add('hovered');
            
            // Show planet info
            this.showPlanetInfo(planetId, planetElement);
            
            // Highlight connected planets
            this.highlightConnectedPlanets(planetId, true);
        } else {
            // Remove hover effect
            planetElement.classList.remove('hovered');
            
            // Hide planet info
            this.hidePlanetInfo();
            
            // Remove highlights
            this.highlightConnectedPlanets(planetId, false);
        }
    }

    /**
     * Handle control button clicks
     */
    handleControlClick(button, event) {
        event.preventDefault();
        
        const action = button.dataset.action;
        
        switch (action) {
            case 'zoom-in':
                this.handleZoom(-100, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case 'zoom-out':
                this.handleZoom(100, window.innerWidth / 2, window.innerHeight / 2);
                break;
            case 'reset':
                this.resetView();
                break;
            case 'labels':
                this.toggleLabels();
                break;
        }
        
        this.playInteractionSound();
    }

    /**
     * Handle keyboard navigation
     */
    handleKeyNavigation(key) {
        if (!this.isInitialized) return;

        switch (key) {
            case 'ArrowUp':
                this.navigatePlanet('up');
                break;
            case 'ArrowDown':
                this.navigatePlanet('down');
                break;
            case 'ArrowLeft':
                this.navigatePlanet('left');
                break;
            case 'ArrowRight':
                this.navigatePlanet('right');
                break;
            case 'Enter':
            case ' ':
                if (this.selectedPlanet) {
                    this.selectedPlanet.click();
                }
                break;
            case 'Escape':
                this.deselectPlanet();
                break;
        }
    }

    /**
     * Navigate to adjacent planet using keyboard
     */
    navigatePlanet(direction) {
        const planets = this.container.querySelectorAll('.planet.unlocked');
        if (planets.length === 0) return;

        if (!this.selectedPlanet) {
            this.selectPlanet(planets[0]);
            return;
        }

        const currentIndex = Array.from(planets).indexOf(this.selectedPlanet);
        let nextIndex;

        switch (direction) {
            case 'right':
            case 'down':
                nextIndex = (currentIndex + 1) % planets.length;
                break;
            case 'left':
            case 'up':
                nextIndex = (currentIndex - 1 + planets.length) % planets.length;
                break;
        }

        this.selectPlanet(planets[nextIndex]);
    }

    /**
     * Select a planet
     */
    selectPlanet(planetElement) {
        // Deselect previous planet
        this.deselectPlanet();

        // Select new planet
        this.selectedPlanet = planetElement;
        planetElement.classList.add('selected');

        // Focus planet for accessibility
        planetElement.focus();

        // Center view on planet
        this.centerOnPlanet(planetElement);
    }

    /**
     * Deselect current planet
     */
    deselectPlanet() {
        if (this.selectedPlanet) {
            this.selectedPlanet.classList.remove('selected');
            this.selectedPlanet = null;
        }
    }

    /**
     * Center view on a planet
     */
    centerOnPlanet(planetElement) {
        const rect = planetElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const planetCenterX = rect.left + rect.width / 2 - containerRect.left;
        const planetCenterY = rect.top + rect.height / 2 - containerRect.top;

        const containerCenterX = containerRect.width / 2;
        const containerCenterY = containerRect.height / 2;

        this.panX += (containerCenterX - planetCenterX) / this.zoomLevel;
        this.panY += (containerCenterY - planetCenterY) / this.zoomLevel;

        // Animate to new position
        this.animateTransform();
    }

    /**
     * Animate transform changes
     */
    animateTransform() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }

        const startPanX = parseFloat(this.container.style.transform?.match(/translateX?\(([^px]+)px\)/)?.[1] || 0);
        const startPanY = parseFloat(this.container.style.transform?.match(/translateY?\(([^px]+)px\)/)?.[1] || 0);
        const startZoom = parseFloat(this.container.style.transform?.match(/scale\(([^)]+)\)/)?.[1] || 1);

        const startTime = performance.now();
        const duration = 500; // ms

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);

            const currentPanX = startPanX + (this.panX - startPanX) * eased;
            const currentPanY = startPanY + (this.panY - startPanY) * eased;
            const currentZoom = startZoom + (this.zoomLevel - startZoom) * eased;

            const galaxyContent = this.container.querySelector('.galaxy-content') || this.container;
            galaxyContent.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scale(${currentZoom})`;

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };

        this.animationFrame = requestAnimationFrame(animate);
    }

    /**
     * Reset view to default position and zoom
     */
    resetView() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.animateTransform();
    }

    /**
     * Toggle planet labels visibility
     */
    toggleLabels() {
        this.container.classList.toggle('labels-hidden');
        
        const button = this.controls?.querySelector('[data-action="labels"]');
        if (button) {
            button.style.opacity = this.container.classList.contains('labels-hidden') ? '0.5' : '1';
        }
    }

    /**
     * Show locked planet feedback
     */
    showLockedPlanetFeedback(planetElement) {
        // Add shake animation
        planetElement.classList.add('shake');
        setTimeout(() => {
            planetElement.classList.remove('shake');
        }, 500);

        // Show tooltip
        this.showTemporaryTooltip(planetElement, '🔒 Complete prerequisites to unlock');
    }

    /**
     * Show temporary tooltip
     */
    showTemporaryTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'temporary-tooltip';
        tooltip.textContent = message;

        const rect = element.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.top - 40}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 1000;
            animation: fadeInOut 2s ease;
            pointer-events: none;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 2000);
    }

    /**
     * Show planet information panel
     */
    showPlanetInfo(planetId, planetElement) {
        const planetInfo = GalaxyRenderer.planetDefinitions?.[planetId];
        if (!planetInfo) return;

        let infoPanel = document.querySelector('.planet-info-panel');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.className = 'planet-info-panel';
            document.body.appendChild(infoPanel);
        }

        const progress = StateManager.getProgress();
        const planetProgress = this.calculatePlanetProgress(planetId);

        infoPanel.innerHTML = `
            <div class="info-header">
                <img src="images/planets/${planetId}.png" alt="${planetInfo.title}" class="info-icon">
                <h3>${planetInfo.title}</h3>
            </div>
            <div class="info-content">
                <p>${planetInfo.description}</p>
                <div class="info-stats">
                    <div class="info-stat">
                        <span class="stat-label">Progress:</span>
                        <span class="stat-value">${planetProgress}%</span>
                    </div>
                    <div class="info-stat">
                        <span class="stat-label">Difficulty:</span>
                        <span class="stat-value">${planetInfo.difficulty}</span>
                    </div>
                    <div class="info-stat">
                        <span class="stat-label">Time:</span>
                        <span class="stat-value">${planetInfo.estimatedTime}</span>
                    </div>
                </div>
            </div>
        `;

        // Position panel
        const rect = planetElement.getBoundingClientRect();
        infoPanel.style.cssText = `
            position: fixed;
            top: ${Math.min(rect.bottom + 10, window.innerHeight - 200)}px;
            left: ${Math.max(10, Math.min(rect.left, window.innerWidth - 250))}px;
            opacity: 1;
            visibility: visible;
        `;
    }

    /**
     * Hide planet information panel
     */
    hidePlanetInfo() {
        const infoPanel = document.querySelector('.planet-info-panel');
        if (infoPanel) {
            infoPanel.style.opacity = '0';
            infoPanel.style.visibility = 'hidden';
        }
    }

    /**
     * Calculate planet completion percentage
     */
    calculatePlanetProgress(planetId) {
        const progress = StateManager.getProgress();
        const completedConcepts = progress.completedConcepts.filter(concept =>
            concept.startsWith(planetId)
        );
        const planetInfo = GalaxyRenderer.planetDefinitions?.[planetId];
        const totalConcepts = planetInfo?.concepts || 1;
        return Math.round((completedConcepts.length / totalConcepts) * 100);
    }

    /**
     * Highlight connected planets
     */
    highlightConnectedPlanets(planetId, highlight) {
        const planetInfo = GalaxyRenderer.planetDefinitions?.[planetId];
        if (!planetInfo) return;

        // Highlight dependencies
        planetInfo.dependencies?.forEach(depId => {
            const depPlanet = this.container.querySelector(`[data-planet-id="${depId}"]`);
            if (depPlanet) {
                if (highlight) {
                    depPlanet.classList.add('connected');
                } else {
                    depPlanet.classList.remove('connected');
                }
            }
        });

        // Highlight planets that depend on this one
        Object.values(GalaxyRenderer.planetDefinitions || {}).forEach(planet => {
            if (planet.dependencies?.includes(planetId)) {
                const dependentPlanet = this.container.querySelector(`[data-planet-id="${planet.id}"]`);
                if (dependentPlanet) {
                    if (highlight) {
                        dependentPlanet.classList.add('connected');
                    } else {
                        dependentPlanet.classList.remove('connected');
                    }
                }
            }
        });
    }

    /**
     * Handle state changes from StateManager
     */
    handleStateChange(event, data) {
        switch (event) {
            case 'planetUnlocked':
                this.updatePlanetState(data);
                break;
            case 'conceptCompleted':
                this.updatePlanetProgress();
                break;
            case 'currentPlanetChanged':
                this.highlightCurrentPlanet(data);
                break;
        }
    }

    /**
     * Update planet visual state
     */
    updatePlanetState(planetId) {
        const planetElement = this.container.querySelector(`[data-planet-id="${planetId}"]`);
        if (planetElement) {
            planetElement.classList.remove('locked');
            planetElement.classList.add('unlocked');
        }
    }

    /**
     * Update planet progress indicators
     */
    updatePlanetProgress() {
        const planets = this.container.querySelectorAll('.planet');
        planets.forEach(planet => {
            const planetId = planet.dataset.planetId;
            const progress = this.calculatePlanetProgress(planetId);
            
            const progressBar = planet.querySelector('.planet-progress-fill');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        });
    }

    /**
     * Highlight current planet
     */
    highlightCurrentPlanet(planetId) {
        // Remove current highlighting
        this.container.querySelectorAll('.planet.current')
            .forEach(planet => planet.classList.remove('current'));

        // Add current highlighting
        const currentPlanet = this.container.querySelector(`[data-planet-id="${planetId}"]`);
        if (currentPlanet) {
            currentPlanet.classList.add('current');
        }
    }

    /**
     * Highlight first planet for new users
     */
    highlightFirstPlanet() {
        const firstPlanet = this.container.querySelector('.planet.unlocked');
        if (firstPlanet) {
            this.selectPlanet(firstPlanet);
            firstPlanet.classList.add('pulse');
            setTimeout(() => {
                firstPlanet.classList.remove('pulse');
            }, 3000);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate positions if needed
        // This is handled by CSS mostly, but we might need to adjust transforms
    }

    /**
     * Play interaction sound
     */
    playInteractionSound() {
        const audio = document.getElementById('click-sound');
        if (audio && StateManager.getState().settings.soundEnabled) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio play errors
            });
        }
    }

    /**
     * Destroy galaxy map
     */
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyNavigation);
        
        this.isInitialized = false;
        JSVLogger.info('🗑️ GalaxyMap component destroyed');
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!GalaxyMap.instance) {
            GalaxyMap.instance = new GalaxyMap();
        }
        return GalaxyMap.instance;
    }
}

// CSS animations and styles for galaxy map
const galaxyMapStyles = document.createElement('style');
galaxyMapStyles.textContent = `
    .galaxy-controls {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 0.5rem;
        z-index: 100;
    }

    .control-btn {
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: rgba(26, 26, 46, 0.9);
        color: var(--accent-color);
        border: 1px solid rgba(0, 212, 255, 0.3);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        backdrop-filter: blur(10px);
    }

    .control-btn:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: var(--accent-color);
        transform: scale(1.1);
    }

    .planet.hovered {
        transform: scale(1.1);
        z-index: 15;
    }

    .planet.selected {
        border: 3px solid var(--accent-color);
        box-shadow: 0 0 60px rgba(0, 212, 255, 0.8);
    }

    .planet.connected {
        border-color: var(--warning-color);
        box-shadow: 0 0 40px rgba(255, 230, 109, 0.6);
    }

    .planet.shake {
        animation: shake 0.5s ease-in-out;
    }

    .planet.pulse {
        animation: planetPulse 2s ease-in-out infinite;
    }

    .labels-hidden .planet-title,
    .labels-hidden .planet-subtitle {
        opacity: 0;
    }

    .planet-info-panel {
        background: rgba(26, 26, 46, 0.95);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 12px;
        padding: 1rem;
        max-width: 250px;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        pointer-events: none;
    }

    .info-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .info-icon {
        width: 24px;
        height: 24px;
    }

    .info-header h3 {
        margin: 0;
        color: var(--accent-color);
        font-size: 1.1rem;
    }

    .info-content p {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        line-height: 1.4;
    }

    .info-stats {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .info-stat {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
    }

    .stat-label {
        color: var(--text-secondary);
    }

    .stat-value {
        color: var(--accent-color);
        font-weight: 600;
    }

    .temporary-tooltip {
        font-family: 'SpaceMono', monospace;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        .galaxy-controls {
            bottom: 20px;
            gap: 0.3rem;
        }

        .control-btn {
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }

        .planet-info-panel {
            max-width: 200px;
            padding: 0.8rem;
        }

        .info-header h3 {
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(galaxyMapStyles);

// Create singleton instance
const GalaxyMap = GalaxyMap.getInstance();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.GalaxyMap = GalaxyMap;
}