(function () {
  'use strict';

  var Stage5 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '';
  };

  var p = Object.create(Stage.prototype);
  p.constructor = Stage5;

  p.init = function() {
    // Warrior
    this.addActor(create(this, 1, 3, 'Warrior'));
    this.addActor(create(this, 2, 4, 'Rogue'));
    this.addActor(create(this, 0, 5, 'Mage'));

    // Enemies
    this.addActor(create(this, 1, 2, 'Dragon'));
    var spider = create(this, 0, 0, 'Spider');
    this.addActor(spider);

    this.addActor(create(this, 1, 0, 'Scorpion'));

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage5.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage5 = Stage5;
}());
