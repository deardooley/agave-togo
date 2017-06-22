/**
 * Definition of the main app module and its dependencies
 */
var AgaveAuth = angular
    .module('AgaveAuth', [
      'ui.bootstrap',
      'ui.router',
      'angular-cache',
      'oc.lazyLoad',
      'angularMoment',
      'ngStorage',
      'ngSanitize',
      'oauth',
      'ngMd5',
      'ui.select',
      'AlertService',
      'agave.sdk',
      'CommonsService',
      'ngFileUpload'
    ]);

AgaveAuth.config(function ($locationProvider) {
  $locationProvider.html5Mode({
    enabled: false,
    //hashPrefix: '!',
    required: false
  });
})
//.config(function ($routeProvider) {
//    $routeProvider
//        .when('/access_token=:accessToken', {
//            template: '',
//            controller: function ($location, AccessToken) {
//                var hash = $location.path().substr(1);
//                AccessToken.setTokenFromString(hash);
//                $location.path('/success');
//                $location.replace();
//            }
//        });
//});


AgaveAuth.factory('settings', ['$rootScope', function ($rootScope) {
  // supported languages
  var settings = {
    oauth: {
      clients: OAuthClients,
      scope: 'PRODUCTION'
    },
    layout: {
      loginPage: false,
      tenantPage: true
    },
    tenants: [],
    assetsPath: '/assets',
    globalPath: '/assets/global',
    layoutPath: '/assets/layouts/layout',
  };

  $rootScope.settings = settings;

  return settings;
}]);

//AgaveAuth.config(function(OAuthProvider) {
//    OAuthProvider.configure({
//        baseUrl: "https://agave.iplantc.org",
//        clientId: "3ekNmfvne9yN_wnfedCRMeA8XSUa",
//        clientSecret: null,
//        grantPath: '/token',
//        revokePath: '/revoke'
//    });
//});

AgaveAuth.constant('angularMomentConfig', {
  timezone: 'America/Chicago' // optional
});

// safe dependency injection
// this prevents minification issues
//config.$inject = ['$routeProvider', '$locationProvider', '$httpProvider', '$compileProvider'];

/**
 * App routing
 *
 * You can leave it here in the config section or take it out
 * into separate file
 *
 */
