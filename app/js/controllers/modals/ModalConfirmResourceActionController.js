angular.module('AgaveToGo').controller('ModalConfirmResourceActionController', function ($scope, $modalInstance, resourceNames, resourceAction)
{
    $scope.ok = function()
    {
        $modalInstance.close($scope.resourceNames);
    };
    $scope.cancel = function()
    {
        $modalInstance.dismiss('cancel');
    };
});