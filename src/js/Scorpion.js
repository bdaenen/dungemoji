(function () {
  'use strict';

  var Scorpion = function(stage){
    Enemy.call(this, stage);
    this.view = '🦂';
    this.hueRotate = -20;
    this.saturate = 300;
  };

  Scorpion.prototype = Object.create(Enemy.prototype);
  Scorpion.prototype.constructor = Scorpion;

  window.Scorpion = Scorpion;
}());
