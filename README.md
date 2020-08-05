# Search Analytics (Matomo)

This repository supports MIT Libraries' implementation of (Matomo)[https://matomo.org/],
which we use to collect discovery analytics. Our implementation uses the Docker
container provided by Matomo. We host the application in AWS Fargate.

## Building

Run `make build` to create a new container tagged as `analytics-stage:latest`.

## Deploying

Run `make dist` to build, tag, and push a container to staging. To promote to
production, run `make publish`.

Please see the corresponding (Terraform module)[https://github.com/MITLibraries/mitlib-terraform/tree/master/apps/analytics] for deployment config.

## URLs

- Staging: analytics-stage.mitlib.net (MIT VPN access only)
- Production: analytics-prod.mitlib.net

## Implementation notes

### PHP configuration file

`config.ini.php` file contains some basic Matomo configuration. There are a
couple of sections worth addressing:

1. The `Plugins` section tells Matomo which plugins to enable on installation.
   To disable a plugin, simply remove it from this section. Our preference is to
   modify this section and not the `PluginsInstalled` section, as removing a
   plugin from `PluginsInstalled` would remove it from the application completely.
2. The `mail` section configures the SMTP server. Matomo uses mailers for
   several core functions, including password resets and reporting. Some related
   config values (e.g., `login_password_recovery_email_address`) are defined in
   the `General` section.

When deploying from scratch, we noticed that the initial Matomo setup in the GUI
seems to overwrite our config. As a result, it may be necessary on rare occasion
to spin up an EC2 instance to touch the config file directly. So far, we've
only had to do this after the initial deploy, so it's unlikely to come up often.

### Data anonymization

We anonymize tracking data to protect our users' privacy. Specifically, we mask
two bytes of visitors' IPs (e.g., 192.186.x.x), and we have disabled [Matomo's
User ID plugin](https://matomo.org/docs/user-id/).

Before promoting a new build to production, ensure that IPs are anonymized by
visiting Administration -> Privacy -> Anonymize data in the GUI. (You shouldn't
ever need to modify these settings, but it's important to verify as part of the
deploy process.)

### Archiving reports

Matomo calls the process by which it compiles raw log data into human-readable
report 'archiving'. By default, archiving occurs on demand, whenever a Matomo
user attempts to view a report in the GUI. Based on [Matomo's recommendation](https://matomo.org/docs/setup-auto-archiving/), we have configured a cron job to archive reports every
hour.

The cron job runs as a scheduled ECS task and is defined in the
[Terraform config](https://github.com/MITLibraries/mitlib-terraform/tree/master/apps/analytics).

### Authentication

The superuser account can create and manage user
accounts in the GUI (Administration -> System -> Users). After creating a new
account, the superuser should notify the account holder. The account holder
can then reset their password by clicking the 'Lost your password?' link on the
Matomo sign-in page.

We generally assign the 'View' role to new users, unless they require a higher
permissions level.

Matomo has built-in two-factor authentication, which we enforce for all accounts.
When a user logs in to Matomo for the first time, they will be prompted to
configure 2FA. At this time, we are recommending Duo as an authenticator.
