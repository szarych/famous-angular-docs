angular.module('famous-angular')

.controller('stateIntroCtrl', function($rootScope, $scope, $state, $http, $famous, $timeline, stateTransitions, scrollGravity) {
  var Transitionable = $famous['famous/transitions/Transitionable'];
  var Easing = $famous['famous/transitions/Easing'];

  var t = new Transitionable(0);
  $scope.t = t;

/*--------------------------------------------------------------*/

  $scope.grav = new Transitionable(50);
  $scope.gravity = scrollGravity.timelines;

  var start = {
    position: 0,
  };

  $rootScope.scrollstart = function() {
    scrollGravity.scrollstartHandler(start);
  };

  $rootScope.scroll = function() {
    scrollGravity.scrollHandler($scope.grav, start, $state.current.data.index);
  };

  $rootScope.scrollend = function() {
    scrollGravity.scrollendHandler($scope.grav, start);
  };

/*--------------------------------------------------------------*/

  $scope.enter = function($done) {
    stateTransitions.enter(t, function() {
      // In the callback after enter animation is complete, animate the
      // down arrow
      animateArrow();
      setTimeout(function() {
        animateArrow();
      }, 1700);
      $done();
    });
  };

  $scope.leave = function($done) {
    stateTransitions.leave(t, $done);
  };

  $scope.entireView = {
    translate: $timeline([
      [0, [0, 0, 0]],
      [1, [0, 0, 0], Easing.inCubic],
      [2, [0, 0, 200]],
    ]),
    opacity: $timeline([
      [0, 1],
      [1, 1],
      [2, 0],
    ])
  };

/*--------------------------------------------------------------*/

  $http({
    method: 'GET',
    url: 'https://api.github.com/repos/famous/famous-angular'
  }).success(function(data) {
    $scope.stars = data.stargazers_count;
    $scope.forks = data.forks;
  });

/*--------------------------------------------------------------*/

  $scope.logo = {
    translate: $timeline([
      [0, [0, 300, 0], Easing.outCubic],
      [0.5, [0, 80, 0]],
      [1, [0, 80, 0]],
    ]),
    opacity: $timeline([
      [0, 0],
      [0.5, 1],
      [1, 1]
    ])
  };


  $scope.heading = {
    translate: $timeline([
      [0, [0, 400, 0]],
      [0.05, [0, 400, 0], Easing.outCubic],
      [0.55, [0, 210, 0]],
      [1, [0, 210, 0]],
    ]),
    opacity: $timeline([
      [0, 0],
      [0.05, 0],
      [0.55, 1],
      [1, 1],
    ])
  };

  $scope.tagline = {
    translate: $timeline([
      [0, [0, 600, 0]],
      [0.1, [0, 600, 0], Easing.outCubic],
      [0.6, [0, 350, 0]],
      [1, [0, 350, 0]],
    ]),
    opacity: $timeline([
      [0, 0],
      [0.1, 0],
      [0.6, 1, Easing.inCubic],
      [1, 1],
    ])
  };

  $scope.buttons = {
    download: {
      translate: $timeline([
        [0, [0, 490, 0]],
        [0.7, [0, 490, 0], Easing.inOutQuart],
        [1, [-300, 490, 0]],
      ]),
      opacity: $timeline([
        [0, 0],
        [0.7, 0],
        [1, 1],
      ])
    },
    github: {
      rotateX: $timeline([
        [0, -Math.PI / 2],
        [0.5, -Math.PI / 2, Easing.outBack],
        [1, 0],
      ]),
      translate: $timeline([
        [0, [0, 690, 1]],
        [0.15, [0, 690, 1], Easing.inOutQuart],
        [0.65, [0, 490, 1]],
        [1, [0, 490, 1]],
      ]),
      opacity: $timeline([
        [0, 0],
        [0.15, 0],
        [0.65, 1],
        [1, 1],
      ])
    },
    docs: {
      translate: $timeline([
        [0, [0, 490, 0]],
        [0.7, [0, 490, 0], Easing.inOutQuart],
        [1, [300, 490, 0]],
      ]),
      opacity: $timeline([
        [0, 0],
        [0.7, 0],
        [1, 1],
      ])
    }
  };

  $scope.builtBy = {
    translate: $timeline([
      [0, [0, 885, 0], Easing.inOutQuart],
      [0.2, [0, 885, 0], Easing.outQuad],
      [0.7, [0, 685, 0]],
      [1, [0, 685, 0]],
    ]),
    opacity: $timeline([
      [0, 0],
      [0.2, 0],
      [0.7, 1],
      [1, 1]
    ])
  };

  $scope.scrollMessage = {
    translate: $timeline([
      [0, [0, 670, 0]],
      [0.45, [0, 670, 0], Easing.inOutQuart],
      [0.95, [0, 770, 0]],
      [1, [0, 770, 0]],
    ]),
    opacity: $timeline([
      [0, 0],
      [0.75, 0],
      [0.95, 1],
      [1, 1]
    ])
  };

  $scope.downArrow = {
    translate: $timeline([
      [0, [0, 785, 0]],
      [0.5, [0, 785, 0], Easing.inOutQuart],
      [1, [0, 885, 0]]
    ]),
    opacity: $timeline([
      [0, 0],
      [0.6, 0],
      [1, 1]
    ])
  };

/*--------------------------------------------------------------*/

  $scope.arrowAnimation = new Transitionable(0);
  $scope.downArrow.animation = {
    translate: $timeline([
      [0, [0, 0, 0], Easing.inOutQuart],
      [300, [0, 30, 0]],
      [301, [0, -25, 0], Easing.inQuad],
      [600, [0, 0, 0]],
      [1700, [0, 0, 0]]
    ]),
    opacity: $timeline([
      [0, 1, Easing.outQuad],
      [300, 0],
      [301, 0, Easing.outQuad],
      [600, 1],
      [1700, 1]
    ])
  };

  var loopAnimation;

  function animateArrow() {
    $scope.arrowAnimation.set(0, {duration: 0});
    $scope.arrowAnimation.set(1700, {duration: 1700}, function() {
      if (loopAnimation) {
        animateArrow();
      }
    });
  }

  $scope.startArrowAnimation = function() {
    // Don't start a new loop if already looping
    if (loopAnimation) {
      return;
    }

    loopAnimation = true;
    animateArrow();
  };

  $scope.endArrowAnimation = function() {
    loopAnimation = false;
  };

});
