var Victor = require('victor');
function GateSymbol(filename, locations){
  this.filename = filename;
  this.locations = locations;
}
var gates = {
  and:new GateSymbol('img/and.png', [new Victor(0,20), new Victor(0,58), new Victor(150,39)]),
  or:new GateSymbol('img/or.png', [new Victor(0,20), new Victor(0,59), new Victor(154,40)]),
  xor:new GateSymbol('img/xor.png', [new Victor(0,20), new Victor(0,59), new Victor(168,40)]),
  not:new GateSymbol('img/not.png', [new Victor(0,34), new Victor(124,35)]),
  nand:new GateSymbol('img/nand.png', [new Victor(0,20), new Victor(0,59), new Victor(161,40)]),
  nor:new GateSymbol('img/nor.png', [new Victor(0,20), new Victor(0,59), new Victor(164,40)]),
  xnor:new GateSymbol('img/xnor.png', [new Victor(0,21), new Victor(0,60), new Victor(179,40)])

}
function Input(name) {
  this.name = name;
}
Input.prototype.toString = function(){
	return "[object Input]";
}
Input.isInput = function(obj){
	return obj.toString() == "[object Input]";
}


//

function Gate(symbol, position, data) {
  this.symbol = gates[symbol];
  this.position = position||Victor(0,0);
  this.data = data;
}
Gate.prototype.draw = function (canvas, position) {
  if(position){
    return canvas.in('-page', '+'+ position.x +'+' + position.y).in(this.symbol.filename);
  }else {
    return canvas.in('-page', '+'+ this.position.x +'+' + this.position.y).in(this.symbol.filename);
  }
};
Gate.prototype.positionOfNode = function(node){
  if(node >= this.symbol.locations.length) 
    node = this.symbol.locations.length-1;
  var glob = this.position.clone();
  var local = this.symbol.locations[node];
  if(local){
    return glob.add(local);
  }else {
    return new Victor(0,0);
  }
}
Gate.prototype.toString = function(){
	return "[object Gate]";
}
Gate.isGate = function(obj){
	return obj.toString() == "[object Gate]";
}
module.exports.Input = Input;
module.exports.Gate = Gate;
