# Default target
build: build-ui build-api

# Build Docker image for UI
build-ui:
	@echo "Building Docker image for UI..."
	docker build -t registry.digitalocean.com/codecannon/<NAMESPACE>-ui:latest ./ui
	@echo "UI Docker image built successfully."

# Build Docker image for API
build-api:
	@export DOCKER_BUILDKIT=1
	@echo "Building Docker image for API..."
	docker build -t registry.digitalocean.com/codecannon/<NAMESPACE>-api:latest ./api
	@echo "API Docker image built successfully."

# Push Docker images to Docker Hub
push: push-ui push-api

# Push Docker image for UI
push-ui:
	@export DOCKER_BUILDKIT=1
	@echo "Pushing Docker image for UI..."
	docker push registry.digitalocean.com/codecannon/<NAMESPACE>-ui:latest
	@echo "UI Docker image pushed successfully."

# Push Docker image for API
push-api:
	@export DOCKER_BUILDKIT=1
	@echo "Pushing Docker image for API..."
	docker push registry.digitalocean.com/codecannon/<NAMESPACE>-api:latest
	@echo "API Docker image pushed successfully."
