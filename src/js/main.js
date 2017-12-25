(function() {
  'use strict';
  var currentStage = null;
  var currentlySelected = null;

  var GAME_STATE_SELECT_CHARACTER = 0;
  var GAME_STATE_SELECT_POSITION = 1;
  var GAME_STATE_SELECT_TARGET = 2;

  var TURN_ENEMY = 1;
  var TURN_PLAYER = 2;

  var GAME_STATE = GAME_STATE_SELECT_CHARACTER;
  var TURN = TURN_PLAYER;

  var stage1 = new Stage1();
  currentStage = stage1;
  stage1.init();

  var gameLoop = function() {
    if (currentStage.dirty) {
      currentStage.render();
    }
    requestAnimationFrame(gameLoop);
  };

  gameLoop();


  mappedStage.forEach(function(row){
    row.forEach(function(col){
      col.addEventListener('click', clickCallback);
    });
  });

  function clickCallback(e) {
    if (TURN !== TURN_PLAYER) {
      return;
    }
    var $field = e.target;

    if(GAME_STATE === GAME_STATE_SELECT_CHARACTER){
      currentlySelected = currentStage.getPlayerInField($field);
      if (currentlySelected) {
        GAME_STATE = GAME_STATE_SELECT_POSITION;
      }
    }
    else if (GAME_STATE === GAME_STATE_SELECT_POSITION) {
      currentlySelected.move(e.target.dataset.x, e.target.dataset.y);
      GAME_STATE = GAME_STATE_SELECT_CHARACTER;
    }
    else if (GAME_STATE === GAME_STATE_SELECT_TARGET) {

    }
  }
}());
