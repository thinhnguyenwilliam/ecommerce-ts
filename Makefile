
# ecommerce-ts/Makefile
NODE_MODULES := node_modules
SRC := src
DIST := dist

.PHONY: docker-up docker-down docker-restart

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-restart:
	docker compose down
	docker compose up -d


.PHONY: install
install:
	@echo "📦 Installing dependencies..."
	@npm install

# -------------------------
# Development mode
# -------------------------
.PHONY: dev
dev:
	@echo "Starting development server..."
	@npm run dev

# -------------------------
# Build project
# -------------------------
.PHONY: build
build:
	@echo "Building project..."
	@npm run build

# -------------------------
# Start production server
# -------------------------
.PHONY: start
start:
	@echo "🔥 Starting production server..."
	@npm start

# -------------------------
# Clean build files
# -------------------------
.PHONY: clean
clean:
	@echo "🧹 Cleaning dist folder..."
	@rm -rf $(DIST)

# -------------------------
# Full reinstall
# -------------------------
.PHONY: reinstall
reinstall:
	@echo "♻️ Removing node_modules and package-lock.json..."
	@rm -rf $(NODE_MODULES) package-lock.json
	@npm install
