# How-to instructions

Detailed how-to instructions for miscellaneous scenarios.

## Setup from Scratch

The container-based Matomo installation requires a walk through of the web UI to complete the initial setup. This should only need to be done once, and any future deploy/update should be treated like a restore or a migration (see those sections below).

1. Deploy the ECR repository (using [mitlib-tf-workloads-ecr](https://github.com/MITLibraries/mitlib-tf-workloads-ecr)).
1. Run `make dist-dev` and `make publish-dev` to create and push this container to the ECR repository.
1. Deploy the ECS/RDS/EFS resources (using [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo)).
1. After the ECS service has stabilized, access the Matomo web UI and walk through the 8-step process (you will need to create a superuser and set a couple of basic values).
1. Log back in to the web UI as the super user, navigate to the Settings/Plugins page and **Activate** the EnvironmentVariables plugin. This will update the remaining settings.
1. In the Settings/Plugins, **deactivate** the UserID plugin (see **Data anonymization**  in the [README.md](../README.md)).

## Troubleshooting

It **is** possible to SSH into the Matomo container while it is running in ECS:  **Ensure you have the latest Session Manager plugin installed if you have errors or no output to the following command:**

```bash
aws ecs execute-command --region {name-of-the-region} --cluster {name-of-the-cluster} --task {task number} --command "/bin/bash" --interactive
```

This can be used for quick checks of the `config.ini.php` file to see if actions in the UI made any modifications. This is also required for doing major version upgrades of Matomo (e.g. from 3.x to 4.x).

To retrieve the **task number** value for the command:

* Open the AWS Dev1 console in your browser
* Navigate to ECS (Elastic Container Service)
* Click on `matomo-ecs-dev-cluster` (This is also the cluster name for the above command)
* Click on the `Tasks` tab
* Copy the Task number from the list (there should be only one)

OR

```bash
aws ecs execute-command --region us-east-1 --cluster $(aws ecs list-clusters --output text | grep matomo | cut -d'/' -f2) --task $(aws ecs list-tasks --cluster $(aws ecs list-clusters --output text | grep matomo | cut -d'/' -f2) --query "taskArns[*]" --output text | cut -d'/' -f3) --command "/bin/bash" --interactive
```

If you need to force a redeployment of the task for the service, this one-liner will work:

```bash
aws ecs update-service --cluster $(aws ecs list-clusters --output text | grep matomo | cut -d'/' -f2) --service $(aws ecs list-services --cluster $(aws ecs list-clusters --output text | grep matomo | cut -d'/' -f2) --output text | grep matomo | cut -d'/' -f3) --force-new-deployment
```

## Reset 2-Factor auth

If we ever need to reset the 2FA configuration for a user, this is the command to run on the CLI of the container

```bash
./console twofactorauth:disable-2fa-for-user --login=yourlogin
```

See [FAQ_27248](https://matomo.org/faq/how-to/faq_27248/) for more details.
