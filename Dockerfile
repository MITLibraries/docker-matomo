FROM matomo:4.13.1

# Add the EnvironmentVariables plugin
COPY ./files/plugin-EnvironmentVariables-4.0.1/ /var/www/html/plugins/EnvironmentVariables
COPY ./files/plugin-CustomVariables-4.1.1/ /var/www/html/plugins/CustomVariables

# Preconfigure settings
COPY ./files/config.ini.php /var/www/html/config/config.ini.php

# Address "public" directories problem
COPY --chmod=0644 --chown=root:root ./files/lang-htaccess /var/www/html/lang/.htaccess
COPY --chmod=0644 --chown=root:root ./files/config-htaccess /var/www/html/config/.htaccess
COPY --chmod=0644 --chown=root:root ./files/tmp-htaccess /var/www/html/tmp/.htaccess


# Create mount point for EFS partition
RUN mkdir -p /mnt/efs

# Move in the "backup persistent files" script
COPY --chmod=0755 ./files/backup-data.sh /usr/local/bin/backup-data.sh

EXPOSE 80
