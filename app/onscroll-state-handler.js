angular.module('famous-angular')

.run(function($rootScope, $famous, $timeline, $state) {
  var Transitionable = $famous['famous/transitions/Transitionable'];

  var rangePerState = 100;
  var scrollStates = getScrollStates();
  var stateCount = scrollStates.length;

  $rootScope.bodyHeight = (window.innerHeight * stateCount);

  function getScrollStates() {
    var listOfStates = $state.get();
    var usableStates = listOfStates.filter(function(state) {
      return !!state.data;
    });
    var orderedStates = _.sortBy(usableStates, function(state) {
      return state.data.index;
    });
    return orderedStates;
  }

  $rootScope.scrollProgress = new Transitionable(0);

/*--------------------------------------------------------------*/

  var start = {
    scrollPosition: window.pageYOffset
  };

  $(window).bind('scrollstart', function() {
    start.scrollPosition = window.pageYOffset;
  });

  $(window).bind('scrollend', function() {
    start.scrollPosition = window.pageYOffset;
  });

/*--------------------------------------------------------------*/

  // 'scroll', 'scrollend' and 'scrollstart' events fire on initial page load,
  // resulting in unintended routing side effects.  Disable these 
  // unintended scroll events until the rest of the app has had time to
  // initialize
  var initialPageLoad = true;
  setTimeout(function() {
    initialPageLoad = false;
  }, 300);

  $(window).bind('scroll', function() {
    // Initial routing from page laod will set the scroll position, but 
    // don't want to execute handler for that scrollTo()
    if (initialPageLoad) return;

    var t = getTimelineFromScroll();

    var currentStateIndex = $state.current.data.index;
    var reachedStateIndex = stateIndex(determineState(t));
    var direction = compare(reachedStateIndex, currentStateIndex);
    var nextStateIndex = Math.max(Math.min(stateCount - 1, currentStateIndex + direction), 0);
    var nextState = scrollStates[nextStateIndex];

    // If the user quickly jumps to the next state (e.g. [50, 150, 250]),
    // change the state immediately, instead of waiting for the
    // scrollProgress.set() callback
    if (t % 100 === 50) {
      $state.go(nextState.name, null, { location: 'replace' });
    }

    $rootScope.scrollProgress.halt();

    // RACE CONDITION HERE!
    // The duration of the this transtionable set MUST be faster than the
    // duration before a 'scrollend', when starting a 'scrollstart'.  Otherwise
    // the 'scrollend' handlers will fire before the callback for this
    // set() is finished, resulting in never being able to change states
    var durationThatMustBeFasterThanScrollEndTrigger = 200;

    $rootScope.scrollProgress.set(t, { duration: durationThatMustBeFasterThanScrollEndTrigger }, function() {
      $state.go(nextState.name, null, { location: 'replace' });
    });

  });

  function compare(a, b) {
    if (a == b) return 0;
    return a > b ? 1 : -1;
  }

  function stateIndex(s) {
    return _.findIndex(scrollStates, {name: s});
  }

  function getTimelineFromScroll() {
    var scrollMax = $rootScope.bodyHeight - window.innerHeight;
    var maxAllowableDistancePerScroll =  scrollMax / 7;

    // Scale the scroll range to a simple timeline range
    var scaleScroll = $timeline([
      [0, 0],
      [scrollMax, stateCount * rangePerState]
    ]);

    var scrollPosition = window.pageYOffset;
    var scrollDistanceTraveled = scrollPosition - start.scrollPosition;

    // If the scroll distance exceeds the max allowable distance, return
    // the starting scroll positon + the max distance
    if (Math.abs(scrollDistanceTraveled) > maxAllowableDistancePerScroll) {
      var delta = scrollDistanceTraveled > 0
        ? maxAllowableDistancePerScroll
        : -maxAllowableDistancePerScroll;
      var scaled = scaleScroll(start.scrollPosition + delta);
      var rounded = Math.round(scaled / 50) * 50;
      return rounded;
    }

    return scaleScroll(scrollPosition);
  }

  function determineState(t) {
    for (var i = 0; i < scrollStates.length; i++) {
      var state = scrollStates[i];
      if (t <= state.data.scrollTimelineMax) {
        return state.name;
      }
    }
    return "end";
  }


/*--------------------------------------------------------------*/


  $rootScope.$on('$stateChangeSuccess', function(e) {
    determineScrollPositionFromState();

    if (initialPageLoad) {
      var t = $state.current.data.scrollTimelineMax;
      $rootScope.scrollProgress.set(t - 50, { duration: 0 });
    }
  });


  function determineScrollPositionFromState() {
    for (var i = 0; i < scrollStates.length; i++) {
      var state = scrollStates[i];
      if ($state.current.name === state.name) {
        // Set the scroll to half past the beginning of state range
        var halfOfRange = rangePerState / 2;
        var halfwayPointOfRange = state.data.scrollTimelineMax - rangePerState + halfOfRange;

        var scrollMax = $rootScope.bodyHeight - window.innerHeight;

        var newScrollPosition = $timeline([
          [0, 0],
          [stateCount * rangePerState, scrollMax]
        ])(halfwayPointOfRange);

        window.scrollTo(0, newScrollPosition);

        break;
      }
    }
  }

});
