# Build image
docker build -t node-prom-app .

# Run container
docker run -p 3000:3000 node-prom-app

# build code
npm run build
pm2 start dist/server.js --name ecommerce-api
pm2 logs ecommerce-api
pm2 list
pm2 monit

# nginx
ls /etc/nginx/sites-available/

-- copy file về home
cp /etc/nginx/sites-available/default ~/WorkSpace/ecommerce-ts/

-- copy lại với sudo
sudo mv default /etc/nginx/sites-available/default

-- test lỗi syntax
sudo nginx -t
sudo systemctl reload nginx