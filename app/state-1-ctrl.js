angular.module('famous-angular')

.controller('state1Ctrl', function($scope, $famous, $timeline, stateTransitions) {

  var Transitionable = $famous['famous/transitions/Transitionable'];
  var Easing = $famous['famous/transitions/Easing'];

  var t = new Transitionable(0);
  $scope.t = t;

/*--------------------------------------------------------------*/

  $scope.enter = function($done) {
    $scope.$parent.navTimeline.set(1, {duration: 1000});
    stateTransitions.enter(t, $done);
  };

  $scope.leave = function($done) {
    stateTransitions.leave(t, $done);
  };

/*--------------------------------------------------------------*/

  $scope.heading = {
    translate: function(timeValue) {
      var z = $timeline([
        [0, -200, Easing.inOutQuart],
        [0.2, 0],
        [1.6, 0, Easing.outQuad],
        [2, 400]
      ])(timeValue);

      return [0, 0, z];
    },
    opacity: $timeline([
      [0, 0],
      [0.3, 1, Easing.inCubic],
      [1.8, 1, Easing.inOutQuart],
      [2, 0]
    ])
  };

  $scope.frame = {
    visual: {
      translate: function() {
        return $timeline([
          [0.3, [0, -20, -100], Easing.inOutQuart],
          [0.5, [0, 0, 0]]
        ])(t.get());
      }
    },
    code: {
      translate: function() {
        return $timeline([
          [0.3, [0, 2000, 0], Easing.inOutQuart],
          [0.5, [0, 100, 0]]
        ])(t.get());
      }
    }
  };

  $scope.header = {
    visual: {
      translate: function() {
        return $timeline([
          [0.4, [0, -2000, 0], Easing.inOutQuart],
          [0.6, [20, 65, 0]]
        ])(t.get());
      }
    },
    code: {
      translate: function() {
        return $timeline([
          [0.4, [0, 2000, 0], Easing.inOutQuart],
          [0.6, [0, 120, 0]]
        ])(t.get());
      }
    },
  };

  $scope.sidenav = {
    visual: {
      translate: function() {
        return $timeline([
          [0.5, [0, 2000, 0], function(x) { return x }],
          [0.7, [20, 135, 0]]
        ])(t.get());
      }
    },
    code: {
      translate: function() {
        return $timeline([
          [0.5, [0, -2000, 0], Easing.inOutQuart],
          [0.7, [0, 140, 0]]
        ])(t.get());
      }
    },
  };

  $scope.container = {
    code: {
      translate: function() {
        return $timeline([
          [0.6, [-2000, 0, 0], Easing.inOutQuart],
          [0.8, [0, 160, 0]]
        ])(t.get());
      }
    },
    visual: {
      translate: function() {
        return $timeline([
          [0.6, [2000, 90, 0], function(x) { return x }],
          [0.8, [110, 135, 0]]
        ])(t.get());
      }
    },
  };


  $scope.content = {
    visual: {
      translate: function() {
        return [135, 160, 0];
      },
      opacity: function() {
        return $timeline([
          [0.8, 0, Easing.inOutQuart],
          [1, 1]
        ])(t.get());
      },
      scale: function() {
        return $timeline([
          [0.7, [0.1, 0.1], Easing.inOutQuart],
          [1, [1, 1]]
        ])(t.get());
      }
    },
    code: {
      translate: function() {
        return $timeline([
          [0.7, [-2000, 0, 0], Easing.inOutQuart],
          [0.9, [0, 180, 0]]
        ])(t.get());
      }
    }
  };

});
