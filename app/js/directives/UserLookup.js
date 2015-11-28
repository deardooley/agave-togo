/**
 * Directive for generating dynamic lists of material types
 */
AgaveToGo.directive('userLookup', ['$compile', '$filter', 'Commons', '$timeout', 'ProfilesController', function($compile, $filter, Commons, $timeout, ProfilesController) {
    return {
        restrict: 'A',
        scope: {
            addresses: '=ngModel',
        },
        replace:false,
        // scope: true,
        templateUrl: '../app/tpl/directives/user-lookup.html',
        compile: function(element, attributes) {
            var content, directive;

            content = element.contents().remove();

            function checkEnableDefault() {
                var switches = $(".switch");

                if (switches.length > 1) {
                    $(".switch").bootstrapSwitch('disabled', false);
                } else if (switches.length > 0) {
                    $(".switch").click();//bootstrapSwitch('setState', true, false);
                    $(".switch").bootstrapSwitch('disabled', true);
                } else {
                    // no switches to be found.
                }
            }
            return {

                post: function($scope, element, attributes) {

                    $scope.addNewRow = function(addressType) {
                        $scope.addresses[addressType] = { po_box: null, street1: null, street2:null, city: null, state:null, zip:null, type:addressType, is_default:false };

                        // check whether we can re-eneable selection
                        // and update the + new address option minus
                        // the added address type
                        $timeout(function() {
                            $scope.updateAddressFlags();
                            checkEnableDefault();
                        }, 0);
                    };

                    $scope.removeExistingRow = function(addressType) {
                        delete $scope.addresses[addressType];
                        // this is the only value, make it the default, no edits possible
                        $timeout(function() {
                            $scope.updateAddressFlags();
                            checkEnableDefault();
                        }, 0);
                    };

                    $scope.updateAddressFlags = function() {

                        $(attributes.$$element).find('ul.dropdown-menu li').each(function() {
                            if ($scope.addresses && Commons.isNotEmpty($scope.addresses[$(this).data('addressType')])) {
                                $(this).hide();
                            } else {
                                $(this).show();
                            }
                        });
                    };

                    $scope.$watch('addresses', function(oldVal, newVal) {
                        $scope.updateAddressFlags();
                    });
                },

                pre: function($scope, element, attributes) {
                    if (Commons.isEmpty(directive)) {
                        directive = $compile(content);
                    }

                    element.append(directive($scope, function($compile) {
                        return $compile;
                    }));

                    $(".switch").bootstrapSwitch();
                    checkEnableDefault();
                }
            };
        }
    };
}]);