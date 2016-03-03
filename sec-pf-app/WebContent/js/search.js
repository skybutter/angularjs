//var searchController = angular.module('searchController', ['ngAnimate', 'ngTouch', 'ui.grid','ui.grid.edit', 'ui.grid.resizeColumns']);
//var searchController = angular.module('searchController', ['ui.grid', 'ui.grid.selection']);

//searchController.config(["$httpProvider", function ($httpProvider) {
//    $httpProvider.defaults.transformResponse.push(function(responseData){
//       convertDateStringsToDates(responseData);
//       return responseData;
//   });
//}]);

//searchController.controller('SecuritySearchCtrl', ['$scope', '$http', '$location', 'uiGridConstants', function($scope, $http, uiGridConstants, $location) {
gdr.controller('SecuritySearchCtrl', ['$scope', '$http', '$location', 'uiGridConstants','sessionService', function($scope, $http, uiGridConstants, $location, sessionService) {
	var me = this;
    // Check and restore previous search parameters
	var param = sessionService.getSecurityParams();
	if (param === null) {
		console.log("param is null.  initialize me.securityParams.");
		me.securityParams = {
				asset_id : null,
				name : "",
				issuer_name : "",
				bb_name : "",
				coupon : "",
				active_only : false,
				partial_asset_id : true,
				id_type : ""
		};		
	} else {
		console.log("param is NOT null.  initialize me.securityParams = param.");
		me.securityParams = param;
	}	
//	console.log("me.securityParams=" + JSON.stringify(me.securityParams));

	me.gridOptions1 = {
		    enableSorting: true,
		    showFooter: false,
		    multiSelect: false,
		    enableRowSelection: true,
		    enableFullRowSelection: false,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'asset_id', name:"Asset ID", enableCellEdit: false, width: 100 },
		      { field: 'id_context', name:"ID Context", enableCellEdit: false, width: 100 },
		      { field: "issuer", name: 'Issuer', width: 200 },
		      { field: 'name', name: 'Sec Name', enableSorting: false, enableCellEdit: false },
		      { field: 'coupon', name: 'Coupon', enableCellEdit: false, width : 80 }, 
		      { field: 'maturity_date', name:'Maturity Dt', width: 100 }
		    ],
		    onRegisterApi: function( gridApi ) {
		      me.grid1Api = gridApi;
		      // Note:
		  	  // $location is not available in this controller, even though it is specified in controller argument
		      // Using the goNext() defined in the app.js $scope
		      gridApi.selection.on.rowSelectionChanged($scope, function(row){
		    	  console.log("Going to security_id=" + row.entity.security_id );
		    	  $scope.goNext('/security/' + row.entity.security_id);
		      });
		    }
		  };
	// Check and restore previous search results
	var results = sessionService.getSecurityResults();
	if (results === null) {
		console.log("results is null.");		
	} else {
		console.log("result is NOT null.  initialize me.gridOptions1.data = results.");
		//console.log("gridOptions1.data=" + JSON.stringify(results));
		me.gridOptions1.data = results;
	}

	me.search = function() {
		sessionService.setSecurityParams(me.securityParams);
	     //updateData();
		searchSecurity();
	};
	
	me.clear = function() {
		me.gridOptions1.data = [];
		me.securityParams = {
				asset_id : null,
				name : "",
				issuer_name : "",
				bb_name : "",
				coupon : "",
				active_only : false,
				partial_asset_id : true,
				id_type : ""
		};
		sessionService.setSecurityResults([]);
		sessionService.setSecurityParams(me.securityParams);
	};
	
//	updateData = function(){
//		$http.get('data/search_security_results.json').success(function(response) {
//			me.gridOptions1.data = response;
//			//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
//		});
//	}
	
	searchSecurity = function() {
		console.log("search params=" + JSON.stringify(me.securityParams));
		$http({
			method : 'GET',		// Change this to POST for real server.
			url : 'data/search_security_results.json',
			data : me.securityParams
		}).success(function(response) {
			//console.log("characteristics=" + JSON.stringify(response));
			//me.ids = response;
			//$scope.gridOptions1.data = response;
			me.gridOptions1.data = response;
			//console.log("gridOptions1.data=" + JSON.stringify(me.gridOptions1.data));
			sessionService.setSecurityResults(me.gridOptions1.data);
		})
	};
}]);

