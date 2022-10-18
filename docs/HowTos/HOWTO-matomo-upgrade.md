# How-to instructions

Detailed how-to instructions for upgrade scenarios.

## Upgrade Database Engine

The database engine is managed by [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo). In testing, Matomo had no problems with database engine upgrades through different MariaDB versions.

## Update Matomo version

1. Ensure that a backup of the current `config/config.ini.php` exists in the EFS mount.
1. Publish updated container to ECR.
1. Deploy updated container for ECS service.
1. Verify via webUI that the Matomo installation is ready to be upgraded.
1. SSH (via AWSCLI + Session Manager) to the container and run the upgrade on the CLI (see the [Troubleshooting](./HOWTO-miscellaneous.md) section for the AWS CLI connection command). The database update command is `php /var/www/html/console core:update`.
1. For the 3.x to 4.x upgrade, there is an additional step to update to the utf8mb4 character set. Once the database upgrade is complete, run `/var/www/html/console core:convert-to-utf8mb4` to update the tables.
1. Copy updated `config/config.ini.php` to the EFS mount.
1. Verify that there were no changes to the `config.ini.php` file that need to be captured back in this repo.
1. Log back in to the webUI to verify that everything is working.
