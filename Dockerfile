######################################################
#
# Agave Apache PHP Base Image
# Tag: agaveapi/api-base-images
#
# This is the base image for Agave's PHP APIs. It
# builds a minimal image with apache2 + php 5.5 + composer
#
# with support for auto-wiring database connections,
# CORS support, and unified logging to standard out.
#
# https://bitbucket.org/agaveapi/php-api-base
# http://agaveapi.co
#
######################################################

FROM alpine:3.2
MAINTAINER Rion Dooley <dooley@tacc.utexas.edu

RUN apk --update --no-progress add nodejs bash git build-base \
    && git clone https://github.com/sass/sassc
RUN cd sassc \
    && git clone https://github.com/sass/libsass \
    && SASS_LIBSASS_PATH=/sassc/libsass make \
    && mv bin/sassc /usr/bin/sass \
    && cd / \
    && rm -rf /sassc

ADD . /agave-togo

WORKDIR /agave-togo

RUN SKIP_SASS_BINARY_DOWNLOAD_FOR_CI=true npm install --production
#    && apk del git build-base \
#    && apk add libstdc++ \
#    && rm -rf /var/cache/apk/*

EXPOSE 9000

CMD ["npm", "start"]