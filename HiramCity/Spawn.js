class Spawn {
  constructor(node,name) {
    this.node = node;
    this.name = name;
  }
  
  draw() {
    let node = this.node;
    while(node.prevNode != null) {
      line(node.x, node.y, node.prevNode.x, node.prevNode.y);
      node = node.prevNode;
    }
  }
}