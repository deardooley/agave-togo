/**
 * oc.LazyLoad Configuration
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
'use strict';

AgaveToGo

    .constant('angularMomentConfig', {
      timezone: 'America/Chicago' // optional
    })

    .config(function (toastrConfig) {
      angular.extend(toastrConfig, {
        allowHtml: false,
        autoDismiss: true,
        closeButton: true,
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        templates: {
          toast: 'directives/toast/toast.html',
          progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 0,
        extendedTimeOut: 0
      });
    })

    .config(function ($translateProvider) {

      $translateProvider.preferredLanguage('en');
    })

    .config(function (CacheFactoryProvider) {
      angular.extend(CacheFactoryProvider.defaults, {
        maxAge: 5 * 60 * 1000, // 5 minutes
        deleteOnExpire: 'aggressive'
      });

      // $http.defaults.cache = CacheFactory('defaultCache', {
      //     maxAge: 24 * 60 * 60 * 1000, // Items added to this cache expire after 1 day
      //     cacheFlushInterval: 30 * 24 * 60 * 60 * 1000, // This cache will clear itself every 30 days
      //     deleteOnExpire: 'aggressive', // Items will be deleted from this cache when they expire
      //     storageMode: 'localStorage'
      // });
    })

    .config(function ($locationProvider) {
      $locationProvider.html5Mode({
        enabled: false,
        //hashPrefix: '!',
        required: false
      });
    })

    .config(function ($provide) {
      $provide.decorator('$q', function ($delegate) {

        /**
         * $q.allSettled returns a promise that is fulfilled with an array of promise state snapshots,
         * but only after all the original promises have settled, i.e. become either fulfilled or rejected.
         *
         * This method is often used in order to execute a number of operations concurrently and be
         * notified when they all finish, regardless of success or failure.
         *
         * @param promises array or object of promises
         * @returns {Promise} when resolved will contain an an array or object of resolved or rejected promises.
         * A resolved promise have the form { status: 'fulfilled', value: value }.  A rejected promise will have
         * the form { status: 'rejected', reason: reason }.
         */
        function allSettled(promises) {
          var deferred = $delegate.defer(),
              counter = 0,
              results = angular.isArray(promises) ? [] : {};

          angular.forEach(promises, function (promise, key) {
            counter++;
            $delegate.when(promise).then(function (value) {
              if (results.hasOwnProperty(key)) {
                return;
              }
              results[key] = {status: 'fulfilled', value: value};
              if (!(--counter)) {
                deferred.resolve(results);
              }
            }, function (reason) {
              if (results.hasOwnProperty(key)) {
                return;
              }
              results[key] = {status: 'rejected', reason: reason};
              if (!(--counter)) {
                deferred.resolve(results);
              }
            });
          });

          if (counter === 0) {
            deferred.resolve(results);
          }

          return deferred.promise;
        }

        $delegate.allSettled = allSettled;
        return $delegate;
      });
    })

    /* Setup global settings */
    .factory('settings', ['$rootScope', function ($rootScope) {
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
    }])

    .config(['$controllerProvider', function ($controllerProvider) {
      // this option might be handy for migrating old apps, but please don't use it
      // in new ones!
      $controllerProvider.allowGlobals();
    }])

    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: [
          // {
          //   name: 'ui.codemirror',
          //   files: [
          //     '../bower_components/codemirror/lib/codemirror.css',
          //     '../bower_components/codemirror/theme/neo.css',
          //     '../bower_components/codemirror/lib/codemirror.js',
          //     '../bower_components/angular-ui-codemirror/ui-codemirror.min.js'
          //   ]
          // },
          // {
          //   name: 'FileManagerApp',
          //   files: [
          //     '../bower_components/angular-filebrowser/dist/agave-angular-filemanager.min.js',
          //     '../bower_components/angular-filebrowser/dist/agave-angular-filemanager.min.css'
          //   ]
          // },
          // {
          //   serie: true,
          //   insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
          //   name: 'btford.markdown',
          //   files: [
          //     '../bower_components/showdown/compressed/Showdown.min.js',
          //     '../bower_components/angular-markdown-directive/markdown.js'
          //   ]
          // },
          //
          // {
          //   name: 'bootbox',
          //   files: [
          //     '../assets/vendors/bootbox/js/bootbox.js'
          //   ]
          // },
          // {
          //   name: 'bs-example',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/css/bs-example.min.css'
          //   ]
          // },
          // {
          //   name: 'jstree',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jstree/css/proton/style.min.css',
          //     '../assets/vendors/jstree/js/jstree.min.js',
          //     'app/vendors/jstree-directive/jsTree.directive.min.js'
          //   ]
          // },
          // {
          //   name: 'ladda',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/ladda-button/css/ladda-themeless.min.css',
          //     '../assets/vendors/ladda-button/js/spin.min.js',
          //     '../assets/vendors/ladda-button/js/ladda.min.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-iconpicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-iconpicker/css/bootstrap-iconpicker.min.css',
          //     '../assets/vendors/bootstrap-iconpicker/js/iconset/iconset-glyphicon.min.js',
          //     '../assets/vendors/bootstrap-iconpicker/js/iconset/iconset-fontawesome-4.2.0.min.js',
          //     '../assets/vendors/bootstrap-iconpicker/js/bootstrap-iconpicker.min.js'
          //   ]
          // },
          // {
          //   name: 'datatable',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jquery-datatables/css/dataTables.bootstrap.min.css',
          //     '../assets/vendors/jquery-datatables/css/dataTables.responsive.min.css',
          //     '../assets/vendors/jquery-datatables/css/dataTables.tableTools.min.css',
          //     '../assets/vendors/jquery-datatables/css/dataTables.colVis.min.css'
          //   ]
          // },
          // {
          //   name: 'jquery-ui',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jquery-ui-bootstrap/css/jquery-ui.custom.min.css'
          //   ]
          // },
          // {
          //   name: 'nestable',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jquery-nestable/js/jquery.nestable.min.js',
          //     '../assets/vendors/jquery-nestable/css/jquery-nestable.min.css',
          //     'app/vendors/angular-ui-tree/css/angular-ui-tree.min.css',
          //     'app/vendors/angular-ui-tree/js/angular-ui-tree.min.js'
          //   ]
          // },
          // {
          //   name: 'dual-list',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-duallistbox/css/bootstrap-duallistbox.min.css',
          //     '../assets/vendors/bootstrap-duallistbox/js/jquery.bootstrap-duallistbox.min.js',
          //     'app/vendors/angular-bootstrap-duallistbox/angular-bootstrap-duallistbox.js'
          //   ]
          // },
          //
          // {
          //   name: 'morrischart',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/morrisjs/css/morris.min.css',
          //     '../assets/vendors/morrisjs/js/raphael.min.js',
          //     '../assets/vendors/morrisjs/js/morris.min.js',
          //     'app/directives/morris.js'
          //   ]
          // },
          // {
          //   name: 'summernote',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/summernote/css/summernote.min.css',
          //     '../assets/vendors/summernote/js/summernote.min.js',
          //     'app/vendors/angular-summernote/angular-summernote.min.js'
          //   ]
          // },
          // {
          //   name: 'markdown',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-markdown/css/bootstrap-markdown.min.css',
          //     '../assets/vendors/bootstrap-markdown/js/markdown.min.js',
          //     '../assets/vendors/bootstrap-markdown/js/to-markdown.min.js',
          //     '../assets/vendors/bootstrap-markdown/js/bootstrap-markdown.min.js'
          //   ]
          // },
          // {
          //   name: 'x-editable',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     'app/vendors/angular-xeditable/css/xeditable.min.css',
          //     '../assets/vendors/x-editable/js/bootstrap-editable.min.js',
          //     'app/vendors/angular-xeditable/js/xeditable.min.js'
          //   ]
          // },
          // {
          //   name: 'checklist',
          //   files: [
          //     'app/vendors/angular-xeditable/js/lib/checklist-model.js'
          //   ]
          // },
          //
          //
          // {
          //   name: 'ui-bootstrap',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/typeaheadjs/css/typeahead.js-bootstrap.min.css',
          //     'app/vendors/angular-xeditable/js/lib/ui-bootstrap-tpls-0.6.0.min.js'
          //   ]
          // },
          // {
          //   name: 'momentx-edit',
          //   files: [
          //     'app/vendors/angular-xeditable/js/lib/moment.min.2.5.0.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-datepicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
          //     '../assets/vendors/bootstrap-datepicker/js/bootstrap-datepicker.min.js'
          //   ]
          // },
          // {
          //   name: 'jasny-bootstrap',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jasny-bootstrap/css/jasny-bootstrap.min.css',
          //     '../assets/vendors/jasny-bootstrap/js/jasny-bootstrap.min.js'
          //   ]
          // },
          // {
          //   name: 'knob',
          //   files: [
          //     '../assets/vendors/jquery-knob/js/jquery.knob.min.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-tagsinput',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-tagsinput/css/bootstrap-tagsinput.min.css',
          //     '../assets/vendors/bootstrap-tagsinput/js/bootstrap-tagsinput.min.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-timepicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
          //     '../assets/vendors/bootstrap-timepicker/js/bootstrap-timepicker.min.js'
          //   ]
          // },
          // {
          //   name: 'clockpicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/clockpicker/css/bootstrap-clockpicker.min.css',
          //     '../assets/vendors/clockpicker/js/bootstrap-clockpicker.min.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-colorpicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css',
          //     '../assets/vendors/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js'
          //   ]
          // },
          // {
          //   name: 'dropzone',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/dropzone/css/basic.min.css',
          //     '../assets/vendors/dropzone/css/dropzone.min.css',
          //     '../assets/vendors/dropzone/js/dropzone.min.js',
          //     'js/directives/dropzone.js'
          //   ]
          // },
          // {
          //   name: 'jquery-fileupload',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jquery-file-upload/css/blueimp-gallery.min.css',
          //     '../assets/vendors/jquery-file-upload/css/jquery.fileupload.min.css',
          //     '../assets/vendors/jquery-file-upload/css/jquery.fileupload-ui.min.css',
          //     '../assets/vendors/jQuery-File-Upload/js/load-image.all.min.js',
          //     '../assets/vendors/jQuery-File-Upload/js/canvas-to-blob.min.js',
          //     '../assets/vendors/jquery-file-upload/js/jquery.blueimp-gallery.min.js',
          //     '../assets/vendors/jquery-file-upload/js/jquery.iframe-transport.min.js',
          //     '../assets/vendors/jquery-file-upload/js/jquery.fileupload.min.js'
          //   ]
          // },
          // {
          //   name: 'yep-gallery',
          //   files: [
          //     'app/directives/yep-gallery.js'
          //   ]
          // },
          // {
          //   name: 'google-map',
          //   files: [
          //     'app/vendors/angularjs-google-maps/ng-map.min.js'
          //   ]
          // },
          // {
          //   name: 'blueimp-gallery',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-image-gallery/css/blueimp-gallery.min.css',
          //     '../assets/vendors/bootstrap-image-gallery/js/jquery.blueimp-gallery.min.js',
          //     'app/directives/blueimpgallery.js'
          //   ]
          // },
          // {
          //   name: 'bootstrap-image-gallery',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-image-gallery/css/bootstrap-image-gallery.min.css',
          //     '../assets/vendors/bootstrap-image-gallery/js/bootstrap-image-gallery.min.js'
          //   ]
          // },
          // {
          //   name: 'momentjs',
          //   files: [
          //     '../assets/vendors/momentjs/js/moment.min.js'
          //   ]
          // },
          // {
          //   name: 'jquery-ui-custom',
          //   files: [
          //     '../assets/vendors/jquery-ui/js/jquery-ui.custom.min.js'
          //   ]
          // },
          // {
          //   name: 'easypiechart',
          //   files: [
          //     '../assets/vendors/easy-pie-chart/js/jquery.easypiechart.min.js'
          //   ]
          // },
          // {
          //   name: 'daterangepicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-daterangepicker/css/daterangepicker.min.css',
          //     '../assets/vendors/bootstrap-daterangepicker/js/daterangepicker.min.js',
          //     'app/vendors/ng-daterange/ng-daterange.min.js'
          //   ]
          // },
          // {
          //   name: 'angular-daterangepicker',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/bootstrap-daterangepicker/css/daterangepicker.min.css',
          //     '../assets/vendors/bootstrap-daterangepicker/js/daterangepicker.min.js',
          //     'app/vendors/angular-daterangepicker/angular-daterangepicker.min.js'
          //   ]
          // },
          // {
          //   name: 'sweet-alert',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/sweetalert/css/sweetalert.min.css',
          //     '../assets/vendors/sweetalert/js/sweetalert.min.js',
          //     'app/vendors/ng-sweet-alert/SweetAlert.min.js'
          //   ]
          // },
          // {
          //   name: 'jquery.steps',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/jquery-steps/css/jquery.steps.css',
          //     '../assets/vendors/jquery-steps/js/jquery.steps.min.js'
          //   ]
          // },
          // {
          //   name: 'fuelux',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/fuelux/css/fuelux.wizard.min.css',
          //     '../assets/vendors/fuelux/js/fuelux.min.js',
          //     '../assets/vendors/fuelux/js/wizard.min.js'
          //   ]
          // },
          // {
          //   name: 'jquery.validate',
          //   files: [
          //     '../assets/vendors/jquery-validation/js/jquery.validate.min.js'
          //   ]
          // },
          // {
          //   name: 'flot',
          //   files: [
          //     '../assets/vendors/flot/js/jquery.flot.min.js',
          //     'app/vendors/angular-flot/angular-flot.min.js'
          //   ]
          // },
          // {
          //   name: 'flot-plugins',
          //   files: [
          //     '../assets/vendors/flot/js/jquery.flot.fillbetween.min.js',
          //     '../assets/vendors/flot/js/jquery.flot.pie.min.js',
          //   ]
          // },
          // {
          //   name: 'panel-flat',
          //   files: [
          //     'app/directives/panel-flat.js'
          //   ]
          // },
          // {
          //   name: 'pw-check',
          //   files: [
          //     'app/directives/pw-check.js'
          //   ]
          // },
          // {
          //   name: 'ui-bs-paging',
          //   files: [
          //     'app/vendors/ui-bootstrap/ui-bootstrap-paginaton.min.js'
          //   ]
          // },
          // {
          //   name: 'ui-bs-alert',
          //   files: [
          //     'app/vendors/ui-bootstrap/ui-bootstrap-alert.min.js'
          //   ]
          // },
          // {
          //   name: 'fancybox-plus',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/fancybox-plus/css/jquery.fancybox-plus.min.css',
          //     '../assets/vendors/fancybox-plus/js/jquery.fancybox-plus.min.js',
          //     'app/vendors/angular-fancybox-plus/angular-fancybox-plus.min.js'
          //   ]
          // },
          // {
          //   name: 'angular-wizard',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     'app/vendors/angular-wizard/css/angular-wizard.min.css',
          //     'app/vendors/angular-wizard/js/angular-wizard.min.js'
          //   ]
          // },
          // {
          //   name: 'angular-ui-notification',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     'app/vendors/angular-ui-notification/css/angular-ui-notification.min.css',
          //     'app/vendors/angular-ui-notification/js/angular-ui-notification.js'
          //   ]
          // },
          // {
          //   name: 'ui-bs-modal',
          //   files: [
          //     'app/vendors/ui-bootstrap/ui-bootstrap-modal.min.js'
          //   ]
          // },
          // {
          //   name: 'prettify',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/prettify/css/prettify.css',
          //     '../assets/vendors/prettify/js/prettify.min.js'
          //   ]
          // },
          // {
          //   name: 'recaptcha',
          //   files: [
          //     'app/vendors/angular-recaptcha/angular-recaptcha.js'
          //   ]
          // },
          // {
          //   name: 'nprogress',
          //   files: [
          //     '../assets/vendors/nprogress/js/nprogress.min.js'
          //   ]
          // },
          // {
          //   name: 'sweet-alert2',
          //   insertBefore: '#ng_load_plugins_before',
          //   files: [
          //     '../assets/vendors/sweetalert2/js/sweetalert2.min.js',
          //     '../assets/vendors/sweetalert2/css/sweetalert2.min.css',
          //   ]
          // },
          // {
          //   name: 'yep-checkbox',
          //   files: [
          //     'app/directives/yep-checkbox.js'
          //   ]
          // },
          // {
          //   name: 'yep-data-table',
          //   files: [
          //     'app/directives/yep-data-table.js'
          //   ]
          // },
          // {
          //   name: "angular-moment",
          //   files: [
          //     'app/vendors/angular-moment/angular-moment.min.js'
          //   ]
          // },
          // {
          //   name: 'scroll-glue',
          //   files: [
          //     'app/vendors/angularjs-scroll-glue/scrollglue.min.js'
          //   ]
          // },
          // {
          //   name: 'ng-carriage-return',
          //   files: [
          //     'app/directives/ngCarriageReturn.js'
          //   ]
          // },
          // {
          //   name: 'angular-timezone-selector',
          //   files: [
          //     'app/vendors/angular-timezone-selector/angular-timezone-selector.min.css',
          //     'app/vendors/angular-timezone-selector/angular-timezone-selector.min.js'
          //   ]
          // },
          // {
          //   name: 'autocompleteAddressForm',
          //   serie: true,
          //   files: [
          //     'js!//maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyB5Dm_UbYYEsqrSQFLbJxZ_hLjGmJACMo0',
          //     'js/services/AddressService.js',
          //     'js/services/CountryService.js',
          //     'app/directives/autocompleteAddressForm.js',
          //   ]
          // },
          // {
          //   name: 'countrySelect2',
          //   serie: true,
          //   files: [
          //     'js/services/CountryService.js',
          //     'app/directives/countrySelect2.js'
          //   ]
          // },
          // {
          //   name: 'hcard',
          //   files: [
          //     'app/directives/hcardAddress.js'
          //   ]
          // },


          /***************************************************************
           * ToGo Third-party module dependencies
           ***************************************************************/

          {
            name: 'select2',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../assets/global/plugins/select2/css/select2.min.css',
              '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
              '../assets/global/plugins/select2/js/select2.full.min.js',
              '../assets/pages/scripts/components-select2.min.js',
            ]
          },
          {
            name: 'ui.select',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-ui-select/dist/select.min.css',
              '../bower_components/angular-ui-select/dist/select.min.js',
            ]
          },
          {
            name: 'bs-select',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
              '../assets/pages/scripts/components-bootstrap-select.min.js',

            ]
          },
          {
            name: 'bs-pickers',
            insertBefore: '#ng_load_plugins_before',
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

            ]
          },
          {
            name: "angularMoment",
            files: [
              '../bower_components/angular-moment/angular-moment.min.js',
              '../bower_components/humanize-duration/humanize-duration.js',
            ]
          },
          {
            name: 'ngMd5',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-md5/angular-md5.min.js'
            ]
          },
          {
            name: 'togo-charts',
            files: [
              '../assets/global/plugins/morris/morris.css',
              '../assets/global/plugins/morris/morris.min.js',
              '../assets/global/plugins/morris/raphael-min.js',
              '../assets/global/plugins/jquery.sparkline.min.js',
              '../assets/pages/scripts/dashboard.min.js',
              'js/directives/knob.js',
              'js/directives/morris.js',
              'js/directives/sparkline.js',
            ]
          },
          {
            name: 'checklist-model',
            insertBefore: '#ng_load_plugins_before',
            files: []
          },
          {
            name: 'toastr',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-toastr/dist/angular-toastr.css',
              '../bower_components/angular-toastr/dist/angular-toastr.tpls.js',

            ]
          },
          {
            name: 'faker',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/faker/build/build/faker.min.js',
            ]
          },
          {
            name: 'angular-object-diff',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-object-diff/dist/angular-object-diff.css',

            ]
          },
          {
            name: 'jsonFormatter',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/jsoneditor/dist/jsoneditor.min.css',
              '../bower_components/jsoneditor/dist/jsoneditor.min.js',
              'js/directives/ng-jsoneditor.js'

            ]
          },
          {
            name: 'angularUtils.directives.dirPagination',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-utils-pagination/dirPagination.js',
            ]
          },
          {
            name: 'ds.objectDiff',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-object-diff/dist/angular-object-diff.js',
            ]
          },
          {
            name: 'ng.jsoneditor',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/json-formatter/dist/json-formatter.css',
              '../bower_components/json-formatter/dist/json-formatter.js',
            ]
          },
          {
            name: 'ngFileUpload',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/ng-file-upload/ng-file-upload.min.js',
            ]
          },
          {
            name: 'timer',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-timer/dist/angular-timer.min.js',
            ]
          },
          {
            name: 'emguo.poller',
            files: [
              '../bower_components/angular-poller/angular-poller.min.js',
            ]
          },
          {
            name: 'quick-sidebar',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../assets/layouts/global/scripts/quick-sidebar.js',
            ]
          },
          {
            name: 'agave-filemanager',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/angular-filebrowser/dist/agave-angular-filemanager.min.js',
            ]
          },
          {
            name: 'codemirror',
            insertBefore: '#ng_load_plugins_before',
            files: [
              '../bower_components/codemirror/lib/codemirror.js',
              '../bower_components/codemirror/lib/codemirror.css',
              '../bower_components/codemirror/theme/neo.css',
              '../bower_components/codemirror/lib/codemirror.js',
              '../bower_components/angular-ui-codemirror/ui-codemirror.min.js'
            ]
          },
          {
            name: 'agave.sdk',
            files: [
              '../bower_components/agave-angularjs-sdk/agave-angularjs-sdk.min.js'
            ]
          },
          {
            name: 'ngStorage',
            files: [
              '../bower_components/ngStorage/ngStorage.min.js'
            ]
          },
          {
            name: 'sjcl',
            files: [
              '../bower_components/sjcl/sjcl.js'
            ]
          }, {
            name: 'schemaForm',
            serie: true,
            files: [
              '../bower_components/angular-schema-form/dist/schema-form.js',
              '../bower_components/angular-schema-form/dist/bootstrap-decorator.js',
              '../bower_components/angular-schema-form-ui-select/bootstrap-ui-select.min.js',
            ]
          },
          {
            name: 'schemaFormWizard',
            files: [
              '../bower_components/agave-angularjs-sdk/agave-angularjs-sdk.min.js',
              'js/directives/SchemaFormWizard.js',
            ]
          },

          /***************************************************************
           * ToGo App Services Module
           ***************************************************************/

          {
            name: 'ActionsBulkService',
            files: [
              'js/services/ActionsBulkService.js'
            ]
          },
          {
            name: 'ActionsService',
            files: [
              'js/services/ActionsService.js'
            ]
          },
          {
            name: 'ChangelogService',
            files: [
              'js/services/ChangelogService.js'
            ]
          },
          {
            name: 'CollectionsService',
            files: [
              'js/services/CollectionsService.js'
            ]
          },
          {
            name: 'CommentsService',
            files: [
              'js/services/CommentsService.js'
            ]
          },
          {
            name: 'CommonsService',
            files: [
              'js/services/CommonsService.js'
            ]
          },
          {
            name: 'DatasetService',
            files: [
              'js/services/DatasetService.js'
            ]
          },
          {
            name: 'IconService',
            files: [
              'js/services/IconService.js'
            ]
          },
          {
            name: 'JiraService',
            files: [
              'js/services/JiraService.js'
            ]
          },
          {
            name: 'MessageService',
            files: [
              'js/services/MessageService.js'
            ]
          },
          {
            name: 'NotificationService',
            files: [
              'js/services/NotificationService.js'
            ]
          },
          {
            name: 'PermissionServiceModule',
            files: [
              'js/services/PermissionService.js'
            ]
          },
          {
            name: 'ProjectService',
            files: [
              'js/services/CategoryService.js'
            ]
          },
          {
            name: 'QuayRepositoryService',
            files: [
              'js/services/QuayRepositoryService.js'
            ]
          },
          {
            name: 'RolesService',
            files: [
              'js/services/TagService.js'
            ]
          },
          {
            name: 'EncryptionService',
            files: [
              'js/services/EncryptionService.js'
            ]
          },
          {
            name: 'MesageService',
            files: [
              'js/services/MesageService.js'
            ]
          },
          {
            name: 'SessionCredentialService',
            files: [
              'js/services/SessionCredentialService.js'
            ]
          },
          {
            name: 'searching',
            files: [
              'js/services/SearchService.js'
            ]
          },
          {
            name: 'SingularityRepositoryService',
            files: []
          },
          {
            name: 'tagging',
            files: [
              'js/services/TagsService.js',
              'js/directives/TagsModal',
              'js/directives/TagsSelector',
            ]
          },
          {
            name: 'TasksService',
            files: [
              'js/services/ActionsService.js'
            ]
          },
          {
            name: 'faye',
            files: [
              'https://9d1e23fc.fanoutcdn.com/fpp/static/fppclient-1.0.1.min.js',
              'https://9d1e23fc.fanoutcdn.com/fpp/static/json2.js',
            ]
          },

          {
            name: 'ngclipboard',
            files: [
              '../bower_components/ngclipboard/dist/ngclipboard.min.js',
            ]
          },


          /*
           ***************************************************************/
          {
            name: 'ChannelListenerService',
            files: [
              'js/services/ChannelListenerService.js',
              'app/vendors/socket.io/socket.io.min.js'
            ]
          },


          /****************************************************************
           * ToGo Filters modules
           ****************************************************************/
          {
            name: 'agave-sdk-filters',
            files: [
              'app/shared/filters/uiSelectFilter.js'
            ]
          },
          {
            name: 'togo-common-filters',
            files: [
              'app/shared/filters/userAvatarFilter.js'
            ]
          },

          /****************************************************************
           * ToGo Directives
           ****************************************************************/
          {
            name: 'QueryBuilder',
            files: [
              'js/directives/QueryBuilder.js',
            ]
          },
          {
            name: 'job-progress-bar',
            files: [
              'js/directives/JobProgressBar.js',
            ]
          },
          {
            name: 'user-lookup',
            files: [
              'js/directives/UserLookup.js',
            ]
          }
        ]
      })
    }]);

