angular.module('AgaveToGo').controller('FileExplorerController', function($rootScope, $scope, $http, $timeout, SystemsController) {

    var self = this;
    var deferredHandler = function(data, deferred, defaultMsg) {
        if (!data || typeof data !== 'object') {
            this.error = 'Bad response from the server, please check the docs';
        }
        if (data.result && data.result.error) {
            this.error = data.result.error;
        }
        if (!this.error && data.error) {
            this.error = data.error.message;
        }
        if (!this.error && defaultMsg) {
            this.error = defaultMsg;
        }
        if (this.error) {
            return deferred.reject(data);
        }

        return deferred.resolve(data);
    };

    $scope.resource = undefined;

    $scope.getResourceId = $scope.getResourceId || function () {
        return $stateParams[$scope.resource.id];
    };


    $scope.$on('$viewContentLoaded', function() {

        SystemsController.getSystemDetails($scope.getResourceId())
            .success(function(data) {
                $scope.resource = data;
            }).error(function(data) {
                $scope.resource = undefined;
                self.deferredHandler(data, deferred, $translate.instant('error_fetching_system'));
            })['finally'](function() {

            });
    });


});