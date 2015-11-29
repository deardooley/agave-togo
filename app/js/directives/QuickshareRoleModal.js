/**
 * Directive for editing system roles
 */
AgaveToGo.directive('quickshareRoleModal', function($timeout, SystemsController) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            system: '=ngModel',
        },
        templateUrl: '../app/tpl/directives/quickshare-role-modal.html',
        link: function ($scope, elem, attrs) {

            $scope.systemRoles = [];

            var clearRoles = function() {
                $scope.systemRoles = [];
            };

            var refresh = function() {
                SystemsController.listSystemRoles($scope.system.id, 99999, 0).then(
                    function(response) {
                        $timeout(function () {
                            $scope.systemRoles = response;
                        }, 50);
                    },
                    function(data) {
                        console.log(data);
                        App.alert({
                            type: 'danger',
                            message: "There was an error contacting the systems service. if this " +
                            "persists, please contact your system administrator.",
                        });
                    });
            };

            $scope.addNewRow = function(addressType) {
                $scope.systemRoles.push(new SystemRoleRequest());

                // check whether we can re-eneable selection
                // and update the + new address option minus
                // the added address type
                $timeout(function() {
                    $(attributes.$$element).find('.addRole').attr('disabled','disabled');
                }, 0);
            };

            $scope.removeExistingRow = function(role) {

                if (role._links) {
                    SystemsController.deleteSystemRole($scope.system.id, username).then(
                        function (response) {
                            refresh();

                            $timeout(function() {
                                if ($scope.systemRoles.length < 2) {
                                    $(attributes.$$element).find('.remove-role').attr('disabled','disabled');
                                }
                            }, 0);
                        },
                        function (response) {
                            console.log(data);
                            App.alert({
                                type: 'danger',
                                message: "There was an error deleting the role for " + username +
                                " on " + system.name + ". If this persists, please contact " +
                                "your system administrator.",
                            });
                        }
                    );
                } else {
                    for (var i = 0; i < $scope.systemRoles.length; i++) {
                        if ($scope.systemRoles[i].username == username) {
                            delete $scope.systemRoles[i];
                        }
                    }
                }
            };

            $scope.saveAllRoles = function() {
                var isSuccess = true;
                var that = this;

                var promises = [];
                var totalAdded = 0;
                for (var i = 0; i <  $scope.systemRoles.length; i++) {
                    var role = $scope.systemRoles[i];

                    promises.push(SystemsController.updateSystemRole(role, $scope.system.id).then(
                        function (response) {
                            totalAdded++;
                            console.log("Updated user role for " +  response.username + " on " + $scope.system.id
                                    + " to " + response.role);
                        },
                        function (response) {
                            isSuccess = false;
                            console.log(response);
                            App.alert({
                                type: 'danger',
                                message: "Error updating role for " +  response.username + " on " + $scope.system.id
                                    + " to " + response.role + ". " + response
                            });
                        }));
                }

                var deferred = $q.all(promises).then(
                    function(result) {
                        App.alert({message: "Successfully updated user roles on system " + $scope.system.name});
                        $('#quickshare-role-modal').modal('hide');
                    },
                    function(message, result) {
                        console.log(message);
                        App.alert({
                            type: 'danger',
                            message: message
                        });
                    });

                return deferred.promise;
            }

            $('#quickshare-role-modal').on('show.bs.modal', function() {
                $timeout(function () {
                    clearRoles();
                    refresh();
                }, 0);
            });

            $('#quickshare-role-modal').on('hide.bs.modal', function() {
                $timeout(function () {
                    clearRoles();
                }, 0);
            });

        }
    };
});