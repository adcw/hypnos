git switch main

echo "Building app"
npx nx build hypnos-server 

echo "Pushing app to debian"
scp -r dist/* edorian@192.168.3.11:/home/edorian/