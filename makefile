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
build-image-server:
	docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--tag "api-facturacion:$(GIT_SHA)" \
		./Server
build-images: build-image-web build-image-server
	echo "Build images done"

promote-images:
	docker image tag web-facturacion:$(GIT_SHA) web-facturacion:$(BUILD_TAG)
	docker image tag api-facturacion:$(GIT_SHA) api-facturacion:$(BUILD_TAG)

down-prod:
	docker compose -f compose-prod.yml down --remove-orphans --volumes

up-prod: down-prod
	docker compose -f compose-prod.yml up --detach




install:
	cd web && npm install
	cd Server && pnpm i
