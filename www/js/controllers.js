angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope,$http) {
    var mapa;
    var start;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();    
    navigator.geolocation.getCurrentPosition(function(position) {
    var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);    
    start = myLatlng;
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map"),mapOptions);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
    });
      $http.get('https://renzotejada.com/api/nosocomio-rest').success(function (data) {
        var locations = data.data;
        var markers = locations.map(function(location, i) {
          var lati = Number(location.lat);
          var long = Number(location.lng);
          var marker = new google.maps.Marker({          
            position: {lat:lati,lng:long},
            icon: 'http://maps.google.com/mapfiles/kml/shapes/hospitals.png',
            title: location.institucion+' - '+location.direccion            
          });
          marker.addListener('click', function() {
            ruta(marker.getPosition());
          });
          return marker;
        });
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        mapa = map;
        $scope.map = map;            
      }).error(function (err) {
      });   
    }); 
    ruta = function(end){
        directionsDisplay.setMap(mapa);
          var request = {
            origin:start,
            destination:end,
            travelMode: google.maps.TravelMode.DRIVING
          };
          directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
          });   
        $scope.map = mapa;
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
