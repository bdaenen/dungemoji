(function () {
  'use strict';

  var Stage2 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '<div class="intro-container">' +
      '<p>Good job!</p>' +
      '<p>This stage will introduce you to the "push" mechanic.</p>' +
      '<p>If no enemy occupies the front row, the <span style="color:red;">Warrior</span>\'s attack is replaced by "push" (<span class="emo-inline">⬆</span>).</p>' +
      '<p>Pushing the enemy back will put them at a disadvantage, as it limits their movement.</p>' +
      '<p>Keep in mind that as soon as you push, your turn ends!</p>' +
      '<p><b style="color: green"><br/>Goal: Eliminate the <span style="color:blue">Spider!</span></b></p>' +
      '<button onclick="closeIntro()">Continue</button>' +
      '</div>';
  };
  var p = Object.create(Stage.prototype);
  p.constructor = Stage2;


  p.init = function(){
    // Warrior
    this.addActor(create(this, 1, 3, 'Warrior'));

    // Enemies
    this.addActor(create(this, 1, 0, 'Spider'));
    /*var spider = create(this, 0, 0, 'Spider');
    this.addActor(spider);

    this.addActor(create(this, 1, 0, 'Dragon'));*/

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);

  };

  Stage2.prototype = p;

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage2 = Stage2;
}());
