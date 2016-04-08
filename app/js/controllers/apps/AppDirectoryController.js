angular.module('AgaveToGo').controller('AppDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $uibModal, $http, Commons, AppsController, SystemsController) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 25;
    $scope.systems = [];

    // Name of collection, used in route name generation
    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'apps';

    // Name of resource, used in table name generation and variable reference
    // within the view template
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

        App.blockUI({
            target: '.portlet-datatable .portlet-body',
            overlayColor: '#FFF',
            animate: true
        });

        SystemsController.listSystems(99999).then(
            function (response) {
              $scope.systems = response;

              AppsController.listApps($scope.limit, $scope.offset, { 'privateonly': 'true' })
                .then(
                  function(response){
                    $scope.appsList = response;
                    $scope.getAppsDetails(function () {
                      $scope.handleRefreshSuccess($scope.appsDetailsList);
                    });
                  }, function(response){
                    $scope.handleFailure(response);
                  }
                );
            },
            function(response){
              App.alert({
                 type: 'danger',
                 message: "Error retrieving system list.<br>" + response.message,
              });
            }
        );
    };

    $scope.confirmAction = function(selectedApp, selectedAction, index){
        var modalInstance = $uibModal.open({
          templateUrl: 'tpl/modals/ModalConfirmResourceAction.html',
          controller: 'ModalConfirmResourceActionController',
          //size: 'sm',
          scope: $scope,
          resolve:
          {
              resource: function() {
                  return selectedApp;
              },
              resourceAction: function() {
                  return selectedAction;
              },
              resourceIndex: function(){
                return index;
              }
          }
        });
    };

    $scope.openPermissionEditor = function(resource) {
        var modalInstance = $uibModal.open(
            {
                templateUrl: 'tpl/modals/ModalPermissionManager.html',
                controller: 'ModalPermissionEditorController',
                //size: 'sm',
                resolve:
                {
                    ApiPermissionListFunction: function() {
                        return AppsController.listAppPermissions;
                    },
                    ApiPermissionUpdateFunction: function() {
                        return AppsController.updateAppPermission;
                    },
                    resource: function() {
                        return resource;
                    }
                }
            });

        // modalInstance.result.then(function(response)
        //     {
        //         console.log('Modal dismissed at: ' + new Date());
        //     },
        //     function()
        //     {
        //         console.log('Modal dismissed at: ' + new Date());
        //     });
    }

    $scope.doInvokeAction = function (selectedApps, selectedAction) {
        var isSuccess = true;
        var that = this;

        var promises = [];
        var totalDeleted = 0;
        //angular.forEach(selectedApps, function (app, key) {
        //
        //    promises.push(AppsController.updateInvokeAppAction(app.id, selectedAction).then(
        //        function(response) {
        //            totalDeleted++;
        //            $(that).parent().parent().parent().remove();
        //            App.alert({message: "Successfully performed " + selectedAction + " action on " +  app.label + "."});
        //        },
        //        function(message, response) {
        //            isSuccess = false;
        //            App.alert({
        //                type: 'danger',
        //                message: "Error performing " + selectedAction + " action on " + app.label + "<br>" + message,
        //            });
        //        }));
        //});

        var deferred = $q.all(promises).then(
            function(result) {
                App.alert({message: "Successfully completed " + selectedAction + " action."});
                $scope.refresh();
            },
            function(message, result) {
                App.alert({
                    type: 'danger',
                    message: 'Failed to perform ' + selectedAction + ' on one or more ' + $scope._COLLECTION_NAME + '.'
                });
                $scope.refresh();
            });

        return deferred.promise;
    };

    /**
     * Resolves a system name from its id.
     * @param string id of the system whose name we want to resolve
     */
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

    /**
     * Forces this controller to inherit from the parent. Remember that order is
     * imporant. If you override this controller, any scope variables you override
     * there will be applied first, so make sure you check yoru variables here
     * before initializing them.
     */
    $injector.invoke(BaseCollectionCtrl, this, {
        $timeout: $timeout,
        $rootScope: $rootScope,
        $scope: $scope,
        $state: $state,
        $stateParams: $stateParams,
        $q: $q,
        Commons: Commons,
        ApiStub: AppsController
    });
});
