// tests/components.test.js
// Testing JSVerseHub UI Components

describe('Modal Component', () => {
  let modal;
  let container;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div');
    container.id = 'modal-container';
    document.body.appendChild(container);
    
    // Mock Modal class
    modal = {
      show: jest.fn(),
      hide: jest.fn(),
      setContent: jest.fn(),
      setTitle: jest.fn(),
      setFooter: jest.fn()
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create modal with title', () => {
    const title = 'Test Modal';
    modal.setTitle(title);
    expect(modal.setTitle).toHaveBeenCalledWith(title);
  });

  test('should set modal content', () => {
    const content = '<p>Modal content</p>';
    modal.setContent(content);
    expect(modal.setContent).toHaveBeenCalledWith(content);
  });

  test('should show and hide modal', () => {
    modal.show();
    expect(modal.show).toHaveBeenCalled();
    
    modal.hide();
    expect(modal.hide).toHaveBeenCalled();
  });

  test('should set footer content', () => {
    const footer = '<button>OK</button>';
    modal.setFooter(footer);
    expect(modal.setFooter).toHaveBeenCalledWith(footer);
  });

  test('should handle modal close event', () => {
    const onClose = jest.fn();
    modal.onClose = onClose;
    modal.hide();
    expect(modal.hide).toHaveBeenCalled();
  });
});

describe('Navbar Component', () => {
  let navbar;
  let container;

  beforeEach(() => {
    container = document.createElement('nav');
    container.id = 'navbar';
    document.body.appendChild(container);
    
    navbar = {
      addLink: jest.fn(),
      setActive: jest.fn(),
      render: jest.fn(),
      getLinks: jest.fn(() => [])
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should add navigation link', () => {
    const link = { label: 'Home', href: '/' };
    navbar.addLink(link);
    expect(navbar.addLink).toHaveBeenCalledWith(link);
  });

  test('should set active link', () => {
    navbar.setActive('home');
    expect(navbar.setActive).toHaveBeenCalledWith('home');
  });

  test('should render navbar', () => {
    navbar.render();
    expect(navbar.render).toHaveBeenCalled();
  });

  test('should get all links', () => {
    navbar.getLinks();
    expect(navbar.getLinks).toHaveBeenCalled();
  });

  test('should handle responsive design', () => {
    const container = document.getElementById('navbar');
    expect(container).toBeTruthy();
  });
});

describe('GalaxyMap Component', () => {
  let galaxyMap;
  let canvas;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'galaxy-container';
    canvas = document.createElement('canvas');
    canvas.id = 'galaxy-canvas';
    container.appendChild(canvas);
    document.body.appendChild(container);
    
    galaxyMap = {
      render: jest.fn(),
      addPlanet: jest.fn(),
      selectPlanet: jest.fn(),
      zoom: jest.fn(),
      pan: jest.fn(),
      getPlanets: jest.fn(() => []),
      getSelectedPlanet: jest.fn()
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create canvas element', () => {
    const canvas = document.getElementById('galaxy-canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.tagName).toBe('CANVAS');
  });

  test('should add planet to galaxy', () => {
    const planet = { id: 'basics', name: 'Basics' };
    galaxyMap.addPlanet(planet);
    expect(galaxyMap.addPlanet).toHaveBeenCalledWith(planet);
  });

  test('should render galaxy map', () => {
    galaxyMap.render();
    expect(galaxyMap.render).toHaveBeenCalled();
  });

  test('should select planet', () => {
    galaxyMap.selectPlanet('basics');
    expect(galaxyMap.selectPlanet).toHaveBeenCalledWith('basics');
  });

  test('should zoom in and out', () => {
    galaxyMap.zoom(1.2);
    expect(galaxyMap.zoom).toHaveBeenCalledWith(1.2);
  });

  test('should pan galaxy', () => {
    galaxyMap.pan(10, 20);
    expect(galaxyMap.pan).toHaveBeenCalledWith(10, 20);
  });

  test('should get all planets', () => {
    galaxyMap.getPlanets();
    expect(galaxyMap.getPlanets).toHaveBeenCalled();
  });

  test('should get selected planet', () => {
    galaxyMap.getSelectedPlanet();
    expect(galaxyMap.getSelectedPlanet).toHaveBeenCalled();
  });
});

describe('PlanetCard Component', () => {
  let planetCard;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'planet-card';
    document.body.appendChild(container);
    
    planetCard = {
      setPlanet: jest.fn(),
      render: jest.fn(),
      setLocked: jest.fn(),
      setCompleted: jest.fn(),
      onClick: jest.fn()
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should create planet card', () => {
    const planet = { id: 'basics', name: 'JavaScript Basics' };
    planetCard.setPlanet(planet);
    expect(planetCard.setPlanet).toHaveBeenCalledWith(planet);
  });

  test('should render planet card', () => {
    planetCard.render();
    expect(planetCard.render).toHaveBeenCalled();
  });

  test('should set planet as locked', () => {
    planetCard.setLocked(true);
    expect(planetCard.setLocked).toHaveBeenCalledWith(true);
  });

  test('should set planet as completed', () => {
    planetCard.setCompleted(true);
    expect(planetCard.setCompleted).toHaveBeenCalledWith(true);
  });

  test('should handle click event', () => {
    const clickHandler = jest.fn();
    planetCard.onClick = clickHandler;
    planetCard.onClick('basics');
    expect(planetCard.onClick).toHaveBeenCalledWith('basics');
  });

  test('should display planet information', () => {
    const card = document.querySelector('.planet-card');
    expect(card).toBeTruthy();
  });
});

