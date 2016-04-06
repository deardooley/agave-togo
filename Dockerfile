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

FROM mhart/alpine-node:4

MAINTAINER Rion Dooley <dooley@tacc.utexas.edu

RUN \
    # Install sass
    apk --update add git build-base python && \
    git clone https://github.com/sass/sassc && \
    cd sassc && \
    git clone https://github.com/sass/libsass && \
    SASS_LIBSASS_PATH=/sassc/libsass make && \

    # install
    mv bin/sassc /usr/bin/sass && \

    # cleanup
    cd / && \
    rm -rf /sassc && \
    # sass binary still needs this because of dynamic linking.
    apk add libstdc++

COPY *.json /agave-togo/

RUN \
    cd /agave-togo && \
    # Now build the static assets
    npm install

COPY assets/global/plugins /agave-togo/assets/global/plugins

RUN \
    cd /agave-togo && \
    apk del build-base python && \
    rm -rf /var/cache/apk/* && \
    node_modules/bower/bin/bower  --allow-root install && \

COPY . /agave-togo/

RUN \
    cd /agave-togo && \
    node_modules/gulp/bin/gulp.js minify && \

RUN \
    cd /agave-togo && \
    cp -rf html /var/www/ && \
    cd / && \
    rm -rf /agave-togo

ADD docker_entrypoint.sh /docker_entrypoint.sh

EXPOSE 80 443 9000

CMD ["httpd", "-D", "FOREGROUND"]