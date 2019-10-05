class MyNode extends CGFobject{


    constructor(scene, id, matrix, materials, texture, compChildren, primChildren, ls, lt) {

        super(scene);
        this.id = id;
        this.transfMat = matrix;
        this.materials = materials;
        this.texture = texture;
        this.compChildren = compChildren;
        this.primChildren = primChildren;
        this.lengthS = ls;
        this.lengthT = lt;
        this.visited = false;
        
    }

}