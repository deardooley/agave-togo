angular.module('AgaveToGo').controller('SystemBuilderWizardController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, WizardHandler, SystemsController, SystemTypeEnum, Tags, FilesController) {

    $scope.schema = {
        "type": "object",
        "title": "Interactive app registration form for the Agave platform.",
        "properties": {
            "id": {
                "type": "string",
                "description": "A unique identifier you assign to the system. A system id must be globally unique across a tenant and cannot be reused once deleted",
                "title": "ID",
                // "validator": "[a-zA-Z_\\-\\.]+",
                // "minLength": 3,
                // "maxLength": 64
            },
            "name": {
                "type": "string",
                "description": "Common display name for this system",
                "title": "Name",
                // "validator": "[a-zA-Z_\\-\\.]+",
                // "minLength": 3,
                // "maxLength": 64
            },
            "site": {
                "type": "string",
                "description": "The site associated with this system. Primarily for logical grouping",
                "format": "url",
                "title": "Site",
                // "validator": "(http|https)://[\\w-]+(\\.[\\w-]*)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?"
            },
            "description": {
                "type": "string",
                "description": "Verbose description of this system",
                // "maxLength": 32768,
                "title": "Description"
            },
            "username":{
                 "type": "string",
                 "description": "The name of the default resource to use when defining an X system",
                 "title": "System Auth Username"
            },
            "password":{
                  "type": "string",
                  "description": "The password of the default resource to use when defining an X system",
                  "title": "System Auth Password"
            },
            "type":{
                  "type": "string",
                  "enum": [
                    "STORAGE", "EXECUTION"
                  ],
                  "description": "Storage Type",
                  "title": "Select storage type"
            },
            "credential":{
                  "type": "string",
                  "description": "Credential Certificate",
                  "title": "System Auth Credential"
            },
            "port":{
                  "type": "string",
                  "description": "The port on which to connect to the server",
                  "title": "System Auth Server Port"
            },
            "protocol":{
                  "type": "string",
                  "description": "The protocol with which to obtain an authentication credential",
                  "title": "System Auth Server Protocol"
            },
            "storage": {
                "type": "object",
                "title": "Storage",
                "properties": {
                  "host": {
                      "type": "string",
                      "description": "The hostname or ip address of the storage server",
                      "title": "Host"
                  },
                  "port": {
                      "type": "string",
                      "description": "The port on which to connect to the server",
                      "title": "System Auth Server Port"
                  },
                  "protocol": {
                    "type": "string",
                    "title": "Protocol",
                    "enum": [
                      "SFTP", "GRIDFTP", "IRODS", "LOCAL", "S3"
                    ],
                  },
                  "rootDir":{
                       "type": "string",
                       "description": "The path on the remote system to use as the virtual root directory for all API requests. Defaults to '/'",
                       "title": "rootDir"
                  },
                  "homeDir":{
                       "type": "string",
                       "description": "The path on the remote system, relative to rootDir to use as the virtual home directory for all API requests. This will be the base of any requested paths that do not being with a '/'. Defaults to '/', thus being equivalent to rootDir",
                       "title": "homeDir"
                  },
                  "resource":  {
                      "type": "string",
                      "description": "The name of the default resource to use when defining an X system.",
                      "title": "Resources"
                  },
                  "zone": {
                      "type": "string",
                      "description": "The name of the default zone to use when defining an X system.",
                      "title": "Zone"
                  },
                  "container": {
                    "type": "string",
                    "description": "The container to use when interacting with an object store. Specifying a container provides isolation when exposing your cloud storage accounts so users do not have access to your entire storage account. This should be used in combination with delegated cloud credentials such as an AWS IAM user credential",
                    "title": "Container"
                  },
                  "SFTP":{
                    "type": "string",
                    "description": "",
                    "enum": [
                       "password", "sshkeys", "tunnel"
                   ],
                    "title": "Select SFTP configuration type"
                  },
                  "GRIDFTP":{
                     "type": "string",
                     "description": "",
                     "enum": [
                        "cred", "mpg", "myproxy"
                    ],
                     "title": "Select GRIDFTP configuration type"
                  },
                  "IRODS":{
                     "type": "string",
                     "description": "",
                     "enum": [
                        "mpg", "myproxy", "pam", "password"
                    ],
                     "title": "Select IRODS configuration type"
                   },
                   "auth":{
                    "type": "object",
                    "properties": {
                      // "key":"username",
                      // "key":"password",
                      "username": { "type": "string" },
                      "password": { "type": "string" },
                      "type": {
                        "type": "string",
                        "enum": [
                          "APIKEYS", "LOCAL", "PAM", "PASSWORD", "SSHKEYS", "X509", "SSHKEYS"
                        ]
                      },
                      "credential":{
                            "type": "string",
                            "description": "Credential Certificate",
                            "title": "System Auth Credential"
                      },
                      "publicKey":   {
                          "type": "string",
                          "description": "The public ssh key used to authenticate to the remote system",
                          "title": "SSH Public Key"
                      },
                      "privateKey":   {
                          "type": "string",
                          "description": "The private ssh key used to authenticate to the remote system",
                          "title": "SSH Private Key"
                      },
                      "server": {
                        "type": "object",
                        "properties": {
                          "name": {
                              "type": "string",
                              "description": "A descriptive name given to the credential server",
                              "title": "Name",
                              "validator": "[a-zA-Z_\\-\\.]+",
                              "minLength": 3,
                              "maxLength": 64
                          },
                          "endpoint":{
                                "type": "string",
                                "description": "The endpoint of the authentication server",
                                "title": "System Auth Server Endpoint"
                          },
                          "port":{
                            "type": "string",
                            "title": "System Auth Server Port"
                          },
                          "protocol":{
                             "type": "string",
                             "description": "The protocol used to authenticate to the storage server",
                             "title": "Protocol"
                          },
                        }
                      },
                      "proxy": {
                        "type": "object",
                        "properties": {
                          "name": {
                              "type": "string",
                              "description": "Proxy Name",
                              "title": "Name",
                              // "validator": "[a-zA-Z_\\-\\.]+",
                              // "minLength": 3,
                              // "maxLength": 64
                          },
                          "port":{
                            "type": "string",
                            "title": "Proxy Port"
                          },
                          "host": {
                              "type": "string",
                              "description": "Proxy host",
                              "title": "Proxy Host"
                          },
                        }
                      }
                    }
                  }
                }
            }
        }
    };


    $scope.form = [{
        "type": "wizard",
        "tabs": [
          {
              "title": "Type",
              "items": [
                {
                  "key": "storage",
                  "items": [
                    {
                      "key": "storage.protocol",
                      ngModelOptions: { updateOn: 'default blur' },
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                      // onChange: function(value, formModel){
                      // }
                    },
                    {
                      "key":"storage.SFTP",
                      "condition": "model.storage.protocol === 'SFTP'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key":"storage.GRIDFTP",
                      "condition": "model.storage.protocol === 'GRIDFTP'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key":"storage.IRODS",
                      "condition": "model.storage.protocol === 'IRODS'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.host",
                      "condition": "model.storage.protocol",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.port",
                      "condition": "model.storage.protocol",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.rootDir",
                      "condition": "model.storage.protocol",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.homeDir",
                      "condition": "model.storage.protocol",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.resource",
                      "condition": "model.storage.protocol === 'IRODS'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.zone",
                      "condition": "model.storage.protocol === 'IRODS'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.container",
                      "condition": "model.storage.protocol === 'S3'",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },

                  ]
                },
              ]
          },
          {
              "title": "Details",
              "items": [
                {
                  "key": "id",
                  validationMessage: {
                   'required': 'Missing required',
                  },
                  $validators: {
                   required: function(value) {
                     return value ? true: false;
                   },
                 },
                //  startEmpty: true
                },
                {
                  "key": "name",
                  validationMessage: {
                   'required': 'Missing required',
                  },
                  $validators: {
                   required: function(value) {
                     return value ? true: false;
                   },
                 },
               },
               "description",
               "site"
              ]
          },
          {
              "title": "Auth",
              "items": [
                {
                  "key": "storage.auth",
                  "items": [
                    {
                      "key": "storage.auth.username",
                      "condition":
                        "model.storage.protocol === 'SFTP' || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'pam') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'password') || " +
                        "(model.storage.protocol === 'NCBI') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'password') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.password",
                      "condition":
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === '') || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'pam') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'password') || " +
                        "(model.storage.protocol === 'NCBI') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'password') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.credential",
                      "condition":
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'cred')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.type",
                      "condition":
                        "(model.storage.protocol === 'SFTP') || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'cred') || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                        "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'pam') || " +
                        "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'password') || " +
                        "(model.storage.protocol === 'NCBI') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'password') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.publicKey",
                      "condition":
                        "(model.storage.protocol === 'S3') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.privateKey",
                      "condition":
                        "(model.storage.protocol === 'S3') || " +
                        "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys')",
                      validationMessage: {
                       'required': 'Missing required',
                      },
                      $validators: {
                       required: function(value) {
                         return value ? true: false;
                       },
                     },
                    },
                    {
                      "key": "storage.auth.server",
                      "items": [
                        {
                          "key": "storage.auth.server.name",
                          "condition":
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                        {
                          "key": "storage.auth.server.endpoint",
                          "condition":
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                        {
                          "key": "storage.auth.server.port",
                          "condition":
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                        {
                          "key": "storage.auth.server.protocol",
                          "condition":
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                            "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                            "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                      ]
                    },
                    {
                      "key": "storage.auth.proxy",
                      "items": [
                        {
                          "key": "storage.auth.proxy.name",
                          "condition":
                            "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                        {
                          "key": "storage.auth.proxy.host",
                          "condition":
                            "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        },
                        {
                          "key": "storage.auth.proxy.port",
                          "condition":
                            "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                          validationMessage: {
                           'required': 'Missing required',
                          },
                          $validators: {
                           required: function(value) {
                             return value ? true: false;
                           },
                         },
                        }
                      ]
                    }
                  ]
                }
              ]
          },
        ]
    }];

    // empty for now
    $scope.model = {

    };

    // empty for now
    $scope.prettyModel = '{}';

    $scope.systems = {
        execution: [],
        storage: []
    }

    $scope.defaultSystems = {
        execution: null,
        storage: null
    }


    $scope.currentTabIndex = 0;
    $scope.codeview = false;

    $scope.init = function(){
      WizardHandler.activateTab($scope, $scope.currentTabIndex);
    }

    $scope.init();


    $scope.submit = function () {
        $scope.$broadcast('schemaFormValidate');
        if ($scope.form.$valid) {
            console.log($scope.model);
        }
    };

    $scope.nextStep = function (currentTab) {

        WizardHandler.validateTab($scope, $scope.currentTabIndex).then(function (value) {
            WizardHandler.activateTab($scope, ++$scope.currentTabIndex);
        });


    };

    $scope.previousStep = function () {
        WizardHandler.activateTab($scope, --$scope.currentTabIndex);
    };



    $scope.wizview = 'split';

    $scope.editorConfig = {
        lineWrapping : true,
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: false,
        theme:"neat",
        mode: 'javascript'
    };

    $scope.$watch('model', function(value){
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

    $scope.updateWizardLayout = function() {
        console.log($scope.wizview);
    };
});
