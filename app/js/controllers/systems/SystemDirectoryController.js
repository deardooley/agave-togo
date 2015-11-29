angular.module('AgaveToGo').controller('SystemsDirectoryController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, SystemsController, SystemActionTypeEnum) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 50;
    $scope.systems = [];
    $scope.modalResource = '';

    $scope.systemActions = SystemActionTypeEnum;

    // Name of collection, used in route name generation
    $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || 'systems';

    // Name of resource, used in table name generation and variable reference
    // within the view template
    $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || 'system';

    $scope.editTags = $scope.editTags || function(system) {
        $scope.modalResource = system;
        $('#tagging-modal').modal('show');
        return false;
    };

    $scope.editRoles = $scope.editRoles || function(system) {
        $scope.modalResource = system;
        $('#quickshare-role-modal').modal('show');
        return false;
    };

    $scope.confirmAction = $scope.confirmAction || function(system, action) {

        var tmpl = [
            // tabindex is required for focus
            '<div class="modal fade" tabindex="-1">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
            '<h4 class="modal-title">Confirmation</h4>',
            '</div>',
            '<div class="modal-body">',
            '<p>Are you sure you want to ' + action.toLowerCase() + ' the ' + system.name + ' system?</p>',
            '</div>',
            '<div class="modal-footer">',
            '<a href="#" id="system-confirmation-action-cancel" data-dismiss="modal" class="cancel btn btn-default">Cancel</a>',
            '<a href="#" id="system-confirmation-action-confirm" class="confirm btn btn-primary">Confirm</a>',
            '</div>',
            '</div>'
        ].join('');

        $(tmpl).modal();

        $('#system-confirmation-action-confirm').on('click', function () {
            $scope.invokeSystemAction(system.id, system.name, action);
        });

        $('#system-confirmation-action-cancel').on('click', function () {
            console.log('Cancelled system ' + action + ' action on ' + system.id);
        });
    };

    $scope.confirmDelete = $scope.confirmDelete || function(system) {

        var tmpl = [
            // tabindex is required for focus
            '<div class="modal fade" tabindex="-1">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>',
            '<h4 class="modal-title">Confirmation</h4>',
            '</div>',
            '<div class="modal-body">',
            '<p>Are you sure you want to delete the ' + system.name + ' system?</p>',
            '</div>',
            '<div class="modal-footer">',
            '<a href="#" id="system-confirmation-action-cancel" data-dismiss="modal" class="cancel btn btn-default">Cancel</a>',
            '<a href="#" id="system-confirmation-action-confirm" class="confirm btn btn-primary">Confirm</a>',
            '</div>',
            '</div>'
        ].join('');

        $(tmpl).modal();

        $('#system-confirmation-action-confirm').on('click', function () {
            SystemsController.deleteSystem(systemId).then(
                function(response) {
                    App.alert({message: "Successfully deleted system " + system.id});
                    $scope.refresh();
                },
                function(response) {
                    console.log(data);
                    App.alert({
                        type: 'danger',
                        message: "Error deleting system " + system.name
                    });
                }
            )
        });

        $('#system-confirmation-action-cancel').on('click', function () {
            console.log('Cancelled delete action on ' + system.id);
        });
    };

    $scope.initModelListeners = $scope.initModelListeners || function() {

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