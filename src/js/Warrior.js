(function () {
  'use strict';

  var Warrior = function(stage){
    Player.call(this, stage);
    this.maxHealth = 9;
    this.health = 9;
    this.str = 1;
  };

  var p = Object.create(Player.prototype);
  p.constructor = Warrior;

  p.push = function() {
    this.stage.playerPush();
    log(this.view,'pushes onward!');
    this.endTurn();
  };

  Object.defineProperty(p, 'actions', {
    get: function(){
      var fp = this.stage.playerInField.bind(this.stage);
      var ff = this.stage.fieldByCoord.bind(this.stage);
      if (this.pos.y !== 3 || this.stage.activeRow === 1 || fp(ff(0, 2)) || fp(ff(1,2)) || fp(ff(2,2))) {
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
