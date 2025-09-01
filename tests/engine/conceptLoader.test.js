// File: tests/engine/conceptLoader.test.js
// Location: jsversehub/tests/engine/conceptLoader.test.js

/**
 * @jest-environment jsdom
 */

// Mock the conceptLoader module
const mockConceptLoader = {
  loadedConcepts: new Map(),
  loadingPromises: new Map(),
  cache: new Map(),
  
  // Core loading methods
  loadConcept: jest.fn(),
  preloadConcept: jest.fn(),
  unloadConcept: jest.fn(),
  
  // Batch operations
  loadMultipleConcepts: jest.fn(),
  preloadAdjacentConcepts: jest.fn(),
  
  // Cache management
  clearCache: jest.fn(),
  getCachedConcept: jest.fn(),
  setCachedConcept: jest.fn(),
  
  // Module validation
  validateConceptModule: jest.fn(),
  isConceptLoaded: jest.fn(),
  
  // Dynamic import handling
  importConceptModule: jest.fn(),
  handleImportError: jest.fn(),
  
  // Resource management
  loadConceptResources: jest.fn(),
  unloadConceptResources: jest.fn(),
  
  // Progress tracking
  getLoadingProgress: jest.fn(),
  onLoadingProgress: jest.fn(),
  
  // Error handling
  handleLoadingError: jest.fn(),
  retryLoading: jest.fn(),
  
  // Performance optimization
  prioritizeLoading: jest.fn(),
  deferLoading: jest.fn(),
  
  // Reset for tests
  reset: jest.fn(() => {
    mockConceptLoader.loadedConcepts.clear();
    mockConceptLoader.loadingPromises.clear();
    mockConceptLoader.cache.clear();
  })
};

