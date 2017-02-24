'use strict';

angular.module('AgaveToGo').controller('TagsManagerDirectoryController', [
    '$scope',
    '$q',
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
      $q,
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

    $scope._COLLECTION_NAME = 'tags';
    $scope._RESOURCE_NAME = 'tag';

    $scope[$scope._COLLECTION_NAME] = {};

    $scope.offset = 0;
    $scope.limit = 10;
    $scope.query = '';
    $scope.resource = {};

    $scope.refresh = function(){
      var promisesUuids = [];
      var promises = [];
      $scope.requesting = true;
      TagsController.listTags($scope.query, $scope.limit, $scope.offset)
        .then(
          function(response){
            _.each(response.result, function(tag){
              _.each(tag.associationIds, function(uuid){
                promisesUuids.push(tag);
                promises.push(UUIDsController.getUUID(uuid, false));
              })
            });

            $q.allSettled(promises)
              .then(
                function (promisesResult) {

                  var failed = [];
                  var success = [];
                  var promisesZipped = _.zip(promisesUuids, promisesResult);

                  _.each(promisesZipped, function(zipped){

                      if (typeof $scope[$scope._COLLECTION_NAME][zipped[0].name] === 'undefined'){
                        $scope[$scope._COLLECTION_NAME][zipped[0].name] = {'tag': zipped[0], 'resources': {}};
                      }

                      if (zipped[1].status === 'fulfilled'){
                        if (typeof $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type] == 'undefined'){
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].expand = false;
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type] = [];
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type].push(zipped[1].value.result);
                        } else {
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type].push(zipped[1].value.result);
                        }
                      } else {
                        // do something with failed
                      }
                  });
                  $scope.tagsOriginal = angular.copy($scope[$scope._COLLECTION_NAME]);
                  $scope.requesting = false;
                }

              );
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_tags_list'));
            $scope.requesting = false;
          }
        );
    };

    $scope.expandAll = function(){
      $scope.expand = true;
      _.each($scope[$scope._COLLECTION_NAME], function(tag){
        tag.expand = true;
      });
    };

    $scope.collapseAll = function(){
      $scope.expand = false;
      _.each($scope[$scope._COLLECTION_NAME], function(tag){
        tag.expand = false;
      });
    };

    $scope.filterTags = function(){
      $scope[$scope._COLLECTION_NAME] = {};
      if ($scope.filter === ''){
        _.each($scope.tagsOriginal, function(tagValue, tagKey){
          $scope[$scope._COLLECTION_NAME][tagKey] = tagValue;
        });
      }
      _.each($scope.tagsOriginal, function(tagValue, tagKey){
        if (tagKey.includes($scope.filter)){
          $scope[$scope._COLLECTION_NAME][tagKey] = tagValue;
        }
      });
    };

    $scope.editTag = function($event, tagObj){
       console.log('inside editTag');
       console.log(tagObj);
       $state.go('tags-edit', {'id': tagObj.id});
    }

    $scope.getResourceDetails = function(resource){
      switch(resource.type){
        case 'app':
          $scope.resource.url = $translate.instant('resource_template_app');
          UUIDsController.getUUID(resource.uuid, true)
            .then(
              function(response){
                $scope.resource.uuid = response.result.uuid;
                $scope.app = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_apps_details'));
              }
            );
          break;
        case 'file':
          $scope.resource.url = $translate.instant('resource_template_file');

          // special attributes here for file
          $scope.resource.systemId = resource._links.self.href.split('/')[7];
          $scope.resource.path = resource._links.self.href.split('/system/'+ $scope.resource.systemId + '/')[1];

          FilesController.listFileItems($scope.resource.systemId, $scope.resource.path, 1, 0)
            .then(
              function(response){
                if (response.length > 0){
                  $scope.file = response[0];
                } else {
                  MessageService.handle('', $translate.instant('error_files_list'));
                }
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_files_list'));
              }
            )
          break;
        case 'job':
          $scope.resource.url = $translate.instant('resource_template_job');
          UUIDsController.getUUID(resource.uuid, true)
            .then(
              function(response){
                $scope.resource.uuid = response.result.id;
                $scope.job = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_tags_list'));
              }
            );
          break;
        case 'metadata':
          $scope.resource.url = $translate.instant('resource_template_meta');
          var query = '{"uuid": "' + resource.uuid + '"}';
          MetaController.listMetadata(query, 1, 0)
            .then(
              function(response){
                if (response.result.length > 0){
                  $scope.meta = response.result[0];
                } else {
                  MessageService.handle(response, $translate.instant('error_meta_list'));
                }
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_meta_list'));
              }
            );
          break;
        case 'monitor':
          $scope.resource.url = $translate.instant('resource_template_monitor');

          MonitorsController.getMonitoringTask(resource.uuid)
            .then(
              function(response){
                $scope.resource.uuid = response.result.id;
                $scope.monitor = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_tags_list'));
              }
            );
          break;
        case 'notification':
          $scope.resource.url = $translate.instant('resource_template_notification');
          UUIDsController.getUUID(resource.uuid, true)
            .then(
              function(response){
                $scope.resource.uuid = response.result.id;
                $scope.notification = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_tags_list'));
              }
            );
          break;
        case 'schema':
          $scope.resource.url = $translate.instant('resource_template_schema');
          var query = '{"uuid": "' + resource.uuid + '"}';
          MetaController.listMetadataSchema(query, 1, 0)
            .then(
              function(response){
                if (response.result.length > 0){
                  $scope.schema = response.result[0];
                } else {
                  MessageService.handle(response, $translate.instant('error_meta_schema_list'));
                }
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_meta_schema_list'));
              }
            );
          break;
        case 'system':
          $scope.resource.url = $translate.instant('resource_template_system');
          UUIDsController.getUUID(resource.uuid, true)
            .then(
              function(response){
                $scope.resource.uuid = response.result.uuid;
                $scope.system = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_systems_list'));
              }
            );
          break;
        case 'tag':
          $scope.resource.url = $translate.instant('resource_template_tag');
          UUIDsController.getUUID(resource.uuid, true)
            .then(
              function(response){
                $scope.resource.uuid = response.result.id;
                $scope.tag = response.result;
              },
              function(response){
                MessageService.handle(response, $translate.instant('error_tags_list'));
              }
            );
          break;
      }
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

    $scope.refresh();
}]);
