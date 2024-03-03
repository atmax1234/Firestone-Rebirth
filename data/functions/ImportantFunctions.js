const client = require('../../index');

module.exports = {
    /**
     * @param {Client} client
     */

    RandomNumber: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};