.PHONY: help dist publish promote
SHELL=/bin/bash
ECR_REGISTRY=672626379771.dkr.ecr.us-east-1.amazonaws.com
DATETIME:=$(shell date -u +%Y%m%dT%H%M%SZ)

help: ## Print this message
	@awk 'BEGIN { FS = ":.*##"; print "Usage:  make <target>\n\nTargets:" } \
		/^[-_[:alpha:]]+:.?*##/ { printf "  %-15s%s\n", $$1, $$2 }' $(MAKEFILE_LIST)

build: ## Build docker image
	docker build -t $(ECR_REGISTRY)/matomo-stage:latest \
	-t matomo-stage:latest .
	
		
dist: dist ## Build, tag and push
	$$(aws ecr get-login --no-include-email --region us-east-2)
	docker push $(ECR_REGISTRY)/matomo-stage:latest
	aws ecs update-service --cluster matomo-stage-cluster --service matomo-stage --region us-east-1 --force-new-deployment

publish: ## Promote the current staging build to production
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker pull $(ECR_REGISTRY)/matomo-stage:latest
	docker tag $(ECR_REGISTRY)/matomo-stage:latest $(ECR_REGISTRY)/matomo-prod:latest
	docker tag $(ECR_REGISTRY)/matomo-stage:latest $(ECR_REGISTRY)/matomo-prod:$(DATETIME)
promote:
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker push $(ECR_REGISTRY)/matomo-prod:latest
	docker push $(ECR_REGISTRY)/matomo-prod:$(DATETIME)
	aws ecs update-service --cluster matomo-prod-cluster --service matomo-prod --region us-east-1 --force-new-deployment
