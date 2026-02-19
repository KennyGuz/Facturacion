GIT_SHA := $(shell git rev-parse HEAD)
BUILD_TAG := $(if $(BUILD_TAG),$(BUILD_TAG),latest)

down:
	docker compose down --remove-orphans --volumes
up: down
	docker compose up --detach 


build-image-web:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--tag "web-facturacion:$(GIT_SHA)-build" \
		--target builder \
		./web
	docker buildx build \
		--cache-from "web-facturacion:$(GIT_SHA)-build" \
		--platform linux/amd64,linux/arm64 \
		--tag "web-facturacion:$(GIT_SHA)" \
		--target runner \
		./web
