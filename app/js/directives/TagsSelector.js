AgaveToGo.directive('tagSelector', function ($parse, Tags) {
    return {
        restrict: 'A',
        scope: {
            'val': '=ngModel',
            'selectedTag': '&addTag'
        },
        link: function (scope, elem, attrs) {

            var content = '';
            var placeholder = attributes.placeholder || 'Enter a tag';

            $(attributes.$$element).select2({
                minimumInputLength: 3,
                style: 'btn-white',
                showSubtext: true,
                searchInputPlaceholder: placeholder,
                multiple: (attributes.multiple ? true : false),
                tags: true,
                ajax: {
                    quietMillis: 250,
                    data: function (term, pageNumber, context) {
                        return {q: term};
                    },
                    transport: function (params) {
                        if (params.data.q) {
                            return Tags.list(99999, 0, {name: params.data.q}).then(params.success);
                        } else {
                            return Tags.list(99999, 0).then(params.success);
                        }
                    },
                    results: function (response, pageNumber, query) {
                        console.log(response.data);

                        var matches = [];
                        angular.forEach(response.data, function (item, key) {
                            this.push({id: item.id, text: item.name});
                        }, matches);

                        return {results: matches};
                    },
                    params: {
                        type: "GET",
                        cache: false,
                        dataType: "json"
                    }
                },
                formatSelection: function (object, container) {
                    var txt;
                    if (object.text) {
                        txt = object.text;
                    } else {
                        txt = object.name;
                    }
                    return '<span title="' + txt + '">' + txt + '</span>';
                }
                //initSelection: function (element, callback) {
                //
                //    if (element.val()) {
                //
                //        var initialElementVal = JSON.parse(element.val());
                //
                //        console.log(initialElementVal);
                //        if (angular.isArray(initialElementVal)) {
                //            callback(initialElementVal);
                //        }
                //        else if (angular.isObject(initialElementVal)) {
                //            console.log("Setting initial value " + initialElementVal.id + " => " + initialElementVal.name + " to select2 element");
                //            callback(initialElementVal);
                //        }
                //        else {
                //            console.log("Looking up initial value " + initialElementVal + " for select2 element");
                //            Tags.getTag(initialElementVal).then(
                //                function (response) {
                //                    console.log(response.data);
                //                    callback(response.data);
                //                });
                //        }
                //    } else {
                //        console.log("Skipping initialization. No initial tag value");
                //        callback(null);
                //    }
                //}
            })
            .select2('data', []);

            //A select2 visually resembles a textbox and a dropdown.  A textbox when
            //unselected (or searching) and a dropdown when selecting. This code makes
            //the dropdown portion reflect an error if the textbox portion has the
            //error class. If no error then it cleans itself up.
            $(document).on("select2-opening", function (arg) {
                var elem = $(arg.target);
                if ($("#s2id_" + elem.attr("id")).parent().parent().hasClass("state-error")) {
                    //jquery checks if the class exists before adding.
                    $(".select2-drop-active").addClass("state-error");
                } else {
                    $(".select2-drop-active").removeClass("state-error");
                }
            });

            // // Create re-useable compile function to refresh the directive when
            // // the bound value changes for whatever reason. This is important as
            // // this directive will often not recieve its value until after the
            // // ajax call processes in the parent controller.
            var compile = function (directiveHtml) {
                directiveHtml = $compile($(attributes.$$element))($scope); // Compile html
                //$(attributes.$$element).html('').append(directiveHtml); // Clear and append it
            };

            $scope.$watch('val', function (directiveHtml) { // Watch for changes to the bound value
                // the value changes, recompile
                if (directiveHtml) {
                    compile(directiveHtml);
                }
            });
        }
    };
});