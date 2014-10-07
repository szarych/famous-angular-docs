angular.module('famous-angular')

.controller('state5Ctrl', function($rootScope, $scope, $state, $famous, $timeline, stateTransitions, scrollGravity) {

  var Transitionable = $famous['famous/transitions/Transitionable'];
  var Easing = $famous['famous/transitions/Easing'];

  var t = new Transitionable(0);
  $scope.t = t;

/*--------------------------------------------------------------*/

  $scope.grav = new Transitionable(50);
  $scope.gravity = scrollGravity.timelines;

/*--------------------------------------------------------------*/

  $scope.enter = function($done) {
    // Don't initialize hero block at the state5Ctrl invocation, else there
    // will be dropped frames.  Init hero block after main state5 view has
    // been compiled
    setTimeout(function() {
      $scope.showHeroBlock = true;
      $scope.$digest();
    }, 500);

    scrollGravity.setState({
      grav: $scope.grav,
      startPosition: window.pageYOffset
    });

    stateTransitions.enter(t, function() {
      $done();
    });
  };

  $scope.leave = function($done) {
    stateTransitions.leave(t, $done);
  };

  $scope.entireView = {
    translate: $timeline([
      [0, [0, 0, 0]],
      [1, [0, 0, 0], Easing.inQuad],
      [2, [0, 0, 150]],
    ]),
    opacity: $timeline([
      [0, 1],
      [1, 1],
      [1.8, 0],
    ])
  };

/*--------------------------------------------------------------*/

  $scope.webframe = {
    translate: $timeline([
      [0.3, [250, 580, 0], Easing.outBack],
      [0.6, [250, 180, 0]]
    ]),
    opacity: $timeline([
      [0, 0],
      [0.3, 0],
      [0.5, 1],
    ])
  };

  $scope.heroBlock = {
    translate: $timeline([
      [0, [84, 110, 2], Easing.inOutQuart],
      [0.2, [84, 110, 2]]
    ]),
    opacity: $timeline([
      [0, 0],
      [0.8, 0],
      [1, 1],
    ])
  };

/*--------------------------------------------------------------*/

  $scope.rightColumn = {
    translate: $timeline([
      [0, [1170, 170, -150], Easing.inOutQuart],
      [0.2, [1170, 170, 0]]
    ])
  };

  $scope.heading = {
    translate: $timeline([
      [0, [0, 0, -150], Easing.outQuart],
      [0.2, [0, 0, 0]]
    ]),
    opacity: $timeline([
      [0, 0, Easing.outQuart],
      [0.2, 1]
    ])
  };

  $scope.code = {
    top: {
      translate: $timeline([
        [0.2, [0, 150, 0], Easing.inOutQuart],
        [0.4, [0, 150, 0]]
      ]),
      opacity: $timeline([
        [0, 0],
        [0.2, 0],
        [0.4, 1]
      ])
    },
    middle: {
      translate: $timeline([
        [0.8, [-50, 250, 0], Easing.outQuart],
        [1, [28, 250, 0]]
      ]),
      opacity: $timeline([
        [0, 0],
        [0.8, 0],
        [1, 1]
      ])
    },
    bottom: {
      translate: $timeline([
        [0, [0, 240, 0], Easing.inOutQuart],
        [0.6, [0, 240, 0], Easing.inOutQuart],
        [0.8, [0, 510, 0]]
      ]),
      opacity: $timeline([
        [0, 0],
        [0.2, 0],
        [0.4, 1]
      ])
    }
  };

});
