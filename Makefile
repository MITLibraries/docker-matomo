.PHONY: help dist-dev publish-dev dist-stage publish-stage
SHELL=/bin/bash
### This is the Terraform-generated header for docker-matomo-dev. If  ###
###   this is a Lambda repo, uncomment the FUNCTION line below        ###
###   and review the other commented lines in the document.           ###
ECR_NAME_DEV:=docker-matomo-dev
ECR_URL_DEV:=222053980223.dkr.ecr.us-east-1.amazonaws.com/docker-matomo-dev
# FUNCTION_DEV:=
### End of Terraform-generated header                                 ###

help: ## Print this message
	@awk 'BEGIN { FS = ":.*##"; print "Usage:  make <target>\n\nTargets:" } \
		/^[-_[:alpha:]]+:.?*##/ { printf "  %-15s%s\n", $$1, $$2 }' $(MAKEFILE_LIST)

### Terraform-generated Developer Deploy Commands for Dev environment ###
dist-dev: ## Build docker container (intended for developer-based manual build)
	docker build \
		--platform linux/amd64 \
	    -t $(ECR_URL_DEV):latest \
		-t $(ECR_URL_DEV):`git describe --always` \
		-t $(ECR_NAME_DEV):latest .

publish-dev: dist-dev ## Build, tag and push (intended for developer-based manual publish)
	docker login -u AWS -p $$(aws ecr get-login-password --region us-east-1) $(ECR_URL_DEV)
	docker push $(ECR_URL_DEV):latest
	docker push $(ECR_URL_DEV):`git describe --always`
