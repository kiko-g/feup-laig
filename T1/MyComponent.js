/**
 * Represents an intermediate node aka component
 * @constructor 
 * @param scene Reference to MyScene object
 * @param nodeID node/component ID
 * @param materials list of materials 
 * @param transfMatrix transformation matrix 
 * @param texture texture applied to the component
 * @param componentChildren component children of the node/component
 * @param primitiveChildren primitive children of the node/component (leaves)
 * @param length_t texture paramter "t" scale
 * @param length_s texture paramter "s" scale
 */
class MyComponent extends CGFobject
{
    constructor(scene, nodeID, materials, transfMatrix, texture, componentChildren, primitiveChildren, length_t, length_s)
    {
        super(scene);
        this.nodeID = nodeID;
        this.materials = materials;
        this.transfMatrix = transfMatrix;
        this.texture = texture;
        this.children = componentChildren;
        this.leaves = primitiveChildren;
        this.length_t = length_t;
        this.length_s = length_s;
        this.loaded = false;

        this.activeMaterialID = 0;
    }

    updateMaterial(){
        //used for cycling materials with M key
        this.activeMaterialID++;
        this.activeMaterialID = this.activeMaterialID % this.materials.length;
    }
    
    // addChild(nodeID){ this.children.push(nodeID) };
    // setTexture(texture) { this.texture = texture; }
    // setTransfMatrix(transfMatrix) { this.transfMatrix = transfMatrix; }
}