'use strict'

function log() {
  let args = Array.prototype.slice.call(arguments);
  console.log(args.join(' '))
}

module.exports = {
  log : log
}