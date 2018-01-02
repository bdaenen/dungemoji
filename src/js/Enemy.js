(function () {
  'use strict';

  var Enemy = function(stage){
    Player.call(this, stage);
    this.type = stage.TYPE_ENEMY;
    this.view = '🦂';
    this.playerTarget = null;
  };

  Enemy.prototype = Object.create(Player.prototype);
  Enemy.prototype.constructor = Enemy;

  Enemy.prototype.determineTarget = function() {
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

    console.log(this.view, "targets", this.playerTarget.view);
    return this;
  };

  Enemy.prototype.determineAction = function() {
    if (!this.playerTarget || !this.playerTarget.alive) {
      this.determineTarget();
    }
    if (this.inAttackRange(this.playerTarget) && !this.hasAttacked) {
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
      this.selectAction('endTurn');
      //this.performSelectedAction();
      return;
    }

    this.stage.state = this.stage.GAME_STATE_AI_BUSY;
  };

  window.Enemy = Enemy;
}());
