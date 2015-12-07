angular.module('AgaveAuth').controller('LoginSuccessController', function ($injector, $timeout, $rootScope, $scope, $state, moment, settings, $localStorage, AccessToken, $location, Alerts) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    $timeout(function () {

        $scope.authToken = $localStorage.token;//AccessToken.get();
        console.log($scope.authToken);
        $scope.loggedIn = (!!$scope.authToken) && (moment($scope.authToken.expires_at).diff(moment()) > 0);
        console.log("Logged in: " +  $scope.loggedIn);
        console.log("now: " + moment());
        console.log("expires at: " + moment($scope.authToken.expires_at));
        console.log("Time Left: " +  moment().diff(moment($scope.authToken.expires_at)));

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