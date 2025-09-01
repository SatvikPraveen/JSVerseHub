// src/components/Modal.js - Complete Reusable Modal Component

/**
 * Modal - Reusable modal dialog component for JSVerseHub
 * Provides flexible modal functionality with animations and accessibility
 */

class Modal {
    constructor(options = {}) {
        this.options = {
            id: options.id || `modal-${Date.now()}`,
            title: options.title || '',
            content: options.content || '',
            size: options.size || 'medium', // small, medium, large, fullscreen
            closable: options.closable !== false,
            backdrop: options.backdrop !== false,
            keyboard: options.keyboard !== false,
            animation: options.animation !== false,
            autoFocus: options.autoFocus !== false,
            className: options.className || '',
            onShow: options.onShow || null,
            onHide: options.onHide || null,
            onConfirm: options.onConfirm || null,
            onCancel: options.onCancel || null
        };

        this.isVisible = false;
        this.element = null;
        this.backdrop = null;
        this.content = null;
        this.focusableElements = [];
        this.previousActiveElement = null;

        this.createModal();
        this.setupEventListeners();
    }

    /**
     * Create modal DOM structure
     */
    createModal() {
        // Create modal container
        this.element = document.createElement('div');
        this.element.id = this.options.id;
        this.element.className = `modal ${this.options.className}`;
        this.element.setAttribute('tabindex', '-1');
        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        if (this.options.title) {
            this.element.setAttribute('aria-labelledby', `${this.options.id}-title`);
        }

        // Create modal backdrop
        if (this.options.backdrop) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'modal-backdrop';
            this.element.appendChild(this.backdrop);
        }

        // Create modal content
        this.content = document.createElement('div');
        this.content.className = `modal-content ${this.getSizeClass()}`;
        
        // Add close button if closable
        if (this.options.closable) {
            const closeButton = document.createElement('button');
            closeButton.className = 'close-btn';
            closeButton.innerHTML = `
                <img src="images/ui/close-btn.png" alt="Close" onerror="this.innerHTML='×'">
            `;
            closeButton.setAttribute('aria-label', 'Close modal');
            this.content.appendChild(closeButton);
        }

        // Add content
        this.updateContent();

        this.element.appendChild(this.content);
        document.body.appendChild(this.element);

