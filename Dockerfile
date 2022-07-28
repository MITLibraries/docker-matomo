FROM matomo:3.13.6-apache

# Add the EnvironmentVariables plugin
COPY ./files/plugin-EnvironmentVariables-3.0.0/ /var/www/html/plugins/EnvironmentVariables

# Preconfigure settings
COPY ./files/config.ini.php /var/www/html/config/config.ini.php

# Create mount point for EFS partition
RUN mkdir -p /mnt/efs

EXPOSE 80
