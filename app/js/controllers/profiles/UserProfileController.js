angular.module('AgaveToGo').controller('UserProfileController', function($rootScope, $scope, $http, $timeout, $localStorage, Commons) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
    });

    $scope.profile = $localStorage.activeProfile;


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
}); 
