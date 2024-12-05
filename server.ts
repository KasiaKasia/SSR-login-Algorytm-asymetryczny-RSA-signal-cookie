import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
var cors = require('cors');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var fs = require('fs');
const publicKey = fs.readFileSync('./src/environments/public.key', 'utf8');
const privateKey = fs.readFileSync('./src/environments/private.key', 'utf8');


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
    let accessTokenDetails = {
      iat: 0,
      exp: 0
    }
    let refreshTokenDetails = {
      iat: 0,
      exp: 0
    }
    const user = {
      email: req.body.email,
      password: req.body.password
    }

    if (user.email === 'a' && user.password === 'a') {

      const userDataPayload = {
        userId: 123,
        role: ['admin', 'ksiegowa'],
        permissions: ['read', 'create', 'delete', 'update'],
        firstName: 'Kasia',
        lastName: 'Kowalska',
        email: user.email
      };

      // Podpisanie tokena z użyciem algorytmu RSA i klucza prywatnego
      const accessToken = jwt.sign(userDataPayload, privateKey, { algorithm: 'RS256', expiresIn: '1m' }); //  60 seconds = 1 minute
      const refreshToken = jwt.sign(userDataPayload, privateKey, { algorithm: 'RS256', expiresIn: '2m' });
       
      // Weryfikacja access_token
      jwt.verify(accessToken, publicKey, (err: any, decoded: any) => {
        if (err) {
          console.error('Access Token verification failed:', err);
        } else {
          accessTokenDetails.iat = decoded.iat;
          accessTokenDetails.exp = decoded.exp;

          res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: accessTokenDetails.exp
          });
        }
      });

      // Weryfikacja refresh_token
      jwt.verify(refreshToken, publicKey, (err: any, decoded: any) => {
        if (err) {
          console.error('Refresh Token verification failed:', err);
        } else {
          refreshTokenDetails.iat = decoded.iat;
          refreshTokenDetails.exp = decoded.exp;

          res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // niedostępne dla JS (ogranicza ataki XSS) Wskazuje przeglądarce, że ciasteczko nie może być dostępne przez JavaScript.
            secure: false, // Zmień na true, jeśli używasz HTTPS. Ciasteczka powinny być przesyłane wyłącznie przez szyfrowane połączenia (HTTPS).
            sameSite: 'strict', // przeglądarka dołączy ciasteczko jedynie do żądań pochodzących i kierowanych do tej samej strony, co strona, z której pochodzi ciasteczko.
            maxAge: refreshTokenDetails.exp
          });
        }
      });

      const respons = {
        user: userDataPayload,
        accessTokenDetails: accessTokenDetails,
        refreshTokenDetails: refreshTokenDetails
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

    const userDataPayload = {
      userId: 123,
      role: ['admin', 'ksiegowa'],
      permissions: ['read', 'create', 'delete', 'update'],
      firstName: 'Kasia',
      lastName: 'Kowalska',
      email: req.body.email,
    };

    let accessTokenDetails = {
      iat: 0,
      exp: 0
    }

    let refreshTokenDetails = {
      iat: 0,
      exp: 0
    }


    const accessToken = jwt.sign(userDataPayload, privateKey, { algorithm: 'RS256', expiresIn: '1m' }); //  60 seconds = 1 minute
    const refreshToken = jwt.sign(userDataPayload, privateKey, { algorithm: 'RS256', expiresIn: '2m' });

    jwt.verify(accessToken, privateKey, (err: any, decoded: any) => {
      if (err) {
        console.error('Access Token verification failed:', err);
        return res.status(403).json({
          success: false,
          code: 403,
          message: 'Invalid access token.'
        });
      } else {
        accessTokenDetails.iat = decoded.iat;
        accessTokenDetails.exp = decoded.exp;
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: accessTokenDetails.exp
        });
      }
    });


    // Weryfikacja refresh_token
    jwt.verify(refreshToken, privateKey, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({
          success: false,
          code: 403,
          message: err
        });
      }

      refreshTokenDetails.iat = decoded.iat;
      refreshTokenDetails.exp = decoded.exp;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: refreshTokenDetails.exp
      });
      const respons = {
        user: userDataPayload,
        accessTokenDetails: accessTokenDetails,
        refreshTokenDetails: refreshTokenDetails
      }
      return res.status(200).json({
        success: false,
        code: 200,
        message: 'Gererate accessToken and refreshToken',
        respons: respons
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

function convertExpToDate(exp: number): string {
  const date = new Date(exp * 1000); // Konwersja z sekund na milisekundy
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Miesiące są 0-indeksowane
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  console.log(`${day}-${month}-${year} ${hours}:${minutes}:${seconds}:${milliseconds}`)
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;
}