import _d = require('dotenv');
_d.config();

import socketio = require('socket.io');
import express = require('express');
import http = require('http');
import https = require('https');
import fs = require('fs');

/* SETUP start */
const isProduction = process.env['NODE_' + 'ENV'] === 'production';

const DOMAIN = isProduction
  ? 'https://hypnos-game.duckdns.org'
  : 'http://localhost';
const SERVER_PORT = 3301;

export const SERVER_PATH = `${DOMAIN}:${SERVER_PORT}`;

const app = express();

export const imageFolderPath = __dirname + '/assets/public';

app.use('/images', express.static(imageFolderPath));

const httpsServer = isProduction
  ? https.createServer(
      {
        key: fs.readFileSync('keys/privkey.pem'),
        cert: fs.readFileSync('keys/cert.pem'),
      },
      app
    )
  : http.createServer(app);

httpsServer.listen(SERVER_PORT);

export const io = new socketio.Server(
  httpsServer,
  isProduction
    ? undefined
    : {
        cors: { origin: 'http://localhost' },
      }
);
