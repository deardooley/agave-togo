/***
Agave ToGo AngularJS App Main Script
***/

/* Metronic App */
var AgaveToGo = angular.module("AgaveToGo", [
    "ui.router", 
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'ngMd5',
    'angularMoment',
    'angular-cache',
    //"oauth",
    'CommonsService',
    'AgavePlatformScienceAPILib',
    'AgaveAngularJSDirectives',
    'pascalprecht.translate',
    'ngCookies'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
AgaveToGo.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true,
        modules: [{
            name: 'FileManagerApp',
            files: [
                "../bower_components/angular-filebrowser/src/js/directives/directives.js",
                "../bower_components/angular-filebrowser/src/js/filters/filters.js",
                "../bower_components/angular-filebrowser/src/js/providers/config.js",
                "../bower_components/angular-filebrowser/src/js/entities/acl.js",
                "../bower_components/angular-filebrowser/src/js/entities/chmod.js",
                "../bower_components/angular-filebrowser/src/js/entities/fileitem.js",
                "../bower_components/angular-filebrowser/src/js/entities/item.js",
                "../bower_components/angular-filebrowser/src/js/services/filenavigator.js",
                "../bower_components/angular-filebrowser/src/js/services/fileuploader.js",
                "../bower_components/angular-filebrowser/src/js/providers/translations.js",
                "../bower_components/angular-filebrowser/src/js/app.js",
                "../bower_components/select2/dist/js/select2.min.js",
                "../bower_components/angular-filebrowser/src/js/controllers/main.js",
                "../bower_components/angular-filebrowser/src/js/controllers/selector-controller.js",
                "../bower_components/angular-filebrowser/src/css/angular-filemanager.css",
                //"../bower_components/angular-filebrowser/src/css/animations.css",
                //"../bower_components/angular-filebrowser/src/css/dialogs.css",
                //"../bower_components/angular-filebrowser/src/css/main.css",
                "../bower_components/select2/dist/css/select2.min.css"
            ]
        },{
            name: "schemaForm",
            files: [
                "../bower_components/tv4/tv4.js",
                "../bower_components/angular/angular.min.js",
                "../bower_components/angular-sanitize/angular-sanitize.min.js",
                "../bower_components/objectpath/lib/ObjectPath.js",
                "../dist/schema-form.js"
            ]
        }]
    });
}]);

AgaveToGo.config(function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
    });
});

AgaveToGo.constant('angularMomentConfig', {
    timezone: 'America/Chicago' // optional
});


/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
AgaveToGo.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
AgaveToGo.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
AgaveToGo.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
AgaveToGo.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
AgaveToGo.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
AgaveToGo.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
AgaveToGo.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
AgaveToGo.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
AgaveToGo.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");  
    
    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/dashboard.min.js',
                            '../bower_components/faker/build/build/faker.min.js',
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       Applications Routes                      ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        .state('apps-catalog', {
            url: "/apps/catalog",
            templateUrl: "views/apps/browser.html",
            data: {pageTitle: 'App Catalog'},
            controller: "AppBrowserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'cubeportfolio',
                        files: [
                            '../bower_components/cubeportfolio/js/jquery.cubeportfolio.js',
                            '../bower_components/cubeportfolio/css/cubeportfolio.min.css'
                        ]
                    }, {
                        name: 'AgaveToGo',
                        files: [
                            'js/controllers/apps/AppBrowserController.js'
                        ]
                    }]);
                }]
            }
        })

        .state('apps-manage', {
            url: "/apps/manage",
            templateUrl: "views/apps/manager.html",
            data: {pageTitle: 'App Manager'},
            controller: "AppDirectoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css',
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',
                            '../bower_components/holderjs/holder.js',
                            'js/controllers/apps/AppDirectoryController.js'
                        ]
                    });
                }]
            }
        })

        .state('apps-edit', {
            url: "/apps/manage",
            templateUrl: "views/apps/editor.html",
            data: {pageTitle: 'App Manager'},
            controller: "AppDirectoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            //'../assets/global/plugins/datatables/datatables.min.css',
                            //'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            //'../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            //
                            //'../assets/global/plugins/datatables/datatables.all.min.js',
                            //'../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            //'../assets/global/scripts/datatable.js',
                            '../bower_components/datatables/media/css/dataTables.bootstrap.min.css',
                            '../bower_components/datatables/media/css/dataTables.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../bower_components/datatables/dataTables.bootstrap.min.js',
                            '../bower_components/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',
                            'js/controllers/apps/AppDirectoryController.js'
                        ]
                    });
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       Data Management Routes                   ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // AngularJS plugins
        .state('data-explorer', {
            url: "data/explorer",
            templateUrl: "views/data/explorer.html",
            data: {pageTitle: 'File Explorer'},
            controller: "FileExplorerController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        'FileManagerApp',
                        {
                            name: 'AgaveToGo',
                            files: [
                                'js/controllers/data/FileExplorerController.js'
                            ]
                        }
                    ]);
                }]
            }
        })

        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       User Profile Routes                      ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',

                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}
        })


        /**********************************************************************/
        /**********************************************************************/
        /***                                                                ***/
        /***                       Plugin Routes                            ***/
        /***                                                                ***/
        /**********************************************************************/
        /**********************************************************************/

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'AgaveToGo',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AgaveToGo',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/moment.min.js',
                            '../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            '../assets/global/plugins/datatables/datatables.min.css', 
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css', 
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            'js/scripts/table-ajax.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'AgaveToGo',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
//AgaveToGo.run(["$rootScope", "settings", "$state", 'ProfilesController', function($rootScope, settings, $state) { //}, ProfilesController) {
AgaveToGo.run(["$rootScope", "settings", "$state", "$http", "CacheFactory", function($rootScope, settings, $state, $http, CacheFactory) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    //$rootScope.$on('oauth:error', function(event, rejection) {
    //    // Ignore `invalid_grant` error - should be catched on `LoginController`.
    //    if ('invalid_grant' === rejection.data.error) {
    //        return;
    //    }
    //
    //    // Refresh token when a `invalid_token` error occurs.
    //    if ('invalid_token' === rejection.data.error) {
    //        return OAuth.getRefreshToken();
    //    }
    //
    //    // Redirect to `/login` with the `error_reason`.
    //    return $window.location.href = '/login?error_reason=' + rejection.data.error;
    //});

    $rootScope.$on('oauth:login', function(event, token) {
        console.log('Authorized third party app with token', token.access_token);
        //ProfilesController.getProfile('me')

    });

    $rootScope.$on('oauth:logout', function(event) {
        console.log('The user has signed out');
    });

    $rootScope.$on('oauth:loggedOut', function(event) {
        console.log('The user is not signed in');
    });

    $rootScope.$on('oauth:denied', function(event) {
        console.log('The user did not authorize the third party app');
    });

    $rootScope.$on('oauth:expired', function(event) {
        console.log('The access token is expired. Please refresh.');
    });

    $rootScope.$on('oauth:profile', function(profile) {
        console.log('User profile data retrieved: ', profile);
    });

    $http.defaults.cache = CacheFactory('defaultCache', {
        maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 day
        cacheFlushInterval: 30 * 24 * 60 * 60 * 1000, // This cache will clear itself every 30 days
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
        storageMode: 'localStorage'
    });

}]);