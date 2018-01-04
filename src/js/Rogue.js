(function () {
  'use strict';

  var Rogue = function(stage){
    Player.call(this, stage);
    this.view = '🧝🏼';
    this.health = 3;
    this.dex = 35;
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

    ff = this.stage.eFByC.bind(this.stage);
    x = this.pos.x;
    y = this.pos.y;
    f = [
      ff(x+1,y+1),
      ff(x-1,y-1),
      ff(x,y-2),
      ff(x,y-3)
    ];
    return f.filter(function(o){return o});
  };

  Rogue.prototype = p;

  window.Rogue = Rogue;
}());
