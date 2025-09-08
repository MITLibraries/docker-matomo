FROM matomo:5.4.0
  # checkov:skip=CKV_DOCKER_2:Skipping HEALTHCHECK configuration for now
  # checkov:skip=CKV_DOCKER_3:The container actually runs as www-data user

# Add the EnvironmentVariables plugin
COPY ./files/plugin-EnvironmentVariables-5.0.3/ /var/www/html/plugins/EnvironmentVariables

# Add the CustomVariables plugin
COPY ./files/plugin-CustomVariables-5.0.4/ /var/www/html/plugins/CustomVariables

# Add the HeatmapSessionRecording plugin
COPY ./files/plugin-HeatmapSessionRecording-5.2.4/ /var/www/html/plugins/HeatmapSessionRecording

# Add the UsersFlow plugin
COPY ./files/plugin-UsersFlow-5.0.5/ /var/www/html/plugins/UsersFlow

# Add the SearchEngineKeywordsPerformance plugin
COPY ./files/plugin-SearchEngineKeywordsPerformance-5.0.22/ /var/www/html/plugins/SearchEngineKeywordsPerformance

# Add the CustomReports plugin
COPY ./files/plugin-CustomReports-5.4.3/ /var/www/html/plugins/CustomReports

# Our custom configuration settings.
COPY ./files/config.ini.php /var/www/html/config/config.ini.php

# The HeatmapSessionRecording and UsersFlow update the matomo.js and piwik.js
# files when they are activated. Those updates have been captured and we
# pre-load them here (we put them in /usr/src because the entrypoint.sh builds 
# the /var/www/html folder from the /usr/src/matomo folder.
COPY --chmod=0644 ./files/post_premium_plugins_matomo.js /usr/src/matomo/matomo.js
COPY --chmod=0644 ./files/post_premium_plugins_piwik.js /usr/src/matomo/piwik.js

# Address "public" directories problem
COPY --chmod=0644 --chown=root:root ./files/lang-htaccess /usr/src/matomo/lang/.htaccess
COPY --chmod=0644 --chown=root:root ./files/config-htaccess /usr/src/matomo/config/.htaccess
COPY --chmod=0644 --chown=root:root ./files/tmp-htaccess /usr/src/matomo/tmp/.htaccess

# Create mount point for EFS partition
RUN mkdir -p /mnt/efs

# Fix the installation line in the entrypoint script. We have to modify this 
# because we enforce the uid/gid via the AWS EFS Access Point configuration.
RUN sed -i 's|tar xf -|tar xf - --no-same-owner|' /entrypoint.sh

# Move in the "backup persistent files" script
COPY --chmod=0755 ./files/backup-data.sh /usr/local/bin/backup-data.sh

EXPOSE 80
