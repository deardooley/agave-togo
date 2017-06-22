'use strict';
angular.module('togo.preferences', [])
    .constant('togoPreferencesConfig', {
      'alerts.dashboard.welcome': false
    })
    .service('Preferences', function ($rootScope, $localStorage, $q, Commons, togoPreferencesConfig) {

      if (Commons.isEmpty($localStorage.preferences)) {
        $localStorage.preferences = togoPreferencesConfig;
      }

      this.list = function () {
        return $q(function (resolve, reject) {
          return $localStorage.preferences;
         
        });
      };

      this.search = function (exp) {
        return $q(function (resolve, reject) {
          var filteredProperties = {};
          angular.forEach($localStorage, function (val, key) {
            if (key.matches(exp)) {
              filteredProperties[key] = val;
            }
          });
          return filteredProperties;
        });
      };

      this.update = function (path, val) {
        return $q(function (resolve, reject) {
          $localStorage.preferences[path] = val;
        });
      };

      this.add = function (path, val) {
        return $q(function (resolve, reject) {
          $localStorage.preferences[path] = val;
        });
      };

      this.get = function (path, defaultValue) {
        return $q(function (resolve, reject) {
          return $localStorage.preferences[path] || defaultValue;
        });
      };

      this.delete = function (path) {
        return $q(function (resolve, reject) {
          return Commons.getPath(path);
        });
      };

    });