(function () {
  'use strict';

  var Enemy = function(stage){
    Player.call(this, stage);
    this.type = stage.E;
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
      this.playerTarget = this.getClosest(this.stage.P);
    }

    if (!this.playerTarget) {
      return this;
    }

    log(this.view, "targets", this.playerTarget.view);
    return this;
  };

  p.determineAction = function() {
    if (!this.playerTarget || !this.playerTarget.alive) {
      this.determineTarget();
    }
    if (this.playerTarget && this.inAttackRange(this.playerTarget)) {
      if (!this.hasAttacked) {
        // TODO, select push when appropriate!
        this.selectAction('attack');
        this.performSelectedAction(this.playerTarget.$field);
      }
      else {
        this.selectAction('endTurn');
        return;
      }
    }
    else if (!this.hasMoved && this.playerTarget) {
      var x = this.pos.x;
      var y = this.pos.y;
      var deltaX = x - this.playerTarget.pos.x;
      var deltaY = 2 - y;
      var $field = null;

      if (deltaY > 0) {
        $field = this.stage.enemyFieldByCoord(x, y+1);
      }
      else if (deltaX > 0) {
        $field = this.stage.enemyFieldByCoord(x-1, y);
      }
      else if (deltaX < 0) {
        $field = this.stage.enemyFieldByCoord(x+1, y);
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

    this.stage.state = this.stage.S_AI;
  };

  p.inAttackRange = function (target) {
    var t = this;
    var s = false;
    this.curAction = this.actions.filter(function(o){return o.actionId === 'attack'})[0];
    var targets = t.getValidActionTargets(t.curAction);
    if (!targets) {return false;}

    targets.forEach(function(f) {
      if (target.$field === f) {
        s = true;
      }
    });
    return s;
  };

  p.getAttackable = function() {
    var tar;
    this.stage.players.forEach(function(player) {
      if (!tar && this.inAttackRange(player)) {
        tar = player;
      }
    });

    return tar;
  };

  p.getClosest = function(targetType) {
    var closestDistance = 1/0;
    var closestY = 1/0;
    var closestTarget = null;
    if (targetType === this.stage.P) {
      this.stage.players.forEach(function(player){
        var xDistance = Math.abs(player.pos.x - this.pos.x);
        var yDistance = Math.abs(player.pos.y - this.pos.y);
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
