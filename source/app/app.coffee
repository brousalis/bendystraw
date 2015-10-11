'use strict'

angular.module 'testApp', [
  'restangular'
  'ui.router'
  'templates'
  'testApp.dashboard'
]

.config ($httpProvider, $provide, $urlRouterProvider, $stateProvider, RestangularProvider) ->
  console.log 'app config'

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
