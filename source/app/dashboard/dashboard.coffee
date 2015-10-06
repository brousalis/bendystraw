'use strict'

angular.module('wccApp.dashboard', [
  'ui.router'
])

.config ($stateProvider) ->
  $stateProvider
    .state 'main.dashboard',
      url: '/dashboard'
      templateUrl: 'app/dashboard/dashboard.html'
      controller: 'wccDashboardController'

.controller 'wccDashboardController', ($q, $rootScope, $scope) ->
  console.log 'dashboard'
