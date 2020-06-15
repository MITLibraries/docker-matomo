FROM matomo:latest

# Install system dependencies
RUN apt-get update && apt-get upgrade -y 

RUN mkdir -p /var/www/html/tmp \
      && chmod -R a+w /var/www/html/tmp

EXPOSE 80 443






