class PathNode {
  constructor(x,y,prevNode){
    this.x = x;
    this.y = y;
    this.prevNode = prevNode;
    this.length = 0;
    if (this.prevNode != null)
    {
      let dx = this.prevNode.x - this.x;
      let dy = this.prevNode.y - this.y;
      this.length += prevNode.length + sqrt(dx * dx + dy * dy);
    }
  }
}