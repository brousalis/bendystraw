'use strict'

angular.module 'wccApp', [
  'restangular'
  'ui.router'

  'wccApp.dashboard'
  'wccApp.test'
]

.config ($httpProvider, $provide, $urlRouterProvider, $stateProvider, RestangularProvider) ->
  console.log 'app config'

  $stateProvider
  .state 'main',
    abstract: true
    templateUrl: 'app/layouts/mainLayout.html'
    controller: 'wccAppController'

  RestangularProvider.setDefaultHeaders('Content-Type': 'application/json')

.run ->
  console.log 'app run'

.controller 'wccAppController', ($rootScope, $scope) ->
  console.log 'app controller'
