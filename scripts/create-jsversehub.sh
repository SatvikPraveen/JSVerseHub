#!/bin/bash

echo "🚀 Creating JSVerseHub Project Structure..."

# Base project directory
mkdir -p jsversehub
cd jsversehub

# ───── public folder ─────
mkdir -p public/images/{ui,planets,icons,easter_egg,leaderboard,milestone}

# Add index.html placeholder
touch public/index.html

# ───── src/assets ─────
mkdir -p src/assets/fonts
mkdir -p src/assets/sounds

# Create example font and sound files
touch src/assets/fonts/space-mono.woff2
touch src/assets/sounds/click.wav

# ───── src/components ─────
mkdir -p src/components
touch src/components/{PlanetCard.js,GalaxyMap.js,Modal.js,ConceptViewer.js,Navbar.js}

# ───── src/concepts ─────
mkdir -p src/concepts/{basics,dom,async,es6,oop,functional,patterns,storage}

touch src/concepts/basics/{index.js,demo.html,exercises.js}
touch src/concepts/dom/{index.js,dom-game.html,selectors.js}
touch src/concepts/async/{index.js,async-flow.js,fetch-demo.html}
touch src/concepts/es6/{destructuring.js,arrow-functions.js,modules-demo.js}
touch src/concepts/oop/{classes.js,inheritance.js,prototypes.js}
touch src/concepts/functional/{pure-functions.js,higher-order.js,map-filter-reduce.js}
touch src/concepts/patterns/{module-pattern.js,singleton.js,observer.js}
touch src/concepts/storage/{local-storage.js,session-storage.js,indexeddb.js}

# ───── src/engine ─────
mkdir -p src/engine
touch src/engine/{navigation.js,stateManager.js,conceptLoader.js,galaxyRenderer.js}

# ───── src/utils ─────
mkdir -p src/utils
touch src/utils/{domUtils.js,logger.js,debounce.js,randomColorGenerator.js}

# ───── src/styles ─────
mkdir -p src/styles
touch src/styles/{index.css,galaxy.css,modal.css,theme.css,responsive.css}

# ───── src ─────
touch src/main.js

# ───── tests ─────
mkdir -p tests/engine
touch tests/{basics.test.js,dom.test.js,async.test.js,es6.test.js}
touch tests/engine/{navigation.test.js,conceptLoader.test.js}

# ───── docs ─────
mkdir -p docs
touch docs/{roadmap.md,architecture.md,concept-mapping.md,changelog.md}

# ───── config & root files ─────
touch .eslintrc.js
touch webpack.config.js
touch README.md
touch package.json

echo "✅ JSVerseHub structure created successfully!"
