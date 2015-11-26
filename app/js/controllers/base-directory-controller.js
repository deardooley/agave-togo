/**
 * This is the base controller for all resource collection editing views. It
 * bundles normal bulk crud operations, search, standard actions, and component
 * initialization into the parent for extension and reuse in the individual
 * implementation controllers.
 */
function BaseCollectionCtrl($timeout, $rootScope, $scope, $state, $stateParams, $q, Commons, ApiStub) {

  $scope.offset = $scope.offset || 0;
  $scope.limit = $scope.limit || 25;

  // this is the name of the resource variable. It will be used
  // to generically reference the bound variable without having
  // to change the templates.
  $scope._RESOURCE_NAME = $scope._RESOURCE_NAME || null;

  /**
   * Retrieves the resource id from the passed in state parameters.
   * This will represent the id of an editied resource.
   *
   * @returns integer null if creating a new resource.
   */
   $scope.getResourceId = $scope.getResourceId || function () {
    return $stateParams[$scope._RESOURCE_NAME + 'Id'];
  };

  $scope._COLLECTION_NAME = $scope._COLLECTION_NAME || null;

  /**
   * Id of the table bound to the resource.
   * @returns string of the form #COLLECTION_NAME-table
   */
  $scope.getTableId = $scope.getTableId || function() {
    return '#' + $scope._COLLECTION_NAME + '-table';
  };

  $scope.handleSuccess = $scope.handleSuccess || function(response) {

    console.log(response.data);

    $rootScope.$broadcast('event:content-loading-complete', "remote call success");
  };

  /**
   * Handles success responses to resource loading events.
   * This is called after the resource loads and should be where
   * any initialization occurs.
   * @param response object from the service
   */
  $scope.handleRefreshSuccess = $scope.handleRefreshSuccess || function(response) {

    $scope[$scope._COLLECTION_NAME] = response;

    console.log($scope[$scope._COLLECTION_NAME]);

    $timeout(function(){

      $scope.initModelListeners();

      var table = $('#datatable_collection');

      var tableContainer = table.parents(".table-container");

      // apply the special class that used to restyle the default datatable
      var tmp = $.fn.dataTableExt.oStdClasses;

      $.fn.dataTableExt.oStdClasses.sWrapper = $.fn.dataTableExt.oStdClasses.sWrapper + " dataTables_extended_wrapper";
      $.fn.dataTableExt.oStdClasses.sFilterInput = "form-control input-xs input-sm input-inline";
      $.fn.dataTableExt.oStdClasses.sLengthSelect = "form-control input-xs input-sm input-inline";

      var oTable = table.DataTable({

        // Internationalisation. For more info refer to http://datatables.net/manual/i18n
        "language": {
          "aria": {
            "sortAscending": ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
          },
          "emptyTable": "No " + $scope._COLLECTION_NAME + " found.",
          "info": "Showing _START_ to _END_ of _TOTAL_ entries",
          "infoEmpty": "No entries found",
          "infoFiltered": "(filtered1 from _MAX_ total entries)",
          "lengthMenu": "_MENU_ entries",
          "search": "Search:",
          "zeroRecords": "No matching records found"
        },

        // Or you can use remote translation file
        //"language": {
        //   url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Portuguese.json'
        //},

        buttons: [
          { extend: 'colvis', className: 'btn btn-transparent dark btn-outline', text: 'Columns'}
        ],

        // setup responsive extension: http://datatables.net/extensions/responsive/
        //responsive: true,

        "order": [
          [0, 'asc']
        ],

        "lengthMenu": [
          [10, 25, 50, 100, -1],
          [10, 25, 50, 100, "All"] // change per page values here
        ],
        // set the initial value
        "pageLength": 25,

        //"dom": "<'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-9'fB>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>", // horizobtal scrollable datatable

        // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
        // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.js).
        // So when dropdowns used the scrollable div should be removed.
        "dom": "<'row' <'col-md-12'T>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'Bf>r>t<'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>",
      });

      // revert back to default
      //$.fn.dataTableExt.oStdClasses.sWrapper = tmp.sWrapper;
      //$.fn.dataTableExt.oStdClasses.sFilterInput = tmp.sFilterInput;
      //$.fn.dataTableExt.oStdClasses.sLengthSelect = tmp.sLengthSelect;

      oTable.columns( '.extended' ).visible( false );

      // get table wrapper
      tableWrapper = table.parents('.dataTables_wrapper');

      // build table group actions panel
      if ($('.table-actions-wrapper', tableContainer).size() === 1) {
        $('.table-group-actions', tableWrapper).html($('.table-actions-wrapper', tableContainer).html()); // place the panel inside the wrapper
        $('.table-actions-wrapper', tableContainer).remove(); // remove the template container
      }
      // handle group checkboxes check/uncheck
      $('.group-checkable', table).change(function() {
        var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
        var checked = $(this).prop("checked");
        $(set).each(function() {
          $(this).prop("checked", checked);
        });
        $.uniform.update(set);
        countSelectedRecords();
      });

      // handle row's checkbox click
      table.on('change', 'tbody > tr > td:nth-child(1) input[type="checkbox"]', function() {
        countSelectedRecords();
      });

      // handle filter submit button click
      table.on('click', '.filter-submit', function(e) {
        e.preventDefault();
        the.submitFilter();
      });

      // handle filter cancel button click
      table.on('click', '.filter-cancel', function(e) {
        e.preventDefault();
        the.resetFilter();
      });
      //$(".DTTT_container").hide();
      //
      ////BEGIN CHECKBOX TABLE
      //$('.checkall').on('ifChecked ifUnchecked', function(event) {
      //    if (event.type == 'ifChecked') {
      //        $(this).closest('table').find('input[type=checkbox]').iCheck('check');
      //    } else {
      //        $(this).closest('table').find('input[type=checkbox]').iCheck('uncheck');
      //    }
      //});
      ////END CHECKBOX TABLE

      $rootScope.$broadcast('event:content-loading-complete', "loading success");

    },50);
  };

  /**
   * Handles failure behavior for promises returned from ApiStub
   * calls by this controller.
   *
   * @param {Object} response from the service
   */
   $scope.handleFailure = $scope.handleFailure || function(response) {
    $rootScope.$broadcast('event:content-loading-complete', "loading failed");

    if (response.code == 404 && $scope[$scope._COLLECTION_NAME] === null) {
      $state.go('frontend-404');
    } else {
      console.log("Error response from remote call: ");
      console.log(response);
      var msg = $scope.getErrorMessage(response);
      App.alert({
        type: 'danger',
        message: msg
      });
      $scope.handleRefreshSuccess([
        {
          "_links": {
            "self": {
              "href": "https://agave.iplantc.org/apps/v2/Picard_preprocess-1.98u1"
            }
          },
          "executionSystem": "stampede.tacc.utexas.edu",
          "id": "Picard_preprocess-1.98u1",
          "isPublic": true,
          "label": "Picard preprocess",
          "lastModified": "2015-11-24T17:10:26.000-06:00",
          "name": "Picard_preprocess",
          "revision": 1,
          "shortDescription": "Picard preprocess for variant calling",
          "version": "1.98"
        }
      ]);
    }
  };

  /** parses error resonse from the server and returns it in a standard
   * string format.
   */
  $scope.getErrorMessage = $scope.getErrorMessage || function(response) {
    if (response) {
      if (response.message) {
        return response.message;
      } else if (response.data) {
        if (response.data.message) {
          if (angular.isArray(response.data.message)) {
            return response.data.message;
          } else if (angular.isObject(response.data.message)) {
            return Commons.toArray(JSON.parse(response.data.message));
          } else {
            return response.data.message;
          }
        } else if (response.data.errors) {
          if (angular.isArray(response.data.errors)) {
            return response.data.errors;
          } else if (angular.isObject(response.data.errors)) {
            return Commons.toArray(JSON.parse(response.data.errors));
          } else {
            return response.data.errors;
          }
        } else {
          return JSON.stringify(response.data);
        }
      }
    }

    return "There was an error contacting the "+ $scope._COLLECTION_NAME + " service. If this " +
        "persists, please contact your system administrator.";
  };


  /***************************************************
   * Define scope functions for generic crud tasks
   ***************************************************/

  // This is the scope collection controlled by the child controller and
  // bound to the datatable
  $scope[$scope._COLLECTION_NAME] = [];


  /**
   * Refreshes the current view template and binds the collection obtained from
   * the API to the datatable.
   */
  $scope.refresh = $scope.refresh || function() {
    ApiStub['list' + Commons.capitalize($scope._COLLECTION_NAME, false)]($scope.limit, $scope.offset, { public: false })
        .then($scope.handleRefreshSuccess, $scope.handleFailure);
  };

  /**
   * Returns currently selected rows in the listing table.
   *
   * @returns {*|jQuery}
   */
  $scope.getSelectedRows = function() {
    "use strict";
    return $($scope.getTableId()).find('input.icheck[type=checkbox]:checked');
  };

  $scope.delete = function()
  {
    "use strict";
    var selectedRows = $scope.getSelectedRows();
    if (selectedRows.length)
    {
      var selectedItemNames = '';
      selectedRows.each(function(e) {
        selectedItemNames += '<li>' + $(this).parents('td').next('td').find('a:first-child').html() + '</li>';
      });

      var dlg = dialogs.confirm(
        'Confirm ' + $scope._RESOURCE_NAME + ' delete',
        '<p>Are you sure you want to delete the following ' + $scope._COLLECTION_NAME + '?</p><ul>' + selectedItemNames + '</ul>'
      );

      dlg.result.then(function (btn) {
        // carry out the actual deletion remotely
        $scope.doDelete(selectedRows);
      }, function (btn) {
        // nothing to do here, just ignore
      });
    }
    else
    {
      App.alert({
        type: 'danger',
        message: "No " + $scope._RESOURCE_NAME + " selected <br>" +
        "Please select a " + $scope._RESOURCE_NAME + " to delete"
      });
    }

  };

  /**
   * Deletes one or more rows in the datatable, syncronizing the delete
   * operations via API calls to the service.
   */
  $scope.doDelete = function(selectedRows)
  {
    var isSuccess = true;
    var that = this;

    var promises = [];
    var totalDeleted = 0;
    selectedRows.each(function(i, val) {

      promises.push(ApiStub.delete($(this).data('row-id')).then(
        function(response) {
          totalDeleted++;
          $(that).parent().parent().parent().remove();
          App.alert({message: "Successfully deleted " + totalDeleted + " " + $scope._COLLECTION_NAME + "."});
        },
        function(message, response) {
          isSuccess = false;
          App.alert({
            type: 'danger',
            message: "Error deleting " + $scope._RESOURCE_NAME + " " + $(that).data('row-id') + "<br>" + message,
          });
        }));
    });

    var deferred = $q.all(promises).then(
      function(result) {
        App.alert({message: "Successfully deleted " + $scope._RESOURCE_NAME + "(s)."});
        $scope.refresh();
      },
      function(message, result) {
        App.alert({
          type: 'danger',
          message: 'Failed to delete one or more ' + $scope._COLLECTION_NAME + '.'
        });
        $scope.refresh();
      });

    return deferred.promise;
  };

  $scope.edit = function() {
    var selectedRows = $scope.getSelectedRows();
    if (selectedRows.length)
    {
      var firstRow = selectedRows.first();
      //$state.go($scope._COLLECTION_NAME + '-edit({' + $scope._RESOURCE_NAME + 'Id:' + firstRow.data('row-id') + '})');
      firstRow.parents('td').next('td').find('a:first-child').click();
    }
    else
    {
      App.alert({
        type: 'danger',
        message: "No " + $scope._RESOURCE_NAME + " selected <br>" +
          "Please select a " + $scope._RESOURCE_NAME + " to edit"
      });
    }
  };

  $scope.view = function () {
    var selectedRows = $scope.getSelectedRows();
    if (selectedRows.length) {
      var firstRow = selectedRows.first();
      $state.go($scope._COLLECTION_NAME + '-edit({' + $scope._RESOURCE_NAME + 'Id:' + firstRow.data('row-id') + '})');
    }
    else {
      App.alert({
        type: 'danger',
        message: "No " + $scope._RESOURCE_NAME + " selected <br>" +
        "Please select a " + $scope._RESOURCE_NAME + " to view"
      });
    }
  };


  /***************************************************
   * Init common components
   ***************************************************/

  /**
   * Callback from the promise of the refresh event. Add event bindings, etc in
   * here that need to be called after the resource is fetched and data bound.
   */
  $scope.initModelListeners = $scope.initModelListeners || function() {
  };

  /**
   * Callback to filter input prior to submission. This should operate on the
   * state and/or bound resource itself as the returned value is disregarded.
   */
  $scope.filterBeforeSubmit = $scope.filterBeforeSubmit || function() {
  };

  // fetch the resource from the api to load into the form or
  // create a new empty resource and load that.
  $scope.refresh();
}
