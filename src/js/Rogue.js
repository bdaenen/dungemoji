(function () {
  'use strict';

  var Rogue = function(stage){
    Player.call(this, stage);
    this.view = '🧝🏼';
    this.maxHealth = 3;
    this.health = 3;
    this.dex = 35;
    this.str = 2;
  };

  var p = Object.create(Player.prototype);
  p.constructor = Rogue;

  p.getValidActionTargets = function(action) {
    if (action.actionId !== 'attack') {
      return Player.prototype.getValidActionTargets.call(this, action);
    }

    var ff;
    var x;
    var y;
    var f;

    if (this.type === this.stage.E) {
      ff = this.stage.playerFieldByCoord.bind(this.stage);
    }
    else {
      ff = this.stage.enemyFieldByCoord.bind(this.stage);
    }
    x = this.pos.x;
    y = this.pos.y;
    f = [
      ff(x+1,y+1),
      ff(x-1,y+1),
      ff(x-1,y-1),
      ff(x+1,y-1),
      ff(x,y-2),
      ff(x,y-3),
      ff(x,y+2),
      ff(x,y+3)
    ];
    return f.filter(function(o){return o});
  };

  Rogue.prototype = p;

  window.Rogue = Rogue;
}());
