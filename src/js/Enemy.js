(function () {
  'use strict';

  var Enemy = function(stage){
    Player.call(this, stage);
    this.type = stage.TYPE_ENEMY;
    this.view = '🦂';
    this.playerTarget = null;
  };

  var p = Object.create(Player.prototype);
  p.constructor = Enemy;

  p.determineTarget = function() {
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

    log(this.view, "targets", this.playerTarget.view);
    return this;
  };

  p.determineAction = function() {
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

  p.inAttackRange = function (target) {
    var atk = this.actions.filter(function (o) {
      return o.actionId === 'attack'
    })[0];

    return (Math.abs(target.position.y - this.position.y) <= atk.range) && (Math.abs(target.position.x - this.position.x) <= atk.rangeX);
  };

  p.getClosest = function(targetType) {
    var closestDistance = 1/0;
    var closestY = 1/0;
    var closestTarget = null;
    if (targetType === this.stage.TYPE_PLAYER) {
      this.stage.players.forEach(function(player){
        var xDistance = Math.abs(player.position.x - this.position.x);
        var yDistance = Math.abs(player.position.y - this.position.y);
        var distance = xDistance + yDistance;
        // Give priority over Y distance.
        if (yDistance < closestY || distance < closestDistance) {
          closestDistance = distance;
          closestY = yDistance;
          closestTarget = player;
        }
      }, this);
    }

    return closestTarget;
  };

  Enemy.prototype = p;
  window.Enemy = Enemy;
}());
