(function () {
  'use strict';

  var Scorpion = function(stage){
    Player.call(this, stage);
    this.type = stage.TYPE_ENEMY;
    this.view = '🦂';
    this.playerTarget = null;
  };

  Scorpion.prototype = Object.create(Player.prototype);
  Scorpion.prototype.constructor = Scorpion;

  Scorpion.prototype.determineTarget = function() {
    this.playerTarget = null;
    this.stage.players.forEach(function(player){
      if (this.playerTarget) {
        return;
      }

      if (this.inAttackRange(player)) {
        this.playerTarget = player;
      }
    }, this);

    if (!this.playerTarget) {
      this.playerTarget = this.getClosest(this.stage.TYPE_PLAYER);
    }

    console.log("targeted:", this.playerTarget.view);
    return this;
  };

  Scorpion.prototype.performMoveOrAttack = function() {
    if (this.inAttackRange(this.playerTarget) && !this.hasAttacked) {
      console.log('attacking', this.playerTarget.view);
      this.selectAction('attack');
      this.performSelectedAction(this.playerTarget.$field);
    }
    else if (!this.hasMoved) {
      var x = this.position.x;
      var y = this.position.y;
      var deltaX = x - this.playerTarget.position.x;
      var deltaY = 2 - y;
      var $field = null;

      if (deltaY > 0) {
        $field = this.stage.getEnemyFieldByCoordinate(x, y+1);
      }
      else if (deltaX > 0) {
        $field = this.stage.getEnemyFieldByCoordinate(x-1, y);
      }
      else if (deltaX < 0) {
        $field = this.stage.getEnemyFieldByCoordinate(x+1, y);
      }

      if ($field) {
        this.selectAction('move');
        this.performSelectedAction($field);
      }
      else {
        this.hasMoved = true;
      }
    }
    else {
      this.hasMoved = true;
      this.hasAttacked = true;
      this.selectAction('endTurn');
    }

    this.stage.state = this.stage.GAME_STATE_AI_BUSY;
  };

  window.Scorpion = Scorpion;
}());
