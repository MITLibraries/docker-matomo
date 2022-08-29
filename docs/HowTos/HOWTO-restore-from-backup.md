# How-to instructions

Detailed how-to instructions for restore scenarios.

## Restore from Backup

Most of this is documented in the [Matomo documentation](https://matomo.org/faq/how-to/how-do-i-backup-and-restore-the-matomo-data/). Their instructions rely on `mysqldump`. The details below are specific to MIT Libraries and AWS RDS backups/snapshots.

1. Restore snapshot to new database `matomo-restored`, ensuring that the configuration matches the original (as defined in the [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo) code).

    1. Scroll down to the **Snapshots** section on the Database page in RDS for the Matomo database.
    1. Select the snapshot you wish to restore.
    1. Click the Restore button.
    1. Correct the DB Instance Class setting (it defaults to something much too large).
    1. Enter `matomo-restored` in the DB Instance Identifier field.
    1. Remove the `default` VPC Security Group and add the `matomo-mariadb-<env>` VPC Security Group.
    1. The rest of the settings can stay at defaults.
    1. Start the restore and then wait (for about 10 minutes).

1. Modify original RDS database to have a new identifier like `matomo-old`. Note that this will cause your endpoint to change, so your app will lose connectivity when AWS completes the modification.

    1. Click the **Modify** button on the Database page in RDS for the Matomo database.
    1. Change the DB Instance identifier to `matomo-old`
    1. Change the DB parameter group to the `matomo-mariadb-stage-mariadb-102` then click the **Continue** button.
    1. Select the "Apply immediately" option then click the **Modify DB Instance** button.
    1. Wait for about 10 minutes. During this time, the Matomo ECS service will start reporting error since it will lose contact with the database.

1. Modify the `matomo-restored` to have the original database identifier (e.g., `<env>-matomo-rds`). This will change the endpoint to match the original endpoint.

    * Follow the same sequence as above, but change name to `matomo-mariadb-<env>`.

1. Run TfC-triggered `terraform plan` to capture any other changes. Apply the plan to get back in sync.
1. Log in to the Matomo web UI, navigate to the Settings/Plugins and **Activate** the EnvironmentVariables plugin and **Deactivate** the UserID plugin.
