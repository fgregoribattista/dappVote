// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    ganache: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id,
	  gas:4712388,
	  gasPrice:100000000000,
    },
	development: {
      host: '127.0.0.1',
      port: 9545,
	  network_id: '*',
    },
  }
}
