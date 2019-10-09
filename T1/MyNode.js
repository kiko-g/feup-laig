class MyNode extends CGFobject
{
    constructor(scene, nodeID)
    {
        super(scene);
        this.nodeN = nodeID;
        this.children = [];
        this.leaves = [];
        this.materials = nodeID.materials;
        this.textureID = null;
        this.visited = false;
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix);
    }

    addChild(nodeID){ this.children.push(nodeID) };
    setTexture(texture) { this.texture = texture; }
    // setTransfMatrix(transfMatrix) { this.transfMatrix = transfMatrix; }
}