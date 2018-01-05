(function () {
  'use strict';

  var Stage1 = function(){
    Stage.call(this);
  };

  var p = Object.create(Stage.prototype);
  p.constructor = Stage1;

  p.init = function(){
    // Mage
    this.addActor(create(this, 0, 5, 'Mage'));
    // Rogue
    this.addActor(create(this, 2, 4, 'Rogue'));
    // Warrior
    this.addActor(create(this, 1, 3, 'Warrior'));

    // Enemies
    /*this.addActor(create(this, 2, 0, 'Scorpion'));
    var spider = create(this, 0, 0, 'Spider');
    this.addActor(spider);

    this.addActor(create(this, 1, 0, 'Dragon'));*/

    this.turn = this.P;
    $('#log').innerText = '';
  };

  Stage1.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage1 = Stage1;
}());
