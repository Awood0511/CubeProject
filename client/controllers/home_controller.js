/* Creates an angular module and controller for home.html (ng-app) */
var homeApp = angular.module('homeApplication', []);

/* creates the controller for login.html (ng-controller) */
homeApp.controller('homeController', function($scope, homeFactory){
  $scope.cardsIn8s;
  $scope.length;

  homeFactory.getCards().then(function(response) {
    //do stuff on response
    var cards = response.data;
    var arr = [];
    $scope.length = cards.length;
    for(i = 0; i < cards.length; i=i+8){

      var row = {
        card1_id: 0,
        card2_id: 0,
        card3_id: 0,
        card4_id: 0,
        card5_id: 0,
        card6_id: 0,
        card7_id: 0,
        card8_id: 0
      }

      if(i + 0 < cards.length){
        row.card1_id = cards[(i)+0].id
      }
      if(i + 1 < cards.length){
        row.card2_id = cards[(i)+1].id
      }
      if(i + 2 < cards.length){
        row.card3_id = cards[(i)+2].id
      }
      if(i + 3 < cards.length){
        row.card4_id = cards[(i)+3].id
      }
      if(i + 4 < cards.length){
        row.card5_id = cards[(i)+4].id
      }
      if(i + 5 < cards.length){
        row.card6_id = cards[(i)+5].id
      }
      if(i + 6 < cards.length){
        row.card7_id = cards[(i)+6].id
      }
      if(i + 7 < cards.length){
        row.card8_id = cards[(i)+7].id
      }
      arr.push(row);
    }
    $scope.cardsIn8s = arr;
  }, function(error) {
    //do stuff on error
  });

}); //end homeController

/* creates the factory that will be used to handle http requests */
homeApp.factory('homeFactory', function($http){
  var methods = {

    //sends get request to check if there is currently a user logged in
    getCards: function() {
	     return $http.get('http://70.171.40.96:8080/api/cubecards');
    }
  }; //end methods

  return methods;
}); //end loginFactory
