'use strict';
var config = require('../config/config');

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Tag.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });

        Tag.belongsToMany(models.Deck, {
          as: 'Decks',
          through: 'deck_tags',
          foreignKey: 'tagId'
        });
      }
    }
  });

  return Tag;
};
