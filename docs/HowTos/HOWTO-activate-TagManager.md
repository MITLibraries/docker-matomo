# TagManager core plugin activation

Turns out that the TagManager core plugin needs some extra care and attention if it wasn't initially enabled when first starting with Matomo. Attempting to activate it the usual way causes Matomo to break.

This GitHub Issue documents that problem and provides a simple (but strange) solution:

* [Issue: Can't install TagManager plugin because table _tagmanager_container is missing](https://github.com/matomo-org/matomo/issues/19474)

For our container-based deploy, this means

1. connect to the running container
1. ensure that a simple text editor is available in the container
1. deactivate the TagManager plugin: `su -s /bin/bash -c "/var/www/html/console plugin:deactivate TagManager" www-data`
1. edit the config/config.ini.php file to remove the `PluginsInstalled[] = "TagManager"` line
1. run the `core:update` command: `su -s /bin/bash -c "/var/www/html/console core:update" www-data` (nothing should happen)
1. activate the TagManager plugin: `su -s /bin/bash -c "/var/www/html/console plugin:activate TagManager" www-data`
1. run the `core:update` command again: `su -s /bin/bash -c "/var/www/html/console core:update" www-data` (nothing should happen)

The appropriate updates to the database will now be in place.

At this point, proceed with updates to this repository by updating the `config.ini.php` file to match the file from the container.