describe('ConceptViewer Component', () => {
  let conceptViewer;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'concept-viewer';
    document.body.appendChild(container);
    
    conceptViewer = {
      loadConcept: jest.fn(),
      showConcept: jest.fn(),
      nextSection: jest.fn(),
      previousSection: jest.fn(),
      submitExercise: jest.fn(),
      bookmarkConcept: jest.fn(),
      getCurrentProgress: jest.fn(() => ({}))
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should load concept', () => {
    conceptViewer.loadConcept('basics');
    expect(conceptViewer.loadConcept).toHaveBeenCalledWith('basics');
  });

  test('should show concept', () => {
    conceptViewer.showConcept('basics');
    expect(conceptViewer.showConcept).toHaveBeenCalledWith('basics');
  });

  test('should navigate to next section', () => {
    conceptViewer.nextSection();
    expect(conceptViewer.nextSection).toHaveBeenCalled();
  });

  test('should navigate to previous section', () => {
    conceptViewer.previousSection();
    expect(conceptViewer.previousSection).toHaveBeenCalled();
  });

  test('should submit exercise', () => {
    const code = 'console.log("hello")';
    conceptViewer.submitExercise(code);
    expect(conceptViewer.submitExercise).toHaveBeenCalledWith(code);
  });

  test('should bookmark concept', () => {
    conceptViewer.bookmarkConcept('basics');
    expect(conceptViewer.bookmarkConcept).toHaveBeenCalledWith('basics');
  });

  test('should track progress', () => {
    const progress = conceptViewer.getCurrentProgress();
    expect(progress).toBeDefined();
  });
});

describe('Component Integration', () => {
  test('Modal should work with other components', () => {
    const modal = { show: jest.fn(), hide: jest.fn() };
    const navbar = { render: jest.fn() };
    
    modal.show();
    navbar.render();
    
    expect(modal.show).toHaveBeenCalled();
    expect(navbar.render).toHaveBeenCalled();
  });

  test('GalaxyMap should communicate with PlanetCard', () => {
    const galaxyMap = { selectPlanet: jest.fn() };
    const planetCard = { onClick: jest.fn() };
    
    planetCard.onClick('basics');
    galaxyMap.selectPlanet('basics');
    
    expect(planetCard.onClick).toHaveBeenCalledWith('basics');
    expect(galaxyMap.selectPlanet).toHaveBeenCalledWith('basics');
  });

  test('ConceptViewer should show in Modal', () => {
    const modal = { show: jest.fn(), setContent: jest.fn() };
    const conceptViewer = { showConcept: jest.fn() };
    
    modal.show();
    modal.setContent('<div id="concept-viewer"></div>');
    conceptViewer.showConcept('basics');
    
    expect(modal.show).toHaveBeenCalled();
    expect(conceptViewer.showConcept).toHaveBeenCalledWith('basics');
  });
});
