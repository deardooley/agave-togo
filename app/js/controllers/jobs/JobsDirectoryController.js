angular.module('AgaveToGo').controller('JobDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, $uibModal, Commons, AppsController, SystemsController, JobsController) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 10;
    $scope.systems = [];

    // Name of collection, used in route name generation
    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'jobs';

    // Name of resource, used in table name generation and variable reference
    // within the view template
    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'job';

    $scope.refresh = $scope.refresh || function() {

        App.blockUI({
            target: '.portlet-datatable .portlet-body',
            overlayColor: '#FFF',
            animate: true
        });

        SystemsController.listSystems(99999).then(
            function (data) {
                $scope.systems = data;

                JobsController.listJobs()
                    .then($scope.handleRefreshSuccess, $scope.handleFailure);
            },
            function (data) {
                App.alert({
                    type: 'danger',
                    message: "Error retrieving system list.<br>" + data.message,
                });
            });
    };

    $scope.confirmAction = function(selectedJobs, selectedAction)
    {
        var modalInstance = $uibModal.open(
            {
                templateUrl: 'tpl/modals/ModalConfirmResourceAction.html',
                controller: 'ModalConfirmResourceActionController',
                //size: 'sm',
                resolve:
                {
                    resourceNames: function() {
                        var resourceNames = [];
                        angular.forEach(selectedJobs, function (job, key) {
                            resourceNames.push(job.name + "(" + job.id + ')');
                        });
                        return resourceNames;
                    },
                    resourceAction: function() {
                        return selectedAction;
                    }
                }
            });

        modalInstance.result.then(function(response)
            {
                $log.info('Modal closed at: ' + new Date());
            },
            function()
            {
                $log.info('Modal dismissed at: ' + new Date());
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

        modalInstance.result.then(function(response)
            {
                console.log('Modal dismissed at: ' + new Date());
            },
            function()
            {
                console.log('Modal dismissed at: ' + new Date());
            });
    }

    $scope.doInvokeAction = function (selectedJobs, selectedAction) {
        var isSuccess = true;
        var that = this;

        var promises = [];
        var totalDeleted = 0;
        //angular.forEach(selectedJobs, function (app, key) {
        //
        //    promises.push(JobsController.updateInvokeAppAction(app.id, selectedAction).then(
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