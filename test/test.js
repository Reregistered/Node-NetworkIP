/*
 */
var ip = require('../index.js');
ip.getNetworkIPs(function(err,res){
    console.log(res);
})