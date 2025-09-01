// src/components/PlanetCard.js - Planet Card Component

/**
 * PlanetCard - Individual planet representation component
 * Handles planet rendering, state management, and user interactions
 */

class PlanetCard {
    constructor(planetData, options = {}) {
        this.planetData = planetData;
        this.options = {
            container: options.container || null,
            interactive: options.interactive !== false,
            showTooltip: options.showTooltip !== false,
            showProgress: options.showProgress !== false,
            animate: options.animate !== false,
            size: options.size || 'normal', // small, normal, large
            ...options
        };

        this.element = null;
        this.progressBar = null;
        this.tooltip = null;
        this.isLocked = true;
        this.isCompleted = false;
        this.isCurrent = false;
        this.progress = 0;
        this.isInitialized = false;

        this.init();
    }

    /**
     * Initialize the planet card
     */
    init() {
        this.createElement();
        this.updateState();
        this.setupEventListeners();
        this.isInitialized = true;
        
        // Listen for state changes
        StateManager.addListener((event, data) => {
            this.handleStateChange(event, data);
        });

        JSVLogger.debug(`PlanetCard initialized: ${this.planetData.id}`);
    }

    /**
     * Create the planet card DOM element
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.className = `planet ${this.planetData.id} ${this.getSizeClass()}`;
        this.element.setAttribute('data-planet-id', this.planetData.id);
        this.element.setAttribute('data-difficulty', this.planetData.difficulty);
        this.element.setAttribute('role', 'button');
        this.element.setAttribute('tabindex', '0');
        this.element.setAttribute('aria-label', `${this.planetData.title}: ${this.planetData.description}`);

        // Set position
        this.setPosition();

        // Set background gradient
        this.setBackground();

        // Create planet content
        this.createContent();

        // Create progress indicator
        if (this.options.showProgress) {
            this.createProgressIndicator();
        }

        // Create tooltip
        if (this.options.showTooltip) {
            this.createTooltip();
        }

        // Add to container if specified
        if (this.options.container) {
            this.options.container.appendChild(this.element);
        }
    }

    /**
     * Get CSS class for planet size
     */
    getSizeClass() {
        const sizeClasses = {
            small: 'planet-sm',
            normal: '',
            large: 'planet-lg'
        };
        return sizeClasses[this.options.size] || '';
    }

    /**
     * Set planet position based on configuration
     */
    setPosition() {
        if (!this.planetData.position) return;

        const { angle, radius } = this.planetData.position;
        const containerRect = this.options.container?.getBoundingClientRect();
        
        if (containerRect) {
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            const radian = (angle * Math.PI) / 180;
            
            const x = centerX + radius * Math.cos(radian);
            const y = centerY + radius * Math.sin(radian);

            this.element.style.position = 'absolute';
            this.element.style.left = `${x - 60}px`; // 60px = half planet width
            this.element.style.top = `${y - 60}px`;  // 60px = half planet height
        }
    }

    /**
     * Set planet background gradient
     */
    setBackground() {
        const baseColor = this.planetData.color || '#00d4ff';
        const darkerColor = this.darkenColor(baseColor, 0.3);
        
        this.element.style.background = `radial-gradient(circle at 30% 30%, ${baseColor}, ${darkerColor})`;
        this.element.style.setProperty('--planet-color', baseColor);
        this.element.style.setProperty('--planet-dark', darkerColor);
    }

    /**
     * Create planet content (icon, title, subtitle)
     */
    createContent() {
        const content = document.createElement('div');
        content.className = 'planet-content';

        // Planet icon
        const icon = document.createElement('img');
        icon.className = 'planet-icon';
        icon.src = `images/planets/${this.planetData.id}.png`;
        icon.alt = this.planetData.title;
        icon.onerror = () => {
            // Fallback to emoji or text if image fails
            icon.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'planet-icon-fallback';
            fallback.textContent = this.getPlanetEmoji();
            content.insertBefore(fallback, content.firstChild);
        };

        // Planet title
        const title = document.createElement('h3');
        title.className = 'planet-title';
        title.textContent = this.planetData.title;

        // Planet subtitle
        const subtitle = document.createElement('p');
        subtitle.className = 'planet-subtitle';
        subtitle.textContent = this.planetData.subtitle;

        // Add elements to content
        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(subtitle);

        this.element.appendChild(content);
    }

