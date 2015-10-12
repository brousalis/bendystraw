'use strict'

angular.module 'testApp', [
  'templates'
  'config'

  'restangular'
  'ui.router'
  'testApp.dashboard'
]

.config ($httpProvider, $provide, $urlRouterProvider, $stateProvider, RestangularProvider, config) ->
  console.log 'app config'
  console.log config

  $stateProvider
  .state 'main',
    abstract: true
    templateUrl: 'app/layouts/mainLayout.html'
    controller: 'appController'

  $urlRouterProvider.otherwise('/dashboard')

  RestangularProvider.setDefaultHeaders('Content-Type': 'application/json')

.run ->
  console.log 'app run'

.controller 'appController', ($rootScope, $scope) ->
  console.log 'app controller'
