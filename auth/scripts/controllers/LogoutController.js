angular.module('AgaveAuth').controller('LogoutController', function ($injector, $timeout, $rootScope, $scope, $state, moment, $location, settings, $localStorage, AccessToken, TenantsController, Commons, Alerts) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    //$scope.loggedIn = !!AccessToken.get();

    $timeout(function() {

        $scope.profile = $localStorage.activeProfile;
        console.log($scope.profile);

        $scope.tenant = $localStorage.tenant;
        console.log($scope.tenant);

        if ($scope.profile) {
            if ($scope.tenant) {

                $rootScope.$broadcast('oauth:template:update', '/auth/views/templates/oauth-ng-button.html');
            } else {
                $localStorage.profile = null;
                $location.path("/tenants");
                $location.replace();
            }
        } else if ($scope.tenant) {
            $location.path("/login/" + $scope.tenant.code);
            $location.replace();
        } else {
            $location.path("/tenants");
            $location.replace();
        }
    }, 50);

    $scope.$watch('$localStorage.profile', function(value){
        $timeout(function () {
            $scope.profile = $localStorage.activeProfile;
        }, 0);
    }, true);

    $scope.$watch('settings.tenants', function(value){
        $timeout(function () {
            $rootScope.$broadcast('oauth:template:update', '/auth/views/templates/oauth-ng-button.html');
        }, 0);
    }, true);
});