'use strict'

angular.module('wccApp', [
  'restangular'
])

.config ($httpProvider, $provide, $urlRouterProvider, $stateProvider, RestangularProvider) ->
  $stateProvider
  .state 'main',
    abstract: true
    url: '/'
    templateUrl: 'app/layouts/mainLayout.html'
    controller: 'wccAppController'

  RestangularProvider.setDefaultHeaders('Content-Type': 'application/json')

.controller 'wccAppController', ($rootScope, $scope) ->
  console.log 'app controller'
