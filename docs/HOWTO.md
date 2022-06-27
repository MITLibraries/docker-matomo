# How-to instructions

Detailed how-to instructions for various scenarios.

## Setup from Scratch

The container-based Matomo installation requires a walk through of the web UI to complete the initial setup. This should only need to be done once, and any future deploy/update should be treated like a restore or a migration (see those sections below).

1. Deploy the ECR repository (using [mitlib-tf-workloads-ecr](https://github.com/MITLibraries/mitlib-tf-workloads-ecr)).
1. Run `make dist-dev` and `make publish-dev` to create and push this container to the ECR repository.
1. Deploy the ECS/RDS/EFS resources (using [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo)).
1. After the ECS service has stabilized, access the Matomo web UI and walk through the 8-step process (you will need to create a superuser and set a couple of basic values).
1. Log back in to the web UI as the super user, navigate to the Settings/Plugins page and **Activate** the EnvironmentVariables plugin. This will update the remaining settings.
1. In the Settings/Plugins, **deactivate** the UserID plugin (see **Data anonymization**  in the [README.md](../README.md)).

## WIP: Restore from Backup

Most of this is documented in the [Matomo documentation](https://matomo.org/faq/how-to/how-do-i-backup-and-restore-the-matomo-data/). Their instructions rely on `mysqldump`. The details below are specific to MIT Libraries and AWS RDS backups/snapshots.

1. Restore snapshot to new database `matomo-restored`, ensuring that the configuration matches the original (as defined in the [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo) code).

    1. Scroll down to the **Snapshots** section on the Database page in RDS for the Matomo database.
    1. Select the snapshot you wish to restore.
    1. Click the Restore button.
    1. Correct the DB Instance Class setting (it defaults to something much too large).
    1. Enter `matomo-restored` in the DB Instance Identifier field.
    1. Remove the `default` VPC Security Group and add the `<env>-matomo-rds` VPC Security Group.
    1. The rest of the settings can stay at defaults.
    1. Start the restore and then wait (for about 10 minutes).

1. Modify original RDS database to have a new identifier like `matomo-old`. Note that this will cause your endpoint to change, so your app will lose connectivity when AWS completes the modification.

    1. Click the **Modify** button on the Database page in RDS for the Matomo database.
    1. Change the DB Instance identifier to `matomo-old` 
    1. Change the DB parameter group to the `<env>-matomo-rds-mysql57` then click the **Continue** button.
    1. Select the "Apply immediately" option then click the **Modify DB Instance** button.
    1. Wait for about 10 minutes. During this time, the Matomo ECS service will start reporting error since it will lose contact with the database.

1. Modify the `matomo-restored` to have the original database identifier (e.g., `<env>-matomo-rds`). This will change the endpoint to match the original endpoint.

    * Follow the same sequence as above, but change name to `dev-matomo-rds`.

1. Run TfC-triggered `terraform plan` to capture any other changes. Apply the plan to get back in sync.
1. Log in to the Matomo web UI, navigate to the Settings/Plugins and **Activate** the EnvironmentVariables plugin and **Deactivate** the UserID plugin.

## Migrate from Legacy AWS

This generally follows the [Matomo documentation](https://matomo.org/faq/how-to/how-do-i-backup-and-restore-the-matomo-data/). The following notes are specific to our access to RDS in the two different AWS accounts.

### Overview

The general migration plan is

1. In Legacy AWS, use `mysqldump` to export the database.
1. Copy the export file to Dev1 in AWS Org.
1. In Dev1, use `mysql` CLI to load export file into existing DB instance.
1. Restart the Matomo ECS service.

Before getting started, make sure that you have access to the `root` password for the RDS instance in legacy AWS (needed for the `mysqldump` command) and the `matomo` password for the RDS instance in Dev1 (needed for the `mysql` command).

### Legacy AWS

In the legacy Stage/Prod account, log in to the `efs-access-matomo-<env>` EC2 instance (`<env>` is either `stage` or `prod` depending on the database being backed up). Requires AWS CLI v2, AWS Session-Manager Plugin for AWSCLI.

To capture the InstanceID of the EC2 instance to connect to, run the following command:

```bash
aws ec2 describe-instances --filters "Name=tag:Name,Values=efs-access-matomo-<env>" --query "Reservations[*].Instances[*].[InstanceId]" --output text
```

To capture the RDS_ENDPOINT for the database, run the following command:

```bash
aws rds describe-db-instances --filters "Name=db-instance-id,Values=analytics-<env>" --query "DBInstances[*].Endpoint.Address" --output text
```

To connect to the instance, run the following command:

```bash
aws ssm start-session --target i-xxxxxxxxxxxxxxxxx
```

Once connected, run the following commands (dump the database, tar it):

```bash
bash
cd
mysqldump -h <RDS_ENDPOINT> -P 3306 -u root -p --single-transaction --set-gtid-purged=OFF --extended-insert --no-autocommit matomo > <env>-matomo-mysql5734.sql
tar zcf <env>-matomo-mysql-database-$(date +%Y-%m-%d-%H.%M.%S).sql.tar.gz <env>-matomo-mysql5734.sql
```

Then, authenticate to the target AWS Account (easiest to do w/ copy/paste of credentials from AWS SSO) and copy it to Dev1 EC2 instance):

```bash
<authenticate to target AWS Account>
scp -i ~/.ssh/dev1_ec2.priv <env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz ubuntu@i-yyyyyyyyyyyyyyyyy:~/<env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz
exit
exit
```

### Dev1 AWS Organization

In the Dev1 AWS Account, log in to the `Matomo-efs-mgmt` EC2 instance. Requires AWS CLI v2, AWS Session-Manager Plugin for AWSCLI.

To capture the InstanceID of the EC2 instance to connect to, run the following command:

```bash
aws ec2 describe-instances --filters "Name=tag:Name,Values=Matomo-efs-mgmt" --query "Reservations[*].Instances[*].[InstanceId]" --output text
```

To capture the RDS_ENDPOINT for the database, run the following command:

```bash
aws rds describe-db-instances --filters "Name=db-instance-id,Values=<env>-matomo-rds" --query "DBInstances[*].Endpoint.Address" --output text
```

```bash
aws ssm start-session --target i-xxxxxxxxxxxxxxxxx
```

Once connected, run the following commands (untar database dump, load it into RDS):

```bash
bash
cd
tar xvf <env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz
sudo apt install mysql-client-core-8.0
mysql matomo -h <RDS_ENDPOINT> -P 3306 -u matomo -p < <env>-matomo-mysql5734.sql
exit
exit
```

Once the database is loaded, wait for the Matomo instance to stabilize. Then, log in to the Matomo web UI and verify that all is well.

## WIP: Troubleshooting

It **is** possible to SSH into the Matomo container while it is running in ECS:

```bash
aws ecs execute-command --region {name-of-the-region} --cluster {name-of-the-cluster} --task {task number} --command "/bin/bash" --interactive
```

## WIP: Upgrade Database Engine

The database engine is managed by [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo).

## Update Matomo version

1. Ensure that a backup of the current `config/config.ini.php` exists in the EFS mount.
1. Publish updated container to ECR.
1. Deploy updated container for ECS service.
1. Verify via webUI that the Matomo installation is ready to be upgraded.
1. SSH (via AWSCLI + Session Manager) to the container and run the upgrade on the CLI. (It might be possible to do this via the web UI, but there seems to be a timeout issue related to health checks)
1. Copy updated `config/config.ini.php` to the EFS mount.
1. Verify that there were no changes to the `config.ini.php` file that need to be captured here.
1. Relaunch the container.
