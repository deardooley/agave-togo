angular.module('AgaveToGo').controller('ProjectDashboardController', function($rootScope, $state, $scope, $http, $timeout, Projects, Tasks, Comments, Tags) {

    // private functions & variables

    var _initComponents = function() {

        //// init datepicker
        //$('.todo-taskbody-due').datepicker({
        //    rtl: App.isRTL(),
        //    orientation: "left",
        //    autoclose: true
        //});
        //
        //// init tags
        //$(".todo-taskbody-tags").select2({
        //    placeholder: 'Status'
        //});
    }

    var _handleProjectListMenu = function() {
        if (App.getViewPort().width <= 992) {
            $('.todo-project-list-content').addClass("collapse");
        } else {
            $('.todo-project-list-content').removeClass("collapse").css("height", "auto");
        }
    }

    $timeout(function() {
        // public functions
        _initComponents();
        _handleProjectListMenu();

        App.addResizeHandler(function () {
            _handleProjectListMenu();
        });
    }, 50);

    $scope.projects = [];
    $scope.tasks = [];
    $scope.allTags = [];
    $scope.activeProject;

});