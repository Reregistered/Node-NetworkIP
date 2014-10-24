/*
 * @fileoverview Wrapper for Node OS module to grab the address of a
 * network interface. It will guess which one is the right one.
 */

var os = require('os');

var BLACKLIST = [
  'fe80::1',
  '127.0.0.1',
  '::1'
];

/**
 * @param {bool=true} in_params.ignoreInternal - ignore internal interfaces.
 * @param {family='IPv4'} in_params.family - address family to select. You
 *   can give 'IPv4' or 'IPv6'.
 *
 * @returns {string} what we believe to be the IP address you want.
 */
var getNetworkIP = function (in_params) {

  in_params = in_params || {};

  var ignoreInternal = (in_params.ignoreInternal === undefined)
    ? true
    : in_params.ignoreInternal;

  var family = (in_params.family === undefined)
    ? 'IPv4'
    : in_params.family;

  var interfaces = os.networkInterfaces();
  var candidates = {};

  for (var i in interfaces) {
    candidates[i] = [];
    var hasFamily;
    for (var j in interfaces[i]) {
      if (!interfaces[i][j].internal || !ignoreInternal) {
        if (BLACKLIST.indexOf(interfaces[i][j].address) === -1) {
          candidates[i].push(interfaces[i][j]);
        }
      }
      if (interfaces[i][j].family === family) {
        hasFamily = true;
      }
    }
    // Filter out entries that don't have a family matching the desired family.
    if (!hasFamily) {
      delete candidates[i];
    }
  }

  var longest = [];
  for (var i in candidates) {
    if (candidates[i].length > longest.length) {
      longest = candidates[i];
    }
  }

  for (var i in longest) {
    if (longest[i].family === family) {
      return longest[i].address;
    }
  }

};

// We export getNetworkIPs for historical reasons.
exports.getNetworkIPs = getNetworkIP;
