(function () {
  'use strict';

  var Stage7 = function(){
    Stage.call(this);
    this.rows = 6;
    this.activeRow = 3;
    this.intro = '<div class="intro-container">' +
      '<p>This is the final stage.</p>' +
      '<p>It will keep repeating with random setups.</p>' +
      '<p>Good luck!</p>' +
      '<button onclick="closeIntro();">Continue</button>' +
      '</div>';
  };

  var p = Object.create(Stage.prototype);
  var usedCoordinates = [];
  p.constructor = Stage7;

  p.init = function() {
    var players = ['Warrior', 'Mage', 'Rogue'];
    var enemies = ['Dragon', 'Spider', 'Scorpion'];

    for (var i = 0; i < 3; i++) {
      var coord = getRandomOpenCoordinate.bind(this)(this.P);
      this.addActor(create(this, coord[0], coord[1], players[rnd(0, players.length-1)]));
    }

    // Enemies
    for (i = 0; i < 3; i++) {
      coord = getRandomOpenCoordinate.bind(this)(this.E);
      this.addActor(create(this, coord[0], coord[1], enemies[rnd(0, enemies.length-1)]));
    }

    this.turn = this.P;
    $('#log').innerText = '';
    Stage.prototype.init.call(this);
  };

  Stage7.prototype = p;

  function getRandomOpenCoordinate(type) {
    var x;
    var y;
    if (type === this.P) {
      x = rnd(0, 2);
      y = rnd(3, 5);
    }
    else {
      x = rnd(0, 2);
      y = rnd(0, 2);
    }

    if (searchForArray(usedCoordinates, [x, y]) !== -1) {
      return getRandomOpenCoordinate.bind(this)(type);
    }
    else {
      usedCoordinates.push([x, y]);
      return [x, y];
    }
  }

  function searchForArray(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return i;
      }
    }
    return -1;
  }

  function create(stage, x, y, cn){
    var p = new window[cn](stage);
    p.move(x, y);
    return p;
  }

  window.Stage7 = Stage7;
}());
