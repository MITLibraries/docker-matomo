.PHONY: help dist publish promote
SHELL=/bin/bash
ECR_REGISTRY=672626379771.dkr.ecr.us-east-1.amazonaws.com
NAME= analytics
ECR_REPOSITORY_ARN=$(ECR_REGISTRY)/$(NAME)-$(TF_WORKSPACE)
REGION=us-east-1
DATETIME:=$(shell date -u +%Y%m%dT%H%M%SZ)

help: ## Print this message
	@awk 'BEGIN { FS = ":.*##"; print "Usage:  make <target>\n\nTargets:" } \
		/^[-_[:alpha:]]+:.?*##/ { printf "  %-15s%s\n", $$1, $$2 }' $(MAKEFILE_LIST)

dist: ## Build docker image
	docker build -t $(ECR_REPOSITORY_ARN):latest \
	-t $(NAME):latest .
	
		
publish: dist ## Build, tag and push
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker push $(ECR_REPOSITORY_ARN):latest
	aws ecs update-service --cluster $(NAME)-$(TF_WORKSPACE)-cluster --service $(NAME)-$(TF_WORKSPACE) --region $(REGION) --force-new-deployment

promote: ## Promote the current staging build to production
	$$(aws ecr get-login --no-include-email --region us-east-1)
	docker pull $(ECR_REPOSITORY_ARN):latest
	docker tag $(ECR_REGISTRY)/$(NAME)-stage:latest $(ECR_REGISTRY)/$(NAME)-prod:latest
	docker tag $(ECR_REGISTRY)/$(NAME)-stage:latest $(ECR_REGISTRY)/$(NAME)-prod:$(DATETIME)
	docker push $(ECR_REGISTRY)/$(NAME)-prod:latest
	docker push $(ECR_REGISTRY)/$(NAME)-prod:$(DATETIME)
	aws ecs update-service --cluster $(NAME)-prod-cluster --service $(NAME)-prod --region $(REGION) --force-new-deployment
