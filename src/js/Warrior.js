(function () {
  'use strict';

  var Warrior = function(stage){
    Player.call(this, stage);
    this.maxHealth = 7;
    this.health = 7;
  };

  var p = Object.create(Player.prototype);
  p.constructor = Warrior;

  p.push = function() {
    this.stage.playerPush();
    log(this.view,'pushed onward!');
    this.endTurn();
  };

  p.pushEnemy = function() {
    this.stage.enemyPush();
    log(this.view,'pushed backward!');
    this.endTurn();
  };

  Object.defineProperty(p, 'actions', {
    get: function(){
      var fp = this.stage.playerInField.bind(this.stage);
      var ff = this.stage.fieldByCoord.bind(this.stage);
      if (this.pos.y !== 3 || fp(ff(0, 2)) || fp(ff(1,2)) || fp(ff(2,2))) {
        return this._actions;
      }
      else {
        var actions = JSON.parse(JSON.stringify(this._actions));
        actions[1].actionId = 'push';
        actions[1].view = '⬆';
        actions[0].actionId = 'pushEnemy';
        actions[0].view = 'V';

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
