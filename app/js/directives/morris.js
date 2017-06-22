'use strict';

angular.module('AgaveToGo')
    .directive('morris', function () {
      return {
        restrict: 'AE',
        link: function ($scope, element, attrs) {

          // Merge two objects
          function merge_options(obj1, obj2) {
            var obj3 = {};
            for (var attrname in obj1) {
              obj3[attrname] = obj1[attrname];
            }
            for (var attrname in obj2) {
              obj3[attrname] = obj2[attrname];
            }
            return obj3;
          }

          // Get data form data-attribute
          var morrisData = $scope[attrs.morrisData];
          var morrisType = attrs.morrisType;
          var morrisOption = $scope[attrs.morrisOptions]
          $scope.baseChart = {
            element: element,
            data: morrisData
          }


          var finalChartOptions = merge_options($scope.baseChart, morrisOption);
          //console.log(finalChartOptions);
          //console.log($scope.baseChart);
          //console.log(morrisType);

          // Switch case by morrisType
          var morrisLine;
          var morrisArea;
          var morrisBar;
          var morrisDonut;

          $scope.$watch(attrs.morrisData, function (data) {
            if (attrs.morrisLive) {
              morrisData = data;
            }
            switch (morrisType.toLowerCase()) {
              case 'line':
                if (!morrisLine) {
                  morrisLine = Morris.Line(finalChartOptions);
                } else {
                  morrisLine.setData(morrisData);
                }
                //console.warn(morrisData[0]);
                break;

              case 'bar':
                if (!morrisBar) {
                  morrisBar = Morris.Bar(finalChartOptions);
                } else {
                  morrisBar.setData(morrisData);
                }
                break;

              case 'area':
                if (!morrisArea) {
                  morrisArea = Morris.Area(finalChartOptions);
                } else {
                  morrisArea.setData(morrisData);
                }
                break;

              case 'donut':
                if (!morrisDonut) {
                  morrisDonut = Morris.Donut(finalChartOptions);
                } else {
                  morrisDonut.setData(morrisData);
                }
                break;

              default:
                console.error('you must define morris-type attribute!')
            }
            ;
          });


        }
      }
    })