# Premium Plugins

Premium plugins are those that require a license key. In our docker-ized implementation of Matomo, this gets tricky.

After some initial testing in Dev1, it's not as simple as just dumping the new plugin into the container and redeploying because of the following reasons.

1. The license key is stored in the database, **NOT** in the `config.ini.php` file.
1. Some plugins require changes to the database tables or just new tables. This requires that the plugin installation process is triggered to kick off the script that updates the tables.
1. The *Marketplace* plugin must be active for license keys to work.

## The config.ini.php file

The `config.ini.php` file has two lists of plugins under two different headings.

* One heading, `[PluginsInstalled]` is the list of plugins that are installed (but might be active or inactive) on the server. This should be a 1-1 match for the folders in the `/var/www/html/plugins` folder in the container.
* The other heading, `[Plugins]` is the list of **active** plugins. 
* Each plugin might have its own section in the `config.ini.php` file with plugin-specific settings.

In the end, the premium plugin installation is a two-pass process.

## Process

### High level overview

1. Install license key (via UI or CLI) so that it is in the database.
2. Go through a dev -> stage -> prod deployment cycle of the container to install the plugin folder(s) into the container.
3. Activate the new plugin(s) (via UI or CLI) so that any database changes are properly executed.
4. Go through a dev -> stage -> prod deployment cycle of the container to match the updated `config.ini.php` file on the server.

### Details for each step

#### 1. Install the license key

Before installing the license key, the *Marketplace* plugin must be activated. This is a one-time update to the `config.ini.php` file to add the *Marketplace* pluging to the `[Plugins]` section.

According to the support team at Matomo, the premium license key can be installed in two instances of Matomo, "stage" and "prod." So, we can do some initial validation of a license key in Dev1, but the key cannot remain installed in the Dev1 instance. The license key installation can either be done by a user with "superuser" privileges in the Matomo web UI or it can be done by a member of InfraEng who has ssh access to the running container task/service. The CLI command is

```bash
./console marketplace:set-license-key --license-key=LICENSE-KEY "<key>"
```

This needs to be done on each of the stage & prod instances of Matomo.

#### 2. Install the plugin files

In this phase, the files are installed in the container *but no changes are made to the `config.ini.php` file. This will **not** activate the plugins, it will just make them visible in the UI.

#### 3. Activate the plugin

Once the plugin files are installed in the container, it's time to activate the plugin. In the UI, it's just a matter of clicking the `Activate` link for the plugin. For the CLI, the command is

```bash
./console plugin:activate [<plugin>...]
```

This will change the `config.ini.php` file on the container. It is **very** important to capture these changes and put them back in the `config.ini.php` in the container (see step 4).

#### 4. Backfill this repo

Update the `config.ini.php` file in this repo and go through another dev -> stage -> prod deployment to ensure that the repo code matches the container running in AWS.
