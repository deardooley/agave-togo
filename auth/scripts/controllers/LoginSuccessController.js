angular.module('AgaveAuth').controller('LoginSuccessController', function ($injector, $timeout, $rootScope, $scope, $state, moment, settings, $localStorage, AccessToken, $location, Alerts) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    $timeout(function () {

        $scope.authToken = $localStorage.token;//AccessToken.get();
        console.log($scope.authToken);
        $scope.loggedIn = (!!$scope.authToken) && (moment($scope.authToken.expires_at).diff(moment()) > 0);

        if ($scope.loggedIn) {

            $scope.profile = $localStorage.activeProfile;
            if (!$scope.profile) {
                $rootScope.$broadcast('oauth:login', $localStorage.token);
            }
            console.log($scope.profile);

            $scope.tenant = $localStorage.tenant;
            console.log($scope.tenant);

            var tokenEndsAt = moment($scope.authToken.expires_at).toDate();
            $('#tokenCountdown').countdown({
                until: tokenEndsAt
            });
        } else {
            $location.path("/logout");
            $location.replace();
        }
    }, 50);

    $rootScope.$on('oauth:profile', function(profile) {
        $scope.profile = $localStorage.activeProfile;
    });

});