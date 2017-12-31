(function () {
  'use strict';

  var Stage1 = function(){
    Stage.call(this);
  };

  Stage1.prototype = Object.create(Stage.prototype);
  Stage1.prototype.constructor = Stage1;

  Stage1.prototype.init = function(){
    // Mage
    this.addActor(createPlayer(this, 0, 5, "🕺"));
    // Rogue
    this.addActor(createPlayer(this, 2, 5, '🤢'));
    // Warrior
    this.addActor(createPlayer(this, 1, 3, '😡'));

    // Enemies
    this.addActor(create(this, 1, 2, 'Scorpion'));
    var spider = create(this, 0, 2, 'Spider');
    this.addActor(spider);
  };

  function createPlayer(stage, x, y, view) {
    var p = new Player(stage);
    p.move(x, y);
    p.view = view;
    return p;
  }

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage1 = Stage1;
}());
