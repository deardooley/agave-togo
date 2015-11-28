angular.module('AgaveToGo').controller('SystemsDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, SystemsController, SystemActionTypeEnum) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 50;
    $scope.systems = [];
    $scope.modalTaggedResourceUuid = '';

    $scope.systemActions = SystemActionTypeEnum;

    // Name of collection, used in route name generation
    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'systems';

    // Name of resource, used in table name generation and variable reference
    // within the view template
    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'system';

    $scope.editTags = $scope.editTags || function(systemId) {
        $scope.modalTaggedResourceUuid = systemId;
        $('#tagging-modal').modal('show');
        return false;
    };

    $scope.initModelListeners = $scope.initModelListeners || function() {
        $('.system-confirmation-action').on('confirmed.bs.confirmation', function () {
            $scope.invokeSystemAction($(this).data('systemId'), $(this).data('systemName'), $(this).data('systemAction'));
        });

        $('.system-confirmation-action').on('canceled.bs.confirmation', function () {
            console.log('Cancelled system ' + $(this).data('systemAction') + ' action on ' + $(this).data('systemId'));
        });
    };

    $scope.invokeSystemAction = $scope.enableSystem || function(systemId, systemName, systemActionEnum) {
        $('#confirm-message').html('Are you sure you want to ' + systemActionEnum.lowerCase()
                                    + " " + systemName + "(" + systemId + ")?");
        var action = new SystemAction(systemActionEnum);
        App.alert({message: "Successfully performed " + systemActionEnum + " action on system " + systemId});
        //SystemsController.updateInvokeSystemAction(action, systemId).then(
        //    function(response) {
        //        App.alert({message: "Successfully performed " + systemActionEnum + " action on system " + systemId});
        //        $scope.refresh();
        //    },
        //    function(response) {
        //        console.log(data);
        //        App.alert({
        //            type: 'danger',
        //            message: "Error performing " + systemActionEnum + " action on system "
        //                + systemIdresponse + ". " + response
        //        });
        //    }
        //);
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
        ApiStub: SystemsController
    });
});