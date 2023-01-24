# How-to instructions

Detailed how-to instructions to compare the running copy of config.ini.php to the version in this repo.

## Command line access

1. Log in to the [AWS Console](https://mitlib.awsapps.com/start#/) to retrieve your `Command line or programmatic access` credentials.
1. Copy the appropriate OS information and paste it into your local terminal.
1. Log in to the docker container in ECS - See [docker-matomo/docs/HowTos/HOWTO-miscellaneous.md](https://github.com/MITLibraries/docker-matomo/blob/main/docs/HowTos/HOWTO-miscellaneous.md) for instructions.
1. Run the backup script:

   ```bash
   /usr/local/bin/backup-data.sh
   ```

1. Access the EFS mounted copy of config.ini.php.

   ```bash
   more /mnt/efs/config/config/config.ini.php # Hit space until all content is revealed
   ```

1. Copy/paste this information into a new file in your local editor and save as dev.ini (or other name of your choice).
1. Compare the 2 files for any differences.  Ignore any changes in these sections:
   * [database]
   * [Tracker]
   * [mail]
   * **NB** Comment lines are not copied to the running/backup copy of config.ini.php.
1. Verify information in the [General] section. **NB** Sometimes the order of various settings will change between Matomo versions
1. Copy any differences in [Plugins] and [PluginsInstalled] to the repo copy of config.ini.php and save.
