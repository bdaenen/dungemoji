(function () {
  'use strict';

  var Stage = function(){
    this.renderTargets = [];
    this.dirty = false;
    this._state = this.GAME_STATE_SELECT_CHARACTER;
    this.turn = this.TURN_PLAYER;
    this.currentSelection = null;
  };

  Stage.prototype = {
    GAME_STATE_SELECT_CHARACTER: 1,
    GAME_STATE_SELECT_ACTION: 2,
    GAME_STATE_SELECT_POSITION: 3,
    GAME_STATE_SELECT_TARGET: 4,
    TURN_PLAYER: 1,
    TURN_ENEMY: 2,
    init: function(){},
    addPlayer: function(player){
      this.renderTargets.push(player);
      this.dirty = true;
    },
    removePlayer: function(player){
      var idx = this.renderTargets.indexOf(player);
      idx !== -1 && this.renderTargets.splice(idx, 1);
      this.dirty = true;
    },
    render: function(){
      // Clear the field
      mappedStage.forEach(function(row){
        row.forEach(function(col) {
          col.innerText = '';
        });
      });

      // Render the stage
      this.renderTargets.forEach(function(item){
        var $field = this.getFieldByCoordinate(item.position.x, item.position.y);
        item.render($field);
      }, this);
      this.dirty = false;
    },
    /**
     * @param x
     * @param y
     * @param [type=FIELD_TYPE_STAGE]
     * @returns {*}
     */
    getFieldByCoordinate: function(x, y, type) {
      switch (type) {
        case FIELD_TYPE_ENEMY:
          return mappedEnemyFields[y][x];
          break;
        case FIELD_TYPE_PLAYER:
          return mappedPlayerFields[y][x];
          break;
        case FIELD_TYPE_STAGE:
        default:
          return mappedStage[y][x];
          break;
      }
    },
    getPlayerInField: function($field) {
      var playerFound = null;
      this.renderTargets.forEach(function(player){
        if (player.$field && (player.$field.id === $field.id)) {
          playerFound = player;
        }
      });

      return playerFound;
    },
    renderSelectAction: function() {
      $('.a').innerHTML = this.currentSelection.renderActions();
      this.currentSelection.$field.appendChild($('.a'));
    },
    hideSelectAction: function() {
      $('.a').innerHTML = '';
    }
  };

  Object.defineProperty(Stage.prototype, 'state', {
    get: function(){
      return this._state;
    },
    set: function(state) {
      this._state = state;
      if (state === this.GAME_STATE_SELECT_ACTION) {
        this.renderSelectAction();
      }
      else {
        this.hideSelectAction();
      }
    }
  });

  var mappedEnemyFields =
    [
      [$('#e-b-l'), $('#e-b-c'), $('#e-b-r')],
      [$('#e-m-l'), $('#e-m-c'), $('#e-m-r')],
      [$('#e-f-l'), $('#e-f-c'), $('#e-f-r')]
    ];

  var mappedPlayerFields =
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
