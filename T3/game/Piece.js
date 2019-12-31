class Piece extends CGFobject {
    constructor(scene, appearance, color) {
        super(scene);
        this.appearance = appearance;
        this.color = color;
        
        this.picked = false;
        this.body = new MyCylinder(scene, "piece", 30, 30, 0.3, 0.3, 0.1, true);
        this.top = new MySphere(scene, "piece-top", 0.3, 30, 30);
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
        this.scene.popMatrix();
    }
}