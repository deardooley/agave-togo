angular.module('AgaveToGo').controller('AppDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, AppsController, SystemsController) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 10;
    $scope.systems = [];

    // Name of collection, used in route name generation
    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'apps';

    // Name of resource, used in table name generation and variable reference
    // within the view template
    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'app';

    $scope.refresh = $scope.refresh || function() {

        App.blockUI({
            target: '.portlet-datatable .portlet-body',
            overlayColor: '#FFF',
            animate: true
        });

        SystemsController.listSystems(99999).then(
            function (data) {
                $scope.systems = data;

                AppsController.listApps($scope.limit, $scope.offset)
                    .then($scope.handleRefreshSuccess, $scope.handleFailure);
            },
            function (data) {
                App.alert({
                    type: 'danger',
                    message: "Error retrieving system list.<br>" + data.message,
                });
            });
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