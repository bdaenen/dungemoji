(function () {
  'use strict';

  var Player = function(stage){
    var t = this;
    t.stage = stage;
    t.pos = {x:0,y:0};
    t.str = 1;
    t.dex = 10;
    t.int = 10;
    t._sta = 6;
    t.maxHealth = this._sta;
    t._health = this._sta;
    t.type = stage.P;
    t.view = "😡";
    t.$field = n;
    t.$view = n;
    t.curAction = n;
    t.rotate = 0;
    t.hueRotate = 0;
    t.saturate = 100;
    t._hasAttacked = false;
    t._hasMoved = false;
    t._hasActed = false;
    t._alive = true;
    t._actions = [
      {
        actionId: 'move',
        view: '🏃',
        range: 1,
        type: stage.P
      },
      {
        actionId: 'attack',
        view: '🗡',
        range: 1,
        rangeX: 0,
        type: stage.E
      },
      {
        actionId: 'endTurn',
        view: '🔚',
        type: stage.P
      }
    ];
  };

  Player.prototype = {
    move: function(x, y){
      if (x instanceof Node) {
        return this.move(+x.dataset.x, +x.dataset.y);
      }
      if (this.stage.pInF(this.stage.fByC(x, y))) {
        console.warn('cant move to occupied field');
        return false;
      }
      this.pos.x = x;
      this.pos.y = y;
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
      var target = this.stage.pInF($field);
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
      var t = this;
      this.curAction = this.actions.filter(function(o){return o.actionId === actionId})[0];

      if (t.curAction.range) {
        t.hideValidActionTargets();
        t.renderValidActionTargets(this.curAction);
        t.stage.state = t.stage.S_TAR;
      }
      else {
        t.performSelectedAction();
      }
    },
    performSelectedAction: function($field) {
      var t = this;
      var a = t.curAction.actionId;
      t.stage.hideSelectAction();
      t[a]($field);
      if (a === 'move') {
        t.hasMoved = true;
      }
      else if (a === 'attack') {
        t.hasAttacked = true;
      }
      else if (a === 'endTurn') {
        t.endTurn();
      }
      t.hideValidActionTargets();
      t.stage.dirty = true;
    },
    endTurn: function() {
      // Only a player can end player turns, only enemy can end enemy turns.
      if (this.stage.turn === this.type) {
        this.hasActed = true;
        this.stage.endTurn();
      }
    },
    getValidActionTargets: function(action) {
      var t = this;
      var ff;
      var x;
      var y;
      var f;
      var i;

      if (action.type === t.stage.P) {
        if (t.type === t.stage.P) {
          ff = t.stage.pFByC.bind(t.stage);
        }
        else {
          ff = t.stage.eFByC.bind(t.stage);
        }
        x = t.pos.x;
        y = t.pos.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x + i, y), ff(x - i, y), ff(x, y + i), ff(x, y - i)]);
        }

        // Filter out undefined nodes and occupied nodes.
        f = f.filter(function (o) {
          return (o && !(find(o, '.view').length))
        });
      }
      if (action.type === t.stage.E) {
        if (t.type === t.stage.P) {
          ff = t.stage.eFByC.bind(t.stage);
        }
        else {
          ff = t.stage.pFByC.bind(t.stage);
        }
        x = t.pos.x;
        y = t.pos.y;
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
      var t = this;
      var viewElement = document.createElement('div');
      viewElement.innerText = t.view;
      viewElement.classList.add('view');
      viewElement.style.transform = 'rotate(' + t.rotate + 'deg)';
      viewElement.style.filter = 'hue-rotate('+t.hueRotate+'deg) saturate('+t.saturate+'%)';
      div.appendChild(viewElement);

      if (t.hasActed) {
        viewElement.classList.add('hasActed');
      }

      t.$view = viewElement;
      t.$field = div;

      var healthContainer = document.createElement('div');
      healthContainer.classList.add('health');

      for (var i = t.health; i > 0; i--) {
        healthContainer.innerText += '❤';
      }
      t.$field.appendChild(healthContainer);
    },
    renderActions: function () {
      var t = this;
      var b = document.createElement('b');
      t.actions.forEach(function(action) {
        var $n = document.createElement('li');
        if ((action.actionId === 'move') && t.hasMoved) {
          return;
        }
        else if ((action.actionId === 'attack') && t.hasAttacked) {
          return;
        }

        var targets = t.getValidActionTargets(action);
        if (action.actionId !== 'endTurn' && (!targets || !targets.length)) {
          $n.classList.add('noRange');
        }

        $n.innerText = action.view;
        $n.dataset.actionId = action.actionId;
        b.appendChild($n);
      }, t);

      return b.innerHTML;
    },
    kill: function(){
      var t = this;
      log(t.view, 'was slain!');
      t._alive = false;
      t.stage.removeActor(t);
      t.stage = n;
      t.pos = n;
      t.str = n;
      t.dex = n;
      t.int = n;
      t._sta = n;
      t.maxHealth = n;
      t._health = n;
      t.type = n;
      t.view = n;
      t.$field = n;
      t.$view = n;
      t.curAction = n;
      t.rotate = n;
      t._hasAttacked = n;
      t._hasMoved = n;
      t._hasActed = n;
      t.actions = n;
    }
  };

  dp(Player.prototype, 'sta', {
    get: function() {
      return this._sta;
    },
    set: function(sta) {
      var t = this;
      t._sta = sta;
      t.maxHealth = t._sta;
      t.health > t.maxHealth && (t.health = t.maxHealth);
    }
  });

  dp(Player.prototype, 'health', {
    get: function() {
      return this._health;
    },
    set: function(val) {
      var t = this;
      t._health = val;
      t.health > t.maxHealth && (t._health = t.maxHealth);
      t.health <= 0 && t.kill();
    }
  });

  dp(Player.prototype, 'hasActed', {
    get: function() {
      return this._hasActed;
    },
    set: function(val) {
      this._hasActed = val;
      this._hasAttacked = val;
      this._hasMoved = val;
    }
  });

  dp(Player.prototype, 'hasMoved', {
    get: function() {
      return this._hasMoved;
    },
    set: function(val) {
      var t = this;
      if (val === t._hasMoved) {
        return;
      }
      t._hasMoved = val;
      if (t._hasMoved && t._hasAttacked && !t.hasActed) {
        t.hasActed = true;
      }
      else if (!val) {
        t._hasActed = false;
      }
    }
  });

  dp(Player.prototype, 'hasAttacked', {
    get: function() {
      return this._hasAttacked;
    },
    set: function(val) {
      var t = this;
      if (val === t._hasAttacked) {
        return;
      }
      t._hasAttacked = val;
      if (t._hasMoved && t._hasAttacked && !t.hasActed) {
        t.hasActed = true;
      }
      else if (!val) {
        t._hasActed = false;
      }
    }
  });

  dp(Player.prototype, 'alive', {
    get: function() {
      return this._alive;
    }
  });

  dp(Player.prototype, 'actions', {
    get: function() {
      return this._actions;
    },
    set: function(v){
      this._actions = v;
    }
  });

  window.Player = Player;
}());
