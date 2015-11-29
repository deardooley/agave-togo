AgaveToGo.config(['schemaFormDecoratorsProvider', function (decoratorsProvider) {
    decoratorsProvider.addMapping(
        'bootstrapDecorator',
        'wizard',
        'wizard.html'
    );
}]).
service('WizardHandler', ['$q', function ($q) {

    this.clone = function (obj) {
        var copy;
        if (null == obj || "object" != typeof obj) {
            return obj;
        }
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    this.validateTab = function (scope, tabIndex) {
        var dumpTabs = this.clone(scope.form[0].tabs);
        var dumpModel = this.clone(scope.model);
        for (var i = 0; i < scope.form[0].tabs.length; i++) {
            if (i > tabIndex) {
                scope.form[0].tabs[i].items = [];
            }
        }
        scope.$broadcast('schemaFormValidate');
        var deferred = $q.defer();
        setTimeout(function () {
            scope.form[0].tabs = dumpTabs;
            scope.model = dumpModel;
            if (scope.myForm.$valid) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }, 100);
        return deferred.promise;
    };

    this.activateTab = function (scope, tabIndex) {
        for (var i = 0; i < scope.form[0].tabs.length; i++) {
            var tab = scope.form[0].tabs[i];
            tab.active = (i == tabIndex);
        }
    };

    this.displayArrayButtons = function (form) {
        for (var k in form) {
            if (k == 'add' && form[k] === false) {
                form[k] = null;
            }
            if (k == 'remove' && form[k] === false) {
                form[k] = null;
            }
            if (typeof form[k] == "object" && form[k] !== null) {
                this.displayArrayButtons(form[k]);
            }
        }
    };

}]);
