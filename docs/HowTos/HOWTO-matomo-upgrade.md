# How-to instructions

Detailed how-to instructions for upgrade scenarios.

## Upgrade Database Engine

The database engine is managed by [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo). In testing, Matomo had no problems with database engine upgrades through different MariaDB versions.

## Update Matomo version

1. Ensure that a backup of the current `config/config.ini.php` exists in the EFS mount.
1. Publish updated container to ECR.
1. Deploy updated container for ECS service.
1. Verify via webUI that the Matomo installation is ready to be upgraded.
1. SSH (via AWSCLI + Session Manager) to the container and run the upgrade on the CLI (see the [Troubleshooting](./HOWTO-miscellaneous.md) section). It might be possible to do this via the web UI, but there seems to be a timeout issue related to health checks.
1. Copy updated `config/config.ini.php` to the EFS mount.
1. Verify that there were no changes to the `config.ini.php` file that need to be captured here.
1. Relaunch the container.
