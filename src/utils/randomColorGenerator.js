// src/utils/randomColorGenerator.js - Color Generation and Manipulation Utilities

/**
 * RandomColorGenerator - Advanced color generation and manipulation utilities
 * Provides functions for generating colors, gradients, and color schemes
 */

class RandomColorGenerator {
  constructor() {
    // Predefined color palettes for different themes
    this.palettes = {
      galaxy: [
        "#4c1d95",
        "#7c3aed",
        "#a855f7",
        "#c084fc",
        "#ddd6fe",
        "#1e1b4b",
        "#3730a3",
        "#4f46e5",
        "#6366f1",
        "#818cf8",
      ],
      cosmic: [
        "#0f0f23",
        "#16213e",
        "#1a365d",
        "#2d3748",
        "#4a5568",
        "#553c9a",
        "#7c3aed",
        "#9333ea",
        "#a855f7",
        "#c084fc",
      ],
      neon: [
        "#ff0080",
        "#ff0040",
        "#ff4000",
        "#ff8000",
        "#ffbf00",
        "#80ff00",
        "#00ff40",
        "#00ff80",
        "#00ffbf",
        "#0080ff",
      ],
      retro: [
        "#ff6b9d",
        "#ffa8e4",
        "#c7ceea",
        "#a8d8ea",
        "#7fcdcd",
        "#7cc7c7",
        "#82a0bc",
        "#8e94f2",
        "#ada0f2",
        "#d4a5f7",
      ],
      nature: [
        "#2d5016",
        "#3d6b1d",
        "#4d7c24",
        "#5d8d2b",
        "#6d9e32",
        "#7daf39",
        "#8dc040",
        "#9dd147",
        "#ade24e",
        "#bdf355",
      ],
    };

    // Color harmony rules
    this.harmonyRules = {
      monochromatic: (base) => this.generateMonochromatic(base),
      analogous: (base) => this.generateAnalogous(base),
      complementary: (base) => this.generateComplementary(base),
      triadic: (base) => this.generateTriadic(base),
      tetradic: (base) => this.generateTetradic(base),
      splitComplementary: (base) => this.generateSplitComplementary(base),
    };
  }

  /**
   * Generate random color in various formats
   * @param {string} format - Color format (hex, rgb, hsl, hsv)
   * @param {Object} options - Generation options
   * @returns {string} Generated color
   */
  generateColor(format = "hex", options = {}) {
    const {
      hue = null,
      saturation = null,
      lightness = null,
      alpha = 1,
      palette = null,
    } = options;

    if (palette && this.palettes[palette]) {
      return this.getRandomFromPalette(palette);
    }

    // Generate HSL values
    const h = hue !== null ? hue : Math.floor(Math.random() * 360);
    const s =
      saturation !== null ? saturation : Math.floor(Math.random() * 101);
    const l = lightness !== null ? lightness : Math.floor(Math.random() * 101);

    return this.convertColor({ h, s, l, a: alpha }, "hsl", format);
  }

  /**
   * Generate random color from palette
   * @param {string} paletteName - Name of the palette
   * @returns {string} Random color from palette
   */
  getRandomFromPalette(paletteName) {
    const palette = this.palettes[paletteName];
    if (!palette) {
      JSVLogger.warn(`Palette "${paletteName}" not found`);
      return this.generateColor();
    }

    const randomIndex = Math.floor(Math.random() * palette.length);
    return palette[randomIndex];
  }

  /**
   * Generate color scheme based on harmony rule
   * @param {string} baseColor - Base color (hex format)
   * @param {string} harmony - Harmony rule name
   * @param {number} count - Number of colors to generate
   * @returns {Array} Array of colors
   */
  generateColorScheme(baseColor, harmony = "analogous", count = 5) {
    const harmonyFunc = this.harmonyRules[harmony];
    if (!harmonyFunc) {
      JSVLogger.warn(`Harmony rule "${harmony}" not found`);
      return [baseColor];
    }

    const hsl = this.hexToHsl(baseColor);
    return harmonyFunc.call(this, hsl).slice(0, count);
  }

  /**
   * Generate monochromatic color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of monochromatic colors
   */
  generateMonochromatic(baseHsl) {
    const colors = [];
    const { h, s } = baseHsl;

    for (let i = 0; i < 7; i++) {
      const l = Math.max(10, Math.min(90, 20 + i * 12));
      colors.push(this.hslToHex({ h, s, l }));
    }

    return colors;
  }

  /**
   * Generate analogous color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of analogous colors
   */
  generateAnalogous(baseHsl) {
    const colors = [];
    const { h, s, l } = baseHsl;

    for (let i = -2; i <= 2; i++) {
      const newH = (h + i * 30 + 360) % 360;
      colors.push(this.hslToHex({ h: newH, s, l }));
    }

    return colors;
  }

