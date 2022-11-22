git switch main

echo "Building app"
npx nx build hypnos-server 
npx nx build hypnos 

echo "Pushing app"
scp -r dist/* ideo@192.168.3.12:/var/www/hypnos-game/public_html

ssh ideo@192.168.3.12 "sudo -S bash /var/www/hypnos-game/public_html/apps/hypnos-server/assets/dependencies.sh"