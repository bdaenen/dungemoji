(function () {
  'use strict';

  var Spider = function(stage){
    Enemy.call(this, stage);
    this.maxHealth = 2;
    this.health = 2;
    this.dex = 0;
    this.str = 1.5;
    this.type = stage.E;
    this.view = '🕷';
    this.rotate = 180;
    this.hueRotate = 210;
    this.saturate = 600;
    this.attackView = '🕸';
  };

  var p = Object.create(Enemy.prototype);
  p.constructor = Spider;

  p.getValidActionTargets = function(action){
    return Mage.prototype.getValidActionTargets.call(this, action);
  };

  Spider.prototype = p;

  window.Spider = Spider;
}());
