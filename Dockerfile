######################################################
#
# Agave ToGo Web Container Image
# Tag: agaveapi/togo
#
# This is the image hosting the static assets comprising
# Agave ToGo. SSL is supported.
#
# https://bitbucket.org/agaveapi/agave-togo
# http://togo.agaveapi.co
#
######################################################

FROM agaveapi/httpd:2.4

MAINTAINER Rion Dooley <dooley@tacc.utexas.edu>

ADD . /var/www/html

ENV DOCUMENT_ROOT /var/www/html
