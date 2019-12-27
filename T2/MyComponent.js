/**
 * @constructor
 */
class MyComponent extends CGFobject
{
    /**
	 * Represents an intermediate node aka component
	 * @param {CGFscene} scene main scene
     * @param componentID node/component ID
     * @param materials materials
     * @param transfMatrix transformation matrix
     * @param texture texture applied to the component
     * @param children component children of the node/component
     * @param leaves primitive children of the node/component (leaves)
     * @param animationID
	 */

    constructor(scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, animationID = null) {
        super(scene);
        this.componentID = componentID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.compchildren = componentChildren;
        this.leaves = primitiveChildren;
        this.animationID = animationID;
    }
}