//searchController.controller('PfSearchCtrl', ['$scope', '$http', 'uiGridConstants', function($scope, $http, uiGridConstants) {
gdr.controller('PfSearchCtrl', ['$scope', '$http', 'uiGridConstants','sessionService', function($scope, $http, uiGridConstants, sessionService) {
	var me = this;

	// Check and restore previous search parameters
	var param = sessionService.getPfParams();
	if (param === null) {
		console.log("param is null.  initialize me.params.");
		me.params = {
				pf_num : "",
				name : "",
				description : "",
				style : "",
				derivative : "",
				international : ""
		};
	} else {
		console.log("param is NOT null.  initialize me.params = param.");
		me.params = param;
	}	
	
	me.gridOptions1 = {
		    enableSorting: true,
		    enableRowSelection: false,
		    enableFullRowSelection: false,
		    multiSelect: false,
		    columnDefs: [
		      //{ field: 'security_id' },
		      { field: 'pf_num', displayName:'Pf Number', enableCellEdit: false, width: 95, type : 'string',
		    	  cellTemplate: '<div class="ui-grid-cell ui-grid-cell-contents" ng-click="grid.appScope.openPortfolio(row.entity.pf_num)">{{row.entity.pf_num}}</div>'},
		      { field: 'name', displayName:'Pf Name', enableCellEdit: false, width: 250 },
		      { field: 'description', displayName: 'Pf Description' },
		      { name:' ', cellTemplate:'<button class="btn primary" ng-click="grid.appScope.showMe({{row.entity.pf_num}})"><i class="glyphicon glyphicon-pencil"></button>', width: 40}
		    ],
		    onRegisterApi: function( gridApi ) {
		      //$scope.grid1Api = gridApi;
		      me.grid1Api = gridApi;
		    }
		  };
	// Check and restore previous search results
	var results = sessionService.getPfResults();
	if (results === null) {
		console.log("results is null.");		
	} else {
		console.log("result is NOT null.  initialize me.gridOptions1.data = results.");
		//console.log("gridOptions1.data=" + JSON.stringify(results));
		me.gridOptions1.data = results;
	}

	$scope.showMe = function(pfNum){
		console.log("showMe clicked pfNum=" + pfNum );
		$scope.goNext('/portfolio/' + pfNum);
    };
    
    $scope.openPortfolio = function(pfNum){
		console.log("portfolio=" + pfNum );
		$scope.goNext('/portfolio/' + pfNum);
    };
    
	me.search = function() {
		sessionService.setPfParams(me.params);
	     //updateData();
		searchPf();
	};
	
	me.clear = function() {
		me.gridOptions1.data = [];
		me.params = {
				pf_num : "",
				name : "",
				description : "",
				style : "",
				derivative : "",
				international : ""
		};
		sessionService.setPfResults([]);
		sessionService.setPfParams(me.securityParams);		
	};
	
//	updateData = function(){
//		$http.get('data/search_pf_results.json').success(function(response) {
//			me.gridOptions1.data = response;
//		});
//	}
	
	searchPf = function() {
		console.log("search params=" + JSON.stringify(me.params));
		$http({
			method : 'GET',		// Change this to POST for real server.
			url : 'data/search_pf_results.json',
			data : me.params
		}).success(function(response) {
			//console.log("characteristics=" + JSON.stringify(response));
			//$scope.gridOptions1.data = response;
			me.gridOptions1.data = response;
			sessionService.setPfResults(me.gridOptions1.data);
		})
	};
}]);
