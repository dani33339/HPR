echo "Switching to branch master"
git checkout anton

echo "Bulding app.."
npm run build 

echo "Deploying files to server..."
scp -i E:/Projects/FinalProject/privatekey_openssh -r dist/* ubuntu@129.159.136.30:/var/www/129.159.136.30/

echo "Done!"