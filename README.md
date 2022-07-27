# Search Analytics (Matomo)

This repository supports MIT Libraries' implementation of [Matomo](https://matomo.org/), which we use to collect discovery analytics. Our implementation uses the Docker container provided by Matomo. We host the application in AWS Fargate.

## Dependencies

* Deploying this container to AWS requires that the AWS ECR Repository for the container has been created by the [mitlib-tf-workloads-ecr](https://github.com/MITLibraries/mitlib-tf-workloads-ecr) repository. 
* Building this container requires access to [Official Docker Matomo](https://hub.docker.com/_/matomo/).

## Build

Run `make dist-dev` to create a new container tagged as `matomo:latest`.

## Deploy

Run `make publish-dev` to build, tag, and push a container to Dev1 for testing, or open a PR to `main`. Merge a PR to `main` to build, tag, and push the container to Stage-Workloads. After merging the PR to `main`, tag a release to promote to production.

## Implementation notes

For detailed instructions on initial setup, migration, database upgrades, and application upgrades, see [docs/HOWTO.md](./docs/HOWTO.md).

### Configuration Management

"State" for Matomo is managed/stored in at most two locations:

* the `config.ini.php` file
* the MySQL database

The `config.ini.php` file contains some core Matomo configuration. There are a couple of sections worth addressing:

1. The `[Plugins]` section tells Matomo which plugins to enable on installation. To disable a plugin, simply remove it from this section. Our preference is to modify this section and not the `PluginsInstalled` section, as removing a plugin from `PluginsInstalled` would remove it from the application completely. *Sadly, with the container-based Matomo, it seems to only way to activate a plugin is to use the Matomo web UI*.
1. The `[mail]` section configures the SMTP server. Matomo uses mailers for several core functions, including password resets and reporting. Some related config values (e.g., `login_password_recovery_email_address`) are defined in the `[General]` section.
1. The `[General]` section handles other configurations. A few of these settings are covered by the EnvironmentVariables plugin, but the rest are managed in this code.

By using the [EnvironmentVariables](https://plugins.matomo.org/EnvironmentVariables) plugin for Matomo, we generally don't need to store much in the `config.ini.php` file. Instead, the [mitlib-tf-workloads-matomo](https://github.com/MITLibraries/mitlib-tf-workloads-matomo) code defines the key environment variables for the ECS service, overriding anything in `config.ini.php` and `global.ini.php`.

The database stores the rest of the state of Matomo: all the data itself along with the Superuser credentials and the other user accounts and credentials.

### Data anonymization

We anonymize tracking data to protect our users' privacy. Specifically, we mask two bytes of visitors' IPs (e.g., 192.186.x.x), and we have disabled [Matomo's User ID plugin](https://matomo.org/docs/user-id/).

Before promoting a new build to production, ensure that IPs are anonymized by visiting Administration -> Privacy -> Anonymize data in the GUI. (You shouldn't ever need to modify these settings, but it's important to verify as part of the deploy process.)

### Archiving reports

Matomo calls the process by which it compiles raw log data into human-readable report 'archiving'. By default, archiving occurs on demand, whenever a Matomo user attempts to view a report in the GUI. While [Matomo's recommendation](https://matomo.org/docs/setup-auto-archiving/) is to schedule this, we have **not** configured a cron job to archive reports at this time.

### Authentication

The superuser account can create and manage user accounts in the GUI (Administration -> System -> Users). After creating a new account, the superuser should notify the account holder. The account holder can then reset their password by clicking the 'Lost your password?' link on the Matomo sign-in page.

We generally assign the 'View' role to new users, unless they require a higher permissions level.

Matomo has built-in two-factor authentication, which we enforce for all accounts. When a user logs in to Matomo for the first time, they will be prompted to configure 2FA. At this time, we are recommending Duo as an authenticator.

## Additional documentation

* [MIT Libraries dev docs](https://mitlibraries.github.io/guides/misc/matomo.html) - includes information about setting up a website for tracking in Matomo.
* [Matomo help center](https://matomo.org/help/) - offical Matomo docs. Includes user guide, developer guide, FAQ, and community support forum.
