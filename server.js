// server.js - Simple development server for JSVerseHub

const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const BUILD_DIR = process.env.NODE_ENV === 'production' ? 'dist' : 'public';

// Serve static files
app.use(express.static(path.join(__dirname, BUILD_DIR)));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, BUILD_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 JSVerseHub server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${BUILD_DIR}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
