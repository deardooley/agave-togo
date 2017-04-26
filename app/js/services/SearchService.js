angular.module('GlobalSearchService', []).service('GlobalSearch', ['$rootScope', '$http', '$q',
function ($rootScope, $http, $q) {

    this.failedPromise = function (message) {
        "use strict";
        var deferred = $q.defer();
        deferred.reject({data: {message: [message], code: 400}});
        return deferred.promise;
    };

    this.searchProfiles = function(searchTerm) {

      $scope.users = [];

      var isSuccess = true;
      var that = this;
      var promises = [];
      var totalResults = 0;
      var searchResults = [];
      var users = [];

      if (isOneOrMoreUuid(searchTerm)) {
        promises.push(UUIDsController.getUUID(searchTerm.split()).then(
            function(response) {
              angular.forEach(response, function (item) {
                
                searchResults[item.id || item.uuid] = item;
              });
            },
            function (response) {
              MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));

      }
      if (searchTerm.indexOf(' ') < 0) {
        promises.push(ProfilesController.listProfiles(null, null, searchTerm, null, null).then(
            function (response) {
              angular.forEach(response, function (user) {
                users[user.username] = user;
              });
            },
            function (response) {
              MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));

        promises.push(ProfilesController.listProfiles(null, null, null, searchTerm, null).then(
            function (response) {
              angular.forEach(response, function (user) {
                users[user.username] = user;
              });
            },
            function (response) {
              MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));
      }
      else {
        promises.push(ProfilesController.listProfiles(null, searchTerm, null, null, null).then(
            function (response) {
              angular.forEach(response, function (user) {
                users[user.username] = user;
              });
            },
            function (response) {
              MessageService.handle(response, $translate.instant('error_profiles_search'));
            }));
      }

      promises.push(NotificationsController.listProfiles(searchTerm, null, null, null, null).then(
          function (response) {
            angular.forEach(response, function (item) {
              searchResults[item.uuid] = item;
            });
          },
          function (response) {
            MessageService.handle(response, $translate.instant('error_notifications_search'));
          }));

      promises.push(ProfilesController.listProfiles(null, null, null, null, searchTerm).then(
          function (response) {
            angular.forEach(response, function (user) {
              users[user.username] = user;
            });
          },
          function (response) {
            MessageService.handle(response, $translate.instant('error_profiles_search'));
          }));

      var deferred = $q.all(promises).then(
          function(result) {
            $timeout(function() {
              searchResults
            }, 10);
          },
          function(message, result) {
            MessageService.handle(response, $translate.instant('error_profiles_search'));
          });
    };

    this.latest = function() {
      var options = {
          url: this.baseUrl + '?force=true&latest=true&source=https://bitbucket.org/agaveapi/agave-flat/raw/master/CHANGELOG.md',
          method: 'GET'
      };
      var deferred = $q.defer();
      var response = $http(options);

      response.then(function(resp) {
          deferred.resolve(resp.data);

        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };
}]);