AgaveAuth.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  // Redirect any unmatched url
  $urlRouterProvider.otherwise("/signin");

  $stateProvider

  // Auth redirect
      .state('access_token', {
        url: "/access_token=:accessToken",
        templateUrl: "",
        data: {pageTitle: 'OAuth Redirect'},
        controller: function ($location, $window, AccessToken, ProfilesController, $localStorage) {
          var hash = $location.path().substr(1);
          AccessToken.setTokenFromString(hash);

          $window.location.href = $localStorage.redirectUrl || "../app/";
        }
      })

      // login success
      .state('success', {
        url: "/success",
        templateUrl: "views/success.html",
        data: {pageTitle: 'Login Success'},
        controller: "LoginSuccessController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                //'../auth/css/tenants.css',
                '../assets/global/plugins/countdown/jquery.countdown.min.js',
                '../auth/scripts/controllers/LoginSuccessController.js',
              ]
            });
          }],
          resolvedProfile: function(ProfilesController) {
            ProfilesController.getProfile('me').then(
                function(response) {

                  // store profile
                  $localStorage.profile = response;
                  return response;
                },
                function(err) {
                  delete $localStorage.profile;
                  return null;
                });
          }
        }
      })

      // Login
      .state('login-form-default', {
        url: "/signin",
        templateUrl: "views/templates/login-form.html",
        data: {
          pageTitle: 'Sign In',
          tenantId: 'agave.prod'
        },
        controller: "LoginFormController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                //'../auth/css/tenants.css',
                '../auth/scripts/controllers/LoginFormController.js'
              ]
            });
          }]
        }
      })

      // Login
      .state('login-form', {
        url: "/signin/{tenantId}",
        templateUrl: "views/templates/login-form.html",
        data: {
          pageTitle: 'Sign In',
          tenantId: 'agave.prod'
        },
        controller: "LoginFormController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                //'../auth/css/tenants.css',
                '../auth/scripts/controllers/LoginFormController.js'
              ]
            });
          }]
        }
      })

      // Password Reset
      .state('default-forgot-password', {
        url: "/reset",
        templateUrl: "views/templates/password-reset-form.html",
        data: {
          pageTitle: 'Password Reset',
          tenantId: 'agave.prod'
        },
        controller: "PasswordResetController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before',
              files: [
                '../auth/scripts/controllers/PasswordResetController.js',
              ]
            });
          }]
        }
      })

      // Password Reset
      .state('forgot-password', {
        url: "/reset/:tenantId",
        templateUrl: "views/templates/password-reset-form.html",
        data: {pageTitle: 'Password Reset'},
        controller: "PasswordResetController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before',
              files: [
                '../auth/scripts/controllers/PasswordResetController.js',
              ]
            });
          }]
        }
      })



      // Logout
      .state('logout', {
        url: "/logout",
        templateUrl: "views/logout.html",
        data: {pageTitle: 'Sign Out'},
        controller: "LogoutController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before',
              files: [
                //'../auth/css/tenants.css',
                '../assets/global/plugins/countdown/jquery.countdown.min.js',
                '../auth/scripts/controllers/LogoutController.js',
              ]
            });
          }]
        }
      })

      // // Signup
      // .state('signup-form', {
      //     url: "/signup",
      //     templateUrl: "views/templates/signup-form.html",
      //     data: {
      //         pageTitle: 'Sign Up',
      //         tenantId: 'agave.prod'
      //     },
      //     controller: "SignupFormController",
      //     resolve: {
      //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //             return $ocLazyLoad.load({
      //                 name: 'AgaveAuth',
      //                 insertBefore: '#ng_load_plugins_before',
      //                 files: [
      //                     //'../auth/css/login.css',
      //                     'scripts/controllers/SignupFormController.js',
      //                 ]
      //             });
      //         }]
      //     }
      // })

      // Signup
      .state('signup-form', {
        url: "/signup/{tenantId}",
        templateUrl: "views/templates/signup-form.html",
        data: {pageTitle: 'Sign Up'},
        controller: "SignupFormController",
        resolve: {
          deps: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'AgaveAuth',
              insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
              files: [
                //'../auth/css/login.css',
                'scripts/controllers/SignupFormController.js',
              ]
            });
          }]
        }
      })

      // Login
      .state('tenants', {
          url: "/login",
          templateUrl: "views/templates/oauth-form.html",
          data: {pageTitle: 'Select Tenant'},
          controller: "LoginFormController",
          resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'AgaveAuth',
                      // insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                      files: [
                          '../auth/css/tenants.css',
                          '../auth/scripts/controllers/LoginFormController.js',
                      ]
                  });
              }]
          }
      });
  //
  // // Login
  // .state('login', {
  //     url: "/login/:tenantId",
  //     templateUrl: "views/login-password.html",
  //     data: {pageTitle: 'Login'},
  //     controller: "LoginController",
  //     resolve: {
  //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
  //             return $ocLazyLoad.load({
  //                 name: 'AgaveAuth',
  //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  //                 files: [
  //                     //'../auth/css/tenants.css',
  //                     '../auth/scripts/controllers/LoginController.js',
  //                 ]
  //             });
  //         }]
  //     }
  // })
  //
  // // Logout
  // .state('logout', {
  //     url: "/logout",
  //     templateUrl: "views/logout.html",
  //     data: {pageTitle: 'Logout'},
  //     controller: "LogoutController",
  //     resolve: {
  //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
  //             return $ocLazyLoad.load({
  //                 name: 'AgaveAuth',
  //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  //                 files: [
  //                     //'../auth/css/tenants.css',
  //                     '../assets/global/plugins/countdown/jquery.countdown.min.js',
  //                     '../auth/scripts/controllers/LogoutController.js',
  //                 ]
  //             });
  //         }]
  //     }
  // })
  //
  // // Logout
  // .state('signup', {
  //     url: "/signup",
  //     templateUrl: "views/signup.html",
  //     data: {pageTitle: 'SignUp'},
  //     controller: "SignupController",
  //     resolve: {
  //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
  //             return $ocLazyLoad.load({
  //                 name: 'AgaveAuth',
  //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
  //                 files: [
  //                     //'../auth/css/login.css',
  //                     'scripts/controllers/SignupController.js',
  //                 ]
  //             });
  //         }]
  //     }
  // });
  //$httpProvider.interceptors.push('authInterceptor');

}]);


