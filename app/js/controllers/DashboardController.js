angular.module('AgaveToGo').controller('DashboardController', function($rootScope, $scope, $http, $timeout, $filter, Commons, JobsController, SystemsController, StatusIoController) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.jobHistory = [];

    var usergen = function(count) {
        var users = [];
        for(var i=0;i<count;i++) {
            var firstName = faker.name.firstName(),
                lastName = faker.name.lastName();


            users.push({
                name: firstName + ' ' + lastName,
                username: faker.internet.userName(),
                created: faker.date.past(50)
            });
        }

        return users;
    };

    $scope.fakeUsers = usergen(20);

    JobsController.getJobHistory('3679479586933314021-e0bd34dffff8de6-0001-007').then(
        function(data) {
            $timeout(function() {
                $scope.jobHistory = data;
            }, 50);
        },
        function(data) {
            console.log("unable to fetch job history");
            console.log(data);
        });

    //JobsController.getJobHistory('3679479586933314021-e0bd34dffff8de6-0001-007').then(
    //    function(data) {
    //        $timeout(function() {
    //            $scope.jobHistory = [];
    //        }, 50);
    //    },
    //    function(data) {
    //        console.log("unable to fetch job history");
    //        console.log(data);
    //    });
})
.filter("jobStatusIcon", [function() {
    return function(status){
        if (status === "PENDING") {
            return 'hourglass-half';
        } else if (status === "PROCESSING_INPUTS") {
            return 'list';
        } else if (status === "STAGING_INPUTS") {
            return 'exchange';
        } else if (status === "STAGING_COMPLETE") {
            return 'check';
        } else if (status === "STAGED") {
            return 'check';
        } else if (status === "SUBMITTING") {
            return 'terminal'
        } else if (status === "STAGING_JOB") {
            return 'terminal'
        } else if (status === "QUEUED") {
            return 'clock-o'
        } else if (status === "RUNNING") {
            return 'rocket'
        } else if (status === "CLEANING_UP") {
            return 'exclaimation';
        } else if (status === "ARCHIVING") {
            return 'exchange';
        } else if (status === "ARCHIVING_FINISHED") {
            return 'check';
        } else if (status === "ARCHIVING_FAILED") {
            return 'exclaimation';
        } else if (status === "FINISHED") {
            return 'check';
        } else if (status === "FAILED") {
            return 'exclaimation';
        } else if (status === "STOPPED") {
            return 'hand-stop-o';
        } else if (status === "PAUSED") {
            return 'exclaimation';
        } else {
            return 'rocket';
        }
    }
}]);