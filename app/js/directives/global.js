/***
 GLobal Directives
 ***/

// Route State Load Spinner(used on page or content load)
AgaveToGo.directive('ngSpinnerBar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function () {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function () {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function () {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
AgaveToGo.directive('a', function () {
    return {
        restrict: 'E',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
AgaveToGo.directive('dropdownMenuHover', function () {
    return {
        link: function (scope, elem) {
            elem.dropdownHover();
        }
    };
});

// Remember when an element is hidden and store in the user preferences
AgaveToGo.directive('rememberDismiss', [ 'Preferences', function (Preferences) {
    return {
        restrict: 'A',
        scope: {
            'preferenceKey': '=preferenceKey',
        },
        link: function (scope, elem) {

            if (!scope.userPreference) {
                elem.hide();
            }

            elem.on('click', '[data-close="note"]', function(e) {
                $(this).closest('.note').hide();
                e.preventDefault();
                Preferences.update(scope.preferenceKey, true);
            });

            elem.on('click', '[data-remove="note"]', function(e) {
                $(this).closest('.note').remove();
                e.preventDefault();
                Preferences.update(scope.preferenceKey, true);
            });
        }
    };
}]);

// Handle global start menu toggle button
AgaveToGo.directive('landingStartMenu', function ($parse) {
    return {
        restrict: 'EA',
        templateUrl: '../app/tpl/landing-page-menu-button.html'
    };
});

AgaveToGo.directive('ngclipboard2', function() {
    return {
        restrict: 'A',
        scope: {
            ngclipboardSuccess: '&',
            ngclipboardError: '&'
        },
        link: function(scope, element) {
            var clipboard = new Clipboard(element[0],{
                text: function(trigger) {
                    return element.attr('href');
                }
            });

            clipboard.on('success', function(e) {
                scope.$apply(function () {
                    scope.ngclipboardSuccess({
                        e: e
                    });
                });
            });

            clipboard.on('error', function(e) {
                scope.$apply(function () {
                    scope.ngclipboardError({
                        e: e
                    });
                });
            });

            scope.$on('$destroy', function() {
                clipboard.destroy();
            });

        }
    };
});