(function() {
  'use strict';
  var canvas = d.createElement('canvas');
  var ctx = canvas.getContext('2d');

  var gameLoop = function() {
    update();
    render();
    requestAnimationFrame(gameLoop);
  };

  function update() {

  }

  function render() {

  }

  gameLoop();

}());
