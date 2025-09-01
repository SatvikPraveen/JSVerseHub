// .eslintrc.js - ESLint Configuration for JSVerseHub

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },

  extends: ["airbnb-base"],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  rules: {
    // Console and debugging
    "no-console": "warn",
    "no-debugger": "error",
    "no-alert": "warn",

    // Variables
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-var": "error",
    "prefer-const": "error",
    "no-use-before-define": [
      "error",
      {
        functions: false,
        classes: true,
      },
    ],

    // Code style
    indent: [
      "error",
      4,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
      },
    ],
    quotes: [
      "error",
      "single",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    semi: ["error", "always"],
    "comma-dangle": ["error", "never"],
    "trailing-comma": "off",
    "no-trailing-spaces": "error",
    "eol-last": "error",

    // Spacing
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "computed-property-spacing": ["error", "never"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
    "space-infix-ops": "error",
    "space-unary-ops": "error",
    "keyword-spacing": "error",

    // Line length
    "max-len": [
      "error",
      {
        code: 120,
        tabWidth: 4,
        ignoreComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // Functions
    "arrow-spacing": "error",
    "prefer-arrow-callback": "error",
    "arrow-parens": ["error", "as-needed"],
    "func-style": [
      "error",
      "declaration",
      {
        allowArrowFunctions: true,
      },
    ],

    // Objects and arrays
    "object-shorthand": "error",
    "prefer-destructuring": [
      "error",
      {
        array: false,
        object: true,
      },
    ],
    "no-duplicate-keys": "error",

    // Classes
    "class-methods-use-this": "off",
    "no-useless-constructor": "error",
    "prefer-class-extends-over-prototype-inheritance": "error",

    // Error handling
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",

    // Best practices
    eqeqeq: ["error", "always"],
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "no-return-assign": "error",
    "no-sequences": "error",
    "no-unmodified-loop-condition": "error",
    "no-unused-expressions": "error",
    "no-useless-call": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
    "no-void": "error",
    "prefer-regex-literals": "error",
    radix: "error",

    // ES6+
    "prefer-spread": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    "no-useless-computed-key": "error",
    "no-useless-rename": "error",
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: {
          minProperties: 6,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 6,
          multiline: true,
          consistent: true,
        },
      },
    ],

    // Imports
    "import/prefer-default-export": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",

    // Allow certain patterns common in game development
    "no-plusplus": "off",
    "no-bitwise": "off",
    "no-continue": "off",
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],

    // JSVerseHub specific relaxations
    "no-mixed-operators": "off",
    "consistent-return": "off",
    "default-case": "off",
  },

  globals: {
    // JSVerseHub global classes and utilities
    StateManager: "readonly",
    ConceptLoader: "readonly",
    GalaxyRenderer: "readonly",
    Navigation: "readonly",
    JSVLogger: "readonly",
    DOMUtils: "readonly",
    RandomColorGenerator: "readonly",
    Modal: "readonly",
    Navbar: "readonly",
    GalaxyMap: "readonly",
    PlanetCard: "readonly",
    ConceptViewer: "readonly",

    // Utility functions
    debounce: "readonly",
    throttle: "readonly",
    PerformanceUtils: "readonly",

    // Main app instance
    JSVerseHub: "readonly",
  },

  overrides: [
    {
      files: ["tests/**/*.js", "**/*.test.js"],
      env: {
        jest: true,
      },
      rules: {
        "no-undef": "off",
        "import/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["src/concepts/**/*.js"],
      rules: {
        "no-console": "off", // Allow console in concept examples
        "no-unused-vars": "warn", // Relax for example code
      },
    },
    {
      files: ["webpack.config.js", ".eslintrc.js"],
      env: {
        node: true,
        browser: false,
      },
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],

  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".json"],
      },
    },
  },
};
