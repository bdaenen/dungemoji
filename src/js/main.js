(function() {
  'use strict';
  var curStage = null;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 55;
  ctx.font = '72px "Segoe Ui Emoji"';
  ctx.fillText('⬛', -9, 53);
  //$('body').appendChild(canvas);
  $('#m').style.backgroundImage = 'url("' + canvas.toDataURL() + '")';
  var stage1 = new Stage1();
  curStage = stage1;
  stage1.init();

  var gameLoop = function() {
    if (curStage.turn === curStage.TYPE_ENEMY && curStage.state !== curStage.GAME_STATE_AI_BUSY) {
      curStage.updateAi();
    }
    if (curStage.dirty) {
      curStage.render();
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
    if (curStage.turn !== curStage.TYPE_PLAYER) {
      return;
    }
    var $field = e.target;
    var clickedPlayer = curStage.getPlayerInField($field, curStage.TYPE_PLAYER, true);
    var curSel = curStage.currentSelection;

    if(curStage.state === curStage.GAME_STATE_SELECT_CHARACTER){
      if (clickedPlayer) {
        curStage.currentSelection = clickedPlayer;
        curStage.state = curStage.GAME_STATE_SELECT_ACTION;
      }
    }
    else if (curStage.state === curStage.GAME_STATE_SELECT_ACTION) {
      var a;
      if (a = $field.dataset.actionId) {
        curSel.selectAction(a);
        e.stopPropagation();
      }
      // Changing character is only possible on the initial action.
      else if (!curSel.hasMoved && !curSel.hasAttacked && clickedPlayer) {
        curStage.currentSelection = curStage.getPlayerInField($field, curStage.TYPE_PLAYER, true);
        curStage.state = curStage.GAME_STATE_SELECT_ACTION;
      }
    }
    else if (curStage.state === curStage.GAME_STATE_SELECT_TARGET) {
      if ($field.classList.contains('valid')) {
        curSel.performSelectedAction(e.target);
        if (!curSel.hasMoved || !curSel.hasAttacked) {
          curStage.state = curStage.GAME_STATE_SELECT_ACTION;
          clickCallback(e);
        }
        else if (!curSel.currentAction || curSel.currentAction.actionId !== 'endTurn') {
          curSel.endTurn();
        }
      }
      // Changing action
      else if (a = $field.dataset.actionId) {
        curSel.selectAction(a);
      }
      else if (curStage.getPlayerInField($field, curStage.TYPE_PLAYER, true)) {

      }
    }
  }
}());
