'use strict';
var config = require('../config/config');

module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    front: DataTypes.TEXT,
    back: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        Card.belongsTo(models.Deck, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Card;
};
