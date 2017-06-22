'use strict';
/**
 * ToGo custom config
 */
angular.module('AgaveToGo')
    .config()
    .service('ModuleManager', ['$rootScope', '$localStorage', '$http', 'Commons',
      function ($rootScope, $localStorage, $http, Commons) {

        var modules = $localStorage.modules;
        var defaultModules = [];
        $http.get('config.modules.json').then(function(data) {
          defaultModules = data;
          $localStorage.modules = Commons.unique(modules, data);
        })

        return {
          all: function() {
            return $localStorage.modules;
          },
          get: function(_name) {
            return $localStorage.modules[_name];
          },
          set: function(_value) {
            $localStorage.modules[_name] = value;
            $rootScope.$broadcast('togo.module.change', $localStorage.modules);
          },
          reset: function() {
            $localStorage.modules = defaultModules;
            $rootScope.$broadcast('togo.module.change', $localStorage.modules);
          }
        }
      }]);

