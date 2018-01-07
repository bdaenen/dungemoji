(function () {
  'use strict';

  var Stage3 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '<div class="intro-container">' +
      '<p>Well done! This is the last tutorial stage.</p>' +
      '<p>In this stage you\'ll get to know the <span style="color:green">Rogue</span> and the <span style="color: blue">Mage</span>.</p>' +
      '<p>As you probably noticed, heroes and enemies are colour-coded.</p>' +
      '<p>Red-coloured enemies have the same movement and attack options <br/>as the <span style="color: red">Warrior</span>, ' +
      'green as the <span style="color: green">Rogue</span>, ' + 'and blue as the <span style="color: blue">Mage</span>.</p>' +
      '<p><b style="color: gold"><br/>Goal: Eliminate the <span style="color:red">T-rex!</span></b></p>' +
      '<button onclick="closeIntro()">Continue</button>' +
      '</div>';
  };
  var p = Object.create(Stage.prototype);
  p.constructor = Stage3;


  p.init = function(){
    // Warrior
    this.addActor(create(this, 1, 3, 'Rogue'));
    this.addActor(create(this, 1, 5, 'Mage'));

    // Enemies
    this.addActor(create(this, 1, 2, 'Dragon'));

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage3.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage3 = Stage3;
}());
