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
    this.actions = [{
      actionId: 'move',
      view: '🏃'
    }];
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
