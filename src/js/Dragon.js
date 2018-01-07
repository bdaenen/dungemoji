(function () {
  'use strict';

  var Dragon = function(stage){
    Enemy.call(this, stage);
    this.view = '🦖';
    this.hueRotate = 330;
    this.saturate = 250;
    this.contrast = 400;
    this.attackView = '🗡';
  };

  var p = Object.create(Enemy.prototype);
  p.constructor = Dragon;

  p.push = function() {
    this.stage.enemyPush();
    log(this.view,'pushes onward!');
    this.hasActed
    //this.endTurn();
  };

  Object.defineProperty(p, 'actions', {
    get: function(){
      var fp = this.stage.playerInField.bind(this.stage);
      var ff = this.stage.fieldByCoord.bind(this.stage);
      if (this.pos.y !== 2 || (this.stage.activeRow === this.stage.rows-1) || fp(ff(0, 3)) || fp(ff(1,3)) || fp(ff(2,3))) {
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

  Dragon.prototype = p;
  window.Dragon = Dragon;
}());
