(function () {
  'use strict';

  var Scorpion = function(stage){
    Player.call(this, stage);
    this.type = 'e';
    this.view = '🦂';
  };

  Scorpion.prototype = Object.create(Player.prototype);
  Scorpion.prototype.constructor = Scorpion;

  window.Scorpion = Scorpion;
}());
