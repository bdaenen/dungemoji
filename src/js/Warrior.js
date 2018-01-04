(function () {
  'use strict';

  var Warrior = function(stage){
    Player.call(this, stage);
  };

  var p = Object.create(Player.prototype);
  p.constructor = Warrior;

  p.push = function() {
    this.stage.playerPush();
    log(this.view,'pushed onward!');
    this.endTurn();
  };

  dp(p, 'actions', {
    get: function(){
      var fp = this.stage.pInF.bind(this.stage);
      var ff = this.stage.fByC.bind(this.stage);
      if (this.pos.y !== 3 || fp(ff(0, 2)) || fp(ff(1,2)) || fp(2,2)) {
        return this._actions;
      }
      else {
        var actions = JSON.parse(JSON.stringify(this._actions));
        actions[1].actionId = 'push';
        actions[1].view = '⬆';
        return actions;
      }
    },
    set: function(v) {
      this._actions = v;
    }
  });

  Warrior.prototype = p;

  window.Warrior = Warrior;
}());
