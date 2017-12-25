(function () {
  'use strict';

  var Stage1 = function(){
    Stage.call(this);
  };

  Stage1.prototype = Object.create(Stage.prototype);
  Stage1.prototype.constructor = Stage1;

  Stage1.prototype.init = function(){
    var ghost = new Player(this);
    ghost.move(1, 0);
    ghost.view = "👻";
    ghost.sta = 10;
    this.addPlayer(ghost);

    var warrior = new Player(this);
    // The below string is not empty, but PHPStorm fails to render it.
    warrior.view = "🤴🏻";
    this.addPlayer(warrior);
  };

  window.Stage1 = Stage1;
}());