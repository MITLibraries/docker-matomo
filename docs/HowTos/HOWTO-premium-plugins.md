# Premium Plugins

Premium plugins are those that require a license key. In our docker-ized implementation of Matomo, this gets tricky.

After some initial testing in Dev1, it's not as simple as just dumping the new plugin into the container and redeploying because of the following reasons.

1. The license key is stored in the database, **NOT** in the `config.ini.php` file.
1. Some plugins require changes to the database tables or just new tables. This requires that the plugin installation process is triggered to kick off the script that updates the tables.
1. The *Marketplace* plugin must be active for license keys to work.

## A note about the config.ini.php file

The `config.ini.php` file has two lists of plugins under two different headings.

* One heading, `[PluginsInstalled]` is the list of plugins that are installed (but might be active or inactive) on the server. This should be a 1-1 match for the folders in the `/var/www/html/plugins` folder in the container.
* The other heading, `[Plugins]` is the list of **active** plugins. 
* Each plugin might have its own section in the `config.ini.php` file with plugin-specific settings.

In the end, the premium plugin installation is a two-pass process.

## Process to Install New Premium Plugin

### High level overview

1. Install license key (via UI or CLI) so that it is in the database (this only needs to be done once as all future premium plugins get linked to the same license key).
2. Go through a dev -> stage -> prod deployment cycle of the container to install the plugin folder(s) into the container
3. Activate the new plugin(s) (via UI or CLI) so that any database changes are properly executed.
4. Go through a dev -> stage -> prod deployment cycle of the container to match the updated `config.ini.php` file on the server.

### Details for each step

#### 1. Install the license key

Before installing the license key, the *Marketplace* plugin must be activated. This is a one-time update to the `config.ini.php` file to add the *Marketplace* pluging to the `[Plugins]` section - all new premium plugin purchases are linked to the same license key.

According to the support team at Matomo, the premium license key can be installed in two instances of Matomo, "stage" and "prod." So, we can do some initial validation of a license key in Dev1, but the key cannot remain installed in the Dev1 instance. The license key installation can either be done by a user with "superuser" privileges in the Matomo web UI or it can be done by a member of InfraEng who has ssh access to the running container task/service. The CLI command is

```bash
./console marketplace:set-license-key --license-key=<license_key>
```

This needs to be done once on each of the stage & prod instances of Matomo.

**Note**: It is possible to add the license key to the Dev1 instance of Matomo for a short period of time for testing a new premium plugin without breaking either the Stage or Prod instances of Matomo. This is useful for the initial test of a new premium plugin.

#### 2. Install the plugin files

First, download the plugin source files from shop.matomo.org (use the username/password in the "Matomo Plugins" secret in LastPass to log in). Once the .zip files are downloaded, expand them and save them in the `files/` folder in this repository.

Second, update the [Dockerfile](../../Dockerfile) with a new `COPY` command to copy the the plugin files to the correct directory in the image.

In this phase, the files are installed in the container **but** no changes are made to the `config.ini.php` file. This will **not** activate the plugins, it will just make them visible in the UI.

**Note**: It is possible to do this with the `/var/www/html/console` utility when logged in to the cli of the running conatiner. However, that method introduces potential file permission errors since the command is run as `root` and the content in the `/var/www/html` folder needs to be owned by `www-data`.

#### 3. Activate the plugin

Once the plugin files are installed in the container, it's time to activate the plugin. In the UI, it's just a matter of clicking the `Activate` link for the plugin. For the CLI, the command is

```bash
./console plugin:activate [<plugin>...]
```

This will change the `config/config.ini.php` file -- which is actually persisted on the EFS filesystem linked to the container. It is important to capture any changes that happen in this file so that we can back-fill this repository in case we need to redeploy in a DR scenario.

It's also important to note that this `plugin:activate` command very likely makes changes to the database (adding/removing tables/columns or other changes).

#### 4. Backfill this repo

Update the `config.ini.php` file in this repo and go through another dev -> stage -> prod deployment to ensure that the repo code matches the container running in AWS.

## Process to Upgrade Existing Premium Plugin

See the [HOWTO-matomo-upgrade](./HOWTO-matomo-upgrade.md) documentation. Premium plug updates are the same as regular plugin updates.
