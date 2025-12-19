// File: src/concepts/events/event-types.js
// Comprehensive guide to all JavaScript event types

/**
 * Complete catalog of JavaScript events
 */
export const eventCatalog = {
  mouseEvents: {
    title: "Mouse Events",
    events: [
      {
        name: "click",
        description: "Mouse button clicked",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('click', handler);"
      },
      {
        name: "dblclick",
        description: "Mouse button double-clicked",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('dblclick', handler);"
      },
      {
        name: "mousedown",
        description: "Mouse button pressed",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('mousedown', handler);"
      },
      {
        name: "mouseup",
        description: "Mouse button released",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('mouseup', handler);"
      },
      {
        name: "mousemove",
        description: "Mouse pointer moved",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('mousemove', handler);"
      },
      {
        name: "mouseenter",
        description: "Mouse enters element (doesn't bubble)",
        bubbles: false,
        cancelable: false,
        example: "element.addEventListener('mouseenter', handler);"
      },
      {
        name: "mouseleave",
        description: "Mouse leaves element (doesn't bubble)",
        bubbles: false,
        cancelable: false,
        example: "element.addEventListener('mouseleave', handler);"
      },
      {
        name: "mouseover",
        description: "Mouse over element (bubbles)",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('mouseover', handler);"
      },
      {
        name: "mouseout",
        description: "Mouse leaves element (bubbles)",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('mouseout', handler);"
      },
      {
        name: "contextmenu",
        description: "Right-click context menu",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('contextmenu', handler);"
      },
      {
        name: "wheel",
        description: "Mouse wheel scrolled",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('wheel', handler);"
      }
    ]
  },
  
  keyboardEvents: {
    title: "Keyboard Events",
    events: [
      {
        name: "keydown",
        description: "Key pressed down",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('keydown', handler);"
      },
      {
        name: "keyup",
        description: "Key released",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('keyup', handler);"
      },
      {
        name: "keypress",
        description: "Character key pressed (deprecated, use keydown)",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('keypress', handler);"
      }
    ]
  },
  
  formEvents: {
    title: "Form Events",
    events: [
      {
        name: "submit",
        description: "Form submitted",
        bubbles: true,
        cancelable: true,
        example: "form.addEventListener('submit', handler);"
      },
      {
        name: "reset",
        description: "Form reset",
        bubbles: true,
        cancelable: true,
        example: "form.addEventListener('reset', handler);"
      },
      {
        name: "change",
        description: "Input value changed and committed",
        bubbles: true,
        cancelable: false,
        example: "input.addEventListener('change', handler);"
      },
      {
        name: "input",
        description: "Input value changed (fires while typing)",
        bubbles: true,
        cancelable: false,
        example: "input.addEventListener('input', handler);"
      },
      {
        name: "focus",
        description: "Element received focus",
        bubbles: false,
        cancelable: false,
        example: "input.addEventListener('focus', handler);"
      },
      {
        name: "blur",
        description: "Element lost focus",
        bubbles: false,
        cancelable: false,
        example: "input.addEventListener('blur', handler);"
      },
      {
        name: "focusin",
        description: "Element received focus (bubbles)",
        bubbles: true,
        cancelable: false,
        example: "input.addEventListener('focusin', handler);"
      },
      {
        name: "focusout",
        description: "Element lost focus (bubbles)",
        bubbles: true,
        cancelable: false,
        example: "input.addEventListener('focusout', handler);"
      },
      {
        name: "invalid",
        description: "Form validation failed",
        bubbles: true,
        cancelable: true,
        example: "input.addEventListener('invalid', handler);"
      }
    ]
  },
  
  touchEvents: {
    title: "Touch Events (Mobile)",
    events: [
      {
        name: "touchstart",
        description: "Touch begins",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('touchstart', handler);"
      },
      {
        name: "touchmove",
        description: "Touch moves",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('touchmove', handler);"
      },
      {
        name: "touchend",
        description: "Touch ends",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('touchend', handler);"
      },
      {
        name: "touchcancel",
        description: "Touch cancelled",
        bubbles: true,
        cancelable: false,
        example: "element.addEventListener('touchcancel', handler);"
      }
    ]
  },
  
  pointerEvents: {
    title: "Pointer Events (Modern - Mouse, Touch, Pen)",
    events: [
      {
        name: "pointerdown",
        description: "Pointer button pressed",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('pointerdown', handler);"
      },
      {
        name: "pointermove",
        description: "Pointer moved",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('pointermove', handler);"
      },
      {
        name: "pointerup",
        description: "Pointer button released",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('pointerup', handler);"
      },
      {
        name: "pointerenter",
        description: "Pointer enters element",
        bubbles: false,
        cancelable: true,
        example: "element.addEventListener('pointerenter', handler);"
      },
      {
        name: "pointerleave",
        description: "Pointer leaves element",
        bubbles: false,
        cancelable: true,
        example: "element.addEventListener('pointerleave', handler);"
      },
      {
        name: "pointerover",
        description: "Pointer over element (bubbles)",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('pointerover', handler);"
      },
      {
        name: "pointerout",
        description: "Pointer out of element",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('pointerout', handler);"
      }
    ]
  },
  
  documentEvents: {
    title: "Document & Window Events",
    events: [
      {
        name: "load",
        description: "Page and all resources loaded",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('load', handler);"
      },
      {
        name: "DOMContentLoaded",
        description: "DOM tree complete (before resources)",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('DOMContentLoaded', handler);"
      },
      {
        name: "unload",
        description: "Page unloading",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('unload', handler);"
      },
      {
        name: "beforeunload",
        description: "Before page unload (can show prompt)",
        bubbles: false,
        cancelable: true,
        example: "window.addEventListener('beforeunload', handler);"
      },
      {
        name: "scroll",
        description: "Page scrolled",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('scroll', handler);"
      },
      {
        name: "resize",
        description: "Window resized",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('resize', handler);"
      },
      {
        name: "orientationchange",
        description: "Device orientation changed",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('orientationchange', handler);"
      }
    ]
  },
  
  visibilityEvents: {
    title: "Visibility & Storage Events",
    events: [
      {
        name: "visibilitychange",
        description: "Tab visibility changed",
        bubbles: true,
        cancelable: false,
        example: "document.addEventListener('visibilitychange', handler);"
      },
      {
        name: "storage",
        description: "localStorage/sessionStorage changed in other tab",
        bubbles: false,
        cancelable: false,
        example: "window.addEventListener('storage', handler);"
      },
      {
        name: "online",
        description: "Browser came online",
        bubbles: true,
        cancelable: false,
        example: "window.addEventListener('online', handler);"
      },
      {
        name: "offline",
        description: "Browser went offline",
        bubbles: true,
        cancelable: false,
        example: "window.addEventListener('offline', handler);"
      }
    ]
  },
  
  clipboardEvents: {
    title: "Clipboard Events",
    events: [
      {
        name: "copy",
        description: "Content copied to clipboard",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('copy', handler);"
      },
      {
        name: "cut",
        description: "Content cut to clipboard",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('cut', handler);"
      },
      {
        name: "paste",
        description: "Content pasted from clipboard",
        bubbles: true,
        cancelable: true,
        example: "document.addEventListener('paste', handler);"
      }
    ]
  },
  
  dragDropEvents: {
    title: "Drag & Drop Events",
    events: [
      {
        name: "dragstart",
        description: "Drag operation starts",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('dragstart', handler);"
      },
      {
        name: "drag",
        description: "Element being dragged",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('drag', handler);"
      },
      {
        name: "dragend",
        description: "Drag operation ends",
        bubbles: true,
        cancelable: false,
        example: "element.addEventListener('dragend', handler);"
      },
      {
        name: "dragenter",
        description: "Dragged element enters target",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('dragenter', handler);"
      },
      {
        name: "dragover",
        description: "Dragged element over target",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('dragover', handler);"
      },
      {
        name: "dragleave",
        description: "Dragged element leaves target",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('dragleave', handler);"
      },
      {
        name: "drop",
        description: "Dragged element dropped",
        bubbles: true,
        cancelable: true,
        example: "element.addEventListener('drop', handler);"
      }
    ]
  },
  
  mediaEvents: {
    title: "Media Events (Video, Audio)",
    events: [
      {
        name: "play",
        description: "Playback started",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('play', handler);"
      },
      {
        name: "pause",
        description: "Playback paused",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('pause', handler);"
      },
      {
        name: "playing",
        description: "Playback actually playing",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('playing', handler);"
      },
      {
        name: "seeking",
        description: "User seeking",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('seeking', handler);"
      },
      {
        name: "seeked",
        description: "Seeking complete",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('seeked', handler);"
      },
      {
        name: "ended",
        description: "Playback ended",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('ended', handler);"
      },
      {
        name: "loadeddata",
        description: "Current frame loaded",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('loadeddata', handler);"
      },
      {
        name: "loadedmetadata",
        description: "Metadata loaded",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('loadedmetadata', handler);"
      },
      {
        name: "timeupdate",
        description: "Playback time updated",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('timeupdate', handler);"
      },
      {
        name: "volumechange",
        description: "Volume changed",
        bubbles: false,
        cancelable: false,
        example: "video.addEventListener('volumechange', handler);"
      }
    ]
  },
  
  resourceEvents: {
    title: "Resource Events",
    events: [
      {
        name: "load",
        description: "Resource loaded",
        bubbles: false,
        cancelable: false,
        example: "image.addEventListener('load', handler);"
      },
      {
        name: "error",
        description: "Resource failed to load",
        bubbles: false,
        cancelable: false,
        example: "image.addEventListener('error', handler);"
      },
      {
        name: "abort",
        description: "Resource loading aborted",
        bubbles: false,
        cancelable: false,
        example: "image.addEventListener('abort', handler);"
      },
      {
        name: "progress",
        description: "Resource loading progress",
        bubbles: true,
        cancelable: false,
        example: "xhr.addEventListener('progress', handler);"
      }
    ]
  }
};

