(function () {
  'use strict';

  var Mage = function(stage){
    Player.call(this, stage);
    this.view = '🧙🏻‍♂';
    this.maxHealth = 2;
    this.health = 2;
    this.str = 1.5;
    this.dex = 0;
    this.attackView = '🔥';
    this.attackView2 = '💥';
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

    if (this.type === this.stage.P) {
      ff = this.stage.enemyFieldByCoord.bind(this.stage);
    }
    else {
      ff = this.stage.playerFieldByCoord.bind(this.stage);
    }
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
