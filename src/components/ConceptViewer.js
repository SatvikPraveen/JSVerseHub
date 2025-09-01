// src/components/ConceptViewer.js - Concept Content Display Component

/**
 * ConceptViewer - Component for displaying learning content, exercises, and quizzes
 * Handles concept presentation, user interaction, and progress tracking
 */

class ConceptViewer {
    constructor(options = {}) {
        this.options = {
            container: options.container || null,
            autoPlay: options.autoPlay || false,
            showProgress: options.showProgress !== false,
            enableBookmarks: options.enableBookmarks !== false,
            ...options
        };

        this.currentConcept = null;
        this.currentSection = 0;
        this.currentExercise = 0;
        this.currentQuiz = null;
        this.bookmarks = [];
        this.isInitialized = false;
        this.modal = null;

        this.init();
    }

    /**
     * Initialize the concept viewer
     */
    init() {
        this.loadBookmarks();
        this.isInitialized = true;

        // Listen for state changes
        StateManager.addListener((event, data) => {
            this.handleStateChange(event, data);
        });

        JSVLogger.info('📚 ConceptViewer initialized');
    }

    /**
     * Show concept in modal
     */
    async showConcept(conceptId, options = {}) {
        try {
            JSVLogger.info(`Loading concept: ${conceptId}`);
            
            // Show loading modal
            const loadingModal = Modal.loading(`Loading ${conceptId} concept...`);
            
            // Load concept data
            const conceptData = await ConceptLoader.loadConcept(conceptId);
            this.currentConcept = conceptData;
            this.currentSection = 0;

            // Hide loading modal
            loadingModal.hide();

            // Create concept modal
            this.modal = new Modal({
                title: conceptData.overview.title,
                content: this.generateConceptContent(conceptData),
                size: 'large',
                className: 'concept-modal',
                onHide: () => {
                    this.onConceptClose();
                },
                ...options
            });

            this.modal.setFooter(this.generateConceptFooter(conceptData));
            this.modal.show();

            // Initialize concept features
            this.initializeConceptFeatures();

            JSVLogger.success(`Concept loaded: ${conceptId}`);

        } catch (error) {
            JSVLogger.error('Failed to load concept:', error);
            Modal.alert('Error', 'Failed to load concept. Please try again.');
        }
    }

    /**
     * Generate concept content HTML
     */
    generateConceptContent(conceptData) {
        return `
            <div class="concept-viewer-container">
                ${this.generateConceptHeader(conceptData)}
                ${this.generateProgressIndicator(conceptData)}
                ${this.generateNavigationTabs(conceptData)}
                ${this.generateContentArea(conceptData)}
                ${this.generateSidebar(conceptData)}
            </div>
        `;
    }

    /**
     * Generate concept header
     */
    generateConceptHeader(conceptData) {
        const isBookmarked = this.isBookmarked(conceptData.id);
        
        return `
            <div class="concept-header">
                <div class="concept-meta-info">
                    <div class="concept-badges">
                        <span class="difficulty-badge ${conceptData.overview.difficulty.toLowerCase()}">
                            ${conceptData.overview.difficulty}
                        </span>
                        <span class="time-badge">⏱️ ${conceptData.overview.estimatedTime}</span>
                        <span class="concepts-badge">🎯 ${conceptData.sections.length} sections</span>
                    </div>
                    <div class="concept-actions">
                        <button class="btn-icon bookmark-btn ${isBookmarked ? 'active' : ''}" 
                                data-action="bookmark" title="Bookmark this concept">
                            ${isBookmarked ? '🔖' : '📑'}
                        </button>
                        <button class="btn-icon share-btn" data-action="share" title="Share concept">
                            📤
                        </button>
                        <button class="btn-icon print-btn" data-action="print" title="Print concept">
                            🖨️
                        </button>
                    </div>
                </div>
                <div class="concept-description">
                    <p>${conceptData.overview.description}</p>
                </div>
                ${this.generateLearningObjectives(conceptData.overview.learningObjectives)}
                ${this.generatePrerequisites(conceptData.overview.prerequisites)}
            </div>
        `;
    }

