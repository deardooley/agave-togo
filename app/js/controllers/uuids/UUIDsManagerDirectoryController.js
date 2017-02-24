'use strict';

angular.module('AgaveToGo').controller('UUIDsManagerDirectoryController', [
  '$scope',
  '$state',
  '$stateParams',
  '$translate',
  'FilesController',
  'MetaController',
  'MonitorsController',
  'TagsController',
  'UUIDsController',
  'ActionsService',
  'MessageService',
  'PermissionsService',
  'RolesService',
    function (
      $scope,
      $state,
      $stateParams,
      $translate,
      FilesController,
      MetaController,
      MonitorsController,
      TagsController,
      UUIDsController,
      ActionsService,
      MessageService,
      PermissionsService,
      RolesService
    ) {
    $scope._COLLECTION_NAME = 'uuids';
    $scope._RESOURCE_NAME = 'uuid';

    $scope[$scope._COLLECTION_NAME] = [];

    $scope.queryLimit = 99999;

    $scope.offset = 0;
    $scope.limit = 10;

    $scope.query = '';

    $scope.searchUUID = function(uuid){
      $scope.requesting = true;
      UUIDsController.getUUID(uuid, false)
        .then(
          function(response){
            $scope.resource = {};

            switch(response.result.type){
              case 'app':
                $scope.resource.url = $translate.instant('resource_template_app');
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.uuid;
                      $scope.app = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_apps_details'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'file':
                $scope.resource.url = $translate.instant('resource_template_file');

                // special attributes here for file
                $scope.resource.systemId = response.result._links.self.href.split('/')[7];
                $scope.resource.path = response.result._links.self.href.split('/system/'+ $scope.resource.systemId + '/')[1];

                FilesController.listFileItems($scope.resource.systemId, $scope.resource.path, 1, 0)
                  .then(
                    function(response){
                      if (response.length > 0){
                        $scope.file = response[0];
                        $scope.requesting = false;
                      } else {
                        MessageService.handle('', $translate.instant('error_files_list'));
                        $scope.requesting = false;
                      }
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_files_list'));
                      $scope.requesting = false;
                    }
                  )
                break;
              case 'job':
                $scope.resource.url = $translate.instant('resource_template_job');
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.id;
                      $scope.job = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_tags_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'metadata':
                $scope.resource.url = $translate.instant('resource_template_meta');
                var query = '{"uuid": "' + response.result.uuid + '"}';
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.id;
                      $scope.meta = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_meta_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'monitor':
                $scope.resource.url = $translate.instant('resource_template_monitor');

                MonitorsController.getMonitoringTask(response.result.uuid)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.id;
                      $scope.monitor = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_tags_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'notification':
                $scope.resource.url = $translate.instant('resource_template_notification');
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.id;
                      $scope.notification = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_tags_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'schema':
                $scope.resource.url = $translate.instant('resource_template_schema');
                var query = '{"uuid": "' + response.result.uuid + '"}';
                MetaController.listMetadataSchema(query, 1, 0)
                  .then(
                    function(response){
                      if (response.result.length > 0){
                        $scope.schema = response.result[0];
                      } else {
                        MessageService.handle(response, $translate.instant('error_meta_schema_list'));
                      }
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_meta_schema_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'system':
                $scope.resource.url = $translate.instant('resource_template_system');
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.uuid;
                      $scope.system = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_systems_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
              case 'tag':
                $scope.resource.url = $translate.instant('resource_template_tag');
                UUIDsController.getUUID(response.result.uuid, true)
                  .then(
                    function(response){
                      $scope.resource.uuid = response.result.id;
                      $scope.tag = response.result;
                      $scope.requesting = false;
                    },
                    function(response){
                      MessageService.handle(response, $translate.instant('error_tags_list'));
                      $scope.requesting = false;
                    }
                  );
                break;
            }
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_uuids_list'));
            $scope.requesting = false;
          }
        );

    };


    // Apps
    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceIndex){
      ActionsService.confirmAction(resourceType, resource, resourceAction, resourceIndex);
    };

    $scope.editPermissions = function(resource, resourceType) {
      PermissionsService.editPermissions(resource, resourceType);
    }

    $scope.edit = function(resourceType, resource){
      ActionsService.edit(resourceType, resource);
    };

    $scope.getNotifications = function(resourceType, resource){
      ActionsService.getNotifications(resourceType, resource);
    };

    // Systems
    $scope.editRoles = function(system){
      RolesService.editRoles(system);
    }

    // Tags
    $scope.editTag = function($event, tagObj){
       $state.go('tags-edit', {'id': tagObj.id});
    }



}]);
