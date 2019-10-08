class MyNode extends CGFobject
{
    constructor(scene, id)
    {
        super(scene);
        this.id = id;
        this.children = [];
        this.leaves   = [];
        this.transfMatrix = mat4.create();
        mat4.identity(this.transfMatrix);
        this.visited = false;
    }

    setTexture(texture) { this.texture = texture; }
    setTransfMatrix(transfMatrix) { this.transfMatrix = transfMatrix; }
}