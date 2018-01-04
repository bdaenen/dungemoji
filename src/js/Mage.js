(function () {
  'use strict';

  var Mage = function(stage){
    Player.call(this, stage);
    this.view = '🧙🏻‍♂';
    this.health = 2;
    this.dex = 0;
    this.actions[1].range = 2;
    this.actions[1].rangeX = 2;
  };

  var p = Object.create(Player.prototype);
  p.constructor = Mage;

  p.getValidActionTargets = function(action) {
    if (action.actionId !== 'attack') {
      return Player.prototype.getValidActionTargets.call(this, action);
    }

    var ff;
    var x;
    var y;
    var f = [];

    ff = this.stage.eFByC.bind(this.stage);
    x = this.pos.x;
    y = this.pos.y;
    for (var i=0,j;i<=2;i++) {
      j=1;
      for(;j<=3;j++){
        f=f.concat([ff(x+i,y+j)]);
        f=f.concat([ff(x+i,y-j)]);
        f=f.concat([ff(x-i,y+j)]);
        f=f.concat([ff(x-i,y-j)]);
      }
    }
    return f.filter(function(o){return o});
  };

  Mage.prototype = p;

  window.Mage = Mage;
}());
