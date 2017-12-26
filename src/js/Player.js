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
    this.view = "👦🤵🏻";
    this.$field = null;
    this.currentAction = null;
    this.actions = [
      {
        actionId: 'move',
        view: '🏃'
      },
      {
        actionId: 'attack',
        view: '🗡'
      }
    ];
    this.move(this.position.x, this.position.y);
  };

  Player.prototype = {
    move: function(x, y){
      if (this.stage.getPlayerInField(this.stage.getFieldByCoordinate(x, y))) {
        console.warn('cant move to occupied field');
        return false;
      }
      this.position.x = x;
      this.position.y = y;
      this.stage.dirty = true;
    },
    attack: function(target) {
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
      this.state = this.GAME_STATE_SELECT_TARGET;
    },
    renderValidActionTargets: function(action) {
      if (action.actionId === 'move') {
        var ff = this.stage.getPlayerFieldByCoordinate.bind(this.stage);
        var x = this.position.x;
        var y = this.position.y;
        var f = [ff(x+1, y), ff(x-1, y), ff(x, y+1), ff(x, y-1)];
        f = f.filter(function(o){return o});
        f.forEach(function(o){
          o.classList.add('valid');
        })
      }
    },
    render: function(div) {
      div.innerText += this.view;
      div.dataset.player = this;
      this.$field = div;
    },
    renderActions: function () {
      var b = document.createElement('b');
      this.actions.forEach(function(action) {
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
