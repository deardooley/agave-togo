angular.module('AgaveAuth').controller('TenantSelectionController', function ($injector, $timeout, $rootScope, $scope, $state, $location, settings, $localStorage, $window, TenantsController, Commons, Alerts) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    $scope.tenant = {selected: "agave.prod", code: "agave.prod", name: "Agave Science-as-a-Service Platform"};
    $scope.tenants = [];
    $scope.displayTenant = undefined;

    $scope.getTenantByCode = function (tenantId) {
        var namedTenant = false;
        angular.forEach(settings.tenants, function (tenant, key) {
            if (tenant.code === tenantId) {
                namedTenant = tenant;
                return false;
            }
        });

        if (namedTenant) {
            return namedTenant;
        } else {
            Alerts.danger({message: 'No tenant found matching ' + tenantId});
        }
    };

    $scope.updateTenant = function(item, model) {
      $scope.displayTenant = item;
      $scope.tenant = $scope.getTenantByCode($scope.displayTenant.code);
      $localStorage.tenant = $scope.displayTenant;

    }

    $scope.redirectToSignup = function($event) {
        $event.stopPropagation();
        if ($scope.displayTenant && $scope.displayTenant.signupUrl) {
            alert($scope.displayTenant.signupUrl);
            $window.location.href = $scope.displayTenant.signupUrl;
            return false;
        } else {
            Alerts.danger({container: ".lock-body .message", message: "Select an organization to create an account."});
        }
    };

    $scope.loadTenant = function() {
        if ($scope.displayTenant && $scope.displayTenant.code) {
            $localStorage.tenant = $scope.displayTenant;
            $location.path('login/' + $scope.displayTenant.code);
            $location.replace();
        } else {
            Alerts.danger({container: ".lock-body .message", message: "Select an organization to login."});
        }
    };
});