    /**
     * Create progress indicator
     */
    createProgressIndicator() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'planet-progress';

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'planet-progress-fill';
        this.progressBar.style.width = '0%';

        progressContainer.appendChild(this.progressBar);
        this.element.appendChild(progressContainer);
    }

    /**
     * Create tooltip
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'planet-tooltip';
        this.updateTooltipContent();
        this.element.appendChild(this.tooltip);
    }

    /**
     * Update tooltip content
     */
    updateTooltipContent() {
        if (!this.tooltip) return;

        const dependencyText = this.planetData.dependencies && this.planetData.dependencies.length > 0
            ? `Requires: ${this.planetData.dependencies.join(', ')}`
            : 'No prerequisites';

        this.tooltip.innerHTML = `
            <div class="tooltip-content">
                <strong>${this.planetData.title}</strong><br>
                ${this.planetData.description}<br>
                <div class="tooltip-meta">
                    <span>⏱️ ${this.planetData.estimatedTime}</span>
                    <span>🎯 ${this.planetData.concepts} concepts</span>
                    <span>📊 ${this.planetData.difficulty}</span>
                </div>
                <div class="tooltip-dependencies">
                    ${dependencyText}
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.options.interactive) return;

        // Click handler
        this.element.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        // Keyboard handler
        this.element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.handleClick(e);
            }
        });

        // Hover handlers
        this.element.addEventListener('mouseenter', () => {
            this.handleHover(true);
        });

        this.element.addEventListener('mouseleave', () => {
            this.handleHover(false);
        });

        // Focus handlers
        this.element.addEventListener('focus', () => {
            this.handleFocus(true);
        });

        this.element.addEventListener('blur', () => {
            this.handleFocus(false);
        });

        // Touch handlers for mobile
        this.element.addEventListener('touchstart', (e) => {
            this.handleTouch(e);
        });

        // Context menu for additional options
        this.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e);
        });
    }

    /**
     * Handle click events
     */
    handleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.isLocked) {
            this.showLockedFeedback();
            return;
        }

        // Set as current planet
        StateManager.setCurrentPlanet(this.planetData.id);

        // Trigger planet selection
        this.onPlanetSelect();

        // Play interaction sound
        this.playInteractionSound();

        // Add click animation
        this.addClickAnimation();
    }

    /**
     * Handle hover events
     */
    handleHover(isEntering) {
        if (isEntering) {
            this.element.classList.add('hovered');
            this.showDetailedInfo();
        } else {
            this.element.classList.remove('hovered');
            this.hideDetailedInfo();
        }
    }

    /**
     * Handle focus events
     */
    handleFocus(isFocused) {
        if (isFocused) {
            this.element.classList.add('focused');
            if (this.options.showTooltip) {
                this.showTooltip();
            }
        } else {
            this.element.classList.remove('focused');
            if (this.options.showTooltip) {
                this.hideTooltip();
            }
        }
    }

    /**
     * Handle touch events for mobile
     */
    handleTouch(event) {
        // Add touch feedback
        this.element.classList.add('touched');
        
        setTimeout(() => {
            this.element.classList.remove('touched');
        }, 200);

        // Show tooltip briefly on touch
        if (this.options.showTooltip && !this.isLocked) {
            this.showTooltip();
            setTimeout(() => {
                this.hideTooltip();
            }, 2000);
        }
    }

    /**
     * Show context menu
     */
    showContextMenu(event) {
        if (this.isLocked) return;

        const contextMenu = document.createElement('div');
        contextMenu.className = 'planet-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="view-concept">
                <span class="context-icon">📚</span>
                <span>View Concept</span>
            </div>
            <div class="context-menu-item" data-action="start-quiz">
                <span class="context-icon">🧠</span>
                <span>Take Quiz</span>
            </div>
            <div class="context-menu-item" data-action="view-exercises">
                <span class="context-icon">🎯</span>
                <span>Practice Exercises</span>
            </div>
            <div class="context-menu-item" data-action="reset-progress">
                <span class="context-icon">🔄</span>
                <span>Reset Progress</span>
            </div>
        `;

        // Position context menu
        contextMenu.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            z-index: 1000;
        `;

        // Add event listeners
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleContextAction(action);
            }
            document.body.removeChild(contextMenu);
        });

        // Close on outside click
        const closeMenu = (e) => {
            if (!contextMenu.contains(e.target)) {
                document.body.removeChild(contextMenu);
                document.removeEventListener('click', closeMenu);
            }
        };

        document.body.appendChild(contextMenu);
        setTimeout(() => document.addEventListener('click', closeMenu), 0);
    }

    /**
     * Handle context menu actions
     */
    handleContextAction(action) {
        switch (action) {
            case 'view-concept':
                this.openConcept();
                break;
            case 'start-quiz':
                this.startQuiz();
                break;
            case 'view-exercises':
                this.viewExercises();
                break;
            case 'reset-progress':
                this.resetProgress();
                break;
        }
    }

    /**
     * Update planet state based on progress
     */
    updateState() {
        const progress = StateManager.getProgress();
        
        // Update lock state
        this.isLocked = !progress.unlockedPlanets.includes(this.planetData.id);
        
        // Update completion state
        this.isCompleted = progress.completedConcepts.some(concept => 
            concept.startsWith(this.planetData.id)
        );
        
        // Update current state
        this.isCurrent = progress.currentPlanet === this.planetData.id;
        
        // Update progress percentage
        this.progress = this.calculateProgress();
        
        // Apply visual state
        this.applyVisualState();
        
        // Update progress bar
        this.updateProgressBar();
        
        // Update tooltip
        this.updateTooltipContent();
    }

    /**
     * Apply visual state classes
     */
    applyVisualState() {
        // Remove all state classes
        this.element.classList.remove('locked', 'unlocked', 'completed', 'current');
        
        // Add appropriate state class
        if (this.isCompleted) {
            this.element.classList.add('completed');
        } else if (this.isCurrent) {
            this.element.classList.add('current');
        } else if (this.isLocked) {
            this.element.classList.add('locked');
        } else {
            this.element.classList.add('unlocked');
        }

        // Update ARIA attributes
        this.element.setAttribute('aria-disabled', this.isLocked);
        this.element.setAttribute('aria-pressed', this.isCurrent);
        
        // Update tabindex
        this.element.setAttribute('tabindex', this.isLocked ? '-1' : '0');
    }

    /**
     * Update progress bar
     */
    updateProgressBar() {
        if (!this.progressBar) return;
        
        this.progressBar.style.width = `${this.progress}%`;
        this.progressBar.setAttribute('aria-valuenow', this.progress);
        this.progressBar.setAttribute('aria-valuemin', '0');
        this.progressBar.setAttribute('aria-valuemax', '100');
    }

    /**
     * Calculate completion progress
     */
    calculateProgress() {
        const progress = StateManager.getProgress();
        const completedConcepts = progress.completedConcepts.filter(concept => 
            concept.startsWith(this.planetData.id)
        );
        return Math.round((completedConcepts.length / this.planetData.concepts) * 100);
    }

    /**
     * Show locked planet feedback
     */
    showLockedFeedback() {
        // Add shake animation
        this.element.classList.add('shake');
        setTimeout(() => {
            this.element.classList.remove('shake');
        }, 500);

        // Show requirements tooltip
        this.showRequirementsTooltip();

        // Play error sound
        this.playErrorSound();
    }

    /**
     * Show requirements tooltip
     */
    showRequirementsTooltip() {
        const dependencies = this.planetData.dependencies || [];
        const message = dependencies.length > 0 
            ? `Complete ${dependencies.join(', ')} first`
            : 'This planet is locked';

        const tooltip = document.createElement('div');
        tooltip.className = 'requirements-tooltip';
        tooltip.textContent = `🔒 ${message}`;

        const rect = this.element.getBoundingClientRect();
        tooltip.style.cssText = `
            position: fixed;
            top: ${rect.top - 50}px;
            left: ${rect.left + rect.width / 2}px;
            transform: translateX(-50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            z-index: 1000;
            animation: fadeInOut 2.5s ease;
            pointer-events: none;
        `;

        document.body.appendChild(tooltip);
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 2500);
    }

    /**
     * Show detailed planet information
     */
    showDetailedInfo() {
        // Trigger detailed info display
        if (window.GalaxyMap && window.GalaxyMap.showPlanetInfo) {
            window.GalaxyMap.showPlanetInfo(this.planetData.id, this.element);
        }
    }

    /**
     * Hide detailed planet information
     */
    hideDetailedInfo() {
        // Hide detailed info
        if (window.GalaxyMap && window.GalaxyMap.hidePlanetInfo) {
            window.GalaxyMap.hidePlanetInfo();
        }
    }

    /**
     * Show tooltip
     */
    showTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.add('visible');
        }
    }

    /**
     * Hide tooltip
     */
    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.classList.remove('visible');
        }
    }

    /**
     * Add click animation
     */
    addClickAnimation() {
        this.element.classList.add('clicked');
        setTimeout(() => {
            this.element.classList.remove('clicked');
        }, 300);
    }

    /**
     * Planet selection callback
     */
    onPlanetSelect() {
        // Navigate to concept view
        if (window.Navigation) {
            window.Navigation.navigateTo(`/planet/${this.planetData.id}`);
        }

        // Open concept modal
        this.openConcept();
    }

    /**
     * Open concept modal
     */
    async openConcept() {
        try {
            const conceptData = await ConceptLoader.loadConcept(this.planetData.id);
            
            if (window.Modal) {
                window.Modal.concept(conceptData, {
                    onStartLearning: (concept) => {
                        window.Navigation?.navigateTo(`/concept/${concept.id}`);
                    },
                    onStartQuiz: (concept) => {
                        this.startQuiz();
                    }
                });
            }
        } catch (error) {
            JSVLogger.error('Failed to load concept:', error);
            this.showErrorMessage('Failed to load concept content');
        }
    }

    /**
     * Start quiz for this planet
     */
    startQuiz() {
        if (window.Navigation) {
            window.Navigation.navigateTo(`/quiz/${this.planetData.id}`);
        }
    }

    /**
     * View exercises for this planet
     */
    viewExercises() {
        if (window.Navigation) {
            window.Navigation.navigateTo(`/exercises/${this.planetData.id}`);
        }
    }

    /**
     * Reset progress for this planet
     */
    resetProgress() {
        if (window.Modal) {
            window.Modal.confirm(
                'Reset Progress',
                `Are you sure you want to reset your progress for ${this.planetData.title}?`
            ).then(confirmed => {
                if (confirmed) {
                    // Remove completed concepts for this planet
                    const progress = StateManager.getProgress();
                    const updatedConcepts = progress.completedConcepts.filter(concept => 
                        !concept.startsWith(this.planetData.id)
                    );
                    StateManager.updateProgress({ completedConcepts: updatedConcepts });
                }
            });
        }
    }

    /**
     * Handle state changes from StateManager
     */
    handleStateChange(event, data) {
        if (event === 'planetUnlocked' && data === this.planetData.id) {
            this.updateState();
            this.playUnlockAnimation();
        } else if (event === 'conceptCompleted' && data.startsWith(this.planetData.id)) {
            this.updateState();
        } else if (event === 'currentPlanetChanged') {
            this.updateState();
        }
    }

    /**
     * Play unlock animation
     */
    playUnlockAnimation() {
        this.element.classList.add('unlocking');
        setTimeout(() => {
            this.element.classList.remove('unlocking');
        }, 1000);

        // Play unlock sound
        this.playSuccessSound();
    }

    /**
     * Get planet emoji fallback
     */
    getPlanetEmoji() {
        const emojis = {
            basics: '🟡',
            dom: '🌍',
            async: '⚡',
            es6: '🟣',
            oop: '🔴',
            functional: '🔵',
            patterns: '🟠',
            storage: '💾',
            events: '⚪',
            testing: '🧪',
            security: '🛡️',
            algorithms: '⚙️',
            canvas: '🎨',
            api: '🌐'
        };
        return emojis[this.planetData.id] || '🪐';
    }

    /**
     * Darken color for gradient effects
     */
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount * 255);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount * 255);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount * 255);
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    /**
     * Play interaction sound
     */
    playInteractionSound() {
        const audio = document.getElementById('click-sound');
        if (audio && StateManager.getState().settings.soundEnabled) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio errors
            });
        }
    }

    /**
     * Play success sound
     */
    playSuccessSound() {
        // Could play a different sound for success/unlock
        this.playInteractionSound();
    }

    /**
     * Play error sound
     */
    playErrorSound() {
        // Could play a different sound for errors
        // For now, just use a different pitch or no sound
    }

    /**
     * Show error message
     */
    showErrorMessage(message) {
        if (window.Modal) {
            window.Modal.alert('Error', message);
        }
    }

    /**
     * Get planet element
     */
    getElement() {
        return this.element;
    }

    /**
     * Get planet data
     */
    getPlanetData() {
        return this.planetData;
    }

    /**
     * Check if planet is locked
     */
    isLocked() {
        return this.isLocked;
    }

    /**
     * Check if planet is completed
     */
    isCompleted() {
        return this.isCompleted;
    }

    /**
     * Get completion progress
     */
    getProgress() {
        return this.progress;
    }

    /**
     * Destroy planet card
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.isInitialized = false;
        JSVLogger.debug(`PlanetCard destroyed: ${this.planetData.id}`);
    }
}

// CSS styles for planet card enhancements
const planetCardStyles = document.createElement('style');
planetCardStyles.textContent = `
    .planet-sm {
        width: 80px !important;
        height: 80px !important;
    }

    .planet-sm .planet-icon {
        width: 32px !important;
        height: 32px !important;
    }

    .planet-sm .planet-title {
        font-size: 0.7rem !important;
    }

    .planet-lg {
        width: 160px !important;
        height: 160px !important;
    }

    .planet-lg .planet-icon {
        width: 64px !important;
        height: 64px !important;
    }

    .planet-lg .planet-title {
        font-size: 1rem !important;
    }

    .planet.focused {
        outline: 3px solid var(--accent-color);
        outline-offset: 5px;
    }

    .planet.touched {
        transform: scale(0.95);
    }

    .planet.clicked {
        animation: planetClick 0.3s ease;
    }

    .planet.unlocking {
        animation: planetUnlock 1s ease-out;
    }

    .planet-icon-fallback {
        font-size: 2rem;
        margin-bottom: 4px;
    }

    .planet-tooltip.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(-5px);
    }

    .tooltip-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
        font-size: 0.7rem;
        color: var(--text-muted);
    }

    .tooltip-dependencies {
        font-size: 0.7rem;
        color: var(--warning-color);
        margin-top: 0.5rem;
    }

    .planet-context-menu {
        background: var(--secondary-bg);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(10px);
        min-width: 180px;
        padding: 0.5rem 0;
    }

    .context-menu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        cursor: pointer;
        transition: background 0.2s ease;
        font-size: 0.9rem;
    }

    .context-menu-item:hover {
        background: rgba(0, 212, 255, 0.1);
    }

    .context-icon {
        width: 16px;
        text-align: center;
    }

    .requirements-tooltip {
        font-family: 'SpaceMono', monospace;
        white-space: nowrap;
    }

    @keyframes planetClick {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(0.9); }
    }

    @keyframes planetUnlock {
        0% { 
            transform: scale(1); 
            filter: brightness(1); 
            box-shadow: 0 0 40px var(--planet-color, var(--accent-color));
        }
        25% { 
            transform: scale(1.2); 
            filter: brightness(1.5); 
            box-shadow: 0 0 80px var(--planet-color, var(--accent-color));
        }
        50% { 
            transform: scale(1.1); 
            filter: brightness(1.3); 
            box-shadow: 0 0 60px var(--planet-color, var(--accent-color));
        }
        100% { 
            transform: scale(1); 
            filter: brightness(1); 
            box-shadow: 0 0 40px var(--planet-color, var(--accent-color));
        }
    }

    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(10px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    @media (max-width: 768px) {
        .planet-context-menu {
            min-width: 150px;
        }

        .context-menu-item {
            padding: 0.6rem 0.8rem;
            font-size: 0.8rem;
        }

        .planet-tooltip {
            font-size: 0.75rem !important;
            max-width: 200px;
        }
    }
`;
document.head.appendChild(planetCardStyles);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PlanetCard = PlanetCard;
}