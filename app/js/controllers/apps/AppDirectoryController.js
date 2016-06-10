angular.module('AgaveToGo').controller('AppDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $uibModal, $http, Commons, AppsController, SystemsController, ActionsService, PermissionsService) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 25;
    $scope.systems = [];

    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'apps';

    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'app';

    $scope.appsList = [];
    $scope.appsDetailsList = [];

    $scope.getAppDetails = function(id, callback) {
        return AppsController.getAppDetails(id).then(
          function(response){
            return callback(response);
          }
        );
    };

    $scope.getAppsDetails = function (callback) {
        var prom = [];
        $scope.appsList.forEach(function (app, i) {
            prom.push($scope.getAppDetails(app.id, function(value){
                $scope.appsDetailsList.push(value);
            }));
        });
        $q.all(prom).then(function () {
            callback();
        });
    };

    $scope.refresh = $scope.refresh || function() {
        $scope.appsList = [];
        $scope.appsDetailsList = [];

        // App.blockUI({
        //     target: '.portlet-datatable .portlet-body',
        //     overlayColor: '#FFF',
        //     animate: true
        // });

        SystemsController.listSystems(99999).then(
            function (response) {
              $scope.systems = response;

              AppsController.listApps($scope.limit, $scope.offset, { 'privateonly': 'true' })
                .then(
                  function(response){
                    console.log('listing private apps');
                    $scope.appsList = response;
                    $scope.getAppsDetails(function () {
                      $scope[$scope._COLLECTION_NAME] = $scope.appsDetailsList;
                    });
                  }, function(response){
                    $scope.handleFailure(response);
                  }
                );
            },
            function(response){
              $scope.handleFailure(response);
              App.alert({
                 type: 'danger',
                 message: "Error retrieving system list.<br>" + response.message,
              });
            }
        );
    };

    $scope.refresh();

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
