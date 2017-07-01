angular.module('AgaveToGo').controller('ContainerResourceRunController', function ($scope, $stateParams, $uibModal, $modalStack, $localStorage, $rootScope, $translate, AppsController, SystemsController, JobsController, NotificationSubscriptionTemplateService, NotificationsController, FilesController, SystemExecutionTypeEnum, MessageService, Quay, $filter) {
  $scope.appId = $stateParams.appId || 'jfonner-run-singularity-4.2.3';
  $scope.executionSystem = {};
  $scope.image = {};
  $scope.tags = {};
  $scope.systems = [];

  Quay.getImageDetails($stateParams.id).then(
      function (image) {
        image.available = true;
        image.version = '--';
        image.runtimes = {
          docker: {
            executionType: SystemExecutionTypeEnum.CLI
          },
          singularity: {
            executionType: SystemExecutionTypeEnum.CLI
          },
          native: {
            executionType: SystemExecutionTypeEnum.CLI,
            url: ''
          }
        };

        $scope.image = image;

        Quay.getImageTags($stateParams.id).then(
            function (response) {
              $scope.tags = [];
              for (key in response) {
                if (key !== 'latest') {
                  $scope.tags.push({
                    value: 'agave://singularity-storage/' + image.name + '_' + key + '.img.bz2',
                    label: image.name + " - " + key
                  });
                }
              }

              // fetch systems for archiving, etc
              SystemsController.searchSystems('limit=999999&filter=name,id,type,executionSystem,executionType,label,default').then(
                  function (response) {
                    $scope.systems = response.result;

                    AppsController.getAppDetails($scope.appId).then(
                        function (response) {
                          $scope.app = response.result;

                          // find the execution system in the list
                          angular.forEach($scope.systems, function (system) {
                            if (system.id == $scope.app.executionSystem) {
                              $scope.executionSystem = system;
                              return false;
                            }
                          });


                          for (index in $scope.executionSystem.queues) {
                            var q = $scope.executionSystem.queues[index];
                            if (q["name"] == $scope.app.defaultQueue) {
                              $scope.defaultBatchQueue = q;
                              break;
                            }
                          }

                          $scope.requesting = false;

                          $scope.resetForm();
                        },
                        function (errorResponse) {
                          MessageService.handle(errorResponse, $translate.instant('error_container_app'));
                        })
                    // // fetch storage systems for archiving, etc
                    // AppsController.searchApps('name.like=*singularity*&filter=*').then(
                    //     function(response) {
                    //       $scope.apps = response;
                    //       $scope.appChoices = $filter('filter')(response.result, function(system) {
                    //         return { value: app.id, label: app.executionSystem };
                    //       });
                    //
                    //       $scope.requesting = false;
                    //
                    //       $scope.resetForm();
                    //     },
                    //     function(errorResponse) {
                    //       MessageService.handle(errorResponse, $translate.instant('error_container_apps_list'));
                    //     });
                  },
                  function (errorResponse) {
                    MessageService.handle(errorResponse, $translate.instant('error_systems_list'));
                  });

            },
            function (errorResponse) {
              MessageService.handle(errorResponse, $translate.instant('error_container_tags'));
            });

      },
      function (errorResponse) {
        MessageService.handle(errorResponse, $translate.instant('error_container_details'));
      });


  $scope.formSchema = function (app) {
    var schema = {
      type: 'object',
      properties: {}
    };

    var params = app.parameters || [];
    var inputs = app.inputs || [];

    if (params.length > 0) {
      schema.properties.parameters = {
        type: 'object',
        properties: {}
      };
      _.each(params, function (param) {
        if (!param.value.visible) {
          return;
        }
        if (param.id.startsWith('_')) {
          return;
        }
        var field = {
          title: param.details.label,
          description: param.details.description,
          required: param.value.required
        };
        switch (param.value.type) {
          case 'bool':
          case 'flag':
            field.type = 'boolean';
            break;

          case 'enumeration':
            field.type = 'string';
            field.format = 'uiselect';
            field.enum = _.map(param.value.enum_values, function (enum_val) {
              return Object.keys(enum_val)[0];
            });
            field.items = {
              'titleMap': _.map(param.value.enum_values, function (enum_val) {
                var key = Object.keys(enum_val)[0];
                return {
                  'value': key,
                  'name': enum_val[key]
                };
              })
            };
            break;

          case 'number':
            field.type = 'number';
            break;

          case 'string':
          default:
            field.type = 'string';
        }
        schema.properties.parameters.properties[param.id] = field;
      });
    }


    if (inputs.length > 0) {
      schema.properties.inputs = {
        type: 'object',
        properties: {
          singularityImage: {
            title: 'Select the ' + $scope.image.name + ' version',
            description: "Each version of " + $scope.image.name + " has a separate tag. Select the tagged version fo the image corresponding to the version of the code you would like to run.",
            required: true,
            type: 'string',
            format: 'uiselect',
            placeholder: 'None selected',
            items: $scope.tags,
            default: $scope.tags[0].value
          }
        }
      };
      _.each(inputs, function (input) {
        var field;
        if (input.id == 'singularityImage') {
          return;
        }
        else if (!input.value.visible) {
          return;
        }
        else if (input.id.startsWith('_')) {
          return;
        }
        else {
          field = {
            title: input.details.label,
            description: input.details.description,
          };
          if (input.semantics.maxCardinality === 1) {
            field.type = 'string';
            field.required = input.value.required;
          } else {
            field.type = 'array';
            field.items = {
              type: 'string',
              'x-schema-form': {
                notitle: true
              },
            }
            if (input.semantics.maxCardinality > 1) {
              field.maxItems = input.semantics.maxCardinality;
            }
          }
        }
        schema.properties.inputs.properties[input.id] = field;
      });
    }

    schema.properties.showAadvancedOptions = {
      title: 'View advanced options',
      type: 'boolean',
      default: false
    };

    schema.properties.name = {
      title: 'Job name',
      description: 'A recognizable name for this job',
      type: 'string',
      required: true,
      default: $localStorage.activeProfile.username + '-' + $scope.image.name + '-' + moment(Date.now()).format('YYYYMMDD')
    };

    schema.properties.requestedTime = {
      title: 'Maximum job runtime',
      description: 'In HH:MM:SS format. The maximum time you expect this job to run for. ' +
      'After this amount of time your job will be killed by the job scheduler. ' +
      'Shorter run times result in shorter queue wait times.',
      type: 'string',
      pattern: "^([0-9]{2,}:[0-5][0-9]:[0-5][0-9])$",
      validationMessage: "Must be in format HH:MM:SS",
      required: true,
      default: $scope.defaultBatchQueue["maxRequestedTime"],
      'x-schema-form': {placeholder: app.defaultMaxRunTime}
    };

    var batchQueueArray = [];
    for (index in $scope.executionSystem.queues) {
      var name = $scope.executionSystem.queues[index]['name'];
      batchQueueArray.push({value: name, label: name});
    }
    schema.properties.batchQueue = {
      title: 'Batch Queue',
      description: 'Which batch queue to submit the job to',
      type: 'string',
      format: 'uiselect',
      items: batchQueueArray,
      required: true,
      placeholder: 'None selected',
      default: app.defaultQueue
    };

    schema.properties.nodeCount = {
      title: 'Node Count',
      description: 'The number of nodes to use for this job',
      type: 'integer',
      required: true,
      maximum: $scope.defaultBatchQueue.maxNodes,
      minimum: 1,
      default: 1
    };

    schema.properties.processorsPerNode = {
      title: 'Processors Per Node',
      description: 'The number of processors per node to use for this job',
      type: 'integer',
      required: true,
      maximum: $scope.defaultBatchQueue.maxProcessorsPerNode,
      minimum: 1,
      default: $scope.defaultBatchQueue["maxProcessorsPerNode"]
    };

    schema.properties.archive = {
      title: 'Archive the job output',
      type: 'boolean',
      default: true
    };

    var archiveSystems = [];
    angular.forEach($scope.systems, function (system) {
      if (system.type == 'STORAGE') {
        if (system.default) {
          $scope.defaultSystem = system;
        }
        archiveSystems.push({value: system.id, label: system.name, description: system.id});
      }

    });

    schema.properties.archiveSystem = {
      title: 'Archive System',
      description: 'The system to which the output should be archived',
      type: 'string',
      format: 'uiselect',
      items: archiveSystems,
      placeholder: 'None selected',
      default: $scope.defaultSystem.id,
      options: {
        searchDescriptions: true
      }
    };

    schema.properties.archivePath = {
      title: 'Job output archive location (optional)',
      description: 'Specify a location where the job output should be archived. By default, job output will be archived at: <code>&lt;username&gt;/archive/jobs/${YYYY-MM-DD}/${JOB_NAME}-${JOB_ID}</code>.',
      type: 'string',
      format: 'agaveFile',
      'x-schema-form': {placeholder: '<username>/archive/jobs/${YYYY-MM-DD}/${JOB_NAME}-${JOB_ID}'}
    };

    return schema;
  };

  $scope.resetForm = function () {
    if ($scope.appId !== '') {
      AppsController.getAppDetails($scope.appId)
          .then(
              function (response) {
                $scope.app = response.result;
                SystemsController.getSystemDetails($scope.app.executionSystem)
                    .then(function (systemResponse) {
                      $scope.executionSystem = systemResponse.result;
                      for (index in $scope.executionSystem.queues) {
                        var q = $scope.executionSystem.queues[index];
                        if (q["name"] == $scope.app.defaultQueue) {
                          $scope.defaultBatchQueue = q;
                        }
                      }
                      $scope.form = {model: {}};
                      $scope.form.schema = $scope.formSchema($scope.app);
                      $scope.form.form = [];

                      /* inputs */
                      var inputs = [];
                      var parameters = [];

                      if ($scope.form.schema.properties.inputs && Object.keys($scope.form.schema.properties.inputs.properties).length > 0) {

                        inputs.push({
                          'key': 'inputs',
                          'items': [
                            {
                              key: 'inputs.singularityImage'
                            }
                          ]
                        });

                        angular.forEach($scope.form.schema.properties.inputs.properties, function (input, key) {
                          if (key !== 'singularityImage') {
                            inputs[0].items.push(
                                {
                                  "input": key,
                                  "type": "template",
                                  "template": '<div class="form-group has-success has-feedback"> <label for="input">{{form.title}}</label> <div class="input-group"> <a class="input-group-addon" ng-click="form.selectFile(form.input)">Select</a> <input type="text" class="form-control" id="input" ng-model="form.model.inputs[form.input]"></div> <span class="help-block">{{form.description}}</span> </div>',
                                  "title": input.title,
                                  "description": input.description,
                                  "model": $scope.form.model,
                                  selectFile: function (key) {
                                    $scope.requesting = true;
                                    // SystemsController.getSystemDetails($scope.app.deploymentSystem).then(
                                    SystemsController.searchSystems('type.eq=storage&default.eq=true')
                                        .then(
                                            function (response) {
                                              if (response.result > 0) {
                                                // check if modal already opened
                                                if (!$modalStack.getTop()) {
                                                  $stateParams.path = $scope.path;

                                                  $scope.system = response.result[0];
                                                  $rootScope.uploadFileContent = '';

                                                  if (typeof $stateParams.path === 'undefined' || $stateParams.path === "" || $stateParams.path === "/") {
                                                    // check if username path is browsable
                                                    FilesController.listFileItems(response.result[0].id, $localStorage.activeProfile.username, 1, 0)
                                                        .then(
                                                            function (rootFiles) {
                                                              $scope.path = $localStorage.activeProfile.username;
                                                              $stateParams.path = $scope.path;
                                                              $uibModal.open({
                                                                templateUrl: "views/apps/filemanager.html",
                                                                scope: $scope,
                                                                size: 'lg',
                                                                controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                                  $scope.cancel = function () {
                                                                    $modalInstance.dismiss('cancel');
                                                                  };

                                                                  $scope.close = function () {
                                                                    $modalInstance.close();
                                                                  }

                                                                  $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                                    if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                                      if (typeof $scope.form.model.inputs === 'undefined') {
                                                                        $scope.form.model.inputs = {};
                                                                      }
                                                                      $scope.form.model.inputs[key] = uploadFileContent;
                                                                      $scope.close();
                                                                    }
                                                                  });
                                                                }]
                                                              });
                                                              $scope.error = false;
                                                              $scope.requesting = false;
                                                            },
                                                            function (rootFiles) {
                                                              // check if / is browsable
                                                              FilesController.listFileItems(response.result.id, '/', 1, 0)
                                                                  .then(
                                                                      function (usernameFiles) {
                                                                        $scope.path = '/';
                                                                        $stateParams.path = $scope.path;
                                                                        $uibModal.open({
                                                                          templateUrl: "views/apps/filemanager.html",
                                                                          scope: $scope,
                                                                          size: 'lg',
                                                                          controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                                            $scope.cancel = function () {
                                                                              $modalInstance.dismiss('cancel');
                                                                            };

                                                                            $scope.close = function () {
                                                                              $modalInstance.close();
                                                                            }

                                                                            $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                                              if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                                                if (typeof $scope.form.model.inputs === 'undefined') {
                                                                                  $scope.form.model.inputs = {};
                                                                                }
                                                                                $scope.form.model.inputs[key] = uploadFileContent;
                                                                                $scope.close();
                                                                              }
                                                                            });
                                                                          }]
                                                                        });
                                                                        $scope.error = false;
                                                                        $scope.requesting = false;
                                                                      },
                                                                      function (response) {
                                                                        MessageService.handle(response, $translate.instant('error_files_list'));
                                                                        $scope.requesting = false;
                                                                      }
                                                                  )
                                                            }
                                                        );
                                                  } else {
                                                    $scope.path = $stateParams.path;
                                                    $uibModal.open({
                                                      templateUrl: "views/apps/filemanager.html",
                                                      scope: $scope,
                                                      size: 'lg',
                                                      controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                        $scope.cancel = function () {
                                                          $modalInstance.dismiss('cancel');
                                                        };

                                                        $scope.close = function () {
                                                          $modalInstance.close();
                                                        }

                                                        $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                          if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                            if (typeof $scope.form.model.inputs === 'undefined') {
                                                              $scope.form.model.inputs = {};
                                                            }
                                                            $scope.form.model.inputs[key] = uploadFileContent;
                                                            $scope.close();
                                                          }
                                                        });
                                                      }]
                                                    });
                                                    $scope.error = false;
                                                    $scope.requesting = false;
                                                  }
                                                }
                                              }

                                              // check if modal already opened
                                              if (!$modalStack.getTop()) {
                                                $stateParams.path = $scope.path;

                                                $scope.system = response.result[0];
                                                $rootScope.uploadFileContent = '';

                                                if (typeof $stateParams.path === 'undefined' || $stateParams.path === "" || $stateParams.path === "/") {
                                                  // check if username path is browsable
                                                  FilesController.listFileItems(response.result[0].id, $localStorage.activeProfile.username, 1, 0)
                                                      .then(
                                                          function (rootFiles) {
                                                            $scope.path = $localStorage.activeProfile.username;
                                                            $stateParams.path = $scope.path;
                                                            $uibModal.open({
                                                              templateUrl: "views/apps/filemanager.html",
                                                              scope: $scope,
                                                              size: 'lg',
                                                              controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                                $scope.cancel = function () {
                                                                  $modalInstance.dismiss('cancel');
                                                                };

                                                                $scope.close = function () {
                                                                  $modalInstance.close();
                                                                }

                                                                $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                                  if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                                    if (typeof $scope.form.model.inputs === 'undefined') {
                                                                      $scope.form.model.inputs = {};
                                                                    }
                                                                    $scope.form.model.inputs[key] = uploadFileContent;
                                                                    $scope.close();
                                                                  }
                                                                });
                                                              }]
                                                            });
                                                            $scope.error = false;
                                                            $scope.requesting = false;
                                                          },
                                                          function (rootFiles) {
                                                            // check if / is browsable
                                                            FilesController.listFileItems(response.result[0].id, '/', 1, 0)
                                                                .then(
                                                                    function (usernameFiles) {
                                                                      $scope.path = '/';
                                                                      $stateParams.path = $scope.path;
                                                                      $uibModal.open({
                                                                        templateUrl: "views/apps/filemanager.html",
                                                                        scope: $scope,
                                                                        size: 'lg',
                                                                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                                          $scope.cancel = function () {
                                                                            $modalInstance.dismiss('cancel');
                                                                          };

                                                                          $scope.close = function () {
                                                                            $modalInstance.close();
                                                                          }

                                                                          $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                                            if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                                              if (typeof $scope.form.model.inputs === 'undefined') {
                                                                                $scope.form.model.inputs = {};
                                                                              }
                                                                              $scope.form.model.inputs[key] = uploadFileContent;
                                                                              $scope.close();
                                                                            }
                                                                          });
                                                                        }]
                                                                      });
                                                                      $scope.error = false;
                                                                      $scope.requesting = false;
                                                                    },
                                                                    function (response) {
                                                                      MessageService.handle(response, $translate.instant('error_files_list'));
                                                                      $scope.requesting = false;
                                                                    }
                                                                )
                                                          }
                                                      );
                                                } else {
                                                  $scope.path = $stateParams.path;
                                                  $uibModal.open({
                                                    templateUrl: "views/apps/filemanager.html",
                                                    scope: $scope,
                                                    size: 'lg',
                                                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                                      $scope.cancel = function () {
                                                        $modalInstance.dismiss('cancel');
                                                      };

                                                      $scope.close = function () {
                                                        $modalInstance.close();
                                                      }

                                                      $scope.$watch('uploadFileContent', function (uploadFileContent) {
                                                        if (typeof uploadFileContent !== 'undefined' && uploadFileContent !== '') {
                                                          if (typeof $scope.form.model.inputs === 'undefined') {
                                                            $scope.form.model.inputs = {};
                                                          }
                                                          $scope.form.model.inputs[key] = uploadFileContent;
                                                          $scope.close();
                                                        }
                                                      });
                                                    }]
                                                  });
                                                  $scope.error = false;
                                                  $scope.requesting = false;
                                                }
                                              }
                                            },
                                            function (response) {
                                              MessageService.handle(response, $translate.instant('error_apps_details'));
                                            }
                                        );
                                  }
                                }
                            );
                          }
                        });
                      }

                      /* job details */
                      $scope.form.form.push({
                        type: 'fieldset',
                        title: 'Details',
                        items: [
                          'name',
                          'showAadvancedOptions',
                          {
                            type: "conditional",
                            condition: "form.model.showAadvancedOptions",
                            items: [
                              'requestedTime',
                              'batchQueue',
                              'nodeCount',
                              'processorsPerNode',
                              'archive',
                              {
                                key: 'archiveSystem',
                                condition: "form.model.archive"
                              },
                              {
                                key: 'archivePath',
                                condition: "form.model.archive"
                              }
                            ]
                          }
                        ]
                      });

                      if (inputs.length > 0) {
                        $scope.form.form.push({
                          type: 'fieldset',
                          title: 'Inputs',
                          items: inputs,
                        });
                      }

                      if ($scope.form.schema.properties.parameters && Object.keys($scope.form.schema.properties.parameters.properties).length > 0) {
                        $scope.form.form.push({
                          type: 'fieldset',
                          title: 'Parameters',
                          items: [
                            'parameters'
                          ]
                        });
                      }
                      
                      /* buttons */
                      items = [];

                      items.push({type: 'submit', title: 'Run', style: 'btn-primary'});
                      $scope.form.form.push({
                        type: 'actions',
                        items: items
                      });
                    })
              }
          )
          .catch(
              function (response) {
                MessageService.handle(response, $translate.instant('error_apps_details'));
              }
          );
    } else {
      MessageService.handle(response, $translate.instant('error_apps_details'));
    }
  };


  $scope.onSubmit = function (form) {

    $scope.$broadcast('schemaFormValidate');

    if (form.$valid) {
      var jobData = {
        appId: $scope.app.id,
        archive: true,
        inputs: {},
        parameters: {}
      };

      /* copy form model to disconnect from $scope */
      _.extend(jobData, angular.copy($scope.form.model));

      /* remove falsy input/parameter */
      _.each(jobData.inputs, function (v, k) {
        if (_.isArray(v)) {
          v = _.compact(v);
          if (v.length === 0) {
            delete jobData.inputs[k];
          }
        }
      });
      _.each(jobData.parameters, function (v, k) {
        if (_.isArray(v)) {
          v = _.compact(v);
          if (v.length === 0) {
            delete jobData.parameters[k];
          }
        }
      });

      $scope.requesting = true;

      // add whatever notifications the user has set in their config to the job request.
      // this saves a few api calls after job creation.
      jobData.notifications = NotificationSubscriptionTemplateService.getDefaultSubscriptions();

      JobsController.createSubmitJob(jobData)
          .then(
              function (response) {
                // hard-wired for now
                $scope.job = response.result;

                $uibModal.open({
                  templateUrl: "views/apps/resource/job-success.html",
                  scope: $scope,
                  size: 'lg',
                  controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };

                    $scope.close = function () {
                      $modalInstance.close();
                    }
                  }]
                });
                $scope.resetForm();
                $scope.requesting = false;
              },
              function (response) {
                MessageService.handle(response, $translate.instant('error_jobs_create'));
                $scope.requesting = false;
              });
    }

  };

  $scope.lazyLoadFileManagerParams = [
    '../bower_components/angular-cookies/angular-cookies.min.js',
    '../bower_components/codemirror/lib/codemirror.css',
    '../bower_components/codemirror/theme/neo.css',
    '../bower_components/codemirror/theme/solarized.css',
    '../bower_components/codemirror/mode/javascript/javascript.js',
    '../bower_components/codemirror/mode/markdown/markdown.js',
    '../bower_components/codemirror/mode/clike/clike.js',
    '../bower_components/codemirror/mode/shell/shell.js',
    '../bower_components/codemirror/mode/python/python.js',
    '../bower_components/angular-ui-codemirror/ui-codemirror.min.js',
  ];


});
