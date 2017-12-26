(function() {
  'use strict';
  var currentStage = null;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 56;
  ctx.font = '64px sans-serif';
  ctx.fillText('⬛', -4, 56);
  $('#m').style.backgroundImage = 'url("' + canvas.toDataURL() + '")';
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
    if (currentStage.turn !== currentStage.TURN_PLAYER) {
      return;
    }
    var $field = e.target;

    if(currentStage.state === currentStage.GAME_STATE_SELECT_CHARACTER){
      currentStage.currentSelection = currentStage.getPlayerInField($field);
      if (currentStage.currentSelection) {
        currentStage.state = currentStage.GAME_STATE_SELECT_ACTION;
      }
    }
    else if (currentStage.state === currentStage.GAME_STATE_SELECT_ACTION) {
      var a;
      if (a = e.target.dataset.actionId) {
        currentStage.currentSelection.selectAction(a);
      }
    }
    else if (currentStage.state === currentStage.GAME_STATE_SELECT_TARGET) {
      currentStage.currentSelection.move(e.target.dataset.x, e.target.dataset.y);
      currentStage.state = currentStage.GAME_STATE_SELECT_CHARACTER;
    }
  }
}());
