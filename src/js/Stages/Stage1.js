(function () {
  'use strict';

  var Stage1 = function(){
    Stage.call(this);
  };

  Stage1.prototype = Object.create(Stage.prototype);
  Stage1.prototype.constructor = Stage1;

  Stage1.prototype.init = function(){
    var mage = new Player(this);
    mage.move(0, 5);
    mage.view = "🧙";
    mage.sta = 10;
    this.addPlayer(mage);

    var warrior = new Player(this);
    warrior.move(1, 3);
    // The below string is not empty, but PHPStorm fails to render it.
    warrior.view = "🤴🏻";
    this.addPlayer(warrior);
  };

  window.Stage1 = Stage1;
}());
