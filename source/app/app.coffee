'use strict'

angular.module 'testApp', [
  'templates'
  'env'

  'restangular'
  'ui.router'
  'testApp.dashboard'
]

.constant 'CONFIG',
  TEST: 'true'

.config ($httpProvider, $provide, $urlRouterProvider, $stateProvider, RestangularProvider, CONFIG, ENV, NODE_ENV) ->
  console.log 'app config'
  console.log CONFIG, ENV, NODE_ENV

  $stateProvider
  .state 'main',
    abstract: true
    templateUrl: 'app/layouts/mainLayout.html'
    controller: 'appController'

  $urlRouterProvider.otherwise('/dashboard')

  RestangularProvider.setDefaultHeaders('Content-Type': 'application/json')

.controller 'appController', ($rootScope, $scope) ->
  console.log 'app controller'
