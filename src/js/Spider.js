(function () {
  'use strict';

  var Spider = function(stage){
    Enemy.call(this, stage);
    this.maxHealth = 3;
    this.health = 3;
    this.dex = 30;
    this.type = stage.E;
    this.view = '🕷';
    this.rotate = 180;
    this.hueRotate = 210;
    this.saturate = 600;
  };

  var p = Object.create(Enemy.prototype);
  p.constructor = Spider;

  p.getValidActionTargets = function(action){
    return Mage.prototype.getValidActionTargets.call(this, action);
  };

  Spider.prototype = p;

  window.Spider = Spider;
}());
