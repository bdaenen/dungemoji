(function () {
  'use strict';

  var Stage = function(){
    this.renderTargets = [];
    this.dirty = false;
    this._state = this.S_CHAR;
    this._turn = '';
    this.turn = this.P;
    this.currentSelection = null;
    this.rows = 8;
    this.activeRow = Math.floor(this.rows/2);
  };

  Stage.prototype = {
    S_CHAR: 1,
    S_ACT: 2,
    S_TAR: 3,
    S_AI: 4,
    P: 1,
    E: 2,
    init: function(){},
    addActor: function(player){
      this.renderTargets.push(player);
      this.dirty = true;
    },
    removeActor: function(player){
      var idx = this.renderTargets.indexOf(player);
      idx !== -1 && this.renderTargets.splice(idx, 1);
      this.dirty = true;
    },
    render: function(){
      // Clear the field
      mappedStage.forEach(function(row){
        row.forEach(function(col) {
          col.innerText = '';
          if (((+col.dataset.y) < 3-this.activeRow) || ((+col.dataset.y) > (this.rows - this.activeRow+2))) {
            col.classList.add('wall');
            col.parentNode.classList.add('wall');
          }
          else {
            col.classList.remove('wall');
            col.parentNode.classList.remove('wall');
          }
        }, this);
      }, this);

      // Render the stage
      this.renderTargets.forEach(function(item){
        var $field = this.fieldByCoord(item.pos.x, item.pos.y);
        item.render($field);
      }, this);

      var $mmul = $('#mmul');
      $mmul.innerHTML = '';
      for (var i = 0; i < this.rows; i++) {
        $mmul.appendChild(document.createElement('li'));
      }
      var rows = $$('#mm li');
      rows.forEach(function(row){row.classList.remove('active')});
      rows[this.activeRow].classList.add('active');

      this.dirty = false;
    },
    /**
     * @param x
     * @param y
     * @param [type=FIELD_TYPE_STAGE]
     * @returns {*}
     */
    fieldByCoord: function(x, y, type) {
      switch (type) {
        case FIELD_TYPE_ENEMY:
          return mappedEnemyFields[y] && mappedEnemyFields[y][x];
          break;
        case FIELD_TYPE_PLAYER:
          return mappedPlayerFields[y] && mappedPlayerFields[y][x];
          break;
        case FIELD_TYPE_STAGE:
        default:
          return mappedStage[y] && mappedStage[y][x];
          break;
      }
    },
    playerFieldByCoord: function(x, y, type) {
      if (y > 2) {
        return this.fieldByCoord(x, y, type);
      }
    },
    enemyFieldByCoord: function(x, y, type) {
      if (y <= 2) {
        return this.fieldByCoord(x, y, type);
      }
    },
    playerInField: function($field, type, yetToAct) {
      var playerFound = null;
      var targets;

      if (!type) {
        targets = this.renderTargets;
      }
      else if (type === this.P) {
        targets = yetToAct ? this.playersToAct : this.players;
      }
      else {
        targets = yetToAct ? this.enemiesToAct : this.enemiesToAct;
      }

      targets.forEach(function(player){
        if (player.$field && (player.$field.id === $field.id)) {
          playerFound = player;
        }
      });

      return playerFound;
    },
    updateAi: function() {
      this.state = this.S_AI;
      var yetToAct = this.enemiesToAct;
      var enemy = yetToAct.shift();

      if (!enemy) {
        return this.endTurn();
      }

      enemy.determineTarget();
      (function (enemy) {
        setTimeout(function(){
          this.state === this.S_AI && enemy.determineAction();
        }.bind(this), 1000);
        setTimeout(function(){
          this.state === this.S_AI && enemy.determineAction();
        }.bind(this), 2000);
        setTimeout(function(){
          this.state === this.S_AI && enemy.determineAction();
        }.bind(this), 3000);
      }.bind(this)(enemy));
    },
    renderSelectAction: function() {
      setTimeout(function(){
        $('.a').innerHTML = this.currentSelection.renderActions();
        this.currentSelection.$field.appendChild($('.a'));
      }.bind(this), 100);
    },
    hideSelectAction: function() {
      $('.a').innerHTML = '';
      $('#m').appendChild($('.a'));
    },
    endTurn: function() {
      if (!this.enemiesToAct.length && !this.playersToAct.length) {
        log('= end of round =');
        this.renderTargets.forEach(function(e){e.hasActed = false}, this);
      }
      else {
        log('= end of turn =');
      }
      this.turn = (this.turn === this.E) ? this.P : this.E;
      this.state = this.S_CHAR;
    },
    playerPush: function() {
      this.activeRow--;
      this.enemies.forEach(function(enemy){
        if (enemy.pos.y < 2) {
          enemy.pos.y++;
        }
      });
    },
    enemyPush: function() {
      this.activeRow++;
      this.players.forEach(function(player){
        player.pos.y > 3 && (player.pos.y--);
      });
    }
  };

  Object.defineProperty(Stage.prototype, 'state', {
    get: function(){
      return this._state;
    },
    set: function(state) {
      this._state = state;
      if (state === this.S_ACT) {
        this.renderSelectAction();
      }
      else if (state !== this.S_TAR) {
        this.hideSelectAction();
      }
    }
  });

  Object.defineProperty(Stage.prototype, 'turn', {
    get: function(){
      return this._turn;
    },
    set: function(turn){
      var $turn = $('.turn');
      var cl = $('html').classList;
      this._turn = turn;
      if (turn === this.E) {
        $turn.innerText = 'Enemy';
        cl.add('enemy');
      }
      else {
        $turn.innerText = 'Player';
        cl.remove('enemy');
      }
      (turn === this.E) ? (($turn.innerText = 'Enemy') && cl.add('enemy')) : (($turn.innerText = 'Player') && cl.remove('enemy'));
      $turn.innerText += ' Turn';
      this.dirty = true;
    }
  });

  Object.defineProperty(Stage.prototype, 'enemies', {
    get: function() {
      return this.renderTargets.filter(function(tar){
        return tar.type === this.E;
      }, this);
    }
  });

  Object.defineProperty(Stage.prototype, 'players', {
    get: function() {
      return this.renderTargets.filter(function(tar){
        return tar.type === this.P;
      }, this);
    }
  });

  Object.defineProperty(Stage.prototype, 'enemiesToAct', {
    get: function() {
      return this.renderTargets.filter(function(tar){
        return tar.type === this.E && !tar.hasActed;
      }, this);
    }
  });

  Object.defineProperty(Stage.prototype, 'playersToAct', {
    get: function() {
      return this.renderTargets.filter(function(tar){
        return tar.type === this.P && !tar.hasActed;
      }, this);
    }
  });

  window.mappedEnemyFields =
    [
      [$('#e-b-l'), $('#e-b-c'), $('#e-b-r')],
      [$('#e-m-l'), $('#e-m-c'), $('#e-m-r')],
      [$('#e-f-l'), $('#e-f-c'), $('#e-f-r')]
    ];

  window.mappedPlayerFields =
    [
      [$('#p-f-l'), $('#p-f-c'), $('#p-f-r')],
      [$('#p-m-l'), $('#p-m-c'), $('#p-m-r')],
      [$('#p-b-l'), $('#p-b-c'), $('#p-b-r')]
    ];

  window.mappedStage = mappedEnemyFields.concat(mappedPlayerFields);

  var x = 0;
  var y = 0;
  mappedStage.forEach(function(row){
    row.forEach(function($col){
      $col.dataset.x = x;
      $col.dataset.y = y;
      x++;
    });
    y++;
    x = 0;
  });

  window.FIELD_TYPE_PLAYER = 1;
  window.FIELD_TYPE_ENEMY = 2;
  window.FIELD_TYPE_STAGE = 3;

  window.Stage = Stage;
}());
