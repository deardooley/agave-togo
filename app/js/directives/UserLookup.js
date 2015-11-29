/**
 * Directive for generating dynamic lists of material types
 */
AgaveToGo.directive('userLookup', function($timeout, ProfilesController) {
    return {
        restrict: 'A',
        scope: true,
        replace: false,
        templateUrl: '../app/tpl/directives/user-lookup.html',
        link: function ($scope, elem, attrs) {


        }
    };
});