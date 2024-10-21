# Search Analytics (Matomo)

This repository supports MIT Libraries' implementation of [Matomo](https://matomo.org/), which we use to collect discovery analytics. Our implementation uses the Docker container provided by Matomo. We host the application in AWS Fargate.

## Dependencies

* Deploying this container to AWS requires that the AWS ECR Repository for the container has been created by the [mitlib-tf-workloads-ecr](https://github.com/MITLibraries/mitlib-tf-workloads-ecr) repository.
* Running this container in AWS requires the [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo) infrastructure repository.
* Building this container requires access to [Official Docker Matomo](https://hub.docker.com/_/matomo/).

## Dev/Test Build

Run `make dist-dev` to create a new container tagged as `matomo:latest`.

## Dev/Test Deploy

Run `make publish-dev` to build, tag, and push a container to Dev1 for testing, or open a PR to `main` (a GitHub Action will build, tag, push the container for you).

## Stage Builds and Promotion to Prod

Merge a PR to `main` to build, tag, and push the container to Stage-Workloads. After merging the PR to `main`, tag a release on the `main` branch to promote to production. GitHub Actions in this repo will take care of the build, tag, push to Stage and the copy from Stage to Production.

**Important Note**: There is no automation in GitHub to automatically deploy the new container after it is push to the ECR repository in AWS. At this time, the only method to deploy the updated container is to force a new deployment of the Matomo service via the AWS Console.

## Implementation notes

For detailed instructions on initial setup, migration, database upgrades, and application upgrades, check the [HowTos](./docs/HowTos/) folder.

### Configuration Management

"State" for Matomo is managed/stored in at most two locations:

* the `config.ini.php` file
* the MariaDB database

The `config.ini.php` file contains some core Matomo configuration. There are a couple of sections worth addressing. First, a note about a special plugin we use.

#### The EnvironmentVariables Plugin

We use the [EnvironmentVariables](https://plugins.matomo.org/EnvironmentVariables) plugin that allows us to set configuration values for Matomo via environment variables via the [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo) infrastructure repo.

The current practice is to set the following core configuration information in `config.ini.php` via environment variables. 

* Database connection information
* SSL/TLS configuration
* SMTP information

The remainder of the configuration values should be set by modifying the [config.ini.php](./files/config.ini.php) file and building an updated container.

#### [Plugins] and [PluginsInstalled]

The `[Plugins]` section tells Matomo which plugins to enable on installation. To disable a plugin, simply remove it from this section. Our preference is to modify this section and not the `PluginsInstalled` section, as removing a plugin from `PluginsInstalled` would remove it from the application completely. While plugins can get installed in the container build, they are not automatically activated. There are two activation methods that can be used: via the web UI or via the CLI. See [Install a new plugin](https://matomo.org/faq/plugins/faq_21/) in the official Matomo documentation.

Any time plugins are installed/removed, it is imperative to capture a backup of the `config.ini.php` file (via the EFS partition) before launching the updated container and then compare it to the `config.ini.php` file after verifying that the plugin is activated. This is one of the few situations where the Matomo application might update/overwrite the `config.ini.php` file.

#### [Mail]

The `[mail]` section configures the SMTP server. Matomo uses mailers for several core functions, including password resets and reporting. Some related config values (e.g., `login_password_recovery_email_address`) are defined in the `[General]` section.

All of the settings in `[mail]` are managed via environment variables that are set by the [mitlib-tf-workloads-matomo](https://github.com/mitlibraries/mitlib-tf-workloads-matomo) infrastructure repo.

#### [General]

The `[General]` section handles other configurations. A few of these settings are covered by the EnvironmentVariables plugin, but the rest are managed in this code.

#### Other configuration

The database stores the rest of the state of Matomo: all the data itself along with the Superuser credentials and the other user accounts and credentials.

### Data anonymization

We anonymize tracking data to protect our users' privacy. Specifically, we mask two bytes of visitors' IPs (e.g., 192.186.x.x), and we have disabled [Matomo's User ID plugin](https://matomo.org/docs/user-id/).

Before promoting a new build to production, ensure that IPs are anonymized by visiting Administration -> Privacy -> Anonymize data in the GUI. (You shouldn't ever need to modify these settings, but it's important to verify as part of the deploy process.)

### Archiving reports

Matomo calls the process by which it compiles raw log data into human-readable report 'archiving'. By default, archiving occurs on demand, whenever a Matomo user attempts to view a report in the GUI. Following [Matomo's recommendation](https://matomo.org/docs/setup-auto-archiving/) to schedule this, the mitlib-tf-workloads-matomo infrastructure repository creates an EventBridge rule/schedule for running the reporting archiving hourly.

### Authentication

The superuser account can create and manage user accounts in the GUI (Administration -> System -> Users). After creating a new account, the superuser should notify the account holder. The account holder can then reset their password by clicking the 'Lost your password?' link on the Matomo sign-in page.

We generally assign the 'View' role to new users, unless they require a higher permissions level.

Matomo has built-in two-factor authentication, which we enforce for all accounts. When a user logs in to Matomo for the first time, they will be prompted to configure 2FA. At this time, we are recommending Duo as an authenticator.

#### Recover from lost 2FA

See the official [Recover from lost 2FA](https://matomo.org/faq/how-to/faq_27248) documentation. This allows us to recover the Superuser login if we lose the 2FA information.

## Additional documentation

* [MIT Libraries dev docs](https://mitlibraries.github.io/guides/misc/matomo.html) - includes information about setting up a website for tracking in Matomo.
* [Matomo help center](https://matomo.org/help/) - offical Matomo docs. Includes user guide, developer guide, FAQ, and community support forum.
