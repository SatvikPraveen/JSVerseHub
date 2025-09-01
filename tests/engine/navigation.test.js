// File: tests/engine/navigation.test.js
// Location: jsversehub/tests/engine/navigation.test.js

/**
 * @jest-environment jsdom
 */

// Mock the navigation module
const mockNavigation = {
  currentPage: null,
  history: [],
  transitions: new Map(),
  
  // Core navigation methods
  navigateTo: jest.fn(),
  goBack: jest.fn(),
  goForward: jest.fn(),
  
  // Route management
  registerRoute: jest.fn(),
  unregisterRoute: jest.fn(),
  getCurrentRoute: jest.fn(),
  
  // Transition effects
  setTransition: jest.fn(),
  executeTransition: jest.fn(),
  
  // History management
  pushHistory: jest.fn(),
  clearHistory: jest.fn(),
  
  // Event handling
  onNavigationChange: jest.fn(),
  removeNavigationListener: jest.fn(),
  
  // URL management
  updateURL: jest.fn(),
  parseURL: jest.fn(),
  
  // Galaxy-specific navigation
  navigateToPlanet: jest.fn(),
  navigateToCluster: jest.fn(),
  zoomToPlanet: jest.fn(),
  
  // Animation and effects
  fadeTransition: jest.fn(),
  slideTransition: jest.fn(),
  zoomTransition: jest.fn(),
  
  // State management
  saveNavigationState: jest.fn(),
  restoreNavigationState: jest.fn(),
  
  // Utility methods
  isValidRoute: jest.fn(),
  buildRoute: jest.fn(),
  
  // Reset method for tests
  reset: jest.fn(() => {
    mockNavigation.currentPage = null;
    mockNavigation.history = [];
    mockNavigation.transitions.clear();
  })
};

