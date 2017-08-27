'use strict';
/**
 * ToGo custom config
 */
AgaveToGo
    /**
     * @ngdoc object
     * @name AgaveToGo.config:agaveToGoEnvironmentConfig
     *
     * @description
     * Common configuration settings for the default application 
     * runtime behavior.
     */
    .factory('userProperties', ['$localStorage', function($localStorage) {

      return $localStorage.userProperties || {
            /**
             * @ngdoc property
             * @name AgaveToGo.config.agaveToGoEnvironmentConfig#preprocess
             * @propertyOf angularMoment.config:angularMomentConfig
             * @returns {function} A preprocessor function that will be applied on all incoming dates
             *
             * @description
             * Defines a preprocessor function to apply on all input dates (e.g. the input of `am-time-ago`,
             * `amCalendar`, etc.). The function must return a `moment` object.
             *
             * @example
             *   // Causes angular-moment to always treat the input values as unix timestamps
             *   angularMomentConfig.preprocess = function(value) {
           * 	   return moment.unix(value);
           *   }
             */
            baseUrl: null,

            tenant: null,

            server: {
              enable: false,
              url: null,
              passthrough: true,
              login: {
                enabled: false,
                type: 'token',
                refresh: false
              },
              signup: {
                enabled: false,
                url: null
              }
            },

            login: {
              source: 'tenant', // 'tenant', 'server', 'custom'
              flows: ['implicit'], // 'implicit','password','client_credentials','jwt'
              configFile: "../auth/scripts/implicit.js"
            },

            profile: {
              enable: true,
              edit: false,
              search: true,
              delete: false,
              create: false
            },

            usage: {
              tracking: false,
              analytics: false,
              gaCode: null
            },

            logging: {
              level: 'debug'
            },

            storage: {
              source: 'local', // 'server', 'local', 'session', 'memory', 'none' || null
              prefix: 'AgaveToGo'
            },

            cache: {
              source: 'memory', // 'memory', 'local', 'none' || null
              lifetime: 30, // ttl in seconds
            },

            notifications: {
              target: 'poll',
              url: 'https://httpbin.agaveapi.co/status/404',
              onCreate: false,
              onUpdate: false,
              onDelete: false,
              onComplete: true,
              onFail: true,
              onChange: true,
              persistent: false,
              policy: {
                retryStrategy: "NONE",
                retryLimit: 0,
                retryRate: 0,
                retryDelay: 0,
                saveOnFailure: false
              }
            },

            offline: false,

            environment: 'development'
          };

    }])
    // .factory('settings', ['$rootScope', function($rootScope) {
    //   var settings = {
    //     layout: {
    //       pageSidebarClosed: false, // sidebar menu state
    //       pageContentWhite: true, // set page content layout
    //       pageBodySolid: false, // solid body color state
    //       pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
    //     },
    //
    //     webpack: false,
    //     assetsPath: '../assets',
    //     globalPath: '../assets/global',
    //     layoutPath: '../assets/layouts/layout',
    //   };
    //
    //   $rootScope.settings = settings;
    //
    //   return settings;
    // }]);
