(function() {
  'use strict';
  var curStage = n;
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
    if (curStage.turn === curStage.E && curStage.state !== curStage.S_AI) {
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
    if (curStage.turn !== curStage.P) {
      return;
    }
    var $field = e.target;
    var clickedPlayer = curStage.pInF($field, curStage.P, true);
    var curSel = curStage.currentSelection;

    if(curStage.state === curStage.S_CHAR){
      if (clickedPlayer) {
        curStage.currentSelection = clickedPlayer;
        curStage.state = curStage.S_ACT;
      }
    }
    else if (curStage.state === curStage.S_ACT) {
      var a;
      if (a = $field.dataset.actionId) {
        curSel.selectAction(a);
        e.stopPropagation();
      }
      // Changing character is only possible on the initial action.
      else if (!curSel.hasMoved && !curSel.hasAttacked && clickedPlayer) {
        curStage.currentSelection = curStage.pInF($field, curStage.P, true);
        curStage.state = curStage.S_ACT;
      }
    }
    else if (curStage.state === curStage.S_TAR) {
      if ($field.classList.contains('valid')) {
        curSel.performSelectedAction(e.target);
        if (!curSel.hasMoved || !curSel.hasAttacked) {
          curStage.state = curStage.S_ACT;
          clickCallback(e);
        }
        else if (!curSel.curAction || curSel.curAction.actionId !== 'endTurn') {
          curSel.endTurn();
        }
      }
      // Changing action
      else if (a = $field.dataset.actionId) {
        curSel.selectAction(a);
      }
      else if (curStage.pInF($field, curStage.P, true)) {

      }
    }
  }
}());
