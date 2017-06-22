'use strict';

// you can use sparkline directive to render Composite jQuery Sparkline chart
angular.module('AgaveToGo')
    .directive('sparkline', function () {
      return {
        restrict: 'AE',
        link: function (scope, element, attrs) {

          var composite = attrs.composite;
          var sparkHtmlOptions = scope[attrs.sparkHtmlOptions];
          var sparkValuesOptions = scope[attrs.sparkValuesOptions];
          var sparkValue = scope[attrs.sparkValue];

          // just render composite chart
          if (composite == 'true') {
            element.sparkline('html', sparkHtmlOptions);
            element.sparkline(sparkValue, sparkValuesOptions);
          }

        }
      }
    });