Agave ToGo
===================

This is a reference implementation of the iPlant Agave ToGo reference gateway using AngularJS.

## Installing locally

You can also build the application locally and optionally package it up as static html, css, and javascript files for hosting on your local web server, or out of your Dropbox, campus web server, Google Drive, etc.

### Requirements

The following are not requirements to run the application, but are used in the build process
and for other tasks during development

- node.js + npm (v0.12.0+)
- bower (1.6.5+)

#### Node.js

Node and NPM are used for installing packages necessary for the rest of the build process.
Install node.js and npm via whatever install process is available.

http://nodejs.org/download/

### Project setup

Check out the project and cd into the project.  Use npm and bower to install the rest of the project dependencies.

    git clone https://bitbucket.org/agaveapi/togo agave-togo
    cd agave-togo
    npm install
    bower install

#### Start the application in node development server

This will start a node server on localhost:9000 and automatically open the default browser to the application. Using this for development

    ./server.sh
