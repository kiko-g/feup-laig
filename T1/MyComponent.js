/**
 * @constructor
 */
class MyComponent extends CGFobject
{
    /**
	 * Represents an intermediate node aka component
	 * @param {CGFscene} scene main scene
     * @param nodeID node/component ID
     * @param materials materials
     * @param texture texture applied to the component
     * @param transfMatrix transformation matrix
     * @param componentChildren component children of the node/component
     * @param primitiveChildren primitive children of the node/component (leaves)
	 */

    constructor(scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, loaded) {
        super(scene);
        this.componentID = componentID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.children = componentChildren;
        this.leaves = primitiveChildren;
        // this.loaded = loaded;
    }
}