/**
 * You can intercept any request or response inside authInterceptor
 * or handle what should happend on 40x, 50x errors
 *
 */
//angular
//    .module('AgaveAuth')
//    .factory('authInterceptor', authInterceptor);
//
//authInterceptor.$inject = ['$rootScope', '$q', 'LocalStorage', '$location'];
//
//function authInterceptor($rootScope, $q, LocalStorage, $location) {
//
//    return {
//
//        // intercept every request
//        request: function(config) {
//            config.headers = config.headers || {};
//            return config;
//        },
//
//        // Catch 404 errors
//        responseError: function(response) {
//            if (response.status === 401) {
//                $location.path('/auth/login');
//                return $q.reject(response);
//            } else if (response.status === 404) {
//                $location.path('/404.html');
//                return $q.reject(response);
//            } else {
//                $location.path('/500.html');
//                return $q.reject(response);
//            }
//        }
//    };
//}

// AgaveAuth.config(function (CacheFactoryProvider) {
//     angular.extend(CacheFactoryProvider.defaults, {
//         maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 day
//         cacheFlushInterval: 30 * 24 * 60 * 60 * 1000, // This cache will clear itself every 30 days
//         deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
//         storageMode: 'localStorage',
//         storagePrefix: 'agavetogo.'
//     });
//
//
// });

/**
 * Run block
 */
AgaveAuth.run(["$rootScope", "$location", "$state", "$timeout", "$localStorage", "$filter", "$http", "CacheFactory", "Alerts", "TenantsController", "ProfilesController", "settings", "Commons", function ($rootScope, $location, $state, $timeout, $localStorage, $filter, $http, CacheFactory, Alerts, TenantsController, ProfilesController, settings, Commons) {

  $rootScope.$state = $state;

  // set the default cache for http requests
  $http.defaults.cache = CacheFactory('agave-sdk', {
    maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 day
    // cacheFlushInterval: 30 * 24 * 60 * 60 * 1000, // This cache will clear itself every 30 days
    deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
    storageMode: 'localStorage',
    storagePrefix: 'agavetogo.'
  });

  $rootScope.requesting = true;

  TenantsController.listTenants().then(
      function (response) {
        settings.tenants = $filter('filter')(response, function (tenant, key) {
          if (settings.oauth.clients[tenant.code] &&
              settings.oauth.clients[tenant.code].clientKey) {
            // hack until we push this info into the tenants api
            if (settings.oauth.clients[tenant.code]) {
              tenant.signupUrl = settings.oauth.clients[tenant.code].signupUrl;
              tenant.projectUrl = settings.oauth.clients[tenant.code].projectUrl;
              tenant.supportUrl = settings.oauth.clients[tenant.code].supportUrl;
              tenant.allowsSignup = settings.oauth.clients[tenant.code].allowsSignup;
            }
            else {
              tenant.signupUrl = '';
              tenant.projectUrl = '';
              tenant.supportUrl = '';
              tenant.allowsSignup = true;
            }

            return tenant;
          }
        });

      },
      function (message) {
        Alerts.danger({message: "Failed to retrieve tenant information."});
      }
  );

  $rootScope.$on('oauth:login', function (event, token) {
    $localStorage.token = token;

    $location.path($localStorage.redirectUrl || "../app/");
    $location.replace();
  });

  $rootScope.$on('oauth:profile', function (event, profile) {
    $timeout(function () {
      $localStorage.activeProfile = profile;
    }, 0);
  });

}]);
