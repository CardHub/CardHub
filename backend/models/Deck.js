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
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: "#91A7D0"
    },
    isForked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    forkedFrom: {
      type: DataTypes.INTEGER,
      allowNull: true
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

        Deck.hasMany(models.Card);

        Deck.belongsToMany(models.Tag, {
          as: 'Tags',
          through: 'deck_tags',
          foreignKey: 'deckId'
        });
      }
    },
    instanceMethods: {
      fork: function() {
        var self = this;
        return new Promise(function(resolve, reject) {
          self.getCards().then(function(cards) {
            resolve({
              deck: self.toJSON(),
              cards: cards
            });
          }).catch(function(err) {
            reject(err);
          });
        });
      }
    }
  });

  return Deck;
};
