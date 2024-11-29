import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
const cookieParser = require('cookie-parser');

import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
const cors = require('cors');

const jwt = require('jsonwebtoken');
const fs = require('fs');
// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();
  server.use(express.json());
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  server.use(cookieParser());

  server.use(cors({
    origin: 'http://localhost:5000', // lub '*', ale to mniej bezpieczne
    credentials: true, // Wymagane dla ciasteczek
  }));


  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));
  server.post('/api/login', (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    }
    if (user.email === 'a' && user.password === 'a') {

      const privateKey = fs.readFileSync('./src/environments/private.key', 'utf8');
      const accessPayload = {
        userId: 123,
        role: ['admin', 'ksiegowa'],
        permissions: ['read', 'create', 'delete', 'update'],
        firstName: 'Kasia',
        lastName: 'Kowalska',
        email: user.email
      };

      // Podpisanie tokena z użyciem algorytmu RSA i klucza prywatnego
      const accessToken = jwt.sign(accessPayload, privateKey, { algorithm: 'RS256', expiresIn: '7h' });

      const refreshPayload = {
        userId: 123
      };

      // Generowanie refresh_token
      const refreshToken = jwt.sign(refreshPayload, privateKey, { algorithm: 'RS256', expiresIn: '7d' });

      console.log('Access Token:', accessToken);
      console.log('Refresh Token:', refreshToken);

      const publicKey = fs.readFileSync('./src/environments/public.key', 'utf8');

      // Weryfikacja access_token
      jwt.verify(accessToken, publicKey, (err: any, decoded: any) => {
        if (err) {
          console.error('Access Token verification failed:', err);
        } else {
          console.log('Decoded access token:', decoded);
        }
      });

      // Weryfikacja refresh_token
      jwt.verify(refreshToken, publicKey, (err: any, decoded: any) => {
        if (err) {
          console.error('Refresh Token verification failed:', err);
        } else {
          console.log('Decoded refresh token:', decoded);
        }
      });


      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // niedostępne dla JS (ogranicza ataki XSS) Wskazuje przeglądarce, że ciasteczko nie może być dostępne przez JavaScript.
        secure: false, // Zmień na true, jeśli używasz HTTPS. Ciasteczka powinny być przesyłane wyłącznie przez szyfrowane połączenia (HTTPS).
        sameSite: 'strict', // przeglądarka dołączy ciasteczko jedynie do żądań pochodzących i kierowanych do tej samej strony, co strona, z której pochodzi ciasteczko.
        maxAge: 1 * 60 * 1000 // 1 minuta
      });
      res.cookie('accessToken', accessToken, {
        httpOnly: true, 
        secure: false,
        sameSite: 'strict', 
        maxAge: 1 * 60 * 1000 
      });

      const respons = {
        user: accessPayload,
      }

      return res.status(200).json({
        success: true,
        code: 200,
        message: 'Login was successful',
        respons: respons
      });
    } else if (user.email === '' && user.password === '') {

      return res.status(400).json({
        success: false,
        code: 400,
        message: 'Password and login is required',
        respons: user
      });
    } else {

      return res.status(401).json({
        success: false,
        code: 401,
        message: 'Invalid username or password.',
        respons: user
      });
    }

  });


  server.post(`/api/refresh-token`, (req: any, res: any) => {
    const refreshToken = req.cookies.refreshToken;

    // if (!refreshToken) {
    //   return res.status(401).json({
    //     success: false,
    //     code: 401,
    //     message: 'Refresh token missing.'
    //   });
    // }

    const publicKey = fs.readFileSync('./src/environments/public.key', 'utf8');
    const privateKey = fs.readFileSync('./src/environments/private.key', 'utf8');
    console.log('000000000')

    // Weryfikacja refresh_token
    jwt.verify(refreshToken, publicKey, (err: any, decoded: any) => {
      // if (err) {
      //   return res.status(403).json({
      //     success: false,
      //     code: 403,
      //     message: err
      //   });
      // }
console.log('111111111111111')
      // Tworzenie nowego access_token
      const accessToken = jwt.sign(
        {
          userId: decoded.userId,
          role: ['admin', 'ksiegowa'],
          permissions: ['read', 'create', 'delete', 'update'],
        },
        privateKey,
        { algorithm: 'RS256', expiresIn: '7h' }
      );

      console.log('22222222')

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 1000, // 1 minuta
      });
   
      return res.status(200).json({
        success: false,
        code: 200,
        message: 'Gererate accessToken and refreshToken',
      });
    });

  });


  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 5000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