    /**
     * Generate learning objectives
     */
    generateLearningObjectives(objectives) {
        if (!objectives || objectives.length === 0) return '';

        return `
            <div class="learning-objectives">
                <h4>🎯 Learning Objectives</h4>
                <ul class="objectives-list">
                    ${objectives.map(objective => `
                        <li class="objective-item">
                            <span class="objective-check">✓</span>
                            ${objective}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Generate prerequisites
     */
    generatePrerequisites(prerequisites) {
        if (!prerequisites || prerequisites.length === 0) {
            return '<div class="prerequisites"><span class="no-prereq">📌 No prerequisites required</span></div>';
        }

        return `
            <div class="prerequisites">
                <h4>📋 Prerequisites</h4>
                <div class="prereq-list">
                    ${prerequisites.map(prereq => `
                        <span class="prereq-item">${prereq}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate progress indicator
     */
    generateProgressIndicator(conceptData) {
        const progress = this.calculateConceptProgress(conceptData.id);
        
        return `
            <div class="concept-progress-container">
                <div class="progress-info">
                    <span class="progress-label">Progress</span>
                    <span class="progress-percentage">${progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
                <div class="progress-stats">
                    <span class="stat-item">
                        ${this.getCompletedSections(conceptData.id)}/${conceptData.sections.length} sections
                    </span>
                </div>
            </div>
        `;
    }

    /**
     * Generate navigation tabs
     */
    generateNavigationTabs(conceptData) {
        return `
            <div class="concept-navigation">
                <div class="nav-tabs">
                    <button class="nav-tab active" data-tab="content">
                        📚 Content
                    </button>
                    <button class="nav-tab" data-tab="exercises">
                        🎯 Exercises (${conceptData.exercises.length})
                    </button>
                    <button class="nav-tab" data-tab="quiz">
                        🧠 Quiz (${conceptData.quiz.questions.length})
                    </button>
                    <button class="nav-tab" data-tab="notes">
                        📝 Notes
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Generate content area
     */
    generateContentArea(conceptData) {
        return `
            <div class="concept-content-area">
                ${this.generateContentTab(conceptData)}
                ${this.generateExercisesTab(conceptData)}
                ${this.generateQuizTab(conceptData)}
                ${this.generateNotesTab(conceptData)}
            </div>
        `;
    }

    /**
     * Generate content tab
     */
    generateContentTab(conceptData) {
        return `
            <div class="tab-content active" data-tab="content">
                <div class="sections-navigation">
                    <div class="sections-list">
                        ${conceptData.sections.map((section, index) => `
                            <button class="section-nav-item ${index === 0 ? 'active' : ''}" 
                                    data-section="${index}">
                                <span class="section-number">${index + 1}</span>
                                <span class="section-title">${section.title}</span>
                                <span class="section-status ${this.isSectionCompleted(conceptData.id, index) ? 'completed' : 'pending'}">
                                    ${this.isSectionCompleted(conceptData.id, index) ? '✓' : '○'}
                                </span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="section-content">
                    ${this.generateSectionContent(conceptData.sections[0], 0)}
                </div>
                <div class="section-navigation-controls">
                    <button class="btn btn-secondary" id="prev-section" disabled>
                        ← Previous
                    </button>
                    <span class="section-indicator">
                        Section <span id="current-section">1</span> of ${conceptData.sections.length}
                    </span>
                    <button class="btn btn-primary" id="next-section">
                        Next →
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Generate section content
     */
    generateSectionContent(section, index) {
        return `
            <div class="section-content-wrapper">
                <div class="section-header">
                    <h3 class="section-title">${section.title}</h3>
                    <div class="section-actions">
                        <button class="btn-small btn-secondary" data-action="bookmark-section">
                            📑 Bookmark
                        </button>
                        <button class="btn-small btn-secondary" data-action="copy-section">
                            📋 Copy
                        </button>
                    </div>
                </div>
                
                <div class="section-body">
                    <div class="section-description">
                        <p>${section.content.description}</p>
                    </div>
                    
                    ${this.generateCodeExamples(section.content.examples)}
                    
                    <div class="key-points">
                        <h4>🔑 Key Points</h4>
                        <ul class="key-points-list">
                            ${section.keyPoints.map(point => `
                                <li class="key-point">${point}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="section-completion">
                        <button class="btn btn-success complete-section-btn" 
                                data-section="${index}"
                                ${this.isSectionCompleted(this.currentConcept?.id, index) ? 'disabled' : ''}>
                            ${this.isSectionCompleted(this.currentConcept?.id, index) ? '✓ Completed' : 'Mark as Complete'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate code examples
     */
    generateCodeExamples(examples) {
        if (!examples || examples.length === 0) return '';

        return `
            <div class="code-examples-section">
                <h4>💻 Code Examples</h4>
                <div class="code-examples">
                    ${examples.map((example, index) => `
                        <div class="code-example">
                            <div class="code-header">
                                <span class="code-title">${example.title || `Example ${index + 1}`}</span>
                                <div class="code-actions">
                                    <button class="btn-small copy-code-btn" data-code="${this.escapeHtml(example.code)}">
                                        📋 Copy
                                    </button>
                                    <button class="btn-small run-code-btn" data-code="${this.escapeHtml(example.code)}">
                                        ▶️ Run
                                    </button>
                                </div>
                            </div>
                            <div class="code-content">
                                <pre><code class="language-javascript">${this.escapeHtml(example.code)}</code></pre>
                            </div>
                            ${example.explanation ? `
                                <div class="code-explanation">
                                    <p>${example.explanation}</p>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate exercises tab
     */
    generateExercisesTab(conceptData) {
        return `
            <div class="tab-content" data-tab="exercises">
                <div class="exercises-header">
                    <h3>🎯 Practice Exercises</h3>
                    <p>Apply your knowledge with these hands-on exercises.</p>
                </div>
                <div class="exercises-list">
                    ${conceptData.exercises.map((exercise, index) => `
                        <div class="exercise-card">
                            <div class="exercise-header">
                                <h4 class="exercise-title">${exercise.title}</h4>
                                <div class="exercise-meta">
                                    <span class="difficulty-badge ${exercise.difficulty}">
                                        ${exercise.difficulty}
                                    </span>
                                    <span class="exercise-number">Exercise ${index + 1}</span>
                                </div>
                            </div>
                            <div class="exercise-content">
                                <p class="exercise-description">${exercise.description}</p>
                                <div class="exercise-instructions">
                                    <h5>📋 Instructions</h5>
                                    <p>${exercise.instructions}</p>
                                </div>
                                
                                <div class="exercise-workspace">
                                    <div class="workspace-tabs">
                                        <button class="workspace-tab active" data-workspace="starter">
                                            🏗️ Starter Code
                                        </button>
                                        <button class="workspace-tab" data-workspace="solution">
                                            ✅ Solution
                                        </button>
                                        <button class="workspace-tab" data-workspace="hints">
                                            💡 Hints
                                        </button>
                                    </div>
                                    
                                    <div class="workspace-content">
                                        <div class="workspace-panel active" data-workspace="starter">
                                            <pre><code class="language-javascript">${this.escapeHtml(exercise.starterCode)}</code></pre>
                                            <button class="btn btn-primary run-exercise-btn" 
                                                    data-exercise="${index}">
                                                ▶️ Run Code
                                            </button>
                                        </div>
                                        
                                        <div class="workspace-panel" data-workspace="solution">
                                            <pre><code class="language-javascript">${this.escapeHtml(exercise.solution)}</code></pre>
                                            <p class="solution-note">💡 Try to solve it yourself first!</p>
                                        </div>
                                        
                                        <div class="workspace-panel" data-workspace="hints">
                                            <div class="hints-list">
                                                ${exercise.hints.map((hint, hintIndex) => `
                                                    <div class="hint-item">
                                                        <button class="hint-toggle" data-hint="${hintIndex}">
                                                            💡 Hint ${hintIndex + 1}
                                                        </button>
                                                        <div class="hint-content hidden">
                                                            <p>${hint}</p>
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="exercise-actions">
                                    <button class="btn btn-success complete-exercise-btn" 
                                            data-exercise="${index}">
                                        Mark as Complete
                                    </button>
                                    <button class="btn btn-secondary reset-exercise-btn" 
                                            data-exercise="${index}">
                                        Reset Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Generate quiz tab
     */
    generateQuizTab(conceptData) {
        return `
            <div class="tab-content" data-tab="quiz">
                <div class="quiz-header">
                    <h3>🧠 Knowledge Quiz</h3>
                    <p>Test your understanding of ${conceptData.overview.title}</p>
                    <div class="quiz-info">
                        <span class="quiz-stat">📊 ${conceptData.quiz.questions.length} questions</span>
                        <span class="quiz-stat">⏱️ ${Math.floor(conceptData.quiz.timeLimit / 60)} minutes</span>
                        <span class="quiz-stat">🎯 ${conceptData.quiz.passingScore}% to pass</span>
                    </div>
                </div>
                
                <div class="quiz-container" id="quiz-container">
                    <div class="quiz-start-screen">
                        <div class="quiz-instructions">
                            <h4>📋 Instructions</h4>
                            <ul>
                                <li>Answer all questions to the best of your ability</li>
                                <li>You can review and change your answers before submitting</li>
                                <li>Each question is worth ${Math.round(conceptData.quiz.totalPoints / conceptData.quiz.questions.length)} points</li>
                                <li>You need ${conceptData.quiz.passingScore}% to pass this quiz</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary btn-large start-quiz-btn">
                            🚀 Start Quiz
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate notes tab
     */
    generateNotesTab(conceptData) {
        const notes = this.getUserNotes(conceptData.id);
        
        return `
            <div class="tab-content" data-tab="notes">
                <div class="notes-header">
                    <h3>📝 Personal Notes</h3>
                    <p>Keep track of your thoughts and insights about ${conceptData.overview.title}</p>
                </div>
                
                <div class="notes-editor">
                    <div class="editor-toolbar">
                        <button class="editor-btn" data-action="bold" title="Bold">
                            <strong>B</strong>
                        </button>
                        <button class="editor-btn" data-action="italic" title="Italic">
                            <em>I</em>
                        </button>
                        <button class="editor-btn" data-action="code" title="Code">
                            &lt;/&gt;
                        </button>
                        <button class="editor-btn" data-action="link" title="Link">
                            🔗
                        </button>
                        <div class="editor-separator"></div>
                        <button class="editor-btn" data-action="save" title="Save Notes">
                            💾 Save
                        </button>
                        <button class="editor-btn" data-action="export" title="Export Notes">
                            📤 Export
                        </button>
                    </div>
                    
                    <textarea class="notes-textarea" 
                              placeholder="Write your notes here...">${notes}</textarea>
                    
                    <div class="notes-footer">
                        <span class="word-count">0 words</span>
                        <span class="auto-save-status">Auto-saved</span>
                    </div>
                </div>
                
                <div class="quick-notes">
                    <h4>🔖 Quick Bookmarks</h4>
                    <div class="bookmarks-list" id="concept-bookmarks">
                        <!-- Bookmarks will be populated here -->
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate sidebar
     */
    generateSidebar(conceptData) {
        return `
            <div class="concept-sidebar">
                <div class="sidebar-section">
                    <h4>📖 Table of Contents</h4>
                    <div class="toc-list">
                        ${conceptData.sections.map((section, index) => `
                            <a href="#section-${index}" class="toc-item">
                                <span class="toc-number">${index + 1}.</span>
                                <span class="toc-title">${section.title}</span>
                                <span class="toc-status ${this.isSectionCompleted(conceptData.id, index) ? 'completed' : ''}">
                                    ${this.isSectionCompleted(conceptData.id, index) ? '✓' : ''}
                                </span>
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h4>🎯 Your Progress</h4>
                    <div class="progress-summary">
                        <div class="progress-item">
                            <span class="progress-label">Sections:</span>
                            <span class="progress-value">
                                ${this.getCompletedSections(conceptData.id)}/${conceptData.sections.length}
                            </span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Exercises:</span>
                            <span class="progress-value">
                                ${this.getCompletedExercises(conceptData.id)}/${conceptData.exercises.length}
                            </span>
                        </div>
                        <div class="progress-item">
                            <span class="progress-label">Quiz:</span>
                            <span class="progress-value">
                                ${this.isQuizCompleted(conceptData.id) ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="sidebar-section">
                    <h4>🔗 Related Concepts</h4>
                    <div class="related-concepts">
                        ${this.getRelatedConcepts(conceptData.id).map(concept => `
                            <a href="#" class="related-concept-link" data-concept="${concept.id}">
                                <span class="related-icon">${concept.emoji}</span>
                                <span class="related-title">${concept.title}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate concept footer buttons
     */
    generateConceptFooter(conceptData) {
        return [
            {
                text: '📚 Continue Learning',
                className: 'btn-primary',
                handler: () => {
                    this.continueLearning();
                }
            },
            {
                text: '🧠 Take Quiz',
                className: 'btn-secondary',
                handler: () => {
                    this.switchToQuizTab();
                }
            },
            {
                text: '🔖 Bookmark',
                className: 'btn-secondary',
                handler: () => {
                    this.toggleBookmark(conceptData.id);
                }
            }
        ];
    }

    /**
     * Initialize concept features after modal is shown
     */
    initializeConceptFeatures() {
        this.setupTabNavigation();
        this.setupSectionNavigation();
        this.setupCodeInteractions();
        this.setupExerciseInteractions();
        this.setupQuizInteractions();
        this.setupNotesEditor();
        this.setupBookmarkSystem();
        this.initializeAutoSave();
    }

    /**
     * Setup tab navigation
     */
    setupTabNavigation() {
        const tabButtons = this.modal.element.querySelectorAll('.nav-tab');
        const tabContents = this.modal.element.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = button.dataset.tab;
                
                // Update active tab
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                const targetContent = this.modal.element.querySelector(`[data-tab="${tabName}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Track tab usage
                this.trackTabUsage(tabName);
            });
        });
    }

    /**
     * Setup section navigation
     */
    setupSectionNavigation() {
        const prevBtn = this.modal.element.querySelector('#prev-section');
        const nextBtn = this.modal.element.querySelector('#next-section');
        const sectionNavItems = this.modal.element.querySelectorAll('.section-nav-item');

        // Previous/Next navigation
        prevBtn?.addEventListener('click', () => this.navigateSection(-1));
        nextBtn?.addEventListener('click', () => this.navigateSection(1));

        // Direct section navigation
        sectionNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const sectionIndex = parseInt(item.dataset.section);
                this.navigateToSection(sectionIndex);
            });
        });

        // Complete section buttons
        const completeBtns = this.modal.element.querySelectorAll('.complete-section-btn');
        completeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sectionIndex = parseInt(btn.dataset.section);
                this.completeSection(sectionIndex);
            });
        });
    }

    /**
     * Setup code interactions
     */
    setupCodeInteractions() {
        // Copy code buttons
        const copyBtns = this.modal.element.querySelectorAll('.copy-code-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = btn.dataset.code;
                this.copyToClipboard(code);
                this.showTemporaryMessage('Code copied!', btn);
            });
        });

        // Run code buttons
        const runBtns = this.modal.element.querySelectorAll('.run-code-btn');
        runBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = btn.dataset.code;
                this.runCode(code);
            });
        });
    }

    /**
     * Setup exercise interactions
     */
    setupExerciseInteractions() {
        // Workspace tab navigation
        const workspaceTabs = this.modal.element.querySelectorAll('.workspace-tab');
        workspaceTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const workspace = tab.dataset.workspace;
                const container = tab.closest('.exercise-workspace');
                
                // Update active workspace
                container.querySelectorAll('.workspace-tab').forEach(t => t.classList.remove('active'));
                container.querySelectorAll('.workspace-panel').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                container.querySelector(`[data-workspace="${workspace}"]`).classList.add('active');
            });
        });

        // Hint toggles
        const hintToggles = this.modal.element.querySelectorAll('.hint-toggle');
        hintToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const hintContent = toggle.nextElementSibling;
                hintContent.classList.toggle('hidden');
                toggle.textContent = hintContent.classList.contains('hidden') 
                    ? toggle.textContent.replace('🔽', '💡')
                    : toggle.textContent.replace('💡', '🔽');
            });
        });

        // Exercise completion
        const completeExerciseBtns = this.modal.element.querySelectorAll('.complete-exercise-btn');
        completeExerciseBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseIndex = parseInt(btn.dataset.exercise);
                this.completeExercise(exerciseIndex);
            });
        });
    }

    /**
     * Setup quiz interactions
     */
    setupQuizInteractions() {
        const startQuizBtn = this.modal.element.querySelector('.start-quiz-btn');
        startQuizBtn?.addEventListener('click', () => {
            this.startQuiz();
        });
    }

    /**
     * Setup notes editor
     */
    setupNotesEditor() {
        const notesTextarea = this.modal.element.querySelector('.notes-textarea');
        const wordCount = this.modal.element.querySelector('.word-count');
        
        if (notesTextarea) {
            // Word count update
            notesTextarea.addEventListener('input', (e) => {
                const words = e.target.value.trim().split(/\s+/).filter(word => word.length > 0).length;
                if (wordCount) {
                    wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;
                }
                
                // Auto-save
                this.autoSaveNotes();
            });

            // Editor toolbar
            const editorBtns = this.modal.element.querySelectorAll('.editor-btn');
            editorBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const action = btn.dataset.action;
                    this.handleEditorAction(action, notesTextarea);
                });
            });
        }
    }

    /**
     * Setup bookmark system
     */
    setupBookmarkSystem() {
        const bookmarkBtn = this.modal.element.querySelector('.bookmark-btn');
        bookmarkBtn?.addEventListener('click', () => {
            this.toggleBookmark(this.currentConcept.id);
        });
    }

    /**
     * Initialize auto-save functionality
     */
    initializeAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.autoSaveProgress();
        }, 30000); // Auto-save every 30 seconds
    }

    // Navigation methods
    navigateSection(direction) {
        const newSection = this.currentSection + direction;
        if (newSection >= 0 && newSection < this.currentConcept.sections.length) {
            this.navigateToSection(newSection);
        }
    }

    navigateToSection(sectionIndex) {
        this.currentSection = sectionIndex;
        const sectionContent = this.modal.element.querySelector('.section-content');
        const section = this.currentConcept.sections[sectionIndex];
        
        sectionContent.innerHTML = this.generateSectionContent(section, sectionIndex);
        
        // Update navigation
        this.updateSectionNavigation();
        
        // Scroll to top
        sectionContent.scrollTop = 0;
    }

    updateSectionNavigation() {
        const prevBtn = this.modal.element.querySelector('#prev-section');
        const nextBtn = this.modal.element.querySelector('#next-section');
        const currentSection = this.modal.element.querySelector('#current-section');
        
        if (prevBtn) prevBtn.disabled = this.currentSection === 0;
        if (nextBtn) nextBtn.disabled = this.currentSection === this.currentConcept.sections.length - 1;
        if (currentSection) currentSection.textContent = this.currentSection + 1;

        // Update section navigation items
        const navItems = this.modal.element.querySelectorAll('.section-nav-item');
        navItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSection);
        });
    }

    switchToQuizTab() {
        const quizTab = this.modal.element.querySelector('[data-tab="quiz"]');
        if (quizTab) {
            quizTab.click();
        }
    }

    // Progress tracking methods
    completeSection(sectionIndex) {
        const conceptId = this.currentConcept.id;
        const sectionKey = `${conceptId}-section-${sectionIndex}`;
        
        // Mark section as completed
        StateManager.completeConcept(sectionKey);
        
        // Update UI
        const btn = this.modal.element.querySelector(`[data-section="${sectionIndex}"]`);
        if (btn) {
            btn.disabled = true;
            btn.textContent = '✓ Completed';
            btn.classList.add('completed');
        }
        
        // Update section navigation
        const navItem = this.modal.element.querySelector(`.section-nav-item[data-section="${sectionIndex}"]`);
        if (navItem) {
            const statusSpan = navItem.querySelector('.section-status');
            statusSpan.textContent = '✓';
            statusSpan.classList.add('completed');
        }
        
        // Show celebration
        this.showCompletionCelebration(`Section "${this.currentConcept.sections[sectionIndex].title}" completed!`);
        
        // Auto-advance to next section
        if (sectionIndex < this.currentConcept.sections.length - 1) {
            setTimeout(() => {
                this.navigateToSection(sectionIndex + 1);
            }, 1500);
        }
        
        // Update progress
        this.updateProgressDisplay();
    }

    completeExercise(exerciseIndex) {
        const conceptId = this.currentConcept.id;
        const exerciseKey = `${conceptId}-exercise-${exerciseIndex}`;
        
        // Mark exercise as completed
        StateManager.completeConcept(exerciseKey);
        
        // Update UI
        const btn = this.modal.element.querySelector(`[data-exercise="${exerciseIndex}"] .complete-exercise-btn`);
        if (btn) {
            btn.disabled = true;
            btn.textContent = '✓ Completed';
            btn.classList.add('completed');
        }
        
        // Show success message
        this.showCompletionCelebration('Exercise completed! Great job!');
        
        // Update progress
        this.updateProgressDisplay();
    }

    startQuiz() {
        const quizContainer = this.modal.element.querySelector('#quiz-container');
        this.currentQuiz = {
            questionIndex: 0,
            answers: [],
            startTime: Date.now(),
            timeRemaining: this.currentConcept.quiz.timeLimit
        };
        
        quizContainer.innerHTML = this.generateQuizInterface();
        this.initializeQuiz();
    }

    generateQuizInterface() {
        const quiz = this.currentConcept.quiz;
        const question = quiz.questions[0];
        
        return `
            <div class="quiz-interface">
                <div class="quiz-header">
                    <div class="quiz-progress">
                        <span class="question-counter">Question 1 of ${quiz.questions.length}</span>
                        <div class="quiz-progress-bar">
                            <div class="quiz-progress-fill" style="width: ${(1/quiz.questions.length)*100}%"></div>
                        </div>
                    </div>
                    <div class="quiz-timer" id="quiz-timer">
                        <span class="timer-icon">⏱️</span>
                        <span class="timer-text">${this.formatTime(this.currentQuiz.timeRemaining)}</span>
                    </div>
                </div>
                
                <div class="quiz-question-container">
                    ${this.generateQuestionHTML(question, 0)}
                </div>
                
                <div class="quiz-navigation">
                    <button class="btn btn-secondary" id="quiz-prev" disabled>
                        ← Previous
                    </button>
                    <button class="btn btn-primary" id="quiz-next">
                        Next →
                    </button>
                    <button class="btn btn-success hidden" id="quiz-submit">
                        Submit Quiz
                    </button>
                </div>
            </div>
        `;
    }

    generateQuestionHTML(question, index) {
        return `
            <div class="quiz-question">
                <h4 class="question-text">${question.question}</h4>
                <div class="question-options">
                    ${question.options.map((option, optionIndex) => `
                        <label class="quiz-option">
                            <input type="radio" name="question-${index}" value="${optionIndex}"
                                   ${this.currentQuiz.answers[index] === optionIndex ? 'checked' : ''}>
                            <span class="option-text">${option}</span>
                        </label>
                    `).join('')}
                </div>
                ${question.explanation ? `
                    <div class="question-explanation hidden">
                        <h5>💡 Explanation</h5>
                        <p>${question.explanation}</p>
                    </div>
                ` : ''}
            </div>
        `;
    }

    initializeQuiz() {
        // Start timer
        this.quizTimer = setInterval(() => {
            this.updateQuizTimer();
        }, 1000);
        
        // Setup navigation
        const prevBtn = this.modal.element.querySelector('#quiz-prev');
        const nextBtn = this.modal.element.querySelector('#quiz-next');
        const submitBtn = this.modal.element.querySelector('#quiz-submit');
        
        prevBtn.addEventListener('click', () => this.navigateQuizQuestion(-1));
        nextBtn.addEventListener('click', () => this.navigateQuizQuestion(1));
        submitBtn.addEventListener('click', () => this.submitQuiz());
        
        // Setup answer recording
        const options = this.modal.element.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', (e) => {
                const questionIndex = this.currentQuiz.questionIndex;
                this.currentQuiz.answers[questionIndex] = parseInt(e.target.value);
            });
        });
    }

    navigateQuizQuestion(direction) {
        const newIndex = this.currentQuiz.questionIndex + direction;
        const totalQuestions = this.currentConcept.quiz.questions.length;
        
        if (newIndex >= 0 && newIndex < totalQuestions) {
            this.currentQuiz.questionIndex = newIndex;
            this.updateQuizQuestion();
        }
    }

    updateQuizQuestion() {
        const questionContainer = this.modal.element.querySelector('.quiz-question-container');
        const question = this.currentConcept.quiz.questions[this.currentQuiz.questionIndex];
        
        questionContainer.innerHTML = this.generateQuestionHTML(question, this.currentQuiz.questionIndex);
        
        // Update navigation
        this.updateQuizNavigation();
        
        // Reattach event listeners
        const options = questionContainer.querySelectorAll('input[type="radio"]');
        options.forEach(option => {
            option.addEventListener('change', (e) => {
                this.currentQuiz.answers[this.currentQuiz.questionIndex] = parseInt(e.target.value);
            });
        });
    }

    updateQuizNavigation() {
        const prevBtn = this.modal.element.querySelector('#quiz-prev');
        const nextBtn = this.modal.element.querySelector('#quiz-next');
        const submitBtn = this.modal.element.querySelector('#quiz-submit');
        const counter = this.modal.element.querySelector('.question-counter');
        const progressFill = this.modal.element.querySelector('.quiz-progress-fill');
        
        const currentQ = this.currentQuiz.questionIndex + 1;
        const totalQ = this.currentConcept.quiz.questions.length;
        
        prevBtn.disabled = this.currentQuiz.questionIndex === 0;
        
        if (this.currentQuiz.questionIndex === totalQ - 1) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
        
        counter.textContent = `Question ${currentQ} of ${totalQ}`;
        progressFill.style.width = `${(currentQ / totalQ) * 100}%`;
    }

    updateQuizTimer() {
        this.currentQuiz.timeRemaining -= 1000;
        
        if (this.currentQuiz.timeRemaining <= 0) {
            this.submitQuiz(true); // Auto-submit when time expires
            return;
        }
        
        const timerText = this.modal.element.querySelector('.timer-text');
        if (timerText) {
            timerText.textContent = this.formatTime(this.currentQuiz.timeRemaining);
            
            // Add warning colors
            if (this.currentQuiz.timeRemaining <= 60000) { // Last minute
                timerText.classList.add('timer-warning');
            }
            if (this.currentQuiz.timeRemaining <= 30000) { // Last 30 seconds
                timerText.classList.add('timer-critical');
            }
        }
    }

    submitQuiz(timeExpired = false) {
        clearInterval(this.quizTimer);
        
        // Calculate score
        const quiz = this.currentConcept.quiz;
        let correctAnswers = 0;
        
        quiz.questions.forEach((question, index) => {
            if (this.currentQuiz.answers[index] === question.correctAnswer) {
                correctAnswers++;
            }
        });
        
        const score = Math.round((correctAnswers / quiz.questions.length) * 100);
        const passed = score >= quiz.passingScore;
        
        // Save quiz result
        StateManager.completeQuiz(this.currentConcept.id, correctAnswers, quiz.questions.length);
        
        // Show results
        this.showQuizResults(score, correctAnswers, quiz.questions.length, passed, timeExpired);
    }

    showQuizResults(score, correct, total, passed, timeExpired) {
        const quizContainer = this.modal.element.querySelector('#quiz-container');
        
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <div class="results-header">
                    <div class="results-icon ${passed ? 'success' : 'failure'}">
                        ${passed ? '🎉' : '😔'}
                    </div>
                    <h3 class="results-title">
                        ${timeExpired ? 'Time Expired!' : 'Quiz Completed!'}
                    </h3>
                    <div class="results-score ${passed ? 'passed' : 'failed'}">
                        ${score}%
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="result-stat">
                        <span class="stat-label">Correct Answers:</span>
                        <span class="stat-value">${correct} of ${total}</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">Passing Score:</span>
                        <span class="stat-value">${this.currentConcept.quiz.passingScore}%</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">Status:</span>
                        <span class="stat-value ${passed ? 'passed' : 'failed'}">
                            ${passed ? '✅ Passed' : '❌ Failed'}
                        </span>
                    </div>
                </div>
                
                ${passed ? `
                    <div class="congratulations">
                        <h4>🎊 Congratulations!</h4>
                        <p>You've successfully completed the ${this.currentConcept.overview.title} quiz!</p>
                    </div>
                ` : `
                    <div class="encouragement">
                        <h4>📚 Keep Learning!</h4>
                        <p>Review the content and try again. You've got this!</p>
                    </div>
                `}
                
                <div class="results-actions">
                    <button class="btn btn-primary review-answers-btn">
                        🔍 Review Answers
                    </button>
                    ${!passed ? `
                        <button class="btn btn-secondary retake-quiz-btn">
                            🔄 Retake Quiz
                        </button>
                    ` : ''}
                    <button class="btn btn-secondary close-quiz-btn">
                        ✅ Continue Learning
                    </button>
                </div>
            </div>
        `;
        
        // Setup result actions
        this.setupQuizResultActions();
    }

    setupQuizResultActions() {
        const reviewBtn = this.modal.element.querySelector('.review-answers-btn');
        const retakeBtn = this.modal.element.querySelector('.retake-quiz-btn');
        const closeBtn = this.modal.element.querySelector('.close-quiz-btn');
        
        reviewBtn?.addEventListener('click', () => this.showAnswerReview());
        retakeBtn?.addEventListener('click', () => this.startQuiz());
        closeBtn?.addEventListener('click', () => this.switchToTab('content'));
    }

    showAnswerReview() {
        const quizContainer = this.modal.element.querySelector('#quiz-container');
        const quiz = this.currentConcept.quiz;
        
        quizContainer.innerHTML = `
            <div class="answer-review">
                <div class="review-header">
                    <h3>📋 Answer Review</h3>
                    <p>Review your answers and explanations</p>
                </div>
                
                <div class="reviewed-questions">
                    ${quiz.questions.map((question, index) => {
                        const userAnswer = this.currentQuiz.answers[index];
                        const isCorrect = userAnswer === question.correctAnswer;
                        
                        return `
                            <div class="reviewed-question ${isCorrect ? 'correct' : 'incorrect'}">
                                <div class="question-header">
                                    <span class="question-number">Q${index + 1}</span>
                                    <span class="question-result ${isCorrect ? 'correct' : 'incorrect'}">
                                        ${isCorrect ? '✅ Correct' : '❌ Incorrect'}
                                    </span>
                                </div>
                                
                                <h4 class="question-text">${question.question}</h4>
                                
                                <div class="answer-comparison">
                                    <div class="user-answer">
                                        <strong>Your Answer:</strong>
                                        <span class="${isCorrect ? 'correct' : 'incorrect'}">
                                            ${question.options[userAnswer] || 'Not answered'}
                                        </span>
                                    </div>
                                    
                                    ${!isCorrect ? `
                                        <div class="correct-answer">
                                            <strong>Correct Answer:</strong>
                                            <span class="correct">
                                                ${question.options[question.correctAnswer]}
                                            </span>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                ${question.explanation ? `
                                    <div class="answer-explanation">
                                        <h5>💡 Explanation</h5>
                                        <p>${question.explanation}</p>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="review-actions">
                    <button class="btn btn-primary back-to-results-btn">
                        ← Back to Results
                    </button>
                </div>
            </div>
        `;
        
        // Setup back button
        const backBtn = this.modal.element.querySelector('.back-to-results-btn');
        backBtn?.addEventListener('click', () => {
            // Regenerate results view
            const score = Math.round((this.currentQuiz.answers.filter((answer, index) => 
                answer === this.currentConcept.quiz.questions[index].correctAnswer
            ).length / this.currentConcept.quiz.questions.length) * 100);
            
            this.showQuizResults(score, 
                this.currentQuiz.answers.filter((answer, index) => 
                    answer === this.currentConcept.quiz.questions[index].correctAnswer
                ).length,
                this.currentConcept.quiz.questions.length,
                score >= this.currentConcept.quiz.passingScore,
                false
            );
        });
    }

    // Utility methods
    switchToTab(tabName) {
        const tab = this.modal.element.querySelector(`[data-tab="${tabName}"]`);
        if (tab) {
            tab.click();
        }
    }

    formatTime(milliseconds) {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    }

    runCode(code) {
        // Create a safe execution environment
        try {
            const result = new Function('console', `
                const originalLog = console.log;
                const logs = [];
                console.log = (...args) => {
                    logs.push(args.join(' '));
                    originalLog(...args);
                };
                
                try {
                    ${code}
                    return { success: true, logs, result: 'Code executed successfully' };
                } catch (error) {
                    return { success: false, logs, error: error.message };
                }
            `)(console);
            
            this.showCodeResult(result);
        } catch (error) {
            this.showCodeResult({ success: false, error: error.message, logs: [] });
        }
    }

    showCodeResult(result) {
        // Create or update result display
        let resultDiv = this.modal.element.querySelector('.code-execution-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.className = 'code-execution-result';
            // Find the last code example and insert after it
            const lastCodeExample = this.modal.element.querySelector('.code-example:last-of-type');
            if (lastCodeExample) {
                lastCodeExample.insertAdjacentElement('afterend', resultDiv);
            }
        }
        
        resultDiv.innerHTML = `
            <div class="result-header">
                <span class="result-icon">${result.success ? '✅' : '❌'}</span>
                <span class="result-title">${result.success ? 'Success' : 'Error'}</span>
            </div>
            
            ${result.logs && result.logs.length > 0 ? `
                <div class="result-logs">
                    <h5>📄 Console Output:</h5>
                    <pre class="logs-content">${result.logs.join('\n')}</pre>
                </div>
            ` : ''}
            
            ${result.error ? `
                <div class="result-error">
                    <h5>🚨 Error:</h5>
                    <pre class="error-content">${result.error}</pre>
                </div>
            ` : ''}
        `;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            resultDiv.style.opacity = '0.5';
        }, 5000);
    }

    showTemporaryMessage(message, targetElement) {
        const messageEl = document.createElement('div');
        messageEl.className = 'temporary-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: absolute;
            background: var(--success-color);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.8rem;
            z-index: 1000;
            animation: fadeInOut 2s ease;
            pointer-events: none;
        `;
        
        // Position relative to target element
        const rect = targetElement.getBoundingClientRect();
        messageEl.style.top = `${rect.top - 40}px`;
        messageEl.style.left = `${rect.left}px`;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 2000);
    }

    showCompletionCelebration(message) {
        // Create celebration animation
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-icon">🎉</div>
                <div class="celebration-message">${message}</div>
            </div>
        `;
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--success-color), var(--accent-color));
            color: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            z-index: 2001;
            animation: celebrationPop 2s ease;
            pointer-events: none;
        `;
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 2000);
    }

    // Progress calculation methods
    calculateConceptProgress(conceptId) {
        const progress = StateManager.getProgress();
        const completedConcepts = progress.completedConcepts.filter(concept => 
            concept.startsWith(conceptId)
        );
        
        if (!this.currentConcept) return 0;
        
        const totalItems = this.currentConcept.sections.length + 
                          this.currentConcept.exercises.length + 1; // +1 for quiz
        
        return Math.round((completedConcepts.length / totalItems) * 100);
    }

    getCompletedSections(conceptId) {
        const progress = StateManager.getProgress();
        return progress.completedConcepts.filter(concept => 
            concept.startsWith(`${conceptId}-section`)
        ).length;
    }

    getCompletedExercises(conceptId) {
        const progress = StateManager.getProgress();
        return progress.completedConcepts.filter(concept => 
            concept.startsWith(`${conceptId}-exercise`)
        ).length;
    }

    isQuizCompleted(conceptId) {
        const progress = StateManager.getProgress();
        return progress.completedConcepts.includes(`${conceptId}-quiz`);
    }

    isSectionCompleted(conceptId, sectionIndex) {
        if (!conceptId) return false;
        const progress = StateManager.getProgress();
        return progress.completedConcepts.includes(`${conceptId}-section-${sectionIndex}`);
    }

    updateProgressDisplay() {
        if (!this.currentConcept) return;
        
        const progress = this.calculateConceptProgress(this.currentConcept.id);
        const progressFill = this.modal.element.querySelector('.progress-fill');
        const progressPercentage = this.modal.element.querySelector('.progress-percentage');
        
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercentage) progressPercentage.textContent = `${progress}%`;
        
        // Update sidebar progress
        const sidebarProgress = this.modal.element.querySelectorAll('.progress-value');
        if (sidebarProgress.length >= 3) {
            sidebarProgress[0].textContent = `${this.getCompletedSections(this.currentConcept.id)}/${this.currentConcept.sections.length}`;
            sidebarProgress[1].textContent = `${this.getCompletedExercises(this.currentConcept.id)}/${this.currentConcept.exercises.length}`;
            sidebarProgress[2].textContent = this.isQuizCompleted(this.currentConcept.id) ? 'Completed' : 'Pending';
        }
    }

    // Bookmark and notes methods
    toggleBookmark(conceptId) {
        const isBookmarked = this.isBookmarked(conceptId);
        
        if (isBookmarked) {
            this.removeBookmark(conceptId);
        } else {
            this.addBookmark(conceptId);
        }
        
        // Update bookmark button
        const bookmarkBtn = this.modal.element.querySelector('.bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.classList.toggle('active', !isBookmarked);
            bookmarkBtn.textContent = !isBookmarked ? '🔖' : '📑';
            bookmarkBtn.title = !isBookmarked ? 'Remove bookmark' : 'Bookmark this concept';
        }
    }

    addBookmark(conceptId) {
        if (!this.bookmarks.includes(conceptId)) {
            this.bookmarks.push(conceptId);
            this.saveBookmarks();
            this.showTemporaryMessage('Concept bookmarked!', this.modal.element.querySelector('.bookmark-btn'));
        }
    }

    removeBookmark(conceptId) {
        const index = this.bookmarks.indexOf(conceptId);
        if (index > -1) {
            this.bookmarks.splice(index, 1);
            this.saveBookmarks();
            this.showTemporaryMessage('Bookmark removed!', this.modal.element.querySelector('.bookmark-btn'));
        }
    }

    isBookmarked(conceptId) {
        return this.bookmarks.includes(conceptId);
    }

    saveBookmarks() {
        localStorage.setItem('jsversehub-bookmarks', JSON.stringify(this.bookmarks));
    }

    loadBookmarks() {
        try {
            const stored = localStorage.getItem('jsversehub-bookmarks');
            this.bookmarks = stored ? JSON.parse(stored) : [];
        } catch (error) {
            JSVLogger.warn('Failed to load bookmarks:', error);
            this.bookmarks = [];
        }
    }

    // Notes methods
    getUserNotes(conceptId) {
        try {
            const notes = localStorage.getItem(`jsversehub-notes-${conceptId}`);
            return notes || '';
        } catch (error) {
            JSVLogger.warn('Failed to load notes:', error);
            return '';
        }
    }

    saveUserNotes(conceptId, notes) {
        try {
            localStorage.setItem(`jsversehub-notes-${conceptId}`, notes);
            this.showAutoSaveStatus('Notes saved');
        } catch (error) {
            JSVLogger.error('Failed to save notes:', error);
            this.showAutoSaveStatus('Save failed', true);
        }
    }

    autoSaveNotes() {
        if (!this.currentConcept) return;
        
        const notesTextarea = this.modal.element.querySelector('.notes-textarea');
        if (notesTextarea) {
            clearTimeout(this.notesAutoSaveTimeout);
            this.notesAutoSaveTimeout = setTimeout(() => {
                this.saveUserNotes(this.currentConcept.id, notesTextarea.value);
            }, 2000);
        }
    }

    showAutoSaveStatus(message, isError = false) {
        const statusEl = this.modal.element.querySelector('.auto-save-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = isError ? 'var(--danger-color)' : 'var(--success-color)';
            
            setTimeout(() => {
                statusEl.textContent = 'Auto-saved';
                statusEl.style.color = 'var(--text-muted)';
            }, 2000);
        }
    }

    handleEditorAction(action, textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        
        let replacement = '';
        let newCursorPos = start;
        
        switch (action) {
            case 'bold':
                replacement = `**${selectedText}**`;
                newCursorPos = selectedText ? end + 4 : start + 2;
                break;
            case 'italic':
                replacement = `*${selectedText}*`;
                newCursorPos = selectedText ? end + 2 : start + 1;
                break;
            case 'code':
                replacement = `\`${selectedText}\``;
                newCursorPos = selectedText ? end + 2 : start + 1;
                break;
            case 'link':
                replacement = `[${selectedText || 'link text'}](url)`;
                newCursorPos = start + replacement.length - 4;
                break;
            case 'save':
                this.saveUserNotes(this.currentConcept.id, textarea.value);
                return;
            case 'export':
                this.exportNotes();
                return;
        }
        
        if (replacement) {
            textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
            textarea.focus();
        }
    }

    exportNotes() {
        if (!this.currentConcept) return;
        
        const notes = this.modal.element.querySelector('.notes-textarea').value;
        if (!notes.trim()) {
            Modal.alert('No Notes', 'No notes to export for this concept.');
            return;
        }
        
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jsversehub-notes-${this.currentConcept.id}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Helper methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getRelatedConcepts(conceptId) {
        // This would normally come from the concept data or a separate mapping
        const relatedMap = {
            basics: [
                { id: 'dom', title: 'DOM Manipulation', emoji: '🌍' },
                { id: 'functions', title: 'Advanced Functions', emoji: '⚡' }
            ],
            dom: [
                { id: 'events', title: 'Event Handling', emoji: '⚪' },
                { id: 'async', title: 'Async JavaScript', emoji: '⚡' }
            ]
        };
        
        return relatedMap[conceptId] || [];
    }

    trackTabUsage(tabName) {
        // Track which tabs users interact with most
        JSVLogger.debug(`Tab switched to: ${tabName}`);
    }

    continueLearning() {
        // Navigate to next logical section or concept
        if (this.currentSection < this.currentConcept.sections.length - 1) {
            this.navigateSection(1);
        } else {
            // Check if all sections completed, move to exercises
            const completedSections = this.getCompletedSections(this.currentConcept.id);
            if (completedSections === this.currentConcept.sections.length) {
                this.switchToTab('exercises');
            }
        }
    }

    autoSaveProgress() {
        // Auto-save current progress
        if (this.currentConcept) {
            const progressData = {
                conceptId: this.currentConcept.id,
                currentSection: this.currentSection,
                lastAccessed: Date.now()
            };
            localStorage.setItem('jsversehub-current-progress', JSON.stringify(progressData));
        }
    }

    // Event handlers
    handleStateChange(event, data) {
        if (event === 'conceptCompleted') {
            this.updateProgressDisplay();
        }
    }

    onConceptClose() {
        // Cleanup when concept modal is closed
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        // Save final progress
        this.autoSaveProgress();
        
        this.currentConcept = null;
        this.modal = null;
    }

    // Static methods
    static showExercise(conceptId, exerciseId) {
        const viewer = new ConceptViewer();
        viewer.showConcept(conceptId).then(() => {
            viewer.switchToTab('exercises');
        });
    }

    static showQuiz(conceptId) {
        const viewer = new ConceptViewer();
        viewer.showConcept(conceptId).then(() => {
            viewer.switchToTab('quiz');
        });
    }

    /**
     * Get singleton instance
     */
    static getInstance() {
        if (!ConceptViewer.instance) {
            ConceptViewer.instance = new ConceptViewer();
        }
        return ConceptViewer.instance;
    }
}

// CSS styles for ConceptViewer
const conceptViewerStyles = document.createElement('style');
conceptViewerStyles.textContent = `
    .concept-viewer-container {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 2rem;
        max-height: 70vh;
    }

    .concept-header {
        grid-column: 1 / -1;
        margin-bottom: 1rem;
    }

    .concept-meta-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
    }

    .concept-badges {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .difficulty-badge, .time-badge, .concepts-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .difficulty-badge.beginner { background: rgba(78, 205, 196, 0.2); color: var(--success-color); }
    .difficulty-badge.intermediate { background: rgba(255, 230, 109, 0.2); color: var(--warning-color); }
    .difficulty-badge.advanced { background: rgba(255, 107, 107, 0.2); color: var(--danger-color); }

    .time-badge, .concepts-badge {
        background: rgba(0, 212, 255, 0.2);
        color: var(--accent-color);
    }

    .concept-actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn-icon {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 8px;
        background: rgba(0, 212, 255, 0.1);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
    }

    .btn-icon:hover {
        background: rgba(0, 212, 255, 0.2);
        transform: scale(1.1);
    }

    .btn-icon.active {
        background: var(--accent-color);
        color: white;
    }

    .learning-objectives, .prerequisites {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
    }

    .objectives-list {
        list-style: none;
        padding: 0;
        margin: 0.5rem 0;
    }

    .objective-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin: 0.5rem 0;
        padding: 0.5rem;
        background: rgba(0, 212, 255, 0.1);
        border-radius: 6px;
    }

    .objective-check {
        color: var(--success-color);
        font-weight: bold;
    }

    .prereq-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-top: 0.5rem;
    }

    .prereq-item {
        padding: 0.25rem 0.75rem;
        background: rgba(255, 230, 109, 0.2);
        color: var(--warning-color);
        border-radius: 12px;
        font-size: 0.8rem;
    }

    .no-prereq {
        color: var(--success-color);
        font-style: italic;
    }

    .concept-progress-container {
        grid-column: 1 / -1;
        background: rgba(0, 0, 0, 0.2);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
    }

    .progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .progress-percentage {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--accent-color);
    }

    .progress-bar-container {
        margin-bottom: 0.5rem;
    }

    .progress-bar {
        width: 100%;
        height: 8px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        overflow: hidden;
    }

    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--success-color), var(--accent-color));
        transition: width 0.5s ease;
        border-radius: 4px;
    }

    .concept-navigation {
        grid-column: 1 / -1;
        margin-bottom: 1rem;
    }

    .nav-tabs {
        display: flex;
        gap: 0;
        border-bottom: 2px solid rgba(0, 212, 255, 0.2);
    }

    .nav-tab {
        padding: 1rem 1.5rem;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        border-bottom: 2px solid transparent;
        font-size: 0.9rem;
        font-weight: 500;
    }

    .nav-tab:hover {
        color: var(--text-primary);
        background: rgba(0, 212, 255, 0.05);
    }

    .nav-tab.active {
        color: var(--accent-color);
        border-bottom-color: var(--accent-color);
        background: rgba(0, 212, 255, 0.1);
    }

    .concept-content-area {
        overflow: hidden;
    }

    .tab-content {
        display: none;
        animation: fadeIn 0.3s ease;
    }

    .tab-content.active {
        display: block;
    }

    .sections-navigation {
        margin-bottom: 1rem;
    }

    .sections-list {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .section-nav-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .section-nav-item:hover {
        background: rgba(0, 212, 255, 0.2);
        transform: translateY(-2px);
    }

    .section-nav-item.active {
        background: var(--accent-color);
        color: white;
        border-color: var(--accent-color);
    }

    .section-number {
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .section-status.completed {
        color: var(--success-color);
    }

    .section-content {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        max-height: 50vh;
        overflow-y: auto;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .section-actions {
        display: flex;
        gap: 0.5rem;
    }

    .btn-small {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
        border-radius: 6px;
    }

    .code-examples-section {
        margin: 1.5rem 0;
    }

    .code-example {
        margin: 1rem 0;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(0, 212, 255, 0.2);
    }

    .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        background: rgba(0, 212, 255, 0.1);
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .code-actions {
        display: flex;
        gap: 0.5rem;
    }

    .code-content {
        background: #1a1a1a;
    }

    .code-content pre {
        margin: 0;
        padding: 1rem;
        overflow-x: auto;
    }

    .code-content code {
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        color: #e6e6e6;
    }

    .code-explanation {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-top: 1px solid rgba(0, 212, 255, 0.1);
    }

    .key-points-list {
        list-style: none;
        padding: 0;
    }

    .key-point {
        padding: 0.5rem 0;
        border-left: 3px solid var(--accent-color);
        padding-left: 1rem;
        margin: 0.5rem 0;
    }

    .section-completion {
        margin-top: 2rem;
        text-align: center;
    }

    .complete-section-btn.completed {
        background: var(--success-color) !important;
        cursor: default;
    }

    .section-navigation-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 212, 255, 0.2);
    }

    .section-indicator {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    /* Exercise styles */
    .exercise-card {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
        border: 1px solid rgba(255, 230, 109, 0.2);
    }

    .exercise-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .exercise-meta {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .exercise-workspace {
        margin: 1rem 0;
    }

    .workspace-tabs {
        display: flex;
        gap: 0;
        margin-bottom: 1rem;
    }

    .workspace-tab {
        padding: 0.75rem 1rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-bottom: none;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .workspace-tab:first-child {
        border-radius: 8px 0 0 0;
    }

    .workspace-tab:last-child {
        border-radius: 0 8px 0 0;
    }

    .workspace-tab.active {
        background: rgba(0, 212, 255, 0.1);
        color: var(--accent-color);
        border-color: var(--accent-color);
    }

    .workspace-content {
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 0 0 8px 8px;
        background: #1a1a1a;
    }

    .workspace-panel {
        display: none;
        padding: 1rem;
    }

    .workspace-panel.active {
        display: block;
    }

    .hints-list {
        padding: 1rem;
    }

    .hint-item {
        margin: 0.5rem 0;
    }

    .hint-toggle {
        background: rgba(255, 230, 109, 0.2);
        border: none;
        color: var(--warning-color);
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        text-align: left;
        transition: all 0.3s ease;
    }

    .hint-toggle:hover {
        background: rgba(255, 230, 109, 0.3);
    }

    .hint-content {
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 0 0 6px 6px;
        margin-top: 0.5rem;
    }

    .hint-content.hidden {
        display: none;
    }

    /* Quiz styles */
    .quiz-interface {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
    }

    .quiz-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .quiz-progress-bar {
        width: 200px;
        height: 6px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        margin-top: 0.5rem;
    }

    .quiz-progress-fill {
        height: 100%;
        background: var(--accent-color);
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .quiz-timer {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .timer-warning {
        color: var(--warning-color) !important;
    }

    .timer-critical {
        color: var(--danger-color) !important;
        animation: timerPulse 1s infinite;
    }

    .quiz-question {
        margin: 2rem 0;
    }

    .question-text {
        font-size: 1.2rem;
        margin-bottom: 1.5rem;
        color: var(--text-primary);
    }

    .question-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .quiz-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border: 2px solid rgba(0, 212, 255, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .quiz-option:hover {
        background: rgba(0, 212, 255, 0.1);
        border-color: var(--accent-color);
    }

    .quiz-option input[type="radio"] {
        width: 20px;
        height: 20px;
    }

    .quiz-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 212, 255, 0.2);
    }

    /* Quiz results */
    .quiz-results {
        text-align: center;
        padding: 2rem;
    }

    .results-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    .results-score {
        font-size: 3rem;
        font-weight: 700;
        margin: 1rem 0;
    }

    .results-score.passed {
        color: var(--success-color);
    }

    .results-score.failed {
        color: var(--danger-color);
    }

    .results-details {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
        text-align: left;
    }

    .result-stat {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(0, 212, 255, 0.1);
    }

    .stat-value.passed {
        color: var(--success-color);
    }

    .stat-value.failed {
        color: var(--danger-color);
    }

    /* Answer review */
    .reviewed-question {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        margin: 1rem 0;
        border-left: 4px solid var(--text-muted);
    }

    .reviewed-question.correct {
        border-left-color: var(--success-color);
    }

    .reviewed-question.incorrect {
        border-left-color: var(--danger-color);
    }

    .question-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .question-result.correct {
        color: var(--success-color);
    }

    .question-result.incorrect {
        color: var(--danger-color);
    }

    .answer-comparison {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
    }

    .user-answer, .correct-answer {
        margin: 0.5rem 0;
    }

    .user-answer .correct,
    .correct-answer .correct {
        color: var(--success-color);
    }

    .user-answer .incorrect {
        color: var(--danger-color);
    }

    /* Notes editor */
    .notes-editor {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(0, 212, 255, 0.2);
    }

    .editor-toolbar {
        display: flex;
        gap: 0.5rem;
        padding: 1rem;
        background: rgba(0, 212, 255, 0.1);
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    }

    .editor-btn {
        padding: 0.5rem;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.2);
        border-radius: 4px;
        color: var(--text-primary);
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
        min-width: 40px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .editor-btn:hover {
        background: rgba(0, 212, 255, 0.2);
        border-color: var(--accent-color);
    }

    .editor-separator {
        width: 1px;
        background: rgba(0, 212, 255, 0.2);
        margin: 0 0.5rem;
    }

    .notes-textarea {
        width: 100%;
        min-height: 200px;
        padding: 1rem;
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-family: inherit;
        font-size: 1rem;
        line-height: 1.6;
        resize: vertical;
        outline: none;
    }

    .notes-footer {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.2);
        font-size: 0.8rem;
        color: var(--text-muted);
    }

    /* Sidebar */
    .concept-sidebar {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        padding: 1.5rem;
        height: fit-content;
        max-height: 70vh;
        overflow-y: auto;
    }

    .sidebar-section {
        margin-bottom: 2rem;
    }

    .sidebar-section h4 {
        color: var(--accent-color);
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    .toc-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .toc-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        text-decoration: none;
        color: var(--text-secondary);
        border-radius: 6px;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .toc-item:hover {
        background: rgba(0, 212, 255, 0.1);
        color: var(--text-primary);
    }

    .toc-number {
        width: 20px;
        font-weight: 600;
        color: var(--accent-color);
    }

    .toc-title {
        flex: 1;
    }

    .toc-status.completed {
        color: var(--success-color);
    }

    .progress-summary {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        padding: 1rem;
    }

    .progress-item {
        display: flex;
        justify-content: space-between;
        margin: 0.5rem 0;
        font-size: 0.9rem;
    }

    .progress-value {
        color: var(--accent-color);
        font-weight: 600;
    }

    .related-concepts {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .related-concept-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
        text-decoration: none;
        color: var(--text-secondary);
        transition: all 0.3s ease;
        font-size: 0.9rem;
    }

    .related-concept-link:hover {
        background: rgba(0, 212, 255, 0.1);
        color: var(--text-primary);
    }

    .related-icon {
        font-size: 1.2rem;
    }

    /* Animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes timerPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }

    @keyframes celebrationPop {
        0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }

    /* Responsive design */
    @media (max-width: 1024px) {
        .concept-viewer-container {
            grid-template-columns: 1fr;
        }

        .concept-sidebar {
            order: -1;
            max-height: none;
            margin-bottom: 1rem;
        }
    }

    @media (max-width: 768px) {
        .concept-meta-info {
            flex-direction: column;
            gap: 1rem;
        }

        .concept-badges {
            order: 2;
        }

        .sections-list {
            flex-direction: column;
        }

        .section-nav-item {
            justify-content: space-between;
        }

        .quiz-header {
            flex-direction: column;
            gap: 1rem;
        }

        .editor-toolbar {
            flex-wrap: wrap;
        }

        .quiz-navigation {
            flex-direction: column;
            gap: 1rem;
        }

        .results-details {
            padding: 1rem;
        }
    }
`;
document.head.appendChild(conceptViewerStyles);

// Create singleton instance
const ConceptViewer = ConceptViewer.getInstance();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ConceptViewer = ConceptViewer;
}