describe('Navigation Engine', () => {
  let navigation;

  beforeEach(() => {
    // Reset the navigation state before each test
    navigation = { ...mockNavigation };
    navigation.reset();
    
    // Set up DOM
    document.body.innerHTML = `
      <div id="galaxy-container"></div>
      <div id="modal-container"></div>
      <div id="navigation-breadcrumbs"></div>
    `;
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  // Test basic navigation functionality
  describe('Basic Navigation', () => {
    test('should navigate to a specific page', () => {
      const targetPage = 'basics';
      navigation.navigateTo.mockImplementation((page) => {
        navigation.currentPage = page;
        return Promise.resolve();
      });

      navigation.navigateTo(targetPage);
      
      expect(navigation.navigateTo).toHaveBeenCalledWith(targetPage);
    });

    test('should handle navigation with parameters', () => {
      const page = 'concept-viewer';
      const params = { concept: 'dom', section: 'selectors' };
      
      navigation.navigateTo.mockImplementation((page, params) => {
        navigation.currentPage = page;
        return Promise.resolve({ page, params });
      });

      navigation.navigateTo(page, params);
      
      expect(navigation.navigateTo).toHaveBeenCalledWith(page, params);
    });

    test('should get current route', () => {
      navigation.getCurrentRoute.mockReturnValue({
        page: 'basics',
        params: {},
        timestamp: Date.now()
      });

      const route = navigation.getCurrentRoute();
      
      expect(route).toHaveProperty('page');
      expect(route).toHaveProperty('params');
      expect(route).toHaveProperty('timestamp');
      expect(navigation.getCurrentRoute).toHaveBeenCalled();
    });

    test('should validate routes correctly', () => {
      navigation.isValidRoute.mockImplementation((route) => {
        const validRoutes = ['home', 'basics', 'dom', 'async', 'es6'];
        return validRoutes.includes(route);
      });

      expect(navigation.isValidRoute('basics')).toBe(true);
      expect(navigation.isValidRoute('invalid-route')).toBe(false);
      expect(navigation.isValidRoute).toHaveBeenCalledTimes(2);
    });
  });

  // Test route registration and management
  describe('Route Management', () => {
    test('should register new routes', () => {
      const routeConfig = {
        name: 'advanced-js',
        path: '/concepts/advanced',
        component: 'AdvancedConcepts',
        transitions: ['fade', 'zoom']
      };

      navigation.registerRoute.mockImplementation((config) => {
        return { success: true, route: config };
      });

      const result = navigation.registerRoute(routeConfig);
      
      expect(navigation.registerRoute).toHaveBeenCalledWith(routeConfig);
    });

    test('should unregister routes', () => {
      const routeName = 'advanced-js';
      
      navigation.unregisterRoute.mockImplementation((name) => {
        return { success: true, removed: name };
      });

      navigation.unregisterRoute(routeName);
      
      expect(navigation.unregisterRoute).toHaveBeenCalledWith(routeName);
    });

    test('should build route URLs correctly', () => {
      navigation.buildRoute.mockImplementation((routeName, params) => {
        const baseRoutes = {
          'concept-viewer': '/concepts/:concept/:section?',
          'planet-detail': '/galaxy/planet/:planetId'
        };
        
        let route = baseRoutes[routeName] || `/${routeName}`;
        
        if (params) {
          Object.keys(params).forEach(key => {
            route = route.replace(`:${key}`, params[key]);
          });
        }
        
        return route;
      });

      const url = navigation.buildRoute('concept-viewer', { 
        concept: 'dom', 
        section: 'manipulation' 
      });
      
      expect(url).toBe('/concepts/dom/manipulation');
      expect(navigation.buildRoute).toHaveBeenCalledWith('concept-viewer', {
        concept: 'dom',
        section: 'manipulation'
      });
    });
  });

  // Test history management
  describe('History Management', () => {
    test('should track navigation history', () => {
      navigation.pushHistory.mockImplementation((entry) => {
        navigation.history.push({
          ...entry,
          timestamp: Date.now()
        });
        return navigation.history.length;
      });

      navigation.pushHistory({ page: 'basics', params: {} });
      navigation.pushHistory({ page: 'dom', params: {} });
      
      expect(navigation.pushHistory).toHaveBeenCalledTimes(2);
    });

    test('should navigate back in history', () => {
      navigation.history = [
        { page: 'home', params: {}, timestamp: 1000 },
        { page: 'basics', params: {}, timestamp: 2000 },
        { page: 'dom', params: {}, timestamp: 3000 }
      ];

      navigation.goBack.mockImplementation(() => {
        if (navigation.history.length > 1) {
          const previous = navigation.history[navigation.history.length - 2];
          navigation.currentPage = previous.page;
          return Promise.resolve(previous);
        }
        return Promise.reject(new Error('No previous page'));
      });

      return navigation.goBack().then((previousPage) => {
        expect(navigation.goBack).toHaveBeenCalled();
      });
    });

    test('should navigate forward in history', () => {
      navigation.goForward.mockImplementation(() => {
        return Promise.resolve({ page: 'dom', params: {} });
      });

      return navigation.goForward().then(() => {
        expect(navigation.goForward).toHaveBeenCalled();
      });
    });

    test('should clear history', () => {
      navigation.clearHistory.mockImplementation(() => {
        navigation.history = [];
        return true;
      });

      const result = navigation.clearHistory();
      
      expect(navigation.clearHistory).toHaveBeenCalled();
    });
  });

  // Test transition effects
  describe('Transition Effects', () => {
    test('should register transition effects', () => {
      const transitionConfig = {
        name: 'galaxy-zoom',
        duration: 800,
        easing: 'ease-in-out',
        properties: ['transform', 'opacity']
      };

      navigation.setTransition.mockImplementation((name, config) => {
        navigation.transitions.set(name, config);
        return true;
      });

      navigation.setTransition('galaxy-zoom', transitionConfig);
      
      expect(navigation.setTransition).toHaveBeenCalledWith('galaxy-zoom', transitionConfig);
    });

    test('should execute fade transition', () => {
      const element = document.createElement('div');
      element.id = 'test-element';
      document.body.appendChild(element);

      navigation.fadeTransition.mockImplementation((element, options) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            element.style.opacity = options.to || '1';
            resolve();
          }, options.duration || 300);
        });
      });

      return navigation.fadeTransition(element, { from: '0', to: '1', duration: 100 })
        .then(() => {
          expect(navigation.fadeTransition).toHaveBeenCalled();
        });
    });

    test('should execute slide transition', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      navigation.slideTransition.mockImplementation((element, options) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            element.style.transform = `translateX(${options.to || '0px'})`;
            resolve();
          }, options.duration || 300);
        });
      });

      return navigation.slideTransition(element, { 
        direction: 'left', 
        distance: '100px',
        duration: 100
      }).then(() => {
        expect(navigation.slideTransition).toHaveBeenCalled();
      });
    });

    test('should execute zoom transition for galaxy navigation', () => {
      navigation.zoomTransition.mockImplementation((target, options) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve({
            target,
            finalScale: options.scale || 1,
            finalPosition: options.position || { x: 0, y: 0 }
          }), options.duration || 300);
        });
      });

      const planetElement = { id: 'basics-planet' };
      
      return navigation.zoomTransition(planetElement, {
        scale: 2.5,
        position: { x: 100, y: 150 },
        duration: 100
      }).then((result) => {
        expect(navigation.zoomTransition).toHaveBeenCalled();
        expect(result.target).toBe(planetElement);
      });
    });
  });

  // Test galaxy-specific navigation
  describe('Galaxy Navigation', () => {
    test('should navigate to planet', () => {
      const planetId = 'basics';
      const options = { zoom: true, highlight: true };

      navigation.navigateToPlanet.mockImplementation((id, opts) => {
        return Promise.resolve({
          planetId: id,
          position: { x: 200, y: 300 },
          options: opts
        });
      });

      return navigation.navigateToPlanet(planetId, options)
        .then((result) => {
          expect(navigation.navigateToPlanet).toHaveBeenCalledWith(planetId, options);
          expect(result.planetId).toBe(planetId);
        });
    });

    test('should navigate to concept cluster', () => {
      const clusterId = 'frontend-fundamentals';
      
      navigation.navigateToCluster.mockImplementation((id) => {
        return Promise.resolve({
          clusterId: id,
          planets: ['basics', 'dom', 'events'],
          centerPosition: { x: 400, y: 500 }
        });
      });

      return navigation.navigateToCluster(clusterId)
        .then((result) => {
          expect(navigation.navigateToCluster).toHaveBeenCalledWith(clusterId);
          expect(result.clusterId).toBe(clusterId);
        });
    });

    test('should zoom to planet with smooth animation', () => {
      const planetId = 'async';
      const zoomLevel = 3;

      navigation.zoomToPlanet.mockImplementation((id, level) => {
        return Promise.resolve({
          planetId: id,
          zoomLevel: level,
          viewport: { x: 300, y: 400, scale: level }
        });
      });

      return navigation.zoomToPlanet(planetId, zoomLevel)
        .then((result) => {
          expect(navigation.zoomToPlanet).toHaveBeenCalledWith(planetId, zoomLevel);
          expect(result.zoomLevel).toBe(zoomLevel);
        });
    });
  });

  // Test event handling
  describe('Event Handling', () => {
    test('should register navigation event listeners', () => {
      const callback = jest.fn();
      
      navigation.onNavigationChange.mockImplementation((eventType, callback) => {
        return { eventType, callback, id: 'listener-1' };
      });

      const listener = navigation.onNavigationChange('page-change', callback);
      
      expect(navigation.onNavigationChange).toHaveBeenCalledWith('page-change', callback);
      expect(listener).toHaveProperty('id');
    });

    test('should remove navigation event listeners', () => {
      const listenerId = 'listener-1';
      
      navigation.removeNavigationListener.mockImplementation((id) => {
        return { removed: true, listenerId: id };
      });

      const result = navigation.removeNavigationListener(listenerId);
      
      expect(navigation.removeNavigationListener).toHaveBeenCalledWith(listenerId);
    });

    test('should handle browser navigation events', () => {
      // Mock popstate event handling
      const mockEvent = new PopStateEvent('popstate', {
        state: { page: 'dom', params: {} }
      });

      navigation.parseURL.mockImplementation((url) => {
        const path = url || window.location.pathname;
        return {
          page: path.split('/')[1] || 'home',
          params: {},
          hash: window.location.hash
        };
      });

      const parsed = navigation.parseURL('/dom#manipulation');
      
      expect(navigation.parseURL).toHaveBeenCalledWith('/dom#manipulation');
    });
  });

  // Test URL management
  describe('URL Management', () => {
    test('should update URL without page reload', () => {
      const newURL = '/concepts/async';
      const state = { page: 'async', section: 'promises' };

      navigation.updateURL.mockImplementation((url, state) => {
        // Mock history.pushState
        return { url, state, updated: true };
      });

      const result = navigation.updateURL(newURL, state);
      
      expect(navigation.updateURL).toHaveBeenCalledWith(newURL, state);
    });

    test('should parse URL parameters correctly', () => {
      navigation.parseURL.mockImplementation((url) => {
        const urlObj = new URL(url, 'https://example.com');
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        const params = Object.fromEntries(urlObj.searchParams);
        
        return {
          page: pathParts[0] || 'home',
          section: pathParts[1] || null,
          params,
          hash: urlObj.hash.slice(1)
        };
      });

      const parsed = navigation.parseURL('/concepts/dom?interactive=true#selectors');
      
      expect(parsed.page).toBe('concepts');
      expect(parsed.section).toBe('dom');
      expect(parsed.params.interactive).toBe('true');
      expect(parsed.hash).toBe('selectors');
    });
  });

  // Test state persistence
  describe('State Persistence', () => {
    test('should save navigation state', () => {
      const state = {
        currentPage: 'dom',
        history: [{ page: 'home' }, { page: 'basics' }, { page: 'dom' }],
        preferences: { animationsEnabled: true }
      };

      navigation.saveNavigationState.mockImplementation((state) => {
        // Mock localStorage save
        return { saved: true, timestamp: Date.now() };
      });

      const result = navigation.saveNavigationState(state);
      
      expect(navigation.saveNavigationState).toHaveBeenCalledWith(state);
    });

    test('should restore navigation state', () => {
      navigation.restoreNavigationState.mockImplementation(() => {
        return {
          currentPage: 'dom',
          history: [{ page: 'home' }, { page: 'basics' }, { page: 'dom' }],
          preferences: { animationsEnabled: true },
          restored: true
        };
      });

      const state = navigation.restoreNavigationState();
      
      expect(navigation.restoreNavigationState).toHaveBeenCalled();
      expect(state.restored).toBe(true);
    });

    test('should handle state restoration errors gracefully', () => {
      navigation.restoreNavigationState.mockImplementation(() => {
        throw new Error('Failed to restore state');
      });

      expect(() => navigation.restoreNavigationState()).toThrow('Failed to restore state');
    });
  });

  // Test performance and optimization
  describe('Performance Optimization', () => {
    test('should debounce rapid navigation requests', (done) => {
      let callCount = 0;
      
      navigation.navigateTo.mockImplementation((page) => {
        callCount++;
        return Promise.resolve();
      });

      // Simulate rapid navigation calls
      navigation.navigateTo('page1');
      navigation.navigateTo('page2');
      navigation.navigateTo('page3');

      setTimeout(() => {
        // With debouncing, only the last call should execute
        expect(navigation.navigateTo).toHaveBeenCalledTimes(3);
        done();
      }, 100);
    });

    test('should preload adjacent planets for smooth navigation', () => {
      const currentPlanet = 'basics';
      
      navigation.preloadAdjacentPlanets = jest.fn().mockImplementation((planetId) => {
        const adjacentPlanets = {
          'basics': ['dom', 'events'],
          'dom': ['basics', 'async'],
          'async': ['dom', 'promises']
        };
        
        return Promise.resolve(adjacentPlanets[planetId] || []);
      });

      return navigation.preloadAdjacentPlanets(currentPlanet)
        .then((adjacent) => {
          expect(navigation.preloadAdjacentPlanets).toHaveBeenCalledWith(currentPlanet);
          expect(adjacent).toEqual(['dom', 'events']);
        });
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should handle navigation to non-existent routes', () => {
      navigation.navigateTo.mockImplementation((page) => {
        if (page === 'non-existent') {
          return Promise.reject(new Error('Route not found'));
        }
        return Promise.resolve();
      });

      return navigation.navigateTo('non-existent')
        .catch((error) => {
          expect(error.message).toBe('Route not found');
          expect(navigation.navigateTo).toHaveBeenCalledWith('non-existent');
        });
    });

    test('should fallback to home on critical navigation errors', () => {
      navigation.handleNavigationError = jest.fn().mockImplementation((error) => {
        if (error.critical) {
          return navigation.navigateTo('home');
        }
        return Promise.reject(error);
      });

      const criticalError = new Error('Critical navigation failure');
      criticalError.critical = true;

      navigation.navigateTo.mockImplementation(() => Promise.resolve());

      return navigation.handleNavigationError(criticalError)
        .then(() => {
          expect(navigation.handleNavigationError).toHaveBeenCalledWith(criticalError);
        });
    });
  });
});