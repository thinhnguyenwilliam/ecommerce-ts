# Build image
docker build -t node-prom-app .

# Run container
docker run -p 3000:3000 node-prom-app