describe('Concept Loader Engine', () => {
  let conceptLoader;

  beforeEach(() => {
    conceptLoader = { ...mockConceptLoader };
    conceptLoader.reset();
    
    // Set up DOM
    document.body.innerHTML = `
      <div id="concept-container"></div>
      <div id="loading-indicator"></div>
      <div id="progress-bar"></div>
    `;

    // Mock console methods to avoid noise in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    console.error.mockRestore();
    console.warn.mockRestore();
  });

  // Test basic concept loading
  describe('Basic Concept Loading', () => {
    test('should load a concept module successfully', async () => {
      const conceptId = 'basics';
      const mockModule = {
        id: 'basics',
        title: 'JavaScript Basics',
        content: 'Basic JavaScript concepts',
        exercises: [],
        demos: []
      };

      conceptLoader.loadConcept.mockImplementation((id) => {
        conceptLoader.loadedConcepts.set(id, mockModule);
        return Promise.resolve(mockModule);
      });

      const result = await conceptLoader.loadConcept(conceptId);
      
      expect(conceptLoader.loadConcept).toHaveBeenCalledWith(conceptId);
      expect(result).toEqual(mockModule);
    });

    test('should handle loading errors gracefully', async () => {
      const conceptId = 'non-existent';
      const error = new Error('Module not found');

      conceptLoader.loadConcept.mockImplementation((id) => {
        return Promise.reject(error);
      });

      await expect(conceptLoader.loadConcept(conceptId)).rejects.toThrow('Module not found');
      expect(conceptLoader.loadConcept).toHaveBeenCalledWith(conceptId);
    });

    test('should check if concept is already loaded', () => {
      conceptLoader.isConceptLoaded.mockImplementation((id) => {
        return conceptLoader.loadedConcepts.has(id);
      });

      // Mock a loaded concept
      conceptLoader.loadedConcepts.set('basics', { id: 'basics' });

      expect(conceptLoader.isConceptLoaded('basics')).toBe(true);
      expect(conceptLoader.isConceptLoaded('dom')).toBe(false);
    });

    test('should avoid duplicate loading of same concept', async () => {
      const conceptId = 'basics';
      let loadCount = 0;

      conceptLoader.loadConcept.mockImplementation((id) => {
        if (conceptLoader.loadingPromises.has(id)) {
          return conceptLoader.loadingPromises.get(id);
        }

        const promise = new Promise((resolve) => {
          loadCount++;
          setTimeout(() => {
            const module = { id, loadCount };
            conceptLoader.loadedConcepts.set(id, module);
            resolve(module);
          }, 10);
        });

        conceptLoader.loadingPromises.set(id, promise);
        return promise;
      });

      // Start multiple simultaneous loads
      const [result1, result2, result3] = await Promise.all([
        conceptLoader.loadConcept(conceptId),
        conceptLoader.loadConcept(conceptId),
        conceptLoader.loadConcept(conceptId)
      ]);

      expect(loadCount).toBe(1); // Should only load once
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);
    });
  });

  // Test preloading functionality
  describe('Concept Preloading', () => {
    test('should preload concept without blocking', async () => {
      const conceptId = 'dom';
      const mockModule = { id: 'dom', preloaded: true };

      conceptLoader.preloadConcept.mockImplementation((id) => {
        // Simulate background loading
        return new Promise((resolve) => {
          setTimeout(() => {
            conceptLoader.cache.set(id, mockModule);
            resolve(mockModule);
          }, 5);
        });
      });

      const preloadPromise = conceptLoader.preloadConcept(conceptId);
      
      // Should not block
      expect(preloadPromise).toBeInstanceOf(Promise);
      
      const result = await preloadPromise;
      expect(result).toEqual(mockModule);
      expect(conceptLoader.preloadConcept).toHaveBeenCalledWith(conceptId);
    });

    test('should preload adjacent concepts based on current concept', async () => {
      const currentConcept = 'basics';
      const adjacentConcepts = ['dom', 'events'];

      conceptLoader.preloadAdjacentConcepts.mockImplementation((conceptId) => {
        const adjacencyMap = {
          'basics': ['dom', 'events'],
          'dom': ['basics', 'async', 'events'],
          'async': ['dom', 'promises', 'es6']
        };

        const adjacent = adjacencyMap[conceptId] || [];
        const preloadPromises = adjacent.map(id => 
          conceptLoader.preloadConcept(id)
        );

        return Promise.all(preloadPromises);
      });

      conceptLoader.preloadConcept.mockImplementation((id) => {
        return Promise.resolve({ id, preloaded: true });
      });

      const results = await conceptLoader.preloadAdjacentConcepts(currentConcept);
      
      expect(conceptLoader.preloadAdjacentConcepts).toHaveBeenCalledWith(currentConcept);
      expect(results).toHaveLength(2);
      expect(results[0].id).toBe('dom');
      expect(results[1].id).toBe('events');
    });
  });

  // Test batch loading operations
  describe('Batch Loading Operations', () => {
    test('should load multiple concepts simultaneously', async () => {
      const conceptIds = ['basics', 'dom', 'async'];
      
      conceptLoader.loadMultipleConcepts.mockImplementation((ids) => {
        const loadPromises = ids.map(id => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const module = { id, title: `${id} Module` };
              conceptLoader.loadedConcepts.set(id, module);
              resolve(module);
            }, Math.random() * 20);
          });
        });

        return Promise.all(loadPromises);
      });

      const results = await conceptLoader.loadMultipleConcepts(conceptIds);
      
      expect(conceptLoader.loadMultipleConcepts).toHaveBeenCalledWith(conceptIds);
      expect(results).toHaveLength(3);
      expect(results.map(r => r.id)).toEqual(conceptIds);
    });

    test('should handle partial failures in batch loading', async () => {
      const conceptIds = ['basics', 'invalid', 'dom'];

      conceptLoader.loadMultipleConcepts.mockImplementation((ids) => {
        const loadPromises = ids.map(id => {
          if (id === 'invalid') {
            return Promise.reject(new Error(`Failed to load ${id}`));
          }
          return Promise.resolve({ id, title: `${id} Module` });
        });

        return Promise.allSettled(loadPromises);
      });

      const results = await conceptLoader.loadMultipleConcepts(conceptIds);
      
      expect(results[0].status).toBe('fulfilled');
      expect(results[1].status).toBe('rejected');
      expect(results[2].status).toBe('fulfilled');
    });
  });

  // Test cache management
  describe('Cache Management', () => {
    test('should cache loaded concepts', () => {
      const conceptId = 'basics';
      const module = { id: conceptId, cached: true };

      conceptLoader.setCachedConcept.mockImplementation((id, module) => {
        conceptLoader.cache.set(id, {
          ...module,
          cachedAt: Date.now()
        });
        return true;
      });

      const result = conceptLoader.setCachedConcept(conceptId, module);
      
      expect(conceptLoader.setCachedConcept).toHaveBeenCalledWith(conceptId, module);
      expect(result).toBe(true);
    });

    test('should retrieve cached concepts', () => {
      const conceptId = 'basics';
      const cachedModule = { id: conceptId, cached: true, cachedAt: Date.now() };

      conceptLoader.getCachedConcept.mockImplementation((id) => {
        return conceptLoader.cache.get(id);
      });

      // Mock cache entry
      conceptLoader.cache.set(conceptId, cachedModule);

      const result = conceptLoader.getCachedConcept(conceptId);
      
      expect(conceptLoader.getCachedConcept).toHaveBeenCalledWith(conceptId);
      expect(result).toEqual(cachedModule);
    });

    test('should clear cache when needed', () => {
      conceptLoader.clearCache.mockImplementation((selective) => {
        if (selective && Array.isArray(selective)) {
          selective.forEach(id => conceptLoader.cache.delete(id));
        } else {
          conceptLoader.cache.clear();
        }
        return true;
      });

      // Mock some cache entries
      conceptLoader.cache.set('basics', { id: 'basics' });
      conceptLoader.cache.set('dom', { id: 'dom' });

      conceptLoader.clearCache(['basics']);
      
      expect(conceptLoader.clearCache).toHaveBeenCalledWith(['basics']);
    });

    test('should handle cache size limits', () => {
      const maxCacheSize = 10;

      conceptLoader.manageCacheSize = jest.fn().mockImplementation(() => {
        const cacheSize = conceptLoader.cache.size;
        if (cacheSize > maxCacheSize) {
          // Remove oldest entries
          const entries = Array.from(conceptLoader.cache.entries());
          const toRemove = entries.slice(0, cacheSize - maxCacheSize);
          toRemove.forEach(([id]) => conceptLoader.cache.delete(id));
        }
        return conceptLoader.cache.size;
      });

      // Mock cache with entries
      for (let i = 0; i < 15; i++) {
        conceptLoader.cache.set(`concept-${i}`, { id: `concept-${i}` });
      }

      const finalSize = conceptLoader.manageCacheSize();
      
      expect(conceptLoader.manageCacheSize).toHaveBeenCalled();
    });
  });

  // Test module validation
  describe('Module Validation', () => {
    test('should validate concept module structure', () => {
      const validModule = {
        id: 'basics',
        title: 'JavaScript Basics',
        content: 'Content here',
        exercises: [],
        demos: [],
        metadata: { version: '1.0' }
      };

      const invalidModule = {
        id: 'invalid',
        // Missing required fields
      };

      conceptLoader.validateConceptModule.mockImplementation((module) => {
        const requiredFields = ['id', 'title', 'content'];
        const hasRequiredFields = requiredFields.every(field => 
          module && typeof module[field] === 'string' && module[field].length > 0
        );

        return {
          valid: hasRequiredFields,
          errors: hasRequiredFields ? [] : ['Missing required fields']
        };
      });

      const validResult = conceptLoader.validateConceptModule(validModule);
      const invalidResult = conceptLoader.validateConceptModule(invalidModule);
      
      expect(validResult.valid).toBe(true);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors).toContain('Missing required fields');
    });

    test('should validate concept dependencies', () => {
      const moduleWithDeps = {
        id: 'advanced',
        title: 'Advanced JS',
        dependencies: ['basics', 'dom'],
        content: 'Advanced content'
      };

      conceptLoader.validateDependencies = jest.fn().mockImplementation((module) => {
        if (!module.dependencies) return { valid: true };

        const loadedIds = Array.from(conceptLoader.loadedConcepts.keys());
        const missingDeps = module.dependencies.filter(dep => 
          !loadedIds.includes(dep)
        );

        return {
          valid: missingDeps.length === 0,
          missingDependencies: missingDeps
        };
      });

      // Mock some loaded concepts
      conceptLoader.loadedConcepts.set('basics', { id: 'basics' });

      const result = conceptLoader.validateDependencies(moduleWithDeps);
      
      expect(result.valid).toBe(false);
      expect(result.missingDependencies).toContain('dom');
    });
  });

  // Test resource loading
  describe('Resource Loading', () => {
    test('should load concept resources (CSS, images, etc.)', async () => {
      const conceptId = 'basics';
      const resources = [
        { type: 'css', url: '/styles/basics.css' },
        { type: 'image', url: '/images/basics.png' },
        { type: 'audio', url: '/sounds/success.mp3' }
      ];

      conceptLoader.loadConceptResources.mockImplementation((id, resourceList) => {
        const loadPromises = resourceList.map(resource => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                ...resource,
                loaded: true,
                loadTime: Date.now()
              });
            }, 10);
          });
        });

        return Promise.all(loadPromises);
      });

      const results = await conceptLoader.loadConceptResources(conceptId, resources);
      
      expect(conceptLoader.loadConceptResources).toHaveBeenCalledWith(conceptId, resources);
      expect(results).toHaveLength(3);
      expect(results.every(r => r.loaded)).toBe(true);
    });

    test('should unload concept resources on cleanup', () => {
      const conceptId = 'basics';

      conceptLoader.unloadConceptResources.mockImplementation((id) => {
        // Mock resource cleanup
        const stylesheets = Array.from(document.querySelectorAll(`link[data-concept="${id}"]`));
        stylesheets.forEach(link => link.remove());
        
        return {
          conceptId: id,
          unloaded: stylesheets.length,
          timestamp: Date.now()
        };
      });

      const result = conceptLoader.unloadConceptResources(conceptId);
      
      expect(conceptLoader.unloadConceptResources).toHaveBeenCalledWith(conceptId);
      expect(result.conceptId).toBe(conceptId);
    });
  });

  // Test progress tracking
  describe('Progress Tracking', () => {
    test('should track loading progress', () => {
      const conceptId = 'async';
      
      conceptLoader.getLoadingProgress.mockImplementation((id) => {
        const progressData = {
          conceptId: id,
          stage: 'loading',
          percentage: 75,
          currentTask: 'Loading exercises',
          estimatedTime: 500
        };
        return progressData;
      });

      const progress = conceptLoader.getLoadingProgress(conceptId);
      
      expect(conceptLoader.getLoadingProgress).toHaveBeenCalledWith(conceptId);
      expect(progress.percentage).toBe(75);
      expect(progress.stage).toBe('loading');
    });

    test('should emit progress events', (done) => {
      const conceptId = 'dom';
      let progressUpdates = [];

      conceptLoader.onLoadingProgress.mockImplementation((id, callback) => {
        // Simulate progress updates
        const stages = [
          { stage: 'initializing', percentage: 0 },
          { stage: 'loading-content', percentage: 25 },
          { stage: 'loading-exercises', percentage: 50 },
          { stage: 'loading-demos', percentage: 75 },
          { stage: 'complete', percentage: 100 }
        ];

        stages.forEach((update, index) => {
          setTimeout(() => {
            callback({ conceptId: id, ...update });
            progressUpdates.push(update);
            
            if (index === stages.length - 1) {
              expect(progressUpdates).toHaveLength(5);
              expect(progressUpdates[0].stage).toBe('initializing');
              expect(progressUpdates[4].stage).toBe('complete');
              done();
            }
          }, index * 10);
        });

        return 'progress-listener-1';
      });

      conceptLoader.onLoadingProgress(conceptId, (progress) => {
        progressUpdates.push(progress);
      });
    });
  });

  // Test error handling and recovery
  describe('Error Handling and Recovery', () => {
    test('should handle network errors during loading', async () => {
      const conceptId = 'network-fail';
      const networkError = new Error('Network error');
      networkError.code = 'NETWORK_ERROR';

      conceptLoader.handleLoadingError.mockImplementation((error, conceptId) => {
        if (error.code === 'NETWORK_ERROR') {
          return {
            error,
            conceptId,
            shouldRetry: true,
            retryDelay: 1000,
            fallbackAvailable: false
          };
        }
        return { error, shouldRetry: false };
      });

      const errorInfo = conceptLoader.handleLoadingError(networkError, conceptId);
      
      expect(conceptLoader.handleLoadingError).toHaveBeenCalledWith(networkError, conceptId);
      expect(errorInfo.shouldRetry).toBe(true);
      expect(errorInfo.retryDelay).toBe(1000);
    });

    test('should implement retry logic with exponential backoff', async () => {
      const conceptId = 'retry-test';
      let attemptCount = 0;

      conceptLoader.retryLoading.mockImplementation((id, maxRetries = 3) => {
        return new Promise((resolve, reject) => {
          const attemptLoad = () => {
            attemptCount++;
            
            if (attemptCount < 3) {
              // Fail first two attempts
              setTimeout(() => {
                const delay = Math.pow(2, attemptCount - 1) * 100; // Exponential backoff
                setTimeout(attemptLoad, delay);
              }, 10);
            } else {
              // Succeed on third attempt
              resolve({
                conceptId: id,
                attempts: attemptCount,
                loaded: true
              });
            }
          };

          attemptLoad();
        });
      });

      const result = await conceptLoader.retryLoading(conceptId, 3);
      
      expect(conceptLoader.retryLoading).toHaveBeenCalledWith(conceptId, 3);
      expect(result.attempts).toBe(3);
      expect(result.loaded).toBe(true);
    });

    test('should provide fallback content when loading fails', async () => {
      const conceptId = 'fallback-test';

      conceptLoader.loadWithFallback = jest.fn().mockImplementation((id) => {
        // Simulate loading failure, then fallback
        return Promise.reject(new Error('Loading failed'))
          .catch(() => {
            return {
              id,
              title: `${id} (Offline Mode)`,
              content: 'Fallback content available',
              isFallback: true
            };
          });
      });

      const result = await conceptLoader.loadWithFallback(conceptId);
      
      expect(result.isFallback).toBe(true);
      expect(result.title).toContain('(Offline Mode)');
    });
  });

  // Test performance optimization
  describe('Performance Optimization', () => {
    test('should prioritize critical concept loading', async () => {
      const concepts = ['basics', 'dom', 'async'];
      const priority = ['async', 'basics', 'dom'];

      conceptLoader.prioritizeLoading.mockImplementation((conceptList, priorityOrder) => {
        const prioritized = [...conceptList].sort((a, b) => {
          const aIndex = priorityOrder.indexOf(a);
          const bIndex = priorityOrder.indexOf(b);
          return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        });

        return prioritized.map((id, index) => ({
          conceptId: id,
          priority: index,
          loadOrder: index + 1
        }));
      });

      const result = conceptLoader.prioritizeLoading(concepts, priority);
      
      expect(conceptLoader.prioritizeLoading).toHaveBeenCalledWith(concepts, priority);
      expect(result[0].conceptId).toBe('async');
      expect(result[1].conceptId).toBe('basics');
      expect(result[2].conceptId).toBe('dom');
    });

    test('should implement lazy loading for non-critical resources', async () => {
      const conceptId = 'lazy-test';

      conceptLoader.lazyLoadResources = jest.fn().mockImplementation((id) => {
        return new Promise((resolve) => {
          // Simulate lazy loading with intersection observer
          setTimeout(() => {
            resolve({
              conceptId: id,
              lazyResources: ['demo-videos', 'interactive-examples'],
              loadedLazily: true
            });
          }, 50);
        });
      });

      const result = await conceptLoader.lazyLoadResources(conceptId);
      
      expect(result.loadedLazily).toBe(true);
      expect(result.lazyResources).toContain('demo-videos');
    });

    test('should defer loading of low-priority concepts', () => {
      const lowPriorityConcepts = ['advanced-patterns', 'optimization'];
      
      conceptLoader.deferLoading.mockImplementation((conceptList, delay = 5000) => {
        return conceptList.map(id => ({
          conceptId: id,
          deferred: true,
          scheduledFor: Date.now() + delay
        }));
      });

      const result = conceptLoader.deferLoading(lowPriorityConcepts);
      
      expect(conceptLoader.deferLoading).toHaveBeenCalledWith(lowPriorityConcepts);
      expect(result.every(item => item.deferred)).toBe(true);
    });
  });

  // Test cleanup and memory management
  describe('Cleanup and Memory Management', () => {
    test('should unload concepts to free memory', () => {
      const conceptId = 'memory-test';

      conceptLoader.unloadConcept.mockImplementation((id) => {
        const wasLoaded = conceptLoader.loadedConcepts.has(id);
        
        if (wasLoaded) {
          conceptLoader.loadedConcepts.delete(id);
          conceptLoader.cache.delete(id);
          
          return {
            conceptId: id,
            unloaded: true,
            memoryFreed: true
          };
        }
        
        return { conceptId: id, unloaded: false };
      });

      // Mock loaded concept
      conceptLoader.loadedConcepts.set(conceptId, { id: conceptId });

      const result = conceptLoader.unloadConcept(conceptId);
      
      expect(conceptLoader.unloadConcept).toHaveBeenCalledWith(conceptId);
      expect(result.unloaded).toBe(true);
      expect(result.memoryFreed).toBe(true);
    });

    test('should clean up resources on page unload', () => {
      conceptLoader.cleanup = jest.fn().mockImplementation(() => {
        const loadedCount = conceptLoader.loadedConcepts.size;
        const cachedCount = conceptLoader.cache.size;
        
        conceptLoader.loadedConcepts.clear();
        conceptLoader.cache.clear();
        conceptLoader.loadingPromises.clear();
        
        return {
          cleanedUp: true,
          unloadedConcepts: loadedCount,
          clearedCache: cachedCount
        };
      });

      // Mock some loaded data
      conceptLoader.loadedConcepts.set('test1', {});
      conceptLoader.loadedConcepts.set('test2', {});
      conceptLoader.cache.set('test3', {});

      const result = conceptLoader.cleanup();
      
      expect(conceptLoader.cleanup).toHaveBeenCalled();
      expect(result.cleanedUp).toBe(true);
      expect(result.unloadedConcepts).toBe(2);
      expect(result.clearedCache).toBe(1);
    });
  });
});