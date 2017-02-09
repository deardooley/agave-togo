'use strict';

angular.module('AgaveToGo').controller('TagsManagerDirectoryController', [
    '$scope',
    '$q',
    '$translate',
    '$stateParams',
    'AppsController',
    'FilesController',
    'JobsController',
    'MetaController',
    'MonitorsController',
    'NotificationsController',
    'SystemsController',
    'TagsController',
    'UUIDsController',
    'MessageService', function (
      $scope,
      $q,
      $translate,
      $stateParams,
      AppsController,
      FilesController,
      JobsController,
      MetaController,
      MonitorsController,
      NotificationsController,
      SystemsController,
      TagsController,
      UUIDsController,
      MessageService) {

    $scope._COLLECTION_NAME = 'tags';
    $scope._RESOURCE_NAME = 'tag';

    $scope[$scope._COLLECTION_NAME] = {};

    $scope.offset = 0;
    $scope.limit = 10;
    $scope.query = '';

    $scope.refresh = function(){
      var promisesUuids = [];
      var promises = [];

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
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type] = [];
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type].push(zipped[1].value.result);
                        } else {
                          $scope[$scope._COLLECTION_NAME][zipped[0].name].resources[zipped[1].value.result.type].push(zipped[1].value.result);
                        }
                      } else {
                        // do something with failed
                      }
                  });
                }

              );
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_files_list'));
          }
        );
    };

    $scope.getResourceDetails = function(resource){
      $scope.resource = '';
      switch(resource.type){
        case 'app': UUIDsController.getUUID(resource.uuid, true)
                      .then(
                        function(response){
                          $scope.resource = response.result;
                        },
                        function(response){
                        }
                      );
          break;
        case 'file':
          break;
        case 'job':
          break;
        case 'metadata':
          break;
        case 'monitor':
          break;
        case 'notification':
          break;
        case 'system':
          break;
        case 'tag':
          break;
      }
    }

    $scope.refresh();
}]);
