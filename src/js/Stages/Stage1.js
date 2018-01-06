(function () {
  'use strict';

  var Stage1 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '<div class="intro-container">' +
      '<p>Welcome to Dungeon Push!</p>' +
      '<p>The objective of the game is to eliminate all enemies with the heroes available to you.</p>' +
      '<p>Let\'s start with a simple tutorial where you control the <span style="color: red">Warrior</span>.</p>' +
      '<p>To act, click your hero, choose an action, then choose a target.</p>' +
      '<p><b style="color: green"><br/>Goal: Eliminate the <span style="color:red">Dinosaur!</span></b></p>' +
      '<button onclick="closeIntro()">Continue</button>' +
      '<button onclick="disableTutorial()" class="small">Disable tutorial</button>' +
      '</div>';
  };

  var p = Object.create(Stage.prototype);
  p.constructor = Stage1;


  p.init = function() {
    // Warrior
    this.addActor(create(this, 1, 3, 'Warrior'));
    this.addActor(create(this, 2, 3, 'Rogue'));
    this.addActor(create(this, 0, 4, 'Mage'));

    // Enemies
    this.addActor(create(this, 1, 2, 'Dragon'));
    var spider = create(this, 0, 0, 'Spider');
    this.addActor(spider);

    this.addActor(create(this, 1, 0, 'Scorpion'));

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage1.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage1 = Stage1;
}());
