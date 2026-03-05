# ecommerce-ts/Makefile
NODE_MODULES := node_modules
SRC := src
DIST := dist
KEYS_FOLDER := src/keys

.PHONY: docker-up docker-down docker-restart kafka-up kafka-down \
		kafka-topic-create kafka-topic-list kafka-producer-test \
		kafka-topic-describe kafka-consumer-test rabbitmq-up \
		rabbitmq-producer-test rabbitmq-consumer-test generate-key

generate-key:
	mkdir -p $(KEYS_FOLDER)
	openssl genrsa -out $(KEYS_FOLDER)/private_key.pem 2048
	openssl rsa -in $(KEYS_FOLDER)/private_key.pem -pubout -out $(KEYS_FOLDER)/public_key.pem

rabbitmq-consumer-test:
	npx ts-node src/tests/message_queue/rabbitmq/consumer.ts

rabbitmq-producer-test:
	npx ts-node src/tests/message_queue/rabbitmq/producer.ts

rabbitmq-up:
	docker compose -f docker/docker-compose.rabbitmq.yml up -d

kafka-topic-create:
	docker exec -it ecommerce-kafka \
		/opt/kafka/bin/kafka-topics.sh \
		--create \
		--topic order-created \
		--bootstrap-server localhost:9092 \
		--partitions 1 \
		--replication-factor 1

kafka-topic-describe:
	docker exec -it ecommerce-kafka \
		/opt/kafka/bin/kafka-topics.sh \
		--describe \
		--topic order-created \
		--bootstrap-server localhost:9092

kafka-topic-list:
	docker exec -it ecommerce-kafka \
		/opt/kafka/bin/kafka-topics.sh \
		--list \
		--bootstrap-server localhost:9092

kafka-producer-test:
	npx ts-node src/tests/message_queue/kafka/producer.ts

kafka-consumer-test:
	npx ts-node src/tests/message_queue/kafka/consumer.ts

kafka-up:
	docker compose -f docker/docker-compose.kafka.yml up -d

#  -v
kafka-down:
	docker compose -f docker/docker-compose.kafka.yml down

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
