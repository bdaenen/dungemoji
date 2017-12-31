(function () {
  'use strict';

  var Spider = function(stage){
    Player.call(this, stage);
    this.type = 'e';
    this.view = '🕷';
    this.rotate = 180;
  };

  Spider.prototype = Object.create(Player.prototype);
  Spider.prototype.constructor = Spider;

  window.Spider = Spider;
}());
