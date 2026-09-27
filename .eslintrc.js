// .eslintrc.js - ESLint configuration for JSVerseHub
//
// Style baseline: airbnb-base with 2-space indentation, single quotes and
// semicolons (kept in sync with the Prettier block in package.json).

module.exports = {
  root: true,

  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true
  },

  extends: ['airbnb-base', 'prettier'],

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  rules: {
    // Diagnostics
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'warn',

    // Variables
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: false }],
    'no-template-curly-in-string': 'off',
    'no-dupe-keys': 'error',

    // Correctness
    eqeqeq: ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',
    'no-return-assign': 'error',
    'no-sequences': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-unused-expressions': 'error',
    'no-useless-call': 'error',
    'no-useless-concat': 'error',
    'no-useless-return': 'error',
    'no-void': 'error',
    radix: 'error',

    // Modern syntax
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'prefer-spread': 'error',
    'no-useless-computed-key': 'error',
    'no-useless-rename': 'error',

    // Imports
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',

    // Deliberate relaxations for this codebase (UI/game-style code, singletons
    // exposed on window, prototype-based teaching examples, etc.)
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'no-continue': 'off',
    'no-mixed-operators': 'off',
    'consistent-return': 'off',
    'default-case': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': ['error', { array: false, object: true }],
    'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
    'no-underscore-dangle': 'off',
    'func-names': 'off',
    'max-classes-per-file': 'off',
    'no-await-in-loop': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-globals': 'off',
    'no-nested-ternary': 'off',
    'no-shadow': 'warn',
    'no-new': 'off',
    'no-multi-assign': 'off',
    'no-useless-escape': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'no-restricted-properties': 'off',
    'max-len': [
      'error',
      { code: 120, ignoreComments: true, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true, ignoreRegExpLiterals: true }
    ]
  },

  globals: {
    // Singletons published on window by the engine/components
    StateManager: 'readonly',
    ConceptLoader: 'readonly',
    ContentRegistry: 'readonly',
    GalaxyRenderer: 'readonly',
    Navigation: 'readonly',
    JSVLogger: 'readonly',
    DOMUtils: 'readonly',
    RandomColorGenerator: 'readonly',
    Modal: 'readonly',
    Navbar: 'readonly',
    GalaxyMap: 'readonly',
    PlanetCard: 'readonly',
    ConceptViewer: 'readonly',
    LearningAnalytics: 'readonly',
    SpacedRepetition: 'readonly',
    KnowledgeTracing: 'readonly',
    debounce: 'readonly',
    throttle: 'readonly',
    PerformanceUtils: 'readonly',
    JSVerseHub: 'readonly'
  },

  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js'],
      env: { jest: true },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-const-assign': 'off',
        'no-constant-condition': 'off',
        'global-require': 'off',
        'no-return-await': 'off',
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-shadow': 'off',
        'prefer-destructuring': 'off',
        'no-unused-expressions': 'off',
        'func-names': 'off',
        'no-new': 'off',
        'no-proto': 'off',
        'no-extend-native': 'off',
        'no-self-compare': 'off',
        'no-loop-func': 'off',
        'no-empty': 'off',
        'no-empty-function': 'off',
        'no-constructor-return': 'off',
        'no-prototype-builtins': 'off',
        'object-shorthand': 'off',
        'prefer-arrow-callback': 'off',
        'no-useless-constructor': 'off',
        'no-useless-escape': 'off',
        'no-new-wrappers': 'off',
        'no-new-object': 'off',
        'no-array-constructor': 'off',
        'no-lonely-if': 'off',
        'no-else-return': 'off',
        'no-sparse-arrays': 'off',
        'symbol-description': 'off',
        'no-void': 'off',
        'no-new-func': 'off',
        'no-eval': 'off',
        'no-implied-eval': 'off',
        'prefer-rest-params': 'off',
        'no-param-reassign': 'off',
        'no-return-assign': 'off',
        'prefer-template': 'off',
        'prefer-spread': 'off',
        'no-sequences': 'off',
        'no-throw-literal': 'off',
        'no-unmodified-loop-condition': 'off',
        'guard-for-in': 'off',
        'no-restricted-syntax': 'off',
        'no-use-before-define': 'off',
        'no-underscore-dangle': 'off',
        'no-var': 'off',
        'prefer-const': 'off',
        'vars-on-top': 'off',
        'block-scoped-var': 'off',
        'no-redeclare': 'off',
        'no-inner-declarations': 'off',
        'no-labels': 'off',
        'no-unused-labels': 'off',
        'no-cond-assign': 'off',
        'prefer-promise-reject-errors': 'off',
        'no-async-promise-executor': 'off',
        'no-promise-executor-return': 'off',
        'no-await-in-loop': 'off',
        'no-mixed-operators': 'off',
        'prefer-object-spread': 'off',
        'prefer-numeric-literals': 'off',
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        radix: 'off',
        'class-methods-use-this': 'off',
        'max-classes-per-file': 'off',
        'no-dupe-class-members': 'off',
        'default-param-last': 'off',
        'no-restricted-properties': 'off',
        'no-restricted-globals': 'off',
        'no-alert': 'off',
        'max-len': 'off',
        eqeqeq: 'off'
      }
    },
    {
      // Teaching content: runnable examples deliberately show anti-patterns
      // (prototype hacking, var, arguments, etc.) alongside good practice.
      files: ['src/concepts/**/*.js'],
      rules: {
        'no-console': 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        'no-proto': 'off',
        'no-extend-native': 'off',
        'no-self-compare': 'off',
        'no-loop-func': 'off',
        'no-empty': 'off',
        'no-empty-function': 'off',
        'no-prototype-builtins': 'off',
        'no-constructor-return': 'off',
        'prefer-rest-params': 'off',
        'no-new-wrappers': 'off',
        'no-new-object': 'off',
        'no-array-constructor': 'off',
        'no-lonely-if': 'off',
        'no-else-return': 'off',
        'func-names': 'off',
        'guard-for-in': 'off',
        'no-restricted-syntax': 'off',
        'no-eval': 'off',
        'no-implied-eval': 'off',
        'no-new-func': 'off',
        'no-var': 'off',
        'vars-on-top': 'off',
        'block-scoped-var': 'off',
        'no-redeclare': 'off',
        'no-inner-declarations': 'off',
        'no-use-before-define': 'off',
        'no-param-reassign': 'off',
        'no-return-assign': 'off',
        'no-throw-literal': 'off',
        'no-unused-expressions': 'off',
        'no-sequences': 'off',
        'no-void': 'off',
        'no-cond-assign': 'off',
        'no-dupe-class-members': 'off',
        'default-param-last': 'off',
        'prefer-object-spread': 'off',
        'prefer-numeric-literals': 'off',
        'no-alert': 'off',
        'no-async-promise-executor': 'off',
        'prefer-promise-reject-errors': 'off',
        'no-unmodified-loop-condition': 'off',
        'prefer-const': 'off',
        eqeqeq: 'off',
        'object-shorthand': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-template': 'off',
        'prefer-spread': 'off',
        'prefer-destructuring': 'off',
        'no-useless-escape': 'off',
        'no-useless-constructor': 'off',
        'no-useless-concat': 'off',
        'no-useless-return': 'off',
        'no-useless-computed-key': 'off',
        'no-useless-rename': 'off',
        'symbol-description': 'off',
        'no-labels': 'off',
        'no-unused-labels': 'off',
        'no-new': 'off',
        radix: 'off'
      }
    },
    {
      // Bootstrap diagnostics and the logger implementation itself talk to console directly.
      files: ['src/main.js', 'src/utils/logger.js'],
      rules: { 'no-console': 'off' }
    },
    {
      files: ['webpack.config.js', '.eslintrc.js', 'server.js', 'scripts/**/*.js', 'tests/setup.js'],
      env: { node: true },
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'global-require': 'off',
        'no-console': 'off'
      }
    }
  ],

  settings: {
    'import/resolver': {
      node: { paths: ['src'], extensions: ['.js', '.json'] }
    }
  }
};
