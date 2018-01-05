(function () {
  'use strict';

  var Dragon = function(stage){
    Enemy.call(this, stage);
    this.view = '🦖';
    this.hueRotate = 330;
    this.saturate = 250;
    this.contrast = 400;
  };

  var p = Object.create(Enemy.prototype);
  p.constructor = Dragon;

  Dragon.prototype = p;
  window.Dragon = Dragon;
}());
