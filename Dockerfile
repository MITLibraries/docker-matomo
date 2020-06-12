FROM matomo:latest

# Install system dependencies
RUN apt-get update && apt-get upgrade -y 

EXPOSE 80 443