  /**
   * Generate complementary color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of complementary colors
   */
  generateComplementary(baseHsl) {
    const { h, s, l } = baseHsl;
    const complementH = (h + 180) % 360;

    return [
      this.hslToHex({ h, s, l }),
      this.hslToHex({ h: complementH, s, l }),
      this.hslToHex({ h, s: s * 0.7, l: l * 1.2 }),
      this.hslToHex({ h: complementH, s: s * 0.7, l: l * 1.2 }),
    ];
  }

  /**
   * Generate triadic color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of triadic colors
   */
  generateTriadic(baseHsl) {
    const { h, s, l } = baseHsl;

    return [
      this.hslToHex({ h, s, l }),
      this.hslToHex({ h: (h + 120) % 360, s, l }),
      this.hslToHex({ h: (h + 240) % 360, s, l }),
    ];
  }

  /**
   * Generate tetradic color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of tetradic colors
   */
  generateTetradic(baseHsl) {
    const { h, s, l } = baseHsl;

    return [
      this.hslToHex({ h, s, l }),
      this.hslToHex({ h: (h + 90) % 360, s, l }),
      this.hslToHex({ h: (h + 180) % 360, s, l }),
      this.hslToHex({ h: (h + 270) % 360, s, l }),
    ];
  }

  /**
   * Generate split-complementary color scheme
   * @param {Object} baseHsl - Base color in HSL format
   * @returns {Array} Array of split-complementary colors
   */
  generateSplitComplementary(baseHsl) {
    const { h, s, l } = baseHsl;
    const complement = (h + 180) % 360;

    return [
      this.hslToHex({ h, s, l }),
      this.hslToHex({ h: (complement - 30 + 360) % 360, s, l }),
      this.hslToHex({ h: (complement + 30) % 360, s, l }),
    ];
  }

