(function(angular) {
    "use strict";
    var app = angular.module('FileManagerApp');

    app.filter('strLimit', ['$filter', function($filter) {
        return function(input, limit) {
            if (input.length <= limit) {
                return input;
            }
            return $filter('limitTo')(input, limit) + '...';
        };
    }]);

    app.filter('formatDate', ['$filter', function($filter) {
        return function(input, limit) {
            return input instanceof Date ?
                input.toISOString().substring(0, 19).replace('T', ' ') :
                (input.toLocaleString || input.toString).apply(input);
        };
    }]);

    app.filter('fileIcon', ['$filter', function($filter) {
        return function(fname) {
            var extensionIcons = {
                'parentdir': 'fa-level-up fa-flip-horizontal',
                'xls': 'fa-file-excel-o',
                'xlsx': 'fa-file-excel-o',
                'doc': 'fa-file-word-o',
                'docx': 'fa-file-word-o',
                'ppt': 'fa-file-powerpoint-o',
                'pptx': 'fa-file-powerpoint-o',
                'pdf': 'fa-file-pdf-o',
                'mpg4': " ",
                'hqx': 'fa-file-archive-o',
                'cpt': 'fa-file-archive-o',
                'csv': 'fa-file-code-o',
                'bin': 'fa-file-exe-o',
                'dms': '',
                'lha': '',
                'lzh': '',
                'exe': 'fa-file-exe-o',
                'class': 'fa-file-code-o',
                'psd': '',
                'so': '',
                'sea': '',
                'dll': 'fa-file-exe-o',
                'oda': '',
                'ai': '',
                'eps': '',
                'ps': '',
                'smi': '',
                'smil': '',
                'mif': 'fa-file-code-o',
                'wbxml': 'fa-file-code-o',
                'wmlc': 'fa-file-code-o',
                'dcr': 'fa-file-movie-o',
                'dir': 'fa-file-movie-o',
                'dxr': 'fa-file-movie-o',
                'dvi': 'fa-file-movie-o',
                'gtar': 'fa-file-archive-o',
                'gz': 'fa-file-archive-o',
                'php': 'fa-file-code-o',
                'php4': 'fa-file-code-o',
                'php3': 'fa-file-code-o',
                'phtml': 'fa-file-code-o',
                'phps': 'fa-file-code-o',
                'js': 'fa-file-code-o',
                'swf': 'fa-file-code-o',
                'sit': 'fa-file-archive-o',
                'tar': 'fa-file-archive-o',
                'tgz': 'fa-file-archive-o',
                'xhtml': 'fa-file-code-o',
                'xht': 'fa-file-code-o',
                'zip': 'fa-file-zip-o',
                'mid': 'fa-file-audio-o',
                'midi': 'fa-file-audio-o',
                'mpga': 'fa-file-audio-o',
                'mp2': 'fa-file-audio-o',
                'mp3': 'fa-file-audio-o',
                'aif': 'fa-file-audio-o',
                'aiff': 'fa-file-audio-o',
                'aifc': 'fa-file-audio-o',
                'ram': 'fa-file-audio-o',
                'rm': 'fa-file-audio-o',
                'rpm': 'fa-file-audio-o',
                'ra': 'fa-file-audio-o',
                'rv': 'fa-file-movie-o',
                'wav': 'fa-file-audio-o',
                'bmp': 'fa-file-image-o',
                'gif': 'fa-file-image-o',
                'jpeg': 'fa-file-image-o',
                'jpg': 'fa-file-image-o',
                'jpe': 'fa-file-image-o',
                'png': 'fa-file-image-o',
                'tiff': 'fa-file-image-o',
                'tif': 'fa-file-image-o',
                'css': 'fa-file-code-o',
                'html': 'fa-file-code-o',
                'htm': 'fa-file-code-o',
                'shtml': 'fa-file-code-o',
                'txt': 'fa-file-text-o',
                'text': 'fa-file-text-o',
                'log': 'fa-file-text-o',
                'rtx': 'fa-file-text-o',
                'rtf': 'fa-file-text-o',
                'xml': 'fa-file-code-o',
                'xsl': 'fa-file-code-o',
                'mpeg': 'fa-file-movie-o',
                'mpg': 'fa-file-movie-o',
                'mpe': 'fa-file-movie-o',
                'qt': 'fa-file-movie-o',
                'mov': 'fa-file-movie-o',
                'avi': 'fa-file-movie-o',
                'movie': 'fa-file-movie-o',
                'eml': '',
                'json': 'fa-file-code-o'
            };
            var extension = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);

            if (extension) {
                var iconClass = extensionIcons[extension.toLowerCase()];
                return iconClass ? iconClass : 'fa-file-o';
            } else {
                return 'fa-file-o';
            }
        };
    }])


    app.filter('codeMirrorEditorMode', ['$filter', function($filter) {
        return function(fname) {
            var editorModeMap = {
                "groovy": "groovy",
                "ini": "properties",
                "properties": "properties",
                "css": "css",
                "scss": "css",
                "html": "htmlmixed",
                "htm": "htmlmixed",
                "shtm": "htmlmixed",
                "shtml": "htmlmixed",
                "xhtml": "htmlmixed",
                "cfm": "htmlmixed",
                "cfml": "htmlmixed",
                "cfc": "htmlmixed",
                "dhtml": "htmlmixed",
                "xht": "htmlmixed",
                "tpl": "htmlmixed",
                "twig": "htmlmixed",
                "hbs": "htmlmixed",
                "handlebars": "htmlmixed",
                "kit": "htmlmixed",
                "jsp": "htmlmixed",
                "aspx": "htmlmixed",
                "ascx": "htmlmixed",
                "asp": "htmlmixed",
                "master": "htmlmixed",
                "cshtml": "htmlmixed",
                "vbhtml": "htmlmixed",
                "ejs": "htmlembedded",
                "dust": "htmlembedded",
                "erb": "htmlembedded",
                "jade": "jade",
                "js": "javascript",
                "jsx": "javascript",
                "jsm": "javascript",
                "_js": "javascript",
                "vbs": "vbscript",
                "vb": "vb",
                "json": "javascript",
                "xml": "xml",
                "svg": "xml",
                "wxs": "xml",
                "wxl": "xml",
                "wsdl": "xml",
                "rss": "xml",
                "atom": "xml",
                "rdf": "xml",
                "xslt": "xml",
                "xsl": "xml",
                "xul": "xml",
                "xbl": "xml",
                "mathml": "xml",
                "config": "xml",
                "plist": "xml",
                "xaml": "xml",
                "php": "php",
                "php3": "php",
                "php4": "php",
                "php5": "php",
                "phtm": "php",
                "phtml": "php",
                "ctp": "php",
                "c": "clike",
                "h": "clike",
                "i": "clike",
                "cc": "clike",
                "cp": "clike",
                "cpp": "clike",
                "c++": "clike",
                "cxx": "clike",
                "hh": "clike",
                "hpp": "clike",
                "hxx": "clike",
                "h++": "clike",
                "ii": "clike",
                "ino": "clike",
                "cs": "clike",
                "asax": "clike",
                "ashx": "clike",
                "java": "clike",
                "scala": "clike",
                "sbt": "clike",
                "coffee": "coffeescript",
                "cf": "coffeescript",
                "cson": "coffeescript",
                "_coffee": "coffeescript",
                "clj": "clojure",
                "cljs": "clojure",
                "cljx": "clojure",
                "pl": "perl",
                "pm": "perl",
                "rb": "ruby",
                "ru": "ruby",
                "gemspec": "ruby",
                "rake": "ruby",
                "py": "python",
                "pyw": "python",
                "wsgi": "python",
                "sass": "sass",
                "lua": "lua",
                "sql": "sql",
                "diff": "diff",
                "patch": "diff",
                "md": "markdown",
                "markdown": "markdown",
                "mdown": "markdown",
                "mkdn": "markdown",
                "yaml": "yaml",
                "yml": "yaml",
                "hx": "haxe",
                "sh": "shell",
                "command": "shell",
                "bash": "shell"
            };

            var extension = fname.substr((~-fname.lastIndexOf(".") >>> 0) + 2);

            if (extension) {
                var editorMode = editorModeMap[extension.toLowerCase()];
                return editorMode ? editorMode : '';
            } else {
                return '';
            }
        };
    }]);

    app.filter('humanReadableFileSize', ['$filter', 'fileManagerConfig', function($filter, fileManagerConfig) {
      var decimalByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
      var binaryByteUnits = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

      return function(input) {
      var i = -1;
      var fileSizeInBytes = input;

      do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
      } while (fileSizeInBytes > 1024);

      var result = fileManagerConfig.useBinarySizePrefixes ? binaryByteUnits[i] : decimalByteUnits[i];
        return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + result;
      };
    }])
    .filter('humanSize', function () {
        return function (size, precision, plainText) {

            if (precision === 0 || precision === null) {
                precision = 1;
            }
            if (size === 0 || size === null) {
                return "0B";
            }
            else if (!isNaN(size)) {
                var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
                var posttxt = 0;

                if (size < 1024) {
                    if (plainText) {
                        return Number(size) + sizes[posttxt];
                    } else {
                        return Number(size) + '<font class="units">' + sizes[posttxt] + '</font>';
                    }
                }
                while (size >= 1024) {
                    posttxt++;
                    size = size / 1024;
                }

                var power = Math.pow(10, precision);
                var poweredVal = Math.ceil(size * power);

                size = poweredVal / power;

                if (plainText) {
                    return size + sizes[posttxt];
                } else {
                    return size + '<font class="units">' + sizes[posttxt] + '</font>';
                }
            } else {
                return "";
            }

        };
    });

    app.filter('humanReadableFileSize', ['$filter', 'fileManagerConfig', function($filter, fileManagerConfig) {
        var decimalByteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
        var binaryByteUnits = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        return function(input) {
            var i = -1;
            var fileSizeInBytes = input;

            do {
                fileSizeInBytes = fileSizeInBytes / 1024;
                i++;
            } while (fileSizeInBytes > 1024);

            var result = fileManagerConfig.useBinarySizePrefixes ? binaryByteUnits[i] : decimalByteUnits[i];
            return Math.max(fileSizeInBytes, 0.1).toFixed(1) + ' ' + result;
        };
    }])

    .filter('hasDirectories', function ($filter) {
        return function (fileList) {
            var hasDirectories = false;
            angular.forEach(fileList, function(fileItem, iter) {
                if (fileItem.path) {
                    hasDirectories = true;
                    return false;
                }
            });

            return hasDirectories;
        };
    })

    /**
     * @type {module}
     * @description
     * Filters an array of objects based on one or more matching properties
     */
    .filter('deepPropertyFilter', function ($log) {

        // Gets the value at any depth in a nested object based on the
        // path described by the keys given. Keys may be given as an array
        // or as a dot-separated string.
        // taken from underscore.contrib
        function getPath(obj, ks) {
            if (typeof ks == "string") ks = ks.split(".");

            // If we have reached an undefined property
            // then stop executing and return undefined
            if (obj === undefined) return void 0;

            // If the path array has no more elements, we've reached
            // the intended property and return its value
            if (ks.length === 0) return obj;

            // If we still have elements in the path array and the current
            // value is null, stop executing and return undefined
            if (obj === null) return void 0;

            return getPath(obj[_.first(ks)], _.rest(ks));
        }

        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                var strippedProps = {};
                var propKeys = Object.keys(props);

                // iterate over the properties, stripping spaces and forcing lowercase
                propKeys.forEach(function (propKey) {
                    var propVal = props[propKey] || '';
                    strippedProps[propKey] = propVal.toString().toLowerCase().replace(/ /g, '');
                });

                // check for matches for the property paths in the array of items
                return _.filter(items, function (item) {
                    var itemMatches = false;
                    return _.some(strippedProps, function (propVal, propKey) {
                        var itemVal = getPath(item, propKey) || '';
                        itemVal = itemVal.toString().toLowerCase().replace(/ /g, '');

                        if (itemVal.indexOf(propVal) !== -1) {
                            return true;
                            // // break the circuit and exit the loop on first match
                            // return false;
                        }
                    });
                    // // this will be true if a match was found.
                    // return itemMatches;

                });
            }
            else {
                out = items;
            }

            return out;
        };
    })

    /**
     * @type {module}
     * @description
     * Filters an array of objects based on one or more matching properties
     */
    .filter('propertyFilter', function ($log, $filter) {

        return function (items, props) {
            var out = [];
            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;
                    var keys = Object.keys(props);
                    var optionValue = '';
                    for (var i = 0; i < keys.length; i++) {
                        optionValue = item[keys[i]] ? optionValue + item[keys[i]].toString().toLowerCase().replace(/ /g, '') : '';
                    }
                    for (var j = 0; j < keys.length; j++) {

                        var text = props[keys[j]].toLowerCase().replace(/ /g, '');
                        if (optionValue.indexOf(text) !== -1) {
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
    });;

})(angular);
