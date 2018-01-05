(function () {
  'use strict';

  var Scorpion = function(stage){
    Enemy.call(this, stage);
    this.view = '🦂';
    this.type = stage.E;
    this.hueRotate = 120;
    this.saturate = 360;
  };

  var p = Object.create(Enemy.prototype);
  p.constructor = Scorpion;

  p.getValidActionTargets = function(action){
    return Rogue.prototype.getValidActionTargets.call(this, action);
  };

  Scorpion.prototype = p;
  window.Scorpion = Scorpion;
}());
