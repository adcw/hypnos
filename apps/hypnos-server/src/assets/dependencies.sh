#bin/bash

#/var/www/hypnos-game/public_html/apps/hypnos-server

sudo npm --prefix .. i .. dotenv express socket.io tslib

# sudo node /var/www/hypnos-game/public_html/apps/hypnos-server/main.js &
pm2 restart main
