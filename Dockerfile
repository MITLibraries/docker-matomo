FROM matomo:5.3.1
  # checkov:skip=CKV_DOCKER_2:Skipping HEALTHCHECK configuration for now
  # checkov:skip=CKV_DOCKER_3:Intentionally using root for the user

# Add the EnvironmentVariables plugin
COPY ./files/plugin-EnvironmentVariables-5.0.3/ /var/www/html/plugins/EnvironmentVariables

# Add the CustomVariables plugin
COPY ./files/plugin-CustomVariables-5.0.4/ /var/www/html/plugins/CustomVariables

# Add the HeatmapSessionRecording plugin
COPY ./files/plugin-HeatmapSessionRecording-5.2.3/ /var/www/html/plugins/HeatmapSessionRecording

# Add the UsersFlow plugin
COPY ./files/plugin-UsersFlow-5.0.5/ /var/www/html/plugins/UsersFlow

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
