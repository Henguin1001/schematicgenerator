var fs = require('fs'),
    xml2js = require('xml2js'),
    gm = require('gm').subClass({imageMagick: true}),
    Victor = require('victor'),
    gates = require('./gates.js'),
    Gate = gates.Gate,
    Input = gates.Input,
    syntax = require('./syntax.js');

function run(formula, outfile, cb){

  var canvas = gm();
  var PADDING = 200;


  var data = syntax.compile(formula);
  var grid = data.grid;
  var nets = data.nets;
  var flat = data.flat;

  grid = grid.map((r)=>r.filter((c)=>{
    return Gate.isGate(flat[c.id]);
  }));
  var width = grid.reduce(function(prev, current) {
      return (prev.length > current.length) ? prev : current
  }).length;
  var height = grid.length;
  grid.forEach(function(row,r){
    row.forEach(function(column, c){
      var t = c+Math.floor((width-row.length)/2);
      var position = new Victor(r*PADDING, t*PADDING);
      // var position = new Victor(r*PADDING, c==0?0.5*(width-row.length)*PADDING: (width-row.length)*PADDING);
      console.log(position);
      flat[column.id].position = position;
      flat[column.id].draw(canvas);
    });
  });
  canvas = canvas.mosaic();
  nets.forEach(function(net,i){
    var n1 = flat[net.map[0].id];
    var n2 = flat[net.map[1].id];
    if(Gate.isGate(n1)&&Gate.isGate(n2)){
      // console.log("test: " + n1);
      // console.log(n2);
      var p1 = n1.positionOfNode(net.map[0].idl);
      var p2 = n2.positionOfNode(net.map[1].idl);
      canvas.stroke('#000000').strokeWidth(3).drawLine(p1.x, p1.y, p2.x, p2.y);
    } else if(Gate.isGate(n1)||Gate.isGate(n2)){
      var p1 = Gate.isGate(n1)? n1.positionOfNode(net.map[0].idl):n2.positionOfNode(net.map[1].idl);
      var p2 = p1.clone().add(new Victor(-15,5));
      var name = !Gate.isGate(n1)? n1.name:n2.name;
      canvas.stroke('#000000').strokeWidth(1).font("Helvetica.ttf", 15).drawText(p2.x,p2.y,name)
    }
  });
  canvas.stream('png').pipe(fs.createWriteStream(outfile)).on('finish', cb||()=>{});
}
module.exports = run;
run('(A xor B) or (not B and C)', 'output.png');
