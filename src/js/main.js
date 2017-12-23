(function() {
  'use strict';
  var $ = document.querySelector.bind(document);
  var $$ = document.querySelectorAll.bind(document);
  var find = function(parent, searchTerm){return parent.querySelectorAll(searchTerm)};

  var $enemyField = $('#e');
  var $enemyBackRow = $('#e-b');
  var $enemyMidRow = $('#e-m');
  var $enemyFrontRow = $('#e-f');

  var $playerField = $('#p');
  var $playerBackRow = $('#p-b');
  var $playerMidRow = $('#p-m');
  var $playerFrontRow = $('#p-f');

  console.log($enemyField, $playerField);
}());
