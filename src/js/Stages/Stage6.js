(function () {
  'use strict';

  var Stage6 = function(){
    Stage.call(this);
    this.rows = 8;
    this.activeRow = 3;
    this.intro = '';
  };

  var p = Object.create(Stage.prototype);
  p.constructor = Stage6;

  p.init = function() {
    this.addActor(create(this, 1, 3, 'Rogue'));
    this.addActor(create(this, 2, 3, 'Mage'));

    // Enemies
    this.addActor(create(this, 1, 2, 'Dragon'));
    var spider = create(this, 0, 0, 'Spider');
    this.addActor(spider);

    this.addActor(create(this, 1, 0, 'Scorpion'));

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage6.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage6 = Stage6;
}());
