'use strict'

angular.module('testApp.dashboard', [
  'ui.router'
])

.config ($stateProvider) ->
  console.log 'dashboard config'
  $stateProvider
    .state 'main.dashboard',
      url: '/dashboard'
      templateUrl: 'app/dashboard/dashboard.html'
      controller: 'dashboardController'

.controller 'dashboardController', ($q, $rootScope, $scope) ->
  console.log 'dashboard controller'
  $scope.welcome = 'welcome to the dashboard'
