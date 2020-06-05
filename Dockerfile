FROM matomo

EXPOSE 80 443

# Install system dependencies
RUN apt-get update && apt-get install -y unzip

VOLUME /var/www/html

# Allow to write in tmp directory
RUN 

# Copy Matomo configuration
COPY config.ini.php /var/www/html/config/config.ini.php

