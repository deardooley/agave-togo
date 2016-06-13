angular.module('AgaveToGo').controller('MetaDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $uibModal, $http, Commons, AppsController, MetaController, ActionsService) {


    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'metas';

    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'meta';

    $scope.itemsPerPage = 5;

    $scope.query = '';

    $scope.refresh = function() {
      $scope.requesting = true;

      if ($scope.query){
         // TO-DO: check for complex value.* properties
          var patt = /^\s*{\s*"name"\s*:\s*"[a-zA-Z0-9-_\s]*"((\s*,\s*"value"\s*:\s*"(.*?))?"\s*)?}\s*$/;
          if (patt.test($scope.query)){
              MetaController.listMetadata($scope.query, 99999, 0)
                .then(
                  function (response) {
                    $scope.totalItems = response.length;
                    $scope.pagesTotal = Math.ceil(response.length / $scope.itemsPerPage);
                    $scope[$scope._COLLECTION_NAME] = response;
                    $scope.requesting = false;
                  },
                  function(response){
                    $scope.requesting = false;
                    App.alert({
                       type: 'danger',
                       message: "Error retrieving system list.<br>" + response.message,
                    });
                  }
              );
              App.alert({
                message: "Valid query"
              });
          } else {
              App.alert({
                type: 'danger',
                message: "Invalid query"
              });
          }
      } else {
        MetaController.listMetadata($scope.query, 99999, 0)
          .then(
            function (response) {
              $scope.totalItems = response.length;
              $scope.pagesTotal = Math.ceil(response.length / $scope.itemsPerPage);
              $scope[$scope._COLLECTION_NAME] = response;
              $scope.requesting = false;
            },
            function(response){
                $scope.requesting = false;
              App.alert({
                 type: 'danger',
                 message: "Error retrieving system list.<br>" + response.message,
              });
            }
        );
      }
    };

    $scope.search = function(){
      $scope.refresh();
    }


    $scope.refresh();

    $scope.getPage = function(newPageNumber, oldPageNumber, resourceType){
      $scope.offset = (newPageNumber - 1) * this.itemsPerPage;
      MetaController.listMetadata($scope.query, $scope.itemsPerPage, $scope.offset)
        .then(
          function (response) {
            $scope.pagesTotal = Math.ceil(response.length / $scope.itemsPerPage);
            $scope[$scope._COLLECTION_NAME] = response;
          },
          function(response){
            $scope.handleFailure(response);
            App.alert({
               type: 'danger',
               message: "Error retrieving collection: " + response.message,
            });
          }
      );
    }

    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
      ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    }

    $scope.edit = function(resourceType, resource){
      ActionsService.edit(resourceType, resource);
    };

    $scope.editPermissions = function(resource) {
        PermissionsService.editPermissions(resource);
    }

    $scope.getSystemName = function(id) {
        if (id) {
            for(var i=0; i<$scope.systems.length; i++) {
                if ($scope.systems[i].id === id) {
                    return $scope.systems[i].name;
                }
            }
        }
        return id;
    };

});
