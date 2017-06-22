'use strict';

angular.module('AgaveToGo')
    .directive('knob', function () {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
          element.knob({
            
            change: function (value) {
              scope.$apply(function () {
                ngModel.$setViewValue(value)
              })
            }
          });
        }
      }
    })