git switch main

echo "Building app"
npx nx build hypnos-server 
npx nx build hypnos 

echo "Pushing app"
scp -r dist/* edorian@192.168.3.11:/var/www/hypnos/public_html