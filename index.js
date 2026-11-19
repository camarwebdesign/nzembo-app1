const path = require('path');
const express = require('express');

const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;
const app = express();

const APP_BASE_URL = (process.env.APP_URL || 'https://app.nzembo.net').replace(/\/+$/, '');
const ADMIN_BASE_URL = (process.env.ADMIN_URL || 'https://admin.nzembo.net').replace(/\/+$/, '');

// Redirections vers les applications autonomes app.nzembo.net et admin.nzembo.net
app.get(['/app', '/app/*'], (req, res) => {
  const suffix = req.originalUrl.replace(/^\/app/i, '') || '';
  return res.redirect(302, `${APP_BASE_URL}${suffix.startsWith('/') || !suffix ? suffix : '/' + suffix}`);
});

app.get('/invite/*', (req, res) => {
  return res.redirect(302, `${APP_BASE_URL}${req.originalUrl}`);
});

app.get(['/admin', '/admin/*'], (req, res) => {
  const suffix = req.originalUrl.replace(/^\/admin/i, '') || '';
  return res.redirect(302, `${ADMIN_BASE_URL}${suffix.startsWith('/') || !suffix ? suffix : '/' + suffix}`);
});

// Compatibilité /public/*
app.use('/public', express.static(PUBLIC_DIR, { index: false }));

// Fichiers statiques de la Landing Page
app.use(express.static(PUBLIC_DIR, { index: false }));

// Point d'entrée principal
app.get('/', (_req, res) => {
  return res.sendFile(path.join(PUBLIC_DIR, 'landing.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌐 [Nzembo Landing - nzembo.net] Actif sur http://localhost:${PORT}`);
  });
}

module.exports = app;
