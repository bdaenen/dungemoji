(function () {
  'use strict';

  var Stage4 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '<div class="intro-container">' +
      '<p>Now the real game begins.</p>' +
      '<p>If you need any more information, click the "manual" button at the bottom of the page.</p>' +
      '<p>Good luck!</p>' +
      '<button onclick="closeIntro();">Continue</button>' +
      '</div>';
    showManualButton();
  };
  var p = Object.create(Stage.prototype);
  p.constructor = Stage4;


  p.init = function(){
    // Warrior
    this.addActor(create(this, 1, 3, 'Rogue'));
    this.addActor(create(this, 1, 5, 'Mage'));

    // Enemies
    this.addActor(create(this, 0, 0, 'Spider'));
    this.addActor(create(this, 1, 2, 'Dragon'));

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage4.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage4 = Stage4;
}());
