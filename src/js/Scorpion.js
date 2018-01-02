(function () {
  'use strict';

  var Scorpion = function(stage){
    Enemy.call(this, stage);
    this.view = '🦂';
  };

  Scorpion.prototype = Object.create(Enemy.prototype);
  Scorpion.prototype.constructor = Scorpion;

  window.Scorpion = Scorpion;
}());
