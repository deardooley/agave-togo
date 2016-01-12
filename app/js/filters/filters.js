AgaveToGo.filter('propsFilter', function () {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
})
.filter('isOwner', function () {
    return function (username) {
        return Apps.getAuthenticatedUserProfile().username === username;
    }
})
.filter('getAbsoluteAgaveSystemPath', [ '$localStorage', function($localStorage) {
    return function(system) {
        var path = "";
        if (system.storage.homeDir) {
            path = system.storage.homeDir;
        }
        if (system.public) {
            path = "/" + $localStorage.activeProfile.username;
        }
        return path;
    }
}])
;