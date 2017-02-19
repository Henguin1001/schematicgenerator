var schematic = require('./index.js');
var argv = require('minimist')(process.argv.slice(2));
var INPUT = "(a and b) or c";

schematic(argv.input||INPUT,argv.output||'output.png', function(err){
  if(!err) console.log("done");
  else throw err;
});
