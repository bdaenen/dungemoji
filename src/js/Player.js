(function () {
  'use strict';

  var Player = function(stage){
    var t = this;
    t.stage = stage;
    t.pos = {x:0,y:0};
    t.str = 1;
    t.dex = 10;
    t.int = 10;
    t._sta = 5;
    t.maxHealth = this._sta;
    t._health = this._sta;
    t.type = stage.P;
    t.view = "😡";
    t.$field = null;
    t.$view = null;
    t.curAction = null;
    t.rotate = 0;
    t.hueRotate = 0;
    t.saturate = 100;
    t.contrast = 100;
    t._hasAttacked = false;
    t._hasMoved = false;
    t._hasActed = false;
    t._alive = true;
    t.attackView = '🗡';
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
      var $field = this.stage.fieldByCoord(x, y);
      if (this.stage.inited && (this.stage.playerInField($field) || $field.classList.contains('wall'))) {
        console.warn('cant move to occupied or walled field');
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
      var target = this.stage.playerInField($field);
      if (!target) {
        return;
      }
      var critmp = 1;
      this.renderAttack(target);
      log(this.view, 'attacks', target.view);
      if (Math.random() > target.dex/100) {
        (Math.random() < this.dex/150) && (critmp = 1.5) && log('Critical hit!');
        log(target.view, 'receives', (this.str * critmp), 'damage');
        target.health -= (this.str * critmp);
      }
      else {
        log(target.view, 'dodged!');
        target.renderDodge();
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
      var ff;
      var x;
      var y;
      var f;
      var i;

      if (action.type === this.stage.P) {
        if (this.type === this.stage.P) {
          ff = this.stage.playerFieldByCoord.bind(this.stage);
        }
        else {
          ff = this.stage.enemyFieldByCoord.bind(this.stage);
        }
        x = this.pos.x;
        y = this.pos.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x + i, y), ff(x - i, y), ff(x, y + i), ff(x, y - i)]);
        }

        // Filter out undefined nodes and occupied nodes.
        f = f.filter(function (o) {
          return (o && !(find(o, '.view').length) && !(o.classList.contains('wall')))
        });
      }
      if (action.type === this.stage.E) {
        if (this.type === this.stage.P) {
          ff = this.stage.enemyFieldByCoord.bind(this.stage);
        }
        else {
          ff = this.stage.playerFieldByCoord.bind(this.stage);
        }
        x = this.pos.x;
        y = this.pos.y;
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
      viewElement.style.filter = 'hue-rotate('+t.hueRotate+'deg) saturate('+t.saturate+'%) contrast('+t.contrast+'%)';
      div.appendChild(viewElement);

      if (t.hasActed) {
        viewElement.classList.add('hasActed');
      }

      t.$view = viewElement;
      t.$field = div;

      var healthContainer = document.createElement('div');
      healthContainer.classList.add('health');
      var count = 0;
      for (var i = t.health; i > 0; i--) {
        if (i > 5 || (count + i) > 5) {
          healthContainer.innerText += '💕';
          i--;
        }
        else if (i >= 1) {
          healthContainer.innerText += '❤';
        }
        // Half damage is possible with crits.
        else {
          healthContainer.innerText += '💔';
        }
        count++;
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
    renderAttack: function(target) {
      var pos = target.pos;
      // SetTimeout to bypass stage updating clearing this. #notime.
      setTimeout(function () {
        var effectDiv = document.createElement('div');
        effectDiv.classList.add('effect');
        effectDiv.innerText = this.attackView;
        this.$field.appendChild(effectDiv);
        var count = 0;
        var fading = false;

        effectDiv.addEventListener('transitionend', function(e){
          count++;
          if (count > 1) {
            if (fading) {
              return effectDiv.remove();
            }
            fading = true;
            effectDiv.classList.add('fade');
          }
        }.bind(this));

        setTimeout(function(){
          var xDelta = this.pos.x - pos.x;
          var yDelta = this.pos.y - pos.y;
          xDelta *= -317;
          xDelta += (317/2);
          yDelta *= 117;
          effectDiv.style.left = xDelta;
          effectDiv.style.top = -yDelta;
        }.bind(this), 100);
      }.bind(this), 100);
    },
    renderDodge: function() {
      // SetTimeout to bypass stage updating clearing this. #notime.
      setTimeout(function(){
        var effectDiv = document.createElement('div');
        effectDiv.classList.add('effect', 'dodge');
        effectDiv.innerText = '💨';

        this.$field.appendChild(effectDiv);
        var fading = false;

        effectDiv.addEventListener('transitionend', function(e){
          if (!fading) {
            fading = true;
            effectDiv.classList.add('fade');
          }
          else {
            effectDiv.remove();
          }
        }.bind(this));

        setTimeout(function(){
          effectDiv.style.left = 317/2+40;
        }.bind(this), 100);
      }.bind(this), 100);
    },
    kill: function(){
      var t = this;
      log(t.view, 'was slain!');
      t._alive = false;
      t.stage.removeActor(t);
      t.stage = null;
      t.pos = null;
      t.str = null;
      t.dex = null;
      t.int = null;
      t._sta = null;
      t.maxHealth = null;
      t._health = null;
      t.type = null;
      t.view = null;
      t.$field = null;
      t.$view = null;
      t.curAction = null;
      t.rotate = null;
      t._hasAttacked = null;
      t._hasMoved = null;
      t._hasActed = null;
      t.actions = null;
    }
  };

  Object.defineProperty(Player.prototype, 'sta', {
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

  Object.defineProperty(Player.prototype, 'health', {
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

  Object.defineProperty(Player.prototype, 'hasAttacked', {
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
