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
        this.loaded = true;
        this.nodeID = nodeID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.children = componentChildren;
        this.leaves = primitiveChildren;
    }
}