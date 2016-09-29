## Agave ToGo

Agave ToGo v2 is a full-featured web application providing a reference user interface to exercising the core
functionality of the Agave Platform and demonstrate some of the advanced use cases which are possible by leveraging
the core Agave Core Science APIs and mainstream open source web technologies.

This version of the web application is implemented as a client-side application using the
[AngularJS framework](http://angularjs.org/). It is designed to run entirely within your browser with no need for a
back-end server. The Aside from the Agave Platform itself, there are no external third-party
service dependencies. The assets produced by this project are entirely static, thus you may host this application out
of your Bitbucket, GitHub, Dropbox, Google Drive, or even a folder you published using Agave.  

Agave ToGo is fully open source under the BSD 2-Clause license. We encourage you to fork the project and use it as
a jumping point from which you can build your own application. To contribute back enhancement and bug fixes, please
make a pull request on the branch you have forked.

## Getting Started

To get you started you can simply clone the angular-seed repository and install the dependencies:

### Prerequisites

You need git to clone the `agave-togo` repository. You can get git from [http://git-scm.com/](http://git-scm.com/).

We also use a number of node.js tools to initialize and test agave-togo. You must have node.js and its package manager (npm) installed. You can get them from [http://nodejs.org/](http://nodejs.org/).

### Clone agave-togo

Clone the agave-togo repository using [git](http://git-scm.com/):

```
git clone https://github.com/deardooley/agave-togo.git  
cd agave-togo  
```

If you just want to start a new project without the agave-togo commit history then you can do:

```
git clone --depth=1 https://github.com/deardooley/agave-togo.git <your-project-name>  
```

The `depth=1` tells git to only pull down one commit worth of historical data.

### Install Dependencies

We have two three of dependencies in this project: tools and Agave Platform SDKs, and the angular framework code. The tools help us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager](https://www.npmjs.org/).
* We get the Agave Platform SDKs and angular code via `bower`, a [client-side code package manager](http://bower.io/).  

We have pre-configured npm to automatically run bower so we can simply do:

```
npm install
```  

Behind the scenes this will also call `bower install`. You should find that you have two new folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `bower_components` - contains the angular framework files

### Run the Application

We have preconfigured the project with a simple development web server. The simplest way to start this server is:

```
npm start
```

Now browse to the app at [http://localhost:9000/app](http://localhost:9000/app).

### Run tests (optional)

Set your tenant `BASEURI` and `oAuthAccessToken` on `/bower_components/agave-angularjs-sdk/Agave/TestConfiguration.js`:

```
Configuration.BASEURI = 'https://public.agaveapi.co';
Configuration.oAuthAccessToken = '37d51643...';
```

```
cd agave-togo
karma start
```

## Docker Installation

We also provide Agave ToGo as a [Docker](https://hub.docker.com/r/agaveapi/agave-togo) image. This repository is configured to build automatically
and publish the resulting image to the [Docker Public Registry].

### Prerequisites

You need git to clone the `agave-togo` repository. You can get git from [http://git-scm.com/](http://git-scm.com/).

You will need to have the [Docker Engine installed](http://docs.docker.com/engine/installation/) to perform the actual build.


### Build the Image

Clone the image as you would above, then invoke the `docker build` command.

```
git clone https://github.com/deardooley/agave-togo.git  
cd agave-togo
docker build --rm=true -t agave-togo .
```

This will create an `agave-togo` image based on the master branch of the repository that you can run anywhere.

### Run the Docker Container

To create and run the image as a Docker image, run the following command:

```
docker run -p 9000:9000 -n agave-togo agave-togo
```

The container will write the HTTP access logs to std out. You can view them using the `docker logs` command:

```
docker logs agave-togo
```
