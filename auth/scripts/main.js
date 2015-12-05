/**
 * Definition of the main app module and its dependencies
 */
var AgaveAuth = angular
    .module('AgaveAuth', [
        "ui.router",
        'oauth',
        'ngMd5',
        'AgavePlatformScienceAPILib',
        'ui.select',
        'AlertService',
        'CommonsService',
    ]);

AgaveAuth.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
    });
});

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
AgaveAuth.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login");

    $stateProvider

        // Login
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: {pageTitle: 'Login'},
            controller: "LoginController"
        })

        // Logout
        .state('logout', {
            url: "/logout",
            templateUrl: "views/logout.html",
            data: {pageTitle: 'Logout'},
            controller: "LogoutController"
        })

        // Logout
        .state('signup', {
            url: "/signup",
            templateUrl: "views/signup.html",
            data: {pageTitle: 'SignUp'},
            controller: "SignupController"
        });
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


/**
 * Run block
 */
AgaveAuth.run(["$rootScope", "$location", "$state", function($rootScope, $location, $state) {

    $rootScope.$state = $state;

    $rootScope.$on('oauth:login', function(event, token) {
        console.log('Authorized third party app with token', token.access_token);
        ProfilesController.getProfile('me').then(
            function(profile) {
                $localStorage.currentUser = profile;
                $location.href("../app");
            },
            function(message) {
                $localStorage.currentUser = null;
            }
        )
    });

    $rootScope.$on('oauth:logout', function(event) {
        console.log('The user has signed out');
    });

    $rootScope.$on('oauth:loggedOut', function(event) {
        console.log('The user is not signed in');
    });

    $rootScope.$on('oauth:denied', function(event) {
        console.log('The user did not authorize the third party app');
        $location.href("/login");
    });

    $rootScope.$on('oauth:expired', function(event) {
        console.log('The access token is expired. Please refresh.');
        $location.href("/login");
    });

    $rootScope.$on('oauth:profile', function(profile) {
        console.log('User profile data retrieved: ', profile);
    });

}]);
