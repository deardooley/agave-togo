angular.module('AgaveToGo').controller('SystemBuilderWizardController', function($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $filter, $uibModal, $localStorage, Commons, WizardHandler, SystemsController, SystemTypeEnum, Tags, FilesController) {

      $scope.getSystemsTitleMap = function(){
        $scope.systemsTitleMap = [];

        // Push default option to use local disk
        // TO-DO: local disk input field
        $scope.systemsTitleMap.push({"value": "Local Disk", "name": "Local Disk - TO-DO"});

        // get only default system for now.
        // TO-DO: get all storage systems
        SystemsController.listSystems(1, 0, true, null, "STORAGE")
          .then(function(response){
            _.each(response, function(system){
              $scope.systemsTitleMap.push({"value": system.id, "name": system.id});
            });
          })
          .catch(function(response){
            // log error
          });

        // // get default system first
        // SystemsController.listSystems(null, 0, true, null, "STORAGE")
        //   .then(function(response){
        //     _.each(response, function(system){
        //       $scope.systemsTitleMap.push({"value": system.id, "name": system.id});
        //     });
        //   })
        //   .catch(function(response){
        //     // log error
        //   });
        //
        // // get private systems
        // SystemsController.listSystems(null, 0, null, false, null)
        //   .then(function(response){
        //     _.each(response, function(system){
        //       $scope.systemsTitleMap.push({"value": system.id, "name": system.id});
        //     });
        //   })
        //   .catch(function(response){
        //     // log error
        //   });

        return $scope.systemsTitleMap;
    };

    $scope.schema = {
        "type": "object",
        "title": "Interactive app registration form for the Agave platform.",
        "properties": {
            "id": {
                "type": "string",
                "description": "Give the system a unique identifier. This can be anything you like. E.g. demo.storage.example.com",
                "title": "ID",
                // "validator": "[a-zA-Z_\\-\\.]+",
                // "minLength": 3,
                // "maxLength": 64
            },
            "name": {
                "type": "string",
                "description": "Give a name to this system. E.g. Demo Storage Example",
                "title": "Name",
                // "validator": "[a-zA-Z_\\-\\.]+",
                // "minLength": 3,
                // "maxLength": 64
            },
            "site": {
                "type": "string",
                "description": "Give a site to this system. E.g. example.com",
                "format": "url",
                "title": "Site",
                // "validator": "(http|https)://[\\w-]+(\\.[\\w-]*)+([\\w.,@?^=%&amp;:/~+#-]*[\\w@?^=%&amp;/~+#-])?"
            },
            "description": {
                "type": "string",
                "description": "Give a description for this system",
                // "maxLength": 32768,
                "title": "Description"
            },
            "username": {
                "type": "string",
                "description": "The name of the default resource to use when defining an X system",
                "title": "System Auth Username"
            },
            "password": {
                "type": "string",
                "description": "The password of the default resource to use when defining an X system",
                "title": "System Auth Password"
            },
            "type": {
                "type": "string",
                "enum": [
                    "STORAGE", "EXECUTION"
                ],
                "description": "What type of system is it?",
                // "description": "Systems come in two flavors: storage and execution. Storage systems are only used for storing and interacting with data. Execution systems are used for running apps (aka jobs or batch jobs) as well as storing and interacting with data.",
                "title": "Select System Type"
            },
            "test": {
                "type": "template",
                "description": "What kind of storage system is it?",
                // "description": "Systems come in two flavors: storage and execution. Storage systems are only used for storing and interacting with data. Execution systems are used for running apps (aka jobs or batch jobs) as well as storing and interacting with data.",
                "title": "Select System Type"
            },
            "credential": {
                "type": "string",
                "description": "Credential Certificate",
                "title": "System Auth Credential"
            },
            "port": {
                "type": "string",
                "description": "The port on which to connect to the server",
                "title": "System Auth Server Port"
            },
            "protocol": {
                "type": "string",
                "description": "The protocol with which to obtain an authentication credential",
                "title": "System Auth Server Protocol"
            },
            "login": {
                "type": "object",
                "title": "LOGIN",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "Hostname",
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
                            "SSH", "GSISSH", "LOCAL"
                        ],
                    },
                    "SSH": {
                        "type": "string",
                        "description": "",
                        "enum": [
                            "PASSWORD", "SSHKEYS", "TUNNEL"
                        ],
                        "title": "Select SSH configuration type"
                    },
                    "GSISSH": {
                        "type": "string",
                        "description": "",
                        "enum": [
                            "CRED", "MPG", "MYPROXY"
                        ],
                        "title": "Select GSISSH configuration type"
                    },
                    "auth": {
                        "title": "Login Auth",
                        "type": "object",
                        "properties": {
                            // "key":"username",
                            // "key":"password",
                            "username": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string",
                                "enum": [
                                    "APIKEYS", "LOCAL", "PAM", "PASSWORD", "SSHKEYS", "X509", "SSHKEYS"
                                ]
                            },
                            "credential": {
                                "type": "string",
                                "description": "Credential Certificate",
                                "title": "System Auth Credential"
                            },
                            "publicKey": {
                                "type": "string",
                                "description": "The public ssh key used to authenticate to the remote system",
                                "title": "SSH Public Key"
                            },
                            "privateKey": {
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
                                    "endpoint": {
                                        "type": "string",
                                        "description": "The endpoint of the authentication server",
                                        "title": "System Auth Server Endpoint"
                                    },
                                    "port": {
                                        "type": "string",
                                        "title": "System Auth Server Port"
                                    },
                                    "protocol": {
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
                                    "port": {
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
            },
            "storage": {
                "type": "object",
                "title": "STORAGE",
                "properties": {
                    "host": {
                        "type": "string",
                        "description": "Hostname",
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
                        "description": "What kind of Storage System is it?",
                        "enum": [
                            "SFTP", "GRIDFTP", "IRODS", "LOCAL", "S3"
                        ],
                        // "default": "SFTP"
                    },
                    "rootDir": {
                        "type": "string",
                        "description": "Where would you like to restrict access on the system?",
                        "title": "rootDir"
                    },
                    "homeDir": {
                        "type": "string",
                        "description": "Would you like to specify a home directory?",
                        "title": "homeDir"
                    },
                    "resource": {
                        "type": "string",
                        "description": "The name of the default resource to use when defining an X system.",
                        "title": "Resource"
                    },
                    "zone": {
                        "type": "string",
                        "description": "The name of the default zone to use when defining an X system.",
                        "title": "Zone"
                    },
                    "container": {
                        "type": "string",
                        "description": "What container wouuld you like to isolate?",
                        "title": "Container"
                    },
                    "SFTP": {
                        "type": "string",
                        "description": "How would you like to authenticate?",
                        "enum": [
                            "PASSWORD", "SSHKEYS"
                        ],
                        "title": "Select SFTP configuration type"
                    },
                    "GRIDFTP": {
                        "type": "string",
                        "description": "How would you like to authenticate?",
                        "enum": [
                            "cred", "mpg", "myproxy"
                        ],
                        "title": "Select GRIDFTP configuration type"
                    },
                    "IRODS": {
                        "type": "string",
                        "description": "How would you like to authenticate?",
                        "enum": [
                            "MPG", "MYPROXY", "PAM", "PASSWORD"
                        ],
                        "title": "Select IRODS configuration type"
                    },
                    "auth": {
                        "type": "object",
                        "properties": {
                            // "key":"username",
                            // "key":"password",
                            "username": {
                                "type": "string"
                            },
                            "password": {
                                "type": "string"
                            },
                            "type": {
                                "type": "string",
                                "enum": [
                                    "APIKEYS", "LOCAL", "PAM", "PASSWORD", "SSHKEYS", "X509", "SSHKEYS"
                                ]
                            },
                            "credential": {
                                "type": "string",
                                "description": "Credential Certificate",
                                "title": "System Auth Credential"
                            },
                            "publicKey": {
                                "type": "string",
                                "description": "The public ssh key used to authenticate to the remote system",
                                "title": "SSH Public Key"
                            },
                            "privateKey": {
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
                                    "endpoint": {
                                        "type": "string",
                                        "description": "The endpoint of the authentication server",
                                        "title": "System Auth Server Endpoint"
                                    },
                                    "port": {
                                        "type": "string",
                                        "title": "System Auth Server Port"
                                    },
                                    "protocol": {
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
                                    "port": {
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
                  /********** publicKey field ************/
                  {
                    "type": "section",
                    "htmlClass": "col-xs-8",
                    "items": [
                      {
                          "key": "login.auth.publicKey"
                      }
                    ]
                  },
                  {
                    "type": "section",
                    "htmlClass": "col-xs-2",
                    "items": [
                      {
                        "type": "select",
                        "title":"Upload",
                        "titleMap": $scope.getSystemsTitleMap(),
                        ngModelOptions: {
                            updateOnDefault: true
                        },
                        onChange: function(systemId, formModel) {
                          SystemsController.getSystemDetails(systemId).then(
                              function(sys) {
                                  console.log('inside SystemController');
                                  if ($stateParams.path) {
                                      $scope.path = $stateParams.path;
                                  } else {
                                      $scope.path = $localStorage.activeProfile.username;
                                      $stateParams.path = $scope.path;
                                      // $location.path("/data/explorer/" + $stateParams.systemId + "/" + $scope.path);
                                  }
                                  $scope.system = sys;
                                  $rootScope.uploadFileContent = '';
                                  $uibModal.open({
                                    templateUrl: "views/systems/filemanager.html",
                                    // resolve: {
                                    // },
                                    scope: $scope,
                                    controller: ['$scope', '$modalInstance', function($scope, $modalInstance ) {
                                      $scope.ok = function()
                                      {
                                        // TO-DO
                                      };

                                      $scope.cancel = function()
                                      {
                                          $modalInstance.dismiss('cancel');
                                      };

                                      $scope.close = function(){
                                          $modalInstance.close();
                                      }

                                      $scope.$watch('uploadFileContent', function(uploadFileContent){
                                          if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== ''){
                                            $scope.model.login = {'auth' : {'publicKey': ''}};
                                            $scope.model.login.auth.publicKey = uploadFileContent;
                                            $scope.close();
                                          }
                                      });
                                    }]
                                  });
                              },
                              function(msg) {
                                  $scope.path = $stateParams.path ? $stateParams.path : '';
                                  $scope.system = '';
                              }
                          );
                        }
                      }
                    ]
                  },
                  {
                   "type": "section",
                   "htmlClass": "col-xs-2",
                   "items": [
                     {
                        "type": "template",
                        "template":

                        '<div class="form-group ">'+
                          '<label class="control-label">&nbsp;</label>'+
                          '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                            '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="Copy and paste your publicKey or use the Upload File Manager"></i>'+
                          '</div>'+
                          '<div class="help-block"></div>'+
                        '</div>',
                     }
                   ]
                 },
                /********** publicKey field ************/
                  {
                  "type": "section",
                  "htmlClass": "col-xs-8",
                  "items": [
                    {
                      "key": "type",
                      ngModelOptions: {
                          updateOnDefault: true
                      },
                      onChange: function(value, formModel) {
                          // pre-select SFTP and sshkeys by default
                          $scope.model.storage = {};
                          $scope.model.storage.protocol = "SFTP";

                          $scope.model.storage.SFTP = {};
                          $scope.model.storage.SFTP = "sshkeys";
                      },
                      $validators: {
                          required: function(value) {
                              return value ? true : false;
                          },
                      },
                      validationMessage: {
                          'required': 'Missing required',
                      },
                    }
                  ],
                 },
                 {
                   "type": "section",
                   "htmlClass": "col-xs-4",
                   "items": [
                     {
                        "type": "template",
                        "template":

                        '<div class="form-group ">'+
                        	'<label class="control-label">&nbsp;</label>'+
                        	'<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                        		'<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="Systems come in two flavors: storage and execution. Storage systems are only used for storing and interacting with data. Execution systems are used for running apps (aka jobs or batch jobs) as well as storing and interacting with data"></i>'+
                        	'</div>'+
                        	'<div class="help-block"></div>'+
                        '</div>',
                     }
                   ]
                 }
                ]
            },
            {
                "title": "Protocol",
                "items": [{
                    /**********************************************************************/
                    /**********************************************************************/
                    /***                                                                ***/
                    /***                            Execution                           ***/
                    /***                                                                ***/
                    /**********************************************************************/
                    /**********************************************************************/

                    "key": "login",
                    "condition": "model.type === 'EXECUTION'",
                    "items": [{
                            "key": "login.protocol",
                            // "condition": "model.type",
                            "title": "Protocol",
                            // ngModelOptions: { updateOn: 'default blur' },
                            ngModelOptions: {
                                updateOnDefault: true
                            },
                            onChange: function(value, formModel) {
                            },
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },

                        }, {
                            "key": "login.SSH",
                            "condition": "model.login.protocol === 'SSH'",
                            ngModelOptions: {
                                updateOnDefault: true
                            },
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.GSISSH",
                            "condition": "model.login.protocol === 'GSISSH'",
                            ngModelOptions: {
                                updateOnDefault: true
                            },
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.host",
                            "condition": "model.login.protocol === 'SSH' || model.login.protocol === 'GSISSH' || model.login.protocol === 'LOCAL'",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.port",
                            "condition": "model.login.protocol === 'SSH' || model.login.protocol === 'GSISSH'",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.resource",
                            "condition": "model.login.protocol === 'IRODS'",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.zone",
                            "condition": "model.login.protocol === 'IRODS'",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "login.container",
                            "condition": "model.login.protocol === 'S3'",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        },
                        {
                            // "key": "login",
                            // "items": [{
                                "key": "login.auth",
                                "items": [{
                                    "key": "login.auth.username",
                                    "condition": "(model.login.protocol === 'SSH' && model.login.SSH === 'PASSWORD') || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'SSHKEYS') || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'TUNNEL') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MPG') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MYPROXY')"
                                }, {
                                    "key": "login.auth.password",
                                    "condition": "(model.login.protocol === 'SSH' && model.login.SSH === 'PASSWORD') || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'TUNNEL') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MYPROXY')"
                                }, {
                                    "key": "login.auth.credential",
                                    "condition": "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'CRED') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MPG') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MYPROXY')"
                                }, {
                                    "key": "login.auth.type",
                                    "condition": "model.login.protocol === 'LOCAL' || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'PASSWORD') || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'SSHKEYS') || " +
                                        "(model.login.protocol === 'SSH' && model.login.SSH === 'TUNNEL') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'CRED') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MPG') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MYPROXY')"
                                }, {
                                    "key": "login.auth.publicKey",
                                    "condition": "(model.login.protocol === 'SSH' && model.login.SSH === 'SSHKEYS')"
                                }, {
                                    "key": "login.auth.privateKey",
                                    "condition": "(model.login.protocol === 'SSH' && model.login.SSH === 'SSHKEYS')"
                                }, {
                                    "key": "login.auth.server",
                                    "title": "Login Auth Server",
                                    "condition": "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MPG') || " +
                                        "(model.login.protocol === 'GSISSH' && model.login.GSISSH === 'MYPROXY')",
                                    "items": [{
                                        "key": "login.auth.server.name",
                                    }, {
                                        "key": "login.auth.server.endpoint",
                                    }, {
                                        "key": "login.auth.server.port",
                                    }, {
                                        "key": "login.auth.server.protocol",
                                    }, ]
                                }, {
                                    "key": "login.auth.proxy",
                                    "condition": "model.login.protocol === 'SSH' && model.login.SSH === 'TUNNEL'",
                                    "items": [{
                                        "key": "login.auth.proxy.name",
                                    }, {
                                        "key": "login.auth.proxy.host",
                                    }, {
                                        "key": "login.auth.proxy.port",
                                    }]
                                }]
                            // }]
                        }
                    ]
                }, {
                    /**********************************************************************/
                    /**********************************************************************/
                    /***                                                                ***/
                    /***                            Storage                             ***/
                    /***                                                                ***/
                    /**********************************************************************/
                    /**********************************************************************/

                    "key": "storage",
                    "items": [
                    // Protocol
                    {
                      "type": "section",
                        "htmlClass": "col-xs-8",
                        "items": [
                          {
                              "key": "storage.protocol",
                              "title": "Protocol",
                              ngModelOptions: {
                                updateOnDefault: true
                              },
                              // "condition": "model.type",
                          },
                        ]
                    },
                    {
                       "type": "section",
                       "htmlClass": "col-xs-4",
                       "items": [
                         {
                            "type": "template",
                            "template":

                            '<div class="form-group ">'+
                            	'<label class="control-label">&nbsp;</label>'+
                            	'<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                            		'<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The protocol used to authenticate to the storage server"></i>'+
                            	'</div>'+
                            	'<div class="help-block"></div>'+
                            '</div>',
                         }
                       ]
                     },
                    // subprotocol-SFTP
                    {
                      "type": "section",
                        "htmlClass": "col-xs-8",
                        "items": [
                          {
                            "key": "storage.SFTP",
                            "condition": "model.storage.protocol === 'SFTP'",
                            ngModelOptions: {
                                updateOnDefault: true
                            },
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                          },
                        ]
                    },
                    {
                       "type": "section",
                       "htmlClass": "col-xs-4",
                       "condition": "model.storage.protocol === 'SFTP'",
                       "items": [
                         {
                            "type": "template",
                            "template":
                            '<div class="form-group ">'+
                            	'<label class="control-label">&nbsp;</label>'+
                            	'<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                            		'<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The SFTP configuration type used to authenticate to the storage server"></i>'+
                            	'</div>'+
                            	'<div class="help-block"></div>'+
                            '</div>',
                         }
                       ]
                     },
                    // subprotocol-GRIDFTP
                    {
                      "type": "section",
                        "htmlClass": "col-xs-8",
                        "items": [
                          {
                              "key": "storage.GRIDFTP",
                              "condition": "model.storage.protocol === 'GRIDFTP'",
                              validationMessage: {
                                  'required': 'Missing required',
                              },
                              $validators: {
                                  required: function(value) {
                                      return value ? true : false;
                                  },
                              },
                          }
                        ]
                    },
                    {
                       "type": "section",
                       "htmlClass": "col-xs-4",
                      "condition": "model.storage.protocol === 'GRIDFTP'",
                       "items": [
                         {
                            "type": "template",
                            "template":
                            '<div class="form-group ">'+
                              '<label class="control-label">&nbsp;</label>'+
                              '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The GRIDFTP configuration type used to authenticate to the storage server"></i>'+
                              '</div>'+
                              '<div class="help-block"></div>'+
                            '</div>',
                         }
                       ]
                     },
                    // subprotocol-IRODS
                    {
                      "type": "section",
                        "htmlClass": "col-xs-8",
                        "items": [
                          {
                              "key": "storage.IRODS",
                              "condition": "model.storage.protocol === 'IRODS'",
                              validationMessage: {
                                  'required': 'Missing required',
                              },
                              $validators: {
                                  required: function(value) {
                                      return value ? true : false;
                                  },
                              },
                          }
                        ]
                    },
                    {
                       "type": "section",
                       "htmlClass": "col-xs-4",
                       "condition": "model.storage.protocol === 'IRODS'",
                       "items": [
                         {
                            "type": "template",
                            "template":
                            '<div class="form-group ">'+
                              '<label class="control-label">&nbsp;</label>'+
                              '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The IRODS configuration type used to authenticate to the storage server"></i>'+
                              '</div>'+
                              '<div class="help-block"></div>'+
                            '</div>',
                         }
                       ]
                     },
                     // host
                     {
                       "type": "section",
                         "htmlClass": "col-xs-8",
                         "items": [
                           {
                               "key": "storage.host",
                               "condition": "model.storage.protocol",
                               validationMessage: {
                                   'required': 'Missing required',
                               },
                               $validators: {
                                   required: function(value) {
                                       return value ? true : false;
                                   },
                               },
                           }
                         ]
                     },
                     {
                        "type": "section",
                        "htmlClass": "col-xs-4",
                        "condition": "model.storage.protocol",
                        "items": [
                          {
                             "type": "template",
                             "template":
                             '<div class="form-group ">'+
                               '<label class="control-label">&nbsp;</label>'+
                               '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                 '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The hostname or ip address of the storage server"></i>'+
                               '</div>'+
                               '<div class="help-block"></div>'+
                             '</div>',
                          }
                        ]
                      },
                      // port
                      {
                        "type": "section",
                          "htmlClass": "col-xs-8",
                          "items": [
                            {
                                "key": "storage.port",
                                "condition": "model.storage.protocol",
                                validationMessage: {
                                    'required': 'Missing required',
                                },
                                $validators: {
                                    required: function(value) {
                                        return value ? true : false;
                                    },
                                },
                            }
                          ]
                      },
                      {
                         "type": "section",
                         "htmlClass": "col-xs-4",
                         "condition": "model.storage.protocol",
                         "items": [
                           {
                              "type": "template",
                              "template":
                              '<div class="form-group ">'+
                                '<label class="control-label">&nbsp;</label>'+
                                '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                  '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The port number of the storage server"></i>'+
                                '</div>'+
                                '<div class="help-block"></div>'+
                              '</div>',
                           }
                         ]
                       },
                       // rootDir
                       {
                         "type": "section",
                           "htmlClass": "col-xs-8",
                           "items": [
                             {
                                 "key": "storage.rootDir",
                                 "condition": "model.storage.protocol",
                                 validationMessage: {
                                     'required': 'Missing required',
                                 },
                                 $validators: {
                                     required: function(value) {
                                         return value ? true : false;
                                     },
                                 },
                             }
                           ]
                       },
                       {
                          "type": "section",
                          "htmlClass": "col-xs-4",
                          "condition": "model.storage.protocol",
                          "items": [
                            {
                               "type": "template",
                               "template":
                               '<div class="form-group ">'+
                                 '<label class="control-label">&nbsp;</label>'+
                                 '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                   '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The path on the remote system to use as the virtual root directory for all API requests. Defaults to /"></i>'+
                                 '</div>'+
                                 '<div class="help-block"></div>'+
                               '</div>',
                            }
                          ]
                        },
                        // homeDir
                        {
                          "type": "section",
                            "htmlClass": "col-xs-8",
                            "items": [
                              {
                                "key": "storage.homeDir",
                                "condition": "model.storage.protocol",
                                validationMessage: {
                                    'required': 'Missing required',
                                },
                                $validators: {
                                    required: function(value) {
                                        return value ? true : false;
                                    },
                                  },
                              }
                            ]
                        },
                        {
                           "type": "section",
                           "htmlClass": "col-xs-4",
                           "condition": "model.storage.protocol",
                           "items": [
                             {
                                "type": "template",
                                "template":
                                '<div class="form-group ">'+
                                  '<label class="control-label">&nbsp;</label>'+
                                  '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                    '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The path on the remote system, relative to rootDir to use as the virtual home directory for all API requests. This will be the base of any requested paths that do not being with a /. Defaults to /, thus being equivalent to rootDir"></i>'+
                                  '</div>'+
                                  '<div class="help-block"></div>'+
                                '</div>',
                             }
                           ]
                         },
                         // storage.resource
                         {
                           "type": "section",
                             "htmlClass": "col-xs-8",
                             "items": [
                               {
                                   "key": "storage.resource",
                                   "condition": "model.storage.protocol === 'IRODS'",
                                   validationMessage: {
                                       'required': 'Missing required',
                                   },
                                   $validators: {
                                       required: function(value) {
                                           return value ? true : false;
                                       },
                                   },
                               }
                             ]
                         },
                         {
                            "type": "section",
                            "htmlClass": "col-xs-4",
                            "condition": "model.storage.protocol === 'IRODS'",
                            "items": [
                              {
                                 "type": "template",
                                 "template":
                                 '<div class="form-group ">'+
                                   '<label class="control-label">&nbsp;</label>'+
                                   '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                     '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The name of the default resource to use when defining an IRODS system"></i>'+
                                   '</div>'+
                                   '<div class="help-block"></div>'+
                                 '</div>',
                              }
                            ]
                          },
                          // storage.zone
                          {
                            "type": "section",
                              "htmlClass": "col-xs-8",
                              "items": [
                                {
                                    "key": "storage.zone",
                                    "condition": "model.storage.protocol === 'IRODS'",
                                    validationMessage: {
                                        'required': 'Missing required',
                                    },
                                    $validators: {
                                        required: function(value) {
                                            return value ? true : false;
                                        },
                                    },
                                }
                              ]
                          },
                          {
                             "type": "section",
                             "htmlClass": "col-xs-4",
                             "condition": "model.storage.protocol === 'IRODS'",
                             "items": [
                               {
                                  "type": "template",
                                  "template":
                                  '<div class="form-group ">'+
                                    '<label class="control-label">&nbsp;</label>'+
                                    '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                      '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The name of the default zone to use when defining an IRODS system"></i>'+
                                    '</div>'+
                                    '<div class="help-block"></div>'+
                                  '</div>',
                               }
                             ]
                           },
                           // storage.container
                           {
                             "type": "section",
                               "htmlClass": "col-xs-8",
                               "items": [
                                 {
                                     "key": "storage.container",
                                     "condition": "model.storage.protocol === 'S3'",
                                     validationMessage: {
                                         'required': 'Missing required',
                                     },
                                     $validators: {
                                         required: function(value) {
                                             return value ? true : false;
                                         },
                                     },
                                 }
                               ]
                           },
                           {
                              "type": "section",
                              "htmlClass": "col-xs-4",
                              "condition": "model.storage.protocol === 'S3'",
                              "items": [
                                {
                                   "type": "template",
                                   "template":
                                   '<div class="form-group ">'+
                                     '<label class="control-label">&nbsp;</label>'+
                                     '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                       '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The container to use when interacting with an object store. Specifying a container provides isolation when exposing your cloud storage accounts so users do not have access to your entire storage account. This should be used in combination with delegated cloud credentials such as an AWS IAM user credential"></i>'+
                                     '</div>'+
                                     '<div class="help-block"></div>'+
                                   '</div>',
                                }
                              ]
                            }
                  ]
                }]
            },
            {
                "title": "Details",
                "items": [
                  // ID
                  {
                    "type": "section",
                      "htmlClass": "col-xs-8",
                      "items": [
                        {
                          "key": "id",
                          ngModelOptions: {
                            updateOnDefault: true
                          },
                          onChange: function(value, formModel){
                            // Make sure systems are there before displaying message
                            if ($scope.systems.length > 0) {
                              formModel.description = '<span class="text-success">'+ value + ' is available</span>';
                            }
                          },
                          validationMessage: {
                              'required': 'Missing required',
                              'notavailable': '{{viewValue}} is not available'
                          },
                          $validators: {
                              required: function(value) {
                                  return value ? true : false;
                              },
                              notavailable: function(value){
                                  if ($scope.systems.length && value) {
                                    return !($filter('filter')($scope.systems, {id: value}));
                                  } else {
                                      return true;
                                  }

                              }
                          },
                        },
                      ]
                  },
                  {
                     "type": "section",
                     "htmlClass": "col-xs-4",
                     "items": [
                       {
                          "type": "template",
                          "template":

                          '<div class="form-group ">'+
                          	'<label class="control-label">&nbsp;</label>'+
                          	'<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                          		'<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="A unique identifier you assign to the system. A system id must be globally unique across a tenant and cannot be reused once deleted"></i>'+
                          	'</div>'+
                          	'<div class="help-block"></div>'+
                          '</div>',
                       }
                     ]
                   },
                   // name
                   {
                     "type": "section",
                       "htmlClass": "col-xs-8",
                       "items": [
                         {
                           "key": "name",
                           validationMessage: {
                               'required': 'Missing required',
                           },
                           $validators: {
                               required: function(value) {
                                   return value ? true : false;
                               },
                           },
                         },
                       ]
                   },
                   {
                      "type": "section",
                      "htmlClass": "col-xs-4",
                      "items": [
                        {
                           "type": "template",
                           "template":

                           '<div class="form-group ">'+
                            '<label class="control-label">&nbsp;</label>'+
                            '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                              '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="Common display name for this system"></i>'+
                            '</div>'+
                            '<div class="help-block"></div>'+
                           '</div>',
                        }
                      ]
                    },
                    // description
                    {
                      "type": "section",
                        "htmlClass": "col-xs-8",
                        "items": [
                           "description",
                        ]
                    },
                    {
                       "type": "section",
                       "htmlClass": "col-xs-4",
                       "items": [
                         {
                            "type": "template",
                            "template":

                            '<div class="form-group ">'+
                             '<label class="control-label">&nbsp;</label>'+
                             '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                               '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="Verbose description of this system"></i>'+
                             '</div>'+
                             '<div class="help-block"></div>'+
                            '</div>',
                         }
                       ]
                     },
                     // site
                     {
                       "type": "section",
                         "htmlClass": "col-xs-8",
                         "items": [
                            "site",
                         ]
                     },
                     {
                        "type": "section",
                        "htmlClass": "col-xs-4",
                        "items": [
                          {
                             "type": "template",
                             "template":

                             '<div class="form-group ">'+
                              '<label class="control-label">&nbsp;</label>'+
                              '<div class="form-control" style="border:transparent; padding-left:0px; padding-right:0px;">'+
                                '<i class="fa fa-question-circle fa-lg" popover-placement="right" popover-trigger="mouseenter" uib-popover="The site associated with this system. Primarily for logical grouping"></i>'+
                              '</div>'+
                              '<div class="help-block"></div>'+
                             '</div>',
                          }
                        ]
                      },

                  //   "site"
                ]
            },

            {
                "title": "Auth",
                "items": [{
                    "key": "storage.auth",
                    "items": [{
                        "key": "storage.auth.username",
                        "condition": "model.storage.protocol === 'SFTP' || " +
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
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.password",
                        "condition": "(model.storage.protocol === 'SFTP' && model.storage.SFTP === '') || " +
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
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.credential",
                        "condition": "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'cred')",
                        validationMessage: {
                            'required': 'Missing required',
                        },
                        $validators: {
                            required: function(value) {
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.type",
                        "condition": "(model.storage.protocol === 'SFTP') || " +
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
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.publicKey",
                        "condition": "(model.storage.protocol === 'S3') || " +
                            "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys')",
                        validationMessage: {
                            'required': 'Missing required',
                        },
                        $validators: {
                            required: function(value) {
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.privateKey",
                        "condition": "(model.storage.protocol === 'S3') || " +
                            "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'sshkeys')",
                        validationMessage: {
                            'required': 'Missing required',
                        },
                        $validators: {
                            required: function(value) {
                                return value ? true : false;
                            },
                        },
                    }, {
                        "key": "storage.auth.server",
                        "items": [{
                            "key": "storage.auth.server.name",
                            "condition": "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                                "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "storage.auth.server.endpoint",
                            "condition": "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                                "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "storage.auth.server.port",
                            "condition": "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                                "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "storage.auth.server.protocol",
                            "condition": "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'mpg') || " +
                                "(model.storage.protocol === 'GRIDFTP' && model.storage.GRIDFTP === 'myproxy') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'mpg') || " +
                                "(model.storage.protocol === 'IRODS' && model.storage.IRODS === 'myproxy')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, ]
                    }, {
                        "key": "storage.auth.proxy",
                        "items": [{
                            "key": "storage.auth.proxy.name",
                            "condition": "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "storage.auth.proxy.host",
                            "condition": "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }, {
                            "key": "storage.auth.proxy.port",
                            "condition": "(model.storage.protocol === 'SFTP' && model.storage.SFTP === 'tunnel')",
                            validationMessage: {
                                'required': 'Missing required',
                            },
                            $validators: {
                                required: function(value) {
                                    return value ? true : false;
                                },
                            },
                        }]
                    }]
                }]
            },
        ]
    }];

    // empty for now
    $scope.model = {};

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

    $scope.fetchSystems = function() {
        $scope.systems = [];
        SystemsController.listSystems()
          .then(function(response){
            $scope.systems = response;
          })
          .catch(function(response) {
            $scope.systems = [];
          });
    };

    $scope.init = function() {
        $scope.fetchSystems();
        WizardHandler.activateTab($scope, $scope.currentTabIndex);
    }

    $scope.init();




    $scope.submit = function() {
        $scope.$broadcast('schemaFormValidate');
        if ($scope.form.$valid) {
            console.log($scope.model);
        }
    };

    $scope.nextStep = function(currentTab) {

        WizardHandler.validateTab($scope, $scope.currentTabIndex).then(function(value) {
            WizardHandler.activateTab($scope, ++$scope.currentTabIndex);
        });


    };

    $scope.previousStep = function() {
        WizardHandler.activateTab($scope, --$scope.currentTabIndex);
    };



    $scope.wizview = 'split';

    $scope.editorConfig = {
        lineWrapping: true,
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: false,
        theme: "neat",
        mode: 'javascript'
    };

    // Watch protocol. reset if default SFTP/default changes
    $scope.$watch('model.storage.protocol', function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && typeof oldValue !== 'undefined'){
          $scope.model.storage[oldValue] = undefined;
      }
    }, true);

    $scope.$watch('model', function(value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

    $scope.updateWizardLayout = function() {
        console.log($scope.wizview);
    };

    $scope.codemirrorLoaded = function(_editor) {
        // Events
        _editor.on("change", function () {
            //if (_editor.hasFocus()) {
            $timeout(function() {
                $scope.model = JSON.parse(_editor.getValue());
            }, 0);

            //}
        });
        _editor.on("blur", function () {
            if (_editor.hasFocus()) {
                $scope.model = JSON.parse(_editor.getValue());
            }
        });
    };

    // CodeMirror editor support
    $scope.editorConfig = {
        lineWrapping : true,
        lineNumbers: true,
        matchBrackets: true,
        styleActiveLine: false,
        theme:"neat",
        mode: 'javascript',
        json: true,
        statementIndent: 2,
        onLoad: $scope.codemirrorLoaded
    };
});
