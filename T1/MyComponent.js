/**
 * Represents an intermediate node aka component
 * @constructor
 * @param scene Reference to MyScene object
 * @param nodeID node/component ID
 * @param materials materials
 * @param transfMatrix transformation matrix
 * @param texture texture applied to the component
 * @param componentChildren component children of the node/component
 * @param primitiveChildren primitive children of the node/component (leaves)
 * @param current current selected material (inside materials param)
 * @param materials list of materials (inside materials param)
 * @param texture texture object applied (inside texture param)
 * @param length_t texture paramter "t" scale (inside texture param)
 * @param length_s texture paramter "s" scale (inside texture param)
 */
class MyComponent extends CGFobject
{
    constructor(scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, loaded) {
        super(scene);
        this.componentID = componentID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.children = componentChildren;
        this.leaves = primitiveChildren;
        this.loaded = loaded;
    }
}
