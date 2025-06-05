# How-to instructions

Detailed how-to instructions for upgrading Matomo.

## Upgrade Database Engine

The database engine is managed by [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo). In testing, Matomo had no problems with database engine upgrades through different MariaDB versions.

## Update Matomo version

These instructions assume you are working in the **dev** environment.  Change to the appropriate `<env>` tag if you are working in a different environment.

1. Ensure that an out-of-band backup of the current `config/config.ini.php` exists
   * SSH (via AWSCLI + Session Manager) to the container(see the [Troubleshooting](./HOWTO-miscellaneous.md) section for the AWS CLI connection command).
   * Run `cp /var/www/html/config/* /mnt/efs/backup/config`
1. Make any necessary changes to the repo.
   * For version upgrades, change line 1 in **Dockerfile** to the new version.
   * Verify plugin versions for compatibility with new version of Matomo. See **Update Matomo Plugins** below for more details.
1. Publish the updated container to ECR.
   * Run `make dist-dev` to create the updated container.
   * Run `make publish-dev` to push the new container to ECR and tag it as 'latest'.
1. Deploy updated container for ECS service.
   * Via the AWS Console:
   * Go to ECS
      * Click on **matomo-ecs-dev-cluster**
      * Click on the checkbox in **Services** next to `matomo-ecs-dev-service`
      * Click  `Update`
      * On the next page, expand **Deployment options** and choose `Force new deployment`
      * Click `Update`
   * Via AWS CLI
      * `aws ecs update-service --cluster matomo-ecs-dev-cluster --service matomo-ecs-dev-service --force-new-deployment`
   * Either method takes a few minutes to complete the deployment.  It's easiest to verify completion in the AWS Console.  A green bar will appear at the top of the page stating `Service updated: matomo-ecs-dev-cluster:matomo-ecs-dev-service`
1. Verify via webUI that the Matomo installation is ready to be upgraded.
   * (Infra members should have the "superuser" checkbox checked for their Matomo UI login; if not, please verify with UXWS)
   * This step is only necessary when a database update is required.
1. SSH (via AWSCLI + Session Manager) to the container and run the upgrade on the CLI (see the [Troubleshooting](./HOWTO-miscellaneous.md) section for the AWS CLI connection command).
   * The database update command is `php /var/www/html/console core:update`.
   * This step is only necessary when there is a required update to the table structure in Matomo listed in the release notes.
1. Compare the out-of-band `/mnt/efs/backup/config/config.ini/php` to the updated `config/config.ini.php` for changes.
1. Verify that there were no changes to the `config.ini.php` file that need to be captured back in this repo.
   * See [compare-ini-files](./HOWTO-compare-ini-files.md)
1. Log back in to the webUI to verify that everything is working.
   * (Infra members should have the "superuser" checkbox checked for their Matomo UI login; if not, please verify with UXWS)

## Update Matomo Plugins

Often, an update to the version of Matomo will require an update to a plugin version. See below for an overview of the plugin update process.

1. Ensure that an out-of-band backup of the current `config/config.ini.php` exists
   * SSH (via AWSCLI + Session Manager) to the container(see the [Troubleshooting](./HOWTO-miscellaneous.md) section for the AWS CLI connection command).
   * Run `cp /var/www/html/config/* /mnt/efs/backup/config`
1. Visit [Matomo plugins](https://plugins.matomo.org), select the correct version of Matomo, and then search for the plugins that are currently in use in our instance of Matomo.
   * If there is a newer version, download it from the site, unzip it, and store the unzipped folder in the [files/](../../files/) directory, following the naming convention in place (e.g., `plugin-<plugin_name>-<version>`)
1. Update the [Dockerfile](../../Dockerfile) to reference the newer version of the plugin stored in the [files/](../../files/) directory.
1. Proceed with the publishing process as outlined in the **Update Matomo Version** instructions above.
