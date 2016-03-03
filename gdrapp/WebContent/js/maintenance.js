var maintCtrller = angular.module('maintCtrller', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.resizeColumns']);

maintCtrller.controller("FieldCtrl",['$scope', '$http', function($scope, $http) {
	var me = this;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'entity', displayName:"Entity", enableSorting: true },
		      { field: 'name', displayName: "Name", enableSorting: true },
		      { field: 'long_name', displayName: 'Long Name', width: 120 },
		      { field: 'description', displayName : 'Description' },
		      { field: 'data_category', displayName : 'Data Category', width: 150 },
		      { field: 'data_type', displayName : 'Data Type', width: 80 },
		      { field: 'length', displayName : 'Length', width: 60 },
		      { field: 'bb_field_id', displayName : 'BB Field ID', width: 80 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/fields.json').success(function(response) {
		me.gridOptions1.data = response;
		console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);

maintCtrller.controller("FieldLookupCtrl",['$scope', '$http', function($scope, $http) {
	var me = this;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'field', displayName:"Field", enableSorting: true },
		      { field: 'value', displayName: "Value", enableSorting: true },
		      { field: 'description', displayName : 'Description' },
		      { field: 'parent', displayName : 'Parent', width: 80 },
		      { field: 'grandparent', displayName : 'Grand', width: 80 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/field_lookups.json').success(function(response) {
		me.gridOptions1.data = response;
		console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);

maintCtrller.controller("FieldGroupCtrl",['$scope', '$http', function($scope, $http) {
	var me = this;
	
	me.gridOptions1 = {
		    enableSorting: true,
		    columnDefs: [
		      { field: 'entity', displayName:"Entity", enableSorting: true },
		      { field: 'name', displayName: "Name", enableSorting: true },
		      { field: 'long_name', displayName : 'Long Name', enableSorting: true },
		      { field: 'description', displayName : 'Description', enableSorting: true }
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	me.gridOptions1.data = [];

	$http.get('data/field_groups.json').success(function(response) {
		me.gridOptions1.data = response;
		console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
	});
}]);
