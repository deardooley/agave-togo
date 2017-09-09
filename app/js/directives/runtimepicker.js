'use strict';

angular.module('AgaveToGo')
    .directive('runtimepicker', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        // scope: {
        //   runtimepickerConfig: "="
        // },
        link: function (scope, element, attr, ngModel) {

          var runtimepickerConfig = scope.$eval(attr.runtimepickerConfig);

          var tp = element.timepicker(runtimepickerConfig);

          tp.on('changeTime.timepicker', function(e) {
            scope.$apply(function () {
              ngModel.$setViewValue(e.value);
            });
          });

          // element.runtimepicker({
          //
          //   change: function (value) {
          //     scope.$apply(function () {
          //       ngModel.$setViewValue(value)
          //     })
          //   }
          // });
        }
      }
    })