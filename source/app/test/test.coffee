'use strict'

angular.module('wccApp.test', [
  'ui.router'
])

.config ($stateProvider) ->
  $stateProvider
    .state 'main.test',
      url: '/test'
      templateUrl: 'app/test/test.html'
      controller: 'wccTestController'

.controller 'wccTestController', ($q, $rootScope, $scope) ->
  console.log 'test'
