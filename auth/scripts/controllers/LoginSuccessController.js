angular.module('AgaveAuth').controller('LoginSuccessController', function ($injector, $timeout, $rootScope, $scope, $state, moment, settings, $localStorage, AccessToken, $location, Alerts, ProfilesController) {

    settings.layout.tenantPage = true;
    settings.layout.loginPage = false;

    $timeout(function () {

        $scope.authToken = $localStorage.token;//AccessToken.get();
        console.log($scope.authToken);
        $scope.loggedIn = (!!$scope.authToken) && (moment($scope.authToken.expires_at).diff(moment()) > 0);

        if ($scope.loggedIn) {

            $scope.profile = $localStorage.activeProfile;
            if (!$scope.profile) {
                ProfilesController.getProfile('me').then(
                    function(profile) {
                        $rootScope.$broadcast('oauth:profile', profile);
                    },
                    function(message) {
                        Alerts.danger({message:"Failed to fetch user profile."});
                    }
                );
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

    $rootScope.$on('oauth:profile', function(event, profile) {
        $localStorage.activeProfile = profile;
        $timeout(function () {
            $scope.profile = profile;
        },0);
    });

});