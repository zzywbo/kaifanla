
var app = angular.module('kaifanla',['ng','ngRoute']);

app.config(function ($routeProvider) {

//  添加路由
  $routeProvider
    .when('/start',{
      templateUrl:'tpl/start.html',
      controller:'startCtrl'
    })
    .when('/main',{
      templateUrl:'tpl/main.html',
      controller:'mainCtrl'
    })
    .when('/detail',{
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .when('/detail/:id',{
      templateUrl:'tpl/detail.html',
      controller:'detailCtrl'
    })
    .when('/order',{
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .when('/order/:id',{
      templateUrl:'tpl/order.html',
      controller:'orderCtrl'
    })
    .when('/myOrder',{
      templateUrl:'tpl/myOrder.html',
      controller:'myOrderCtrl'
    })
    .otherwise({redirectTo:'/start'});
})

app.controller('parentCtrl',
  ['$scope','$location', function ($scope,$location) {

    $scope.jump = function (arg) {
      $location.path(arg);
    }

}]);


app.controller('startCtrl',
  ['$scope', function ($scope) {

}]);

app.controller('mainCtrl',
  ['$scope','$http', function ($scope,$http) {
      $scope.hasMore = true;
      $http.get('data/dish_getbypage.json')
        .success(function (data) {
          $scope.dishList = data;
        })

      $scope.loadMore = function () {
        $http
          .get('data/dish_getbypage02.json')
          .success(function (data) {
            $scope.dishList = $scope.dishList.concat(data);
            if(data.length < 5)
            {
              $scope.hasMore = false;
            }
          })
      }

      $scope.$watch('kw', function () {
        if($scope.kw)
        {
          $http
            .get('data/dish_getbykw.json')
            .success(function (data) {
              $scope.dishList = data;
            })
        }
      })
  }]);

app.controller('detailCtrl',
  ['$scope','$routeParams','$http',
    function ($scope,$routeParams,$http) {
      var did = $routeParams.id;
      $http
        .get('data/dish_getbypage03.json')
        .success(function (data) {
          $scope.dish = data[did-1];
        })
  }]);

app.controller('orderCtrl',
  ['$scope','$routeParams','$http',
    function ($scope,$routeParams,$http) {
      var did = $routeParams.id;
      $scope.order = {'did':did};
      $scope.submitOrder = function () {
        //console.log($scope.order);
        var args = jQuery.param($scope.order);
        //console.log(args);
        $http
          .get('data/dish_getbypage.json')
          .success(function (data) {
            console.log(data);
            if(data[did-1].msg == "have")
            {
              sessionStorage.setItem('phone',$scope.order.phone);
              $scope.succMsg = "下单成功，订单编号为"+data[did-1].did+"您可以在订单中心查看订单状态";
            }
            else
            {
              $scope.errMsg = '下单失败!';
            }
          })
      }
      

  }]);

app.controller('myOrderCtrl',
  ['$scope', '$http',function ($scope,$http) {
    $http
      .get('data/dish_order.json')
      .success(function (data) {
        $scope.orderList = data;
      })
  }]);
