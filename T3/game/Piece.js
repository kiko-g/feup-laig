/**
 * @brief Builds a Piece object to be used in game
 * 
 * Fuse uses small cylinders as pieces so we decided to use a Cylinder with
 * low height and tops covered with "pressed" spheres (scaled down in Y)
 */

class Piece extends CGFobject {
    constructor(scene, appearance, color) {
        super(scene);
        this.color = color;
        this.appearance = appearance;
        
        this.step = 1.05;
        this.body = new MyCylinder(scene, "piece", 30, 30, 0.3, 0.3, 0.1, true);
        this.top = new MySphere(scene, "piece_top", 0.3, 30, 30);
        this.anim = null; //starts as null, is created in runtime
    }

    display() {
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(0, 0.1, 0);
        this.scene.rotate(90 * Math.PI / 180, 1, 0, 0);
        this.body.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 0.1, 0);
        this.scene.scale(1, 0.11, 1);
        this.top.display();
        this.scene.translate(0, -1, 0);
        this.top.display();             //bottom face of piece
        this.scene.popMatrix();
    }
}