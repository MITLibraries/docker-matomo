# How-to instructions

Detailed how-to instructions for initial migration from legacy AWS scenario.

## Migrate from Legacy AWS

This generally follows the [Matomo documentation](https://matomo.org/faq/how-to/how-do-i-backup-and-restore-the-matomo-data/). The following notes are specific to our access to RDS in the two different AWS accounts.

### Overview

The general migration plan is

1. Run a clean deploy of the [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo) resources in the AWS Org account (Dev1 or Stage-Workloads or Prod-Workloads)
1. Start the special EC2 instance in the account (Dev1 or Stage-Workloads or Prod-Workloads).
1. In Legacy AWS, use `mysqldump` to export the database (using the special EFS-access EC2 instance)
1. Copy the export file to Dev1 in AWS Org.
1. In Dev1, use `mysql` CLI to load export file into existing DB instance (using the special EC2 instance)
1. Restart the Matomo ECS service.

Before getting started, make sure that you have access to the `root` password for the RDS instance in legacy AWS (needed for the `mysqldump` command) and the `matomo` password for the RDS instance in Dev1/Stage-Workloads/Prod-Workloads (needed for the `mysql` command).

### Legacy AWS

In the legacy Stage/Prod account, log in to the `matomo-efs-mgmt` EC2 instance (`<env>` is either `stage` or `prod` depending on the database being backed up). Requires AWS CLI v2, AWS Session-Manager Plugin for AWSCLI.

To capture the InstanceID of the EC2 instance to connect to, run the following command:

```bash
aws ec2 describe-instances --filters "Name=tag:Name,Values=matomo-efs-mgmt" --query "Reservations[*].Instances[*].[InstanceId]" --output text
```

To capture the RDS_ENDPOINT for the database, run the following command:

```bash
aws rds describe-db-instances --filters "Name=db-instance-id,Values=analytics-<env>" --query "DBInstances[*].Endpoint.Address" --output text
```

To connect to the instance, run the following command (the value for `--target` is the output from the `aws ec2` command above)

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

Then, authenticate to the target AWS Account (easiest to do with copy/paste of credentials from AWS SSO) and copy it to  EC2 instance in the AWS Org Account (which will take about 10 minutes):

```bash
<authenticate to target AWS Account>
aws ec2 describe-instances --filters "Name=tag:Name,Values=matomo-efs-mgmt" --query "Reservations[*].Instances[*].[InstanceId]" --output text
scp -i ~/.ssh/<env>_ec2.private <env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz ubuntu@i-yyyyyyyyyyyyyyyyy:~/<env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz
exit
exit
```

### AWS Organization

In the AWS Org Account, log in to the `Matomo-efs-mgmt` EC2 instance. Requires AWS CLI v2, AWS Session-Manager Plugin for AWSCLI.

To capture the InstanceID of the EC2 instance to connect to, run the following command:

```bash
aws ec2 describe-instances --filters "Name=tag:Name,Values=matomo-efs-mgmt" --query "Reservations[*].Instances[*].[InstanceId]" --output text
```

To capture the RDS_ENDPOINT for the database, run the following command:

```bash
aws rds describe-db-instances --filters "Name=db-instance-id,Values=matomo-mariadb-<env>" --query "DBInstances[*].Endpoint.Address" --output text
```

```bash
aws ssm start-session --target i-xxxxxxxxxxxxxxxxx
```

Once connected, run the following commands (untar database dump, load it into RDS):

```bash
bash
cd
tar xvf <env>-matomo-mysql-database-<DATETIMESTAMP>.sql.tar.gz
sudo apt install mariadb-client-core-10.3
mysql matomo -h <RDS_ENDPOINT> -P 3306 -u matomo -p < <env>-matomo-mysql5734.sql
exit
exit
```

Once the database is loaded, log in to the Matomo web UI and verify that all is well.