        JSVLogger.debug(`Modal created: ${this.options.id}`);
    }

    /**
     * Get CSS class for modal size
     */
    getSizeClass() {
        const sizeClasses = {
            small: 'modal-sm',
            medium: '',
            large: 'modal-lg',
            fullscreen: 'modal-fullscreen'
        };
        return sizeClasses[this.options.size] || '';
    }

    /**
     * Update modal content
     */
    updateContent() {
        if (!this.content) return;

        const contentContainer = this.content.querySelector('.modal-body') || 
                               document.createElement('div');
        
        if (!contentContainer.classList.contains('modal-body')) {
            contentContainer.className = 'modal-body';
            this.content.appendChild(contentContainer);
        }

        // Add title if provided
        if (this.options.title) {
            let titleElement = this.content.querySelector('.modal-title');
            if (!titleElement) {
                const header = document.createElement('div');
                header.className = 'modal-header';
                
                titleElement = document.createElement('h2');
                titleElement.className = 'modal-title';
                titleElement.id = `${this.options.id}-title`;
                
                header.appendChild(titleElement);
                this.content.insertBefore(header, contentContainer);
            }
            titleElement.textContent = this.options.title;
        }

        // Update content
        if (typeof this.options.content === 'string') {
            contentContainer.innerHTML = this.options.content;
        } else if (this.options.content instanceof Node) {
            contentContainer.innerHTML = '';
            contentContainer.appendChild(this.options.content);
        }

        // Update focusable elements
        this.updateFocusableElements();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (!this.element) return;

        // Close button click
        const closeBtn = this.element.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }

        // Backdrop click
        if (this.options.backdrop && this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                if (this.options.backdrop === true) {
                    this.hide();
                }
            });
        }

        // Keyboard events
        this.element.addEventListener('keydown', (e) => {
            this.handleKeydown(e);
        });

        // Animation events
        this.element.addEventListener('transitionend', (e) => {
            if (e.target === this.element) {
                this.handleTransitionEnd(e);
            }
        });
    }

    /**
     * Handle keydown events
     */
    handleKeydown(event) {
        if (!this.isVisible) return;

        switch (event.key) {
            case 'Escape':
                if (this.options.keyboard && this.options.closable) {
                    event.preventDefault();
                    this.hide();
                }
                break;

            case 'Tab':
                this.handleTabKey(event);
                break;

            case 'Enter':
                if (event.target.classList.contains('btn-primary')) {
                    event.preventDefault();
                    if (this.options.onConfirm) {
                        this.options.onConfirm();
                    }
                }
                break;
        }
    }

    /**
     * Handle Tab key for focus management
     */
    handleTabKey(event) {
        if (this.focusableElements.length === 0) return;

        const firstElement = this.focusableElements[0];
        const lastElement = this.focusableElements[this.focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    }

    /**
     * Handle transition end events
     */
    handleTransitionEnd(event) {
        if (!this.isVisible && event.propertyName === 'opacity') {
            this.element.style.display = 'none';
        }
    }

    /**
     * Update focusable elements list
     */
    updateFocusableElements() {
        if (!this.element) return;

        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];

        this.focusableElements = Array.from(
            this.element.querySelectorAll(focusableSelectors.join(', '))
        ).filter(el => {
            return el.offsetParent !== null && !el.hidden;
        });
    }

    /**
     * Show modal
     */
    show() {
        if (this.isVisible) return this;

        // Store currently focused element
        this.previousActiveElement = document.activeElement;

        // Trigger onShow callback
        if (this.options.onShow) {
            const result = this.options.onShow();
            if (result === false) return this;
        }

        // Show modal
        this.element.style.display = 'flex';
        this.element.classList.add('show');
        this.isVisible = true;

        // Handle animations
        if (this.options.animation) {
            // Force reflow
            this.element.offsetHeight;
            this.element.classList.add('fade-in');
        }

        // Focus management
        if (this.options.autoFocus) {
            this.setInitialFocus();
        }

        // Prevent body scroll
        document.body.classList.add('modal-open');

        // Add to modal stack
        Modal.addToStack(this);

        JSVLogger.debug(`Modal shown: ${this.options.id}`);
        return this;
    }

    /**
     * Hide modal
     */
    hide() {
        if (!this.isVisible) return this;

        // Trigger onHide callback
        if (this.options.onHide) {
            const result = this.options.onHide();
            if (result === false) return this;
        }

        // Hide modal
        this.element.classList.remove('show');
        this.isVisible = false;

        // Handle animations
        if (this.options.animation) {
            this.element.classList.add('fade-out');
            setTimeout(() => {
                this.element.classList.remove('fade-out');
                this.element.style.display = 'none';
            }, 300);
        } else {
            this.element.style.display = 'none';
        }

        // Restore focus
        if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
            this.previousActiveElement.focus();
        }

        // Remove from modal stack
        Modal.removeFromStack(this);

        // Allow body scroll if no modals are open
        if (Modal.getStackCount() === 0) {
            document.body.classList.remove('modal-open');
        }

        JSVLogger.debug(`Modal hidden: ${this.options.id}`);
        return this;
    }

    /**
     * Toggle modal visibility
     */
    toggle() {
        return this.isVisible ? this.hide() : this.show();
    }

    /**
     * Set initial focus
     */
    setInitialFocus() {
        this.updateFocusableElements();
        
        if (this.focusableElements.length > 0) {
            // Focus first focusable element or close button
            const primaryButton = this.element.querySelector('.btn-primary');
            const firstFocusable = primaryButton || this.focusableElements[0];
            firstFocusable.focus();
        } else {
            // Focus the modal itself
            this.element.focus();
        }
    }

    /**
     * Update modal options
     */
    setOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.updateContent();
        return this;
    }

    /**
     * Set modal title
     */
    setTitle(title) {
        this.options.title = title;
        this.updateContent();
        return this;
    }

    /**
     * Set modal content
     */
    setContent(content) {
        this.options.content = content;
        this.updateContent();
        return this;
    }

    /**
     * Add footer with buttons
     */
    setFooter(buttons) {
        if (!this.content) return this;

        // Remove existing footer
        const existingFooter = this.content.querySelector('.modal-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        if (!buttons || buttons.length === 0) return this;

        // Create footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';

        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `btn ${button.className || 'btn-secondary'}`;
            btn.textContent = button.text || 'Button';
            
            if (button.handler) {
                btn.addEventListener('click', (e) => {
                    const result = button.handler(e, this);
                    if (result !== false && button.close !== false) {
                        this.hide();
                    }
                });
            }

            footer.appendChild(btn);
        });

        this.content.appendChild(footer);
        this.updateFocusableElements();
        return this;
    }

    /**
     * Add loading state
     */
    setLoading(isLoading, message = 'Loading...') {
        if (!this.content) return this;

        const loadingOverlay = this.content.querySelector('.modal-loading');
        
        if (isLoading) {
            if (!loadingOverlay) {
                const overlay = document.createElement('div');
                overlay.className = 'modal-loading';
                overlay.innerHTML = `
                    <div class="loading-spinner"></div>
                    <div class="loading-message">${message}</div>
                `;
                this.content.appendChild(overlay);
            }
            this.content.classList.add('loading');
        } else {
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
            this.content.classList.remove('loading');
        }

        return this;
    }

    /**
     * Destroy modal
     */
    destroy() {
        this.hide();
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }

        Modal.removeFromStack(this);
        
        JSVLogger.debug(`Modal destroyed: ${this.options.id}`);
    }

    /**
     * Get modal element
     */
    getElement() {
        return this.element;
    }

    /**
     * Check if modal is visible
     */
    isOpen() {
        return this.isVisible;
    }

    // Static methods for modal management

    /**
     * Modal stack for managing multiple modals
     */
    static modalStack = [];

    /**
     * Add modal to stack
     */
    static addToStack(modal) {
        if (!this.modalStack.includes(modal)) {
            this.modalStack.push(modal);
        }
    }

    /**
     * Remove modal from stack
     */
    static removeFromStack(modal) {
        const index = this.modalStack.indexOf(modal);
        if (index > -1) {
            this.modalStack.splice(index, 1);
        }
    }

    /**
     * Get stack count
     */
    static getStackCount() {
        return this.modalStack.length;
    }

    /**
     * Close all modals
     */
    static closeAll() {
        const modalsToClose = [...this.modalStack];
        modalsToClose.forEach(modal => modal.hide());
    }

    /**
     * Create alert modal
     */
    static alert(title, message, options = {}) {
        const modal = new Modal({
            title,
            content: `<p>${message}</p>`,
            size: 'small',
            ...options
        });

        modal.setFooter([
            {
                text: 'OK',
                className: 'btn-primary',
                handler: () => {
                    if (options.onConfirm) {
                        options.onConfirm();
                    }
                }
            }
        ]);

        modal.show();
        return modal;
    }

    /**
     * Create confirm modal
     */
    static confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const modal = new Modal({
                title,
                content: `<p>${message}</p>`,
                size: 'small',
                ...options
            });

            modal.setFooter([
                {
                    text: options.cancelText || 'Cancel',
                    className: 'btn-secondary',
                    handler: () => {
                        resolve(false);
                        if (options.onCancel) {
                            options.onCancel();
                        }
                    }
                },
                {
                    text: options.confirmText || 'OK',
                    className: 'btn-primary',
                    handler: () => {
                        resolve(true);
                        if (options.onConfirm) {
                            options.onConfirm();
                        }
                    }
                }
            ]);

            modal.show();
        });
    }

    /**
     * Create prompt modal
     */
    static prompt(title, message, defaultValue = '', options = {}) {
        return new Promise((resolve) => {
            const inputId = `prompt-input-${Date.now()}`;
            const content = `
                <p>${message}</p>
                <div class="form-group">
                    <input type="text" id="${inputId}" class="form-control" value="${defaultValue}" placeholder="${options.placeholder || ''}">
                </div>
            `;

            const modal = new Modal({
                title,
                content,
                size: 'small',
                ...options
            });

            modal.setFooter([
                {
                    text: 'Cancel',
                    className: 'btn-secondary',
                    handler: () => {
                        resolve(null);
                    }
                },
                {
                    text: 'OK',
                    className: 'btn-primary',
                    handler: () => {
                        const input = document.getElementById(inputId);
                        resolve(input ? input.value : '');
                    }
                }
            ]);

            modal.show();

            // Focus input after modal is shown
            setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 100);
        });
    }

    /**
     * Create loading modal
     */
    static loading(message = 'Loading...', options = {}) {
        const modal = new Modal({
            content: `
                <div class="text-center">
                    <div class="loading-spinner large"></div>
                    <p class="loading-message">${message}</p>
                </div>
            `,
            size: 'small',
            closable: false,
            backdrop: false,
            keyboard: false,
            ...options
        });

        modal.show();
        return modal;
    }

    /**
     * Create concept display modal
     */
    static concept(conceptData, options = {}) {
        const modal = new Modal({
            title: conceptData.title || 'JavaScript Concept',
            content: `
                <div class="concept-modal-content">
                    <div class="concept-description">
                        <p>${conceptData.description || 'Learn this JavaScript concept.'}</p>
                    </div>
                    
                    ${conceptData.sections ? `
                        <div class="concept-sections">
                            ${conceptData.sections.map(section => `
                                <div class="concept-section">
                                    <h3>${section.title}</h3>
                                    <p>${section.content.description}</p>
                                    ${section.content.examples ? `
                                        <div class="code-examples">
                                            ${section.content.examples.map(example => `
                                                <div class="code-example">
                                                    <pre><code>${example}</code></pre>
                                                </div>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${conceptData.exercises ? `
                        <div class="concept-exercises">
                            <h3>🎯 Exercises</h3>
                            <p>Complete these exercises to master the concept:</p>
                            <ul>
                                ${conceptData.exercises.map(exercise => `
                                    <li>
                                        <strong>${exercise.title}</strong> 
                                        <span class="difficulty ${exercise.difficulty}">(${exercise.difficulty})</span>
                                        <p>${exercise.description}</p>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `,
            size: 'large',
            ...options
        });

        modal.setFooter([
            {
                text: 'Start Learning',
                className: 'btn-primary',
                handler: () => {
                    if (options.onStartLearning) {
                        options.onStartLearning(conceptData);
                    }
                }
            },
            {
                text: 'Take Quiz',
                className: 'btn-secondary',
                handler: () => {
                    if (options.onStartQuiz) {
                        options.onStartQuiz(conceptData);
                    }
                }
            }
        ]);

        return modal;
    }
}

// CSS styles for modal component
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        display: none;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .modal.show {
        opacity: 1;
    }

    .modal.fade-in {
        animation: modalFadeIn 0.3s ease;
    }

    .modal.fade-out {
        animation: modalFadeOut 0.3s ease;
    }

    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }

    .modal-content {
        position: relative;
        background: var(--secondary-bg);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: var(--border-radius);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        transform: scale(0.7) translateY(50px);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal.show .modal-content {
        transform: scale(1) translateY(0);
    }

    .modal-content.modal-sm {
        max-width: 400px;
    }

    .modal-content.modal-lg {
        max-width: 900px;
    }

    .modal-content.modal-fullscreen {
        max-width: 95vw;
        max-height: 95vh;
        width: 95vw;
        height: 95vh;
    }

    .modal-header {
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .modal-title {
        margin: 0;
        color: var(--accent-color);
        font-size: 1.8rem;
    }

    .modal-body {
        padding: 2rem;
        overflow-y: auto;
        max-height: 60vh;
    }

    .modal-footer {
        padding: 1rem 2rem 2rem;
        border-top: 1px solid rgba(0, 212, 255, 0.2);
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        flex-wrap: wrap;
    }

    .close-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 107, 107, 0.2);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10;
    }

    .close-btn:hover {
        background: rgba(255, 107, 107, 0.4);
        transform: scale(1.1);
    }

    .close-btn img {
        width: 16px;
        height: 16px;
        filter: invert(1);
    }

    .modal-loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(26, 26, 46, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 20;
    }

    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 212, 255, 0.3);
        border-top: 3px solid var(--accent-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }

    .loading-spinner.large {
        width: 60px;
        height: 60px;
        border-width: 4px;
    }

    .loading-message {
        color: var(--accent-color);
        font-size: 0.9rem;
        margin: 0;
    }

    .form-control {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.2);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }

    .form-control:focus {
        outline: none;
        border-color: var(--accent-color);
        box-shadow: 0 0 0 2px rgba(0, 212, 255, 0.2);
    }

    .form-group {
        margin: 1rem 0;
    }

    .text-center {
        text-align: center;
    }

    body.modal-open {
        overflow: hidden;
    }

    /* Concept Modal Specific Styles */
    .concept-modal-content {
        line-height: 1.6;
    }

    .concept-description {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        color: var(--text-secondary);
    }

    .concept-sections {
        margin-bottom: 2rem;
    }

    .concept-section {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        transition: all 0.3s ease;
    }

    .concept-section:hover {
        border-color: rgba(0, 212, 255, 0.3);
        background: rgba(0, 0, 0, 0.3);
    }

    .concept-section h3 {
        color: var(--accent-color);
        margin: 0 0 1rem 0;
        font-size: 1.2rem;
    }

    .code-examples {
        margin-top: 1rem;
    }

    .code-example {
        background: #1a1a1a;
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 8px;
        margin: 0.5rem 0;
        overflow: hidden;
    }

    .code-example pre {
        margin: 0;
        padding: 1rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #e6e6e6;
        overflow-x: auto;
    }

    .concept-exercises {
        background: linear-gradient(135deg, rgba(255, 230, 109, 0.1), rgba(255, 107, 107, 0.1));
        border: 1px solid rgba(255, 230, 109, 0.3);
        border-radius: 8px;
        padding: 1.5rem;
    }

    .concept-exercises h3 {
        color: var(--warning-color);
        margin: 0 0 1rem 0;
    }

    .concept-exercises ul {
        list-style: none;
        padding: 0;
    }

    .concept-exercises li {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        border-left: 4px solid var(--warning-color);
    }

    .difficulty {
        font-size: 0.8rem;
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        text-transform: uppercase;
        font-weight: 600;
    }

    .difficulty.easy {
        background: rgba(78, 205, 196, 0.2);
        color: var(--success-color);
    }

    .difficulty.medium {
        background: rgba(255, 230, 109, 0.2);
        color: var(--warning-color);
    }

    .difficulty.hard {
        background: rgba(255, 107, 107, 0.2);
        color: var(--danger-color);
    }

    @keyframes modalFadeIn {
        from {
            opacity: 0;
            transform: scale(0.7) translateY(50px);
        }
        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes modalFadeOut {
        from {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
        to {
            opacity: 0;
            transform: scale(0.7) translateY(50px);
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
        .modal-content {
            width: 95%;
            margin: 1rem;
        }

        .modal-content.modal-lg,
        .modal-content.modal-fullscreen {
            max-width: 95%;
            max-height: 95vh;
        }

        .modal-header,
        .modal-body {
            padding: 1rem;
        }

        .modal-footer {
            padding: 1rem;
            flex-direction: column;
        }

        .modal-footer .btn {
            width: 100%;
        }

        .modal-title {
            font-size: 1.5rem;
        }

        .concept-section {
            padding: 1rem;
        }
    }
`;
document.head.appendChild(modalStyles);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Modal = Modal;
}