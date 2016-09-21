'use strict';
var config = require('../config/config');

module.exports = function(sequelize, DataTypes) {
  var Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [1,20]
      }
    }
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
