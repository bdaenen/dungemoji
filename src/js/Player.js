(function () {
  'use strict';

  var Player = function(stage){
    this.stage = stage;
    this.position = {x:0,y:0};
    this.str = 1;
    this.dex = 10;
    this.int = 10;
    this._sta = 6;
    this.maxHealth = this._sta;
    this._health = this._sta;
    this.type = stage.TYPE_PLAYER;
    this.view = "😡";
    this.$field = null;
    this.$view = null;
    this.currentAction = null;
    this.rotate = 0;
    this.hueRotate = 0;
    this.saturate = 100;
    this._hasAttacked = false;
    this._hasMoved = false;
    this._hasActed = false;
    this._alive = true;
    this._actions = [
      {
        actionId: 'move',
        view: '🏃',
        range: 1,
        type: stage.TYPE_PLAYER
      },
      {
        actionId: 'attack',
        view: '🗡',
        range: 1,
        rangeX: 0,
        type: stage.TYPE_ENEMY
      },
      {
        actionId: 'endTurn',
        view: '🔚',
        type: stage.TYPE_PLAYER
      }
    ];
  };

  Player.prototype = {
    move: function(x, y){
      if (x instanceof Node) {
        return this.move(+x.dataset.x, +x.dataset.y);
      }
      if (this.stage.getPlayerInField(this.stage.getFieldByCoordinate(x, y))) {
        console.warn('cant move to occupied field');
        return false;
      }
      this.position.x = x;
      this.position.y = y;
      this.stage.dirty = true;

      if (!this.playerTarget) {
        log(this.view, 'moves');
      }
      else {
        log(this.view, 'moves towards', this.playerTarget.view);
      }
    },
    attack: function($field) {
      if (!$field) {
        return;
      }
      var target = this.stage.getPlayerInField($field);
      var critmp = 1;
      log(this.view, 'attacks', target.view);
      if (Math.random() > target.dex/100) {
        (Math.random() < this.dex/150) && (critmp = 2) && log('Critical hit!');
        log(target.view, 'receives', (this.str * 2 * critmp), 'damage');
        target.health -= (this.str * 2 * critmp);
      }
      else {
        log(target.view, 'dodged!');
        // Dodged
      }
    },
    selectAction: function(actionId) {
      this.currentAction = this.actions.filter(function(o){return o.actionId === actionId})[0];

      if (this.currentAction.range) {
        this.hideValidActionTargets();
        this.renderValidActionTargets(this.currentAction);
        this.stage.state = this.stage.GAME_STATE_SELECT_TARGET;
      }
      else {
        this.performSelectedAction();
      }
    },
    performSelectedAction: function($field) {
      this.stage.hideSelectAction();
      this[this.currentAction.actionId]($field);
      if (this.currentAction.actionId === 'move') {
        this.hasMoved = true;
      }
      else if (this.currentAction.actionId === 'attack') {
        this.hasAttacked = true;
      }
      else if (this.currentAction.actionId === 'endTurn') {
        this.endTurn();
      }
      this.hideValidActionTargets();
      this.stage.dirty = true;
    },
    endTurn: function() {
      // Only a player can end player turns, only enemy can end enemy turns.
      if (this.stage.turn === this.type) {
        this.hasActed = true;
        this.stage.endTurn();
      }
    },
    getValidActionTargets: function(action) {
      var ff;
      var x;
      var y;
      var f;
      var i;

      if (action.type === this.stage.TYPE_PLAYER) {
        if (this.type === this.stage.TYPE_PLAYER) {
          ff = this.stage.getPlayerFieldByCoordinate.bind(this.stage);
        }
        else {
          ff = this.stage.getEnemyFieldByCoordinate.bind(this.stage);
        }
        x = this.position.x;
        y = this.position.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x + i, y), ff(x - i, y), ff(x, y + i), ff(x, y - i)]);
        }

        // Filter out undefined nodes and occupied nodes.
        f = f.filter(function (o) {
          return (o && !(find(o, '.view').length))
        });
      }
      if (action.type === this.stage.TYPE_ENEMY) {
        if (this.type === this.stage.TYPE_PLAYER) {
          ff = this.stage.getEnemyFieldByCoordinate.bind(this.stage);
        }
        else {
          ff = this.stage.getPlayerFieldByCoordinate.bind(this.stage);
        }
        x = this.position.x;
        y = this.position.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x, y + i), ff(x, y - i)]);
        }
        f = f.filter(function(o){return o});
      }

      return f;
    },
    renderValidActionTargets: function(action) {
      var fields = this.getValidActionTargets(action);
      fields.forEach(function(o){
        o.classList.add('valid');
      });

      return fields;
    },
    hideValidActionTargets: function() {
      $$('.valid').forEach(function(n){n.classList.remove('valid')});
    },
    render: function(div) {
      var viewElement = document.createElement('div');
      viewElement.innerText = this.view;
      viewElement.classList.add('view');
      viewElement.style.transform = 'rotate(' + this.rotate + 'deg)';
      viewElement.style.filter = 'hue-rotate('+this.hueRotate+'deg) saturate('+this.saturate+'%)';
      div.appendChild(viewElement);

      if (this.hasActed) {
        viewElement.classList.add('hasActed');
      }

      this.$view = viewElement;
      this.$field = div;

      var healthContainer = document.createElement('div');
      healthContainer.classList.add('health');

      for (var i = this.health; i > 0; i--) {
        healthContainer.innerText += '❤';
      }
      this.$field.appendChild(healthContainer);
    },
    renderActions: function () {
      var b = document.createElement('b');
      this.actions.forEach(function(action) {
        var $n = document.createElement('li');
        if ((action.actionId === 'move') && this.hasMoved) {
          return;
        }
        else if ((action.actionId === 'attack') && this.hasAttacked) {
          return;
        }

        var targets = this.getValidActionTargets(action);
        if (action.actionId !== 'endTurn' && (!targets || !targets.length)) {
          $n.classList.add('noRange');
        }

        $n.innerText = action.view;
        $n.dataset.actionId = action.actionId;
        b.appendChild($n);
      }, this);

      return b.innerHTML;
    },
    kill: function(){
      log(this.view, 'was slain!');
      this._alive = false;
      this.stage.removeActor(this);
      this.stage = null;
      this.position = null;
      this.str = null;
      this.dex = null;
      this.int = null;
      this._sta = null;
      this.maxHealth = null;
      this._health = null;
      this.type = null;
      this.view = null;
      this.$field = null;
      this.$view = null;
      this.currentAction = null;
      this.rotate = null;
      this._hasAttacked = null;
      this._hasMoved = null;
      this._hasActed = null;
      this.actions = null;
    }
  };

  Object.defineProperty(Player.prototype, 'sta', {
    get: function() {
      return this._sta;
    },
    set: function(sta) {
      this._sta = sta;
      this.maxHealth = this._sta;
      this.health > this.maxHealth && (this.health = this.maxHealth);
    }
  });

  Object.defineProperty(Player.prototype, 'health', {
    get: function() {
      return this._health;
    },
    set: function(val) {
      this._health = val;
      this.health > this.maxHealth && (this._health = this.maxHealth);
      this.health <= 0 && this.kill();
    }
  });

  Object.defineProperty(Player.prototype, 'hasActed', {
    get: function() {
      return this._hasActed;
    },
    set: function(val) {
      this._hasActed = val;
      this._hasAttacked = val;
      this._hasMoved = val;
    }
  });

  Object.defineProperty(Player.prototype, 'hasMoved', {
    get: function() {
      return this._hasMoved;
    },
    set: function(val) {
      if (val === this._hasMoved) {
        return;
      }
      this._hasMoved = val;
      if (this._hasMoved && this._hasAttacked && !this.hasActed) {
        this.hasActed = true;
      }
      else if (!val) {
        this._hasActed = false;
      }
    }
  });

  Object.defineProperty(Player.prototype, 'hasAttacked', {
    get: function() {
      return this._hasAttacked;
    },
    set: function(val) {
      if (val === this._hasAttacked) {
        return;
      }
      this._hasAttacked = val;
      if (this._hasMoved && this._hasAttacked && !this.hasActed) {
        this.hasActed = true;
      }
      else if (!val) {
        this._hasActed = false;
      }
    }
  });

  Object.defineProperty(Player.prototype, 'alive', {
    get: function() {
      return this._alive;
    }
  });

  Object.defineProperty(Player.prototype, 'actions', {
    get: function() {
      return this._actions;
    },
    set: function(v){
      this._actions = v;
    }
  });

  window.Player = Player;
}());
