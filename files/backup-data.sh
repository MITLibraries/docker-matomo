#!/bin/bash

/bin/cp -r /var/www/html/config/ /mnt/efs/config/
/bin/cp -r /var/www/html/misc/user /mnt/efs/misc_user
/bin/cp -r /var/www/html/js/ /mnt/efs/js/
/bin/cp -r /var/www/html/matomo.js /mnt/efs/matomo.js
/bin/cp -r /var/www/html/piwik.js /mnt/efs/piwik.js
