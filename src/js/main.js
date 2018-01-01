(function() {
  'use strict';
  var currentStage = null;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 55;
  ctx.font = '72px "Segoe Ui Emoji"';
  ctx.fillText('⬛', -9, 53);
  //$('body').appendChild(canvas);
  $('#m').style.backgroundImage = 'url("' + canvas.toDataURL() + '")';
  var stage1 = new Stage1();
  currentStage = stage1;
  stage1.init();

  var gameLoop = function() {
    if (currentStage.turn === currentStage.TYPE_ENEMY && currentStage.state !== currentStage.GAME_STATE_AI_BUSY) {
      currentStage.updateAi();
    }
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
    if (currentStage.turn !== currentStage.TYPE_PLAYER) {
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
      if (a = $field.dataset.actionId) {
        currentStage.currentSelection.selectAction(a);
      }
    }
    else if (currentStage.state === currentStage.GAME_STATE_SELECT_TARGET && $field.classList.contains('valid')) {
      currentStage.currentSelection.performSelectedAction(e.target);
      if (currentStage.currentSelection.hasMoved && currentStage.currentSelection.hasAttacked) {
        currentStage.turn = currentStage.TYPE_ENEMY;
      }
      else {
          currentStage.state = currentStage.GAME_STATE_SELECT_ACTION;
          clickCallback(e);
      }
    }
  }
}());
