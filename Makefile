# -------------------------
# Makefile for ecommerce-ts
# -------------------------

# Variables
NODE_MODULES := node_modules
SRC := src
DIST := dist

# Default target
.PHONY: help
help:
	@echo ""
	@echo "Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make dev           - Run development server (ts-node-dev)"
	@echo "  make build         - Compile TypeScript to JavaScript"
	@echo "  make start         - Run built project from dist/"
	@echo "  make clean         - Remove dist and build artifacts"
	@echo "  make reinstall     - Clean node_modules and reinstall"
	@echo ""

# -------------------------
# Install dependencies
# -------------------------
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