  /**
   * Generate gradient between two colors
   * @param {string} startColor - Starting color (hex)
   * @param {string} endColor - Ending color (hex)
   * @param {number} steps - Number of gradient steps
   * @returns {Array} Array of gradient colors
   */
  generateGradient(startColor, endColor, steps = 10) {
    const startRgb = this.hexToRgb(startColor);
    const endRgb = this.hexToRgb(endColor);
    const gradient = [];

    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * ratio);
      const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * ratio);
      const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * ratio);

      gradient.push(this.rgbToHex({ r, g, b }));
    }

    return gradient;
  }

  /**
   * Generate random gradient CSS
   * @param {string} direction - Gradient direction
   * @param {number} colorCount - Number of colors in gradient
   * @returns {string} CSS gradient string
   */
  generateRandomGradient(direction = "45deg", colorCount = 3) {
    const colors = [];

    for (let i = 0; i < colorCount; i++) {
      colors.push(
        this.generateColor("hex", {
          saturation: Math.floor(Math.random() * 30) + 70, // High saturation
          lightness: Math.floor(Math.random() * 40) + 30, // Medium lightness
        })
      );
    }

    return `linear-gradient(${direction}, ${colors.join(", ")})`;
  }

  /**
   * Convert color between different formats
   * @param {Object|string} color - Color value
   * @param {string} fromFormat - Source format
   * @param {string} toFormat - Target format
   * @returns {string|Object} Converted color
   */
  convertColor(color, fromFormat, toFormat) {
    let rgb;

    // Convert to RGB first (universal format)
    switch (fromFormat.toLowerCase()) {
      case "hex":
        rgb = this.hexToRgb(color);
        break;
      case "hsl":
        rgb = this.hslToRgb(color);
        break;
      case "hsv":
        rgb = this.hsvToRgb(color);
        break;
      case "rgb":
        rgb = color;
        break;
      default:
        throw new Error(`Unsupported source format: ${fromFormat}`);
    }

    // Convert from RGB to target format
    switch (toFormat.toLowerCase()) {
      case "hex":
        return this.rgbToHex(rgb);
      case "hsl":
        return this.rgbToHsl(rgb);
      case "hsv":
        return this.rgbToHsv(rgb);
      case "rgb":
        return rgb;
      default:
        throw new Error(`Unsupported target format: ${toFormat}`);
    }
  }

  /**
   * Convert hex to RGB
   * @param {string} hex - Hex color string
   * @returns {Object} RGB color object
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB to hex
   * @param {Object} rgb - RGB color object
   * @returns {string} Hex color string
   */
  rgbToHex(rgb) {
    const { r, g, b } = rgb;
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  /**
   * Convert HSL to RGB
   * @param {Object} hsl - HSL color object
   * @returns {Object} RGB color object
   */
  hslToRgb(hsl) {
    let { h, s, l } = hsl;
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      return { r: l * 255, g: l * 255, b: l * 255 };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  }

  /**
   * Convert RGB to HSL
   * @param {Object} rgb - RGB color object
   * @returns {Object} HSL color object
   */
  rgbToHsl(rgb) {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Convert hex to HSL
   * @param {string} hex - Hex color string
   * @returns {Object} HSL color object
   */
  hexToHsl(hex) {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHsl(rgb);
  }

  /**
   * Convert HSL to hex
   * @param {Object} hsl - HSL color object
   * @returns {string} Hex color string
   */
  hslToHex(hsl) {
    const rgb = this.hslToRgb(hsl);
    return this.rgbToHex(rgb);
  }

  /**
   * Convert HSV to RGB
   * @param {Object} hsv - HSV color object
   * @returns {Object} RGB color object
   */
  hsvToRgb(hsv) {
    let { h, s, v } = hsv;
    h /= 360;
    s /= 100;
    v /= 100;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  /**
   * Convert RGB to HSV
   * @param {Object} rgb - RGB color object
   * @returns {Object} HSV color object
   */
  rgbToHsv(rgb) {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;

    let h;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }

  /**
   * Get color brightness (0-255)
   * @param {string} hex - Hex color string
   * @returns {number} Brightness value
   */
  getBrightness(hex) {
    const rgb = this.hexToRgb(hex);
    return Math.round((rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000);
  }

  /**
   * Check if color is light or dark
   * @param {string} hex - Hex color string
   * @returns {boolean} True if light, false if dark
   */
  isLight(hex) {
    return this.getBrightness(hex) > 127;
  }

  /**
   * Get contrasting text color (black or white)
   * @param {string} backgroundColor - Background color hex
   * @returns {string} Contrasting text color
   */
  getContrastColor(backgroundColor) {
    return this.isLight(backgroundColor) ? "#000000" : "#ffffff";
  }

  /**
   * Generate random planet color based on type
   * @param {string} planetType - Type of planet
   * @returns {string} Planet color hex
   */
  generatePlanetColor(planetType) {
    const planetColors = {
      basics: { hue: [0, 30], sat: [70, 90], light: [50, 70] },
      dom: { hue: [160, 200], sat: [60, 80], light: [45, 65] },
      async: { hue: [40, 60], sat: [80, 100], light: [55, 75] },
      es6: { hue: [260, 300], sat: [65, 85], light: [50, 70] },
      oop: { hue: [300, 340], sat: [70, 90], light: [55, 75] },
      functional: { hue: [180, 220], sat: [80, 100], light: [45, 65] },
      patterns: { hue: [50, 70], sat: [75, 95], light: [60, 80] },
      storage: { hue: [20, 40], sat: [65, 85], light: [50, 70] },
      events: { hue: [200, 240], sat: [70, 90], light: [55, 75] },
      testing: { hue: [220, 260], sat: [60, 80], light: [40, 60] },
      security: { hue: [340, 360], sat: [80, 100], light: [45, 65] },
      algorithms: { hue: [30, 50], sat: [75, 95], light: [50, 70] },
      canvas: { hue: [140, 180], sat: [70, 90], light: [45, 65] },
      api: { hue: [240, 280], sat: [65, 85], light: [50, 70] },
    };

    const colorRange = planetColors[planetType] || planetColors.basics;

    const h =
      Math.floor(Math.random() * (colorRange.hue[1] - colorRange.hue[0])) +
      colorRange.hue[0];
    const s =
      Math.floor(Math.random() * (colorRange.sat[1] - colorRange.sat[0])) +
      colorRange.sat[0];
    const l =
      Math.floor(Math.random() * (colorRange.light[1] - colorRange.light[0])) +
      colorRange.light[0];

    return this.hslToHex({ h, s, l });
  }

  /**
   * Create custom palette
   * @param {string} name - Palette name
   * @param {Array} colors - Array of colors
   */
  createPalette(name, colors) {
    this.palettes[name] = colors;
    JSVLogger.info(`Created custom palette: ${name}`);
  }

  /**
   * Get all available palettes
   * @returns {Array} Array of palette names
   */
  getPaletteNames() {
    return Object.keys(this.palettes);
  }

  /**
   * Get singleton instance
   */
  static getInstance() {
    if (!RandomColorGenerator.instance) {
      RandomColorGenerator.instance = new RandomColorGenerator();
    }
    return RandomColorGenerator.instance;
  }
}

// Create singleton instance
const RandomColorGenerator = RandomColorGenerator.getInstance();

// Export for use in other modules
if (typeof window !== "undefined") {
  window.RandomColorGenerator = RandomColorGenerator;
}
