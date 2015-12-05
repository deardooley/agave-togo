angular.module('AgaveAuth').controller('LoginController', function ($injector, $timeout, $rootScope, $scope, $state, $stateParams, TenantsController, Commons, Alerts) {

    $scope.tenants = [];

    TenantsController.listTenants().then(
        function(response) {
            $scope.tenants = response;
        },
        function(message) {
            Alerts.success({message: "Failed to retrieve tenant list."});
        }
    );
});