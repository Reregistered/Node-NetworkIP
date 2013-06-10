var getNetworkIPs = require('../index.js'),
    assert = require('assert');

getNetworkIPs(function(err,res){
    console.log(res);
    assert(res.length > 0);
    assert(res[0].length >= 7); // 0.0.0.0
})