/**
 * Advanced Event Patterns
 */
export const advancedPatterns = {
  examples: {
    keyboardShortcuts: `
// Implement keyboard shortcuts
const shortcuts = {
  'Ctrl+s': save,
  'Ctrl+z': undo,
  'Ctrl+Shift+z': redo,
  'Escape': cancel
};

document.addEventListener('keydown', (e) => {
  const keys = [];
  if (e.ctrlKey) keys.push('Ctrl');
  if (e.shiftKey) keys.push('Shift');
  if (e.altKey) keys.push('Alt');
  keys.push(e.key);
  
  const shortcut = keys.join('+');
  if (shortcuts[shortcut]) {
    e.preventDefault();
    shortcuts[shortcut]();
  }
});
    `,
    
    dragging: `
// Implement dragging behavior
let isDragging = false;
let startX, startY;

element.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  
  element.style.transform = \`translate(\${dx}px, \${dy}px)\`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
    `,
    
    hoverEffects: `
// Implement hover effects with enter/leave
element.addEventListener('mouseenter', () => {
  element.classList.add('hovered');
  showTooltip();
});

element.addEventListener('mouseleave', () => {
  element.classList.remove('hovered');
  hideTooltip();
});

// Or using hover state tracking
let isHovering = false;

element.addEventListener('mouseenter', () => {
  isHovering = true;
  performAnimation();
});

element.addEventListener('mouseleave', () => {
  isHovering = false;
  reverseAnimation();
});
    `
  }
};

export default {
  catalog: eventCatalog,
  patterns: advancedPatterns
};
