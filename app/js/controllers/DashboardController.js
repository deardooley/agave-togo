angular.module('AgaveToGo').controller('DashboardController', function($rootScope, $scope, $http, $timeout, $filter, Commons, JobsController, SystemsController, StatusIoController, moment, amMoment) {
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
                img: '../assets/pages/media/users/avatar' + (i%10 + 1) + '.jpg',
                name: firstName + ' ' + lastName,
                firstName: firstName,
                lastName: lastName,
                username: faker.internet.userName(),
                created: faker.date.recent(14)
            });
        }

        return users;
    };

    $scope.fakeUsers = usergen(20);

    var projectStatGen = function(count, numberOfDays) {
        var leaders = [];
        angular.forEach(usergen(count), function (leader, i) {
            leader.comments = Commons.randomInt(5,200) * numberOfDays;
            leader.jobs = Commons.randomInt(5,200) * numberOfDays;
            leader.documents = Commons.randomInt(5,200) * numberOfDays;
            leader.karma = Commons.randomInt(60,99);
            leaders.push(leader);
        });

        var userCount = 0;
        var userSignups = [];
        var dataPoints = 12;

        for (var i=0; i<numberOfDays; i++) {
            var dailyUsers = Commons.randomInt(1, 20);
            //if (numberOfDays > 30) {
            //    userSignups[Math.ceil(i / dataPoints)] = dailyUsers;
            //} else if (numberOfDays > 7) {
            //    userSignups[Math.ceil(i / dataPoints)] = dailyUsers;
            //} else {
            //    userSignups.push(dailyUsers);
            //}
            userCount += dailyUsers;
        }

        for (var i=0; i<dataPoints; i++) {
            userSignups.push(Commons.randomInt(1, 20));
        }

        var totals = {
            users: userCount,
            signups: userSignups,
            comments:  Math.ceil(Commons.sum(leaders, 'comments') * userCount / 10 ),
            jobs:  Math.ceil(Commons.sum(leaders, 'jobs') * userCount / 10 ),
            documents:  Math.ceil(Commons.sum(leaders, 'documents') * userCount / 10 ),
            karma: Commons.randomInt(60,99)
        };

        return {
            totals: totals,
            leaders: leaders
        };
    }
    $scope.projectStatsTimeframe = 'daily';

    $scope.projectLeaders = {
        daily: projectStatGen(4, 1),
        weekly: projectStatGen(4, 7),
        monthly: projectStatGen(4, 30),
        alltime: projectStatGen(4, 365)
    };

    $("#project_sparkline_total").sparkline($scope.projectLeaders.alltime.totals.signups, {
        type: 'bar',
        width: '100',
        barWidth: 5,
        height: '55',
        barColor: '#ffb848',
        negBarColor: '#e02222'
    });

    $("#project_sparkline_day").sparkline($scope.projectLeaders.daily.totals.signups, {
        type: 'bar',
        width: '100',
        barWidth: 5,
        height: '55',
        barColor: '#35aa47',
        negBarColor: '#e02222'
    });

    $("#project_sparkline_week").sparkline($scope.projectLeaders.weekly.totals.signups, {
        type: 'bar',
        width: '100',
        barWidth: 5,
        height: '55',
        barColor: '#ffb848',
        negBarColor: '#e02222'
    });

    $("#project_sparkline_month").sparkline($scope.projectLeaders.monthly.totals.signups, {
        type: 'bar',
        width: '100',
        barWidth: 5,
        height: '55',
        barColor: '#35aa47',
        negBarColor: '#e02222'
    });



    JobsController.getJobHistory('3679479586933314021-e0bd34dffff8de6-0001-007', 15).then(
        function(data) {
            $timeout(function() {
                $scope.jobHistory = data;
            }, 50);
        },
        function(data) {
            console.log("unable to fetch job history");
            console.log(data);
        });

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