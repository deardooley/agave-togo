angular.module('AgaveAuth').controller('LoginSuccessController', function ($injector, $timeout, $rootScope, $scope, $state, moment, settings, $localStorage, AccessToken, $location, Alerts) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    $timeout(function () {

        $scope.authToken = $localStorage.token;//AccessToken.get();

        $scope.loggedIn = !!$scope.authToken;// && (moment().diff(moment($scope.authToken.expires_at)) > 0);

        if ($scope.loggedIn) {

            $scope.profile = $localStorage.activeProfile;
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

});