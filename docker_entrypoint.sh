#!/bin/bash

# Dynamically set document root at container startup
if [[ -z "$DOCUMENT_ROOT" ]]; then
  DOCUMENT_ROOT=/var/www/html
fi

sed -i 's#%DOCUMENT_ROOT%#'$DOCUMENT_ROOT'#g' /etc/apache2/httpd.conf
sed -i 's#%DOCUMENT_ROOT%#'$DOCUMENT_ROOT'#g' /etc/apache2/conf.d/ssl.conf

# sed -i 's#%HOSTNAME%#'$HOSTNAME'#g' /etc/apache2/httpd.conf
# sed -i 's#%HOSTNAME%#'$HOSTNAME'#g' /etc/apache2/conf.d/ssl.conf

# Configure SSL as needed, defaulting to the self-signed cert unless otherwise specified.
if [[ -n "$SSL_CERT" ]]; then
  sed -i 's#^SSLCertificateFile .*#SSLCertificateFile '$SSL_CERT'#g' /etc/apache2/conf.d/ssl.conf
fi

if [[ -n "$SSL_KEY" ]]; then
  sed -i 's#^SSLCertificateKeyFile .*#SSLCertificateKeyFile '$SSL_KEY'#g' /etc/apache2/conf.d/ssl.conf
fi

if [[ -n "$SSL_CA_CHAIN" ]]; then
  sed -i 's#^\#SSLCertificateChainFile .*#SSLCertificateChainFile '$SSL_CA_CHAIN'#g' /etc/apache2/conf.d/ssl.conf
fi

if [[ -n "$SSL_CA_CERT" ]]; then
  sed -i 's#^\#SSLCACertificateFile .*#SSLCACertificateFile '$SSL_CA_CERT'#g' /etc/apache2/conf.d/ssl.conf
fi

# set the oauth client config to walk an implicit flow via the environment
# use this to define multiple tenant configs

echo "Checking for oauth client config...";
if [[ -n "$OAUTH_CLIENT_CONFIG" ]]; then

  echo "OAUTH_CLIENT_CONFIG was found in the environment. Writing config file...";
  echo -e "var OAuthClients = $OAUTH_CLIENT_CONFIG;" > "$DOCUMENT_ROOT/auth/implicit.js"
  echo "OAuth client config complete...";

# set a single oauth client config to walk an implicit flow via individual
# environment variables. If none are given, default to the
else

  if [[ ! -f "$DOCUMENT_ROOT/auth/implicit.js" ]]; then

    echo "No config file found at $DOCUMENT_ROOT/auth/implicit.js. Creating template from environment..."
    echo -e "var OAuthClients = { 'TENANT_ID': { 'clientKey': 'CLIENT_KEY', 'callbackUrl': 'CALLBACK_URL', 'scope': 'PRODUCTION' }" > "$DOCUMENT_ROOT/auth/implicit.js"
  fi

  if [[ -n "$CLIENT_KEY" ]]; then
    echo "CLIENT_KEY found in the environment...";
  else
    echo "No CLIENT_KEY found in the environment. Defaulting to Agave Public Tenant client key...";
    CLIENT_KEY='fPhlaMicCFMUmKnk7amasmf6fcIa'
  fi
  sed -i 's#CLIENT_KEY#'$CLIENT_KEY'#' "$DOCUMENT_ROOT/auth/implicit.js"

  if [[ -n "$TENANT_ID" ]]; then
    echo "TENANT_ID found in the environment...";
  else
    echo "No TENANT_ID found in the environment. Defaulting to agave.prod...";
    TENANT_ID='agave.prod'
  fi
  sed -i 's#$TENANT_ID#'$TENANT_ID'#' "$DOCUMENT_ROOT/auth/implicit.js"

  if [[ -n "$CALLBACK_URL" ]]; then
    echo "CALLBACK_URL found in the environment...";
  else
    echo "CALLBACK_URL found in the environment. Falling back on Agave Public Tenant client callback URL. Authentication will only work when this container is run from localhost...";
    CALLBACK_URL="http://localhost/auth"
  fi
  sed -i 's#CALLBACK_URL#'CALLBACK_URL'#' "$DOCUMENT_ROOT/auth/implicit.js"

fi

# start ntpd because clock skew is astoundingly real
ntpd -d -p pool.ntp.org

# finally, run the command passed into the container
exec "$@"
