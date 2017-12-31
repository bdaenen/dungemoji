(function () {
  'use strict';

  var Player = function(stage){
    this.stage = stage;
    this.position = {x:0,y:0};
    this.str = 10;
    this.dex = 10;
    this.int = 10;
    this._sta = 10;
    this.maxHealth = this._sta * 10;
    this.health = this.maxHealth;
    this.type = 'p';
    this.view = "👦🤵🏻";
    this.$field = null;
    this.currentAction = null;
    this.rotate = 0;
    this.hasAttacked = false;
    this.hasMoved = false;
    this.actions = [
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
        type: stage.TYPE_ENEMY
      }
    ];
  };

  Player.prototype = {
    move: function(x, y){
      if (x instanceof Node) {
        return this.move(x.dataset.x, x.dataset.y);
      }
      if (this.stage.getPlayerInField(this.stage.getFieldByCoordinate(x, y))) {
        console.warn('cant move to occupied field');
        return false;
      }
      this.position.x = x;
      this.position.y = y;
      this.stage.dirty = true;
    },
    attack: function($field) {
      var target = this.stage.getPlayerInField($field);
      var critmp = 1;
      if (Math.random() > target.dex/100) {
        Math.random() > this.dex/150 && (critmp = 2);
        target.health -= (this.str * 2 * critmp);
      }
      else {
        // Dodged
      }
    },
    selectAction: function(actionId) {
      this.currentAction = this.actions.filter(function(o){return o.actionId === actionId})[0];
      this.stage.hideSelectAction();
      this.renderValidActionTargets(this.currentAction);
      this.stage.state = this.stage.GAME_STATE_SELECT_TARGET;
    },
    performSelectedAction: function($field) {
      this[this.currentAction.actionId]($field);
      if (this.currentAction.actionId === 'move') {
        this.hasMoved = true;
      }
      else if (this.currentAction.actionId === 'attack') {
        this.hasAttacked = true;
      }
      this.hideValidActionTargets();
    },
    renderValidActionTargets: function(action) {
      var ff;
      var x;
      var y;
      var f;
      var i;

      if (action.type === this.stage.TYPE_PLAYER) {
        ff = this.stage.getPlayerFieldByCoordinate.bind(this.stage);
        x = this.position.x;
        y = this.position.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x+i, y), ff(x-i, y), ff(x, y+i), ff(x, y-i)]);
        }
        f = f.filter(function(o){return o});
        f.forEach(function(o){
          o.classList.add('valid');
        })
      }
      else if (action.type === this.stage.TYPE_ENEMY) {
        ff = this.stage.getEnemyFieldByCoordinate.bind(this.stage);
        x = this.position.x;
        y = this.position.y;
        f = [];
        for (i = 1; i <= action.range; i++) {
          f = f.concat([ff(x+i, y), ff(x-i, y), ff(x, y+i), ff(x, y-i)]);
        }
        f = f.filter(function(o){return o});
        f.forEach(function(o){
          o.classList.add('valid');
        })
      }
    },
    hideValidActionTargets: function() {
      $$('.valid').forEach(function(n){n.classList.remove('valid')});
    },
    render: function(div) {
      div.innerText += this.view;
      div.dataset.player = this;
      this.$field = div;
      this.$field.style.transform = 'rotate(' + this.rotate + 'deg)';
    },
    renderActions: function () {
      var b = document.createElement('b');
      this.actions.forEach(function(action) {
        if ((action.actionId === 'move') && this.hasMoved) {
          return;
        }
        else if ((action.actionId === 'attack') && this.hasAttacked) {
          return;
        }
        var $n = document.createElement('li');
        $n.innerText = action.view;
        $n.dataset.actionId = action.actionId;
        b.appendChild($n);
      }, this);

      return b.innerHTML;
    }
  };

  Object.defineProperty(Player.prototype, 'sta', {
    get: function() {
      return this._sta;
    },
    set: function(sta) {
      this._sta = sta;
      this.maxHealth = this._sta * 10;
      this.health > this.maxHealth && (this.health = this.maxHealth);
    }
  });

  window.Player = Player;
}());
