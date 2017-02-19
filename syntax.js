var mathjs = require('mathjs'),
  gates = require('./gates.js'),
  Gate = gates.Gate,
  Input = gates.Input,
  arboreal = require('arboreal');

var parse = function myself(tree) {
    if (!tree.args || tree.args.length == 0) {
      return {name:tree.name};
    }
    var temp = {op:tree.op};
    temp.args = tree.args.map(function(node){
      if(node.content){
        return myself(node.content);
      } else {
        return myself(node);
      }
    });
    return temp;
}
module.exports.compile = function(string){
  var grid = [[]];
  var nets = [];
  var flat = {};
  var tree = arboreal.parse(parse(mathjs.parse(string)), 'args');
  tree.traverseDown(function(node) {
    grid[node.depth] = grid[node.depth]||[];
    grid[node.depth].push(node);
  });
  tree.traverseDown(function(node) {
    if(node.data.op){
      flat[node.id] = new Gate(node.data.op, null, node);
    } else {
      flat[node.id] = new Input(node.data.name);
    }
  });
  grid.reverse();
  tree.traverseDown(function(node) {
    node.children.forEach(function(child,input){
      var node_id = node.id+':'+input;
      var child_id = child.id+':'+child.children.length;
      var intersection = nets.map(function(net,i){
        if (net.members.indexOf(child_id)!=-1)
          return {net:net, append:node, i:i, id:node_id, idl:input};
        else if (net.members.indexOf(node_id)!=-1)
          return {net:net, append:child, i:i, id:child_id, idl:'2'};
        else return undefined;
      }).filter((e)=>{return e!=undefined});
      if(intersection.length==1){
        intersection = intersection[0];
        nets[intersection.i].members.push(intersection.id);
        nets[intersection.i].map.push({id:intersection.append.id,idl: intersection.idl});
        nets[intersection.i].contents.push(intersection.append);
      } else {
        nets.push({members:[node_id, child_id], map:[{id:node.id,idl: input},{id:child.id,idl: '2'}], contents:[node, child]});
      }
    });
  });
  return {tree: tree,grid:grid,nets:nets, flat:flat};
};
