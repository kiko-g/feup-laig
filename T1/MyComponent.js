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
 * @param length_t texture paramter "t" scale (inside texture param)
 * @param length_s texture paramter "s" scale (inside texture param)
 */
class MyComponent extends CGFobject
{
    transformation; materials; texture; children; loaded; scene;
    constructor(scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, loaded)
    {
        super(scene);
        this.componentID = componentID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.children = componentChildren;
        this.leaves = primitiveChildren;
        this.loaded = loaded;
    }

    initialize(transfMatrix, materials, texture, children, scene) {
        this.transfMatrix = transfMatrix;
        this.materials = materials;
        this.texture = texture;
        this.children = children;
        this.loaded = true;
        this.scene = scene;
    }

    display() {
        if (!this.loaded) return;
        this.scene.multMatrix(this.transfMatrix);
        let mat = this.materials.materials[this.materials.current]; //applying the current material
        if (this.texture.texture != "inherit") {
            this.scene.appearance.setTexture(this.texture.texture);
        }
        mat.apply(this.scene.appearance);

        this.scene.appearance.apply();
        for (let i = 0; i < this.children.length; i++) {
            this.scene.pushMatrix();
            this.children[i].display();
            this.scene.popMatrix();
       }
    }
}