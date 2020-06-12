.PHONY: help dist publish promote
SHELL=/bin/bash
ECR_REGISTRY=672626379771.dkr.ecr.us-east-1.amazonaws.com
DATETIME:=$(shell date -u +%Y%m%dT%H%M%SZ)

help: ## Print this message
	@awk 'BEGIN { FS = ":.*##"; print "Usage:  make <target>\n\nTargets:" } \
		/^[-_[:alpha:]]+:.?*##/ { printf "  %-15s%s\n", $$1, $$2 }' $(MAKEFILE_LIST)

build: ## Build docker image
	docker build -t $(ECR_REGISTRY)/analytics-stage:latest \
	-t analytics-stage:latest .
	
		
dist: dist ## Build, tag and push
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker push $(ECR_REGISTRY)/analytics-stage:latest
	aws ecs update-service --cluster analytics-stage-cluster --service analytics-stage --region us-east-1 --force-new-deployment

publish: ## Promote the current staging build to production
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker pull $(ECR_REGISTRY)/analytics-stage:latest
	docker tag $(ECR_REGISTRY)/analytics-stage:latest $(ECR_REGISTRY)/analytics-prod:latest
	docker tag $(ECR_REGISTRY)/analytics-stage:latest $(ECR_REGISTRY)/analytics-prod:$(DATETIME)
		
promote:
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker push $(ECR_REGISTRY)/analytics-prod:latest
	docker push $(ECR_REGISTRY)/analytics-prod:$(DATETIME)
	aws ecs update-service --cluster analytics-prod-cluster --service analytics-prod --region us-east-1 --force-new-deployment
