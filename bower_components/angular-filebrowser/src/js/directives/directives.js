(function(angular) {
    "use strict";
    var app = angular.module('FileManagerApp');

    app.directive('angularFilemanager', ['$parse', 'fileManagerConfig', function($parse, fileManagerConfig) {
        return {
            restrict: 'EA',
            templateUrl: fileManagerConfig.tplPath + '/main.html',
            scope: {
                system: "=agaveSystem",
                upload: "=agaveUpload",
                select: "=agaveSelect"
            },
            link: function (scope, element, attrs){
              fileManagerConfig.allowedActions.agaveUpload = (typeof attrs.agaveUpload === 'undefined') ? false : true;
              fileManagerConfig.allowedActions.agaveSelect = (typeof attrs.agaveSelect === 'undefined') ? false : true;
            }
        };
    }]);

    app.directive('ngFile', ['$parse', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.ngFile);
                var modelSetter = model.assign;

                element.bind('change', function() {
                    scope.$apply(function() {
                        modelSetter(scope, element[0].files);
                    });
                });
            }
        };
    }]);

    app.directive('ngRightClick', ['$parse', function($parse) {
        return function(scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope, {$event: event});
                });
            });
        };
    }]);
    
    app.directive('systemSelect', function(SystemsController) {
        return {
            replace: true,
            restrict: 'E',
            scope: {
                agaveSourceSystem: '=agaveSourceSystem',
                agaveDestSystem: '=agaveDestSystem',
                searchFilter: '=searchFilter'
            },
            template: '<div class="agave-system-select">' +
                '<ui-select data-ng-disabled="disabled" ng-model="agaveDestSystem" theme="bootstrap" on-select="setSystem($select.selected)" style="width:100%;">' +
                    '<ui-select-match placeholder="Please select the destination system">' +
                        '<div class="selected-system">' +
                            '<i style="font-size: 1.3em;vertical-align:top;" class="mrs" ng-class="{\'icon icon-cpu pts\': $select.selected.type == \'EXECUTION\', \'fa fa-database ptm\': $select.selected.type == \'STORAGE\'}"></i>' +
                            '<span style="display:inline-block; vertical-align: bottom;" class="system-info">{{ $select.selected.name }}</span>' +
                        '</div>' +
                    '</ui-select-match>' +
                    '<ui-select-choices refresh="searchSystems($select.search)" refresh-delay="300" repeat="system.id as system in systems | propertyFilter: {id: $select.search, name: $select.search}">' +
                        '<div class="candidate-profile-link">' +
                            '<i style="font-size: 2em;vertical-align: top;" ng-class="{\'icon icon-cpu pts\': system.type == \'EXECUTION\', \'fa fa-database fa-2x ptm\': system.type == \'STORAGE\'}"></i>' +
                            '<span style="display:inline-block" class="system-info">{{ system.name }}<br><em class="small_text">({{system.id}})</em></span>' +
                        '</div>' +
                    '</ui-select-choices>' +
                    '<ui-select-no-choice>' +
                        '<div>Select the system where the file item will be copied</div>' +
                    '</ui-select-no-choice>' +
                '</ui-select>' +
                '</div>',
            link: function(scope, element, attrs, model) {

                scope.systems = [];
                scope.disabled = undefined;

                scope.setSystem = function(system) {
                    scope.agaveDestSystem = system;
                };

                scope.searchSystems = function(query) {

                    scope.disabled = true;
                    var searchExpression = scope.searchFilter || '';

                    SystemsController.searchSystems('filter=id,name,type,storage&id.like=*' + query + '*&limit=20&' + searchExpression).then(
                        function(data) {
                            scope.systems = data.result;
                            scope.disabled = false;
                        }, function(err) {
                            scope.systems = [];
                            console.log(err);
                            scope.disabled = false;
                        });
                };
            }
        }
    });
    

})(angular);
