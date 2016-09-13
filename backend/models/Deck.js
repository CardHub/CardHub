'use strict';
var config = require('../config/config');

module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    name: DataTypes.STRING,
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Deck.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });

        Deck.belongsToMany(models.Tag, {
          as: 'Tags',
          through: 'deck_tags',
          foreignKey: 'deckId'
        });
      }
    }
  });

  return Deck;
};
