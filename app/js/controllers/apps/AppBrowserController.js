angular.module('AgaveToGo').controller('AppBrowserController', function($rootScope, $filter, $compile, $scope, Commons, $timeout, AppsController) {

    $scope.apps = [];
    $scope.currentApp = {};
    $scope.currentAppDetails = '<agave-app-details></agave-app-details>';
    $scope.offset = 0;
    $scope.limit = 25;

    $scope.runApp = function (appId) {

    };

    var initCatalog = function() {
        // init cubeportfolio
        $('#js-grid-lightbox-gallery').cubeportfolio({
            filters: '#js-filters-lightbox-gallery1, #js-filters-lightbox-gallery2',
            loadMore: '#js-loadMore-lightbox-gallery',
            loadMoreAction: 'click',
            layoutMode: 'grid',
            mediaQueries: [{
                width: 1500,
                cols: 5
            }, {
                width: 1100,
                cols: 4
            }, {
                width: 800,
                cols: 3
            }, {
                width: 480,
                cols: 2
            }, {
                width: 320,
                cols: 1
            }],
            defaultFilter: '*',
            animationType: 'rotateSides',
            gapHorizontal: 10,
            gapVertical: 10,
            gridAdjustment: 'responsive',
            caption: 'zoom',
            displayType: 'sequentially',
            displayTypeSpeed: 100,

            // lightbox
            lightboxDelegate: '.cbp-lightbox',
            lightboxGallery: true,
            lightboxTitleSrc: 'data-title',
            lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',

            // singlePageInline
            singlePageInlineDelegate: '.cbp-singlePageInline',
            singlePageInlinePosition: 'below',
            singlePageInlineInFocus: true,
            singlePageInlineCallback: function (appId, element) {
                var t = this;

                AppsController.getAppDetails(appId).then(
                    function (data) {
                        $scope.currentApp = data;


                        t.updateSinglePageInline($compile($scope.currentAppDetails)($scope));

                    },
                    function (data) {
                        console.log(data);
                        t.updateSinglePageInline("Error fetching app description.");
                    });
            },
        });
    }

    AppsController.listApps($scope.limit, $scope.offset).then(
        function (data) {
            $scope.apps = data;
            $timeout(function () {
                initCatalog();
            }, 50);
        },
        function (data) {
            //self.deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
            console.log("Error fetching app catalog.");
        });
    //
    //$scope.$on('$viewContentLoaded', function () {
    //
    //
    //});
})
.directive('agaveAppDetails', function($filter) {
    return {
        restrict: 'EA',
        scope: true,
        replace: true,
        templateUrl: '../app/views/apps/details.html',
        link: function ($scope, element, attributes) {
            setTimeout(function () {}, 10);
        }
    };
})
.filter('appImage', ['Commons', function (Commons) {
    return function (icon) {
        return icon ? icon : '../assets/global/img/portfolio/600x600/'+Commons.randomInt(1,100)+'.jpg';
    };
}])
.filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]);