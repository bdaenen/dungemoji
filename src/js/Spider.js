(function () {
  'use strict';

  var Spider = function(stage){
    Enemy.call(this, stage);
    this.type = stage.TYPE_ENEMY;
    this.view = '🕷';
    this.rotate = 180;
    this.hueRotate = 120;
    this.saturate = 600;
  };

  Spider.prototype = Object.create(Enemy.prototype);
  Spider.prototype.constructor = Spider;

  window.Spider = Spider;
}());
