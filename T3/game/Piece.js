class Piece extends CGFobject {
    constructor(scene, appearance, color) {
        super(scene);
        this.color = color;
        this.appearance = appearance;
        
        this.step = 1.5;
        this.picked = false;
        this.body = new MyCylinder(scene, "piece", 30, 30, 0.3, 0.3, 0.1, true);
        this.top = new MySphere(scene, "piece-top", 0.3, 30, 30);
    }

    translateRight(n) {
        let keyframes = [];
        keyframes.push(new MyKeyframe([0, 2, 0], [0, 0, 0], [3, 3, 3], 1));
        // this.scene.graph.animations["right"] = new KeyframeAnimation(this.scene, "piece-anim", keyframes);
        // this.scene.graph.animations["right"].apply();
    }
    
    translateTop(n) {
        this.scene.pushMatrix();
        this.scene.translate(0, this.step * n, 0);
        this.scene.popMatrix();
    }

    translateLeft(n) {
        this.scene.pushMatrix();
        this.scene.translate(0, this.step * n, 0);
        this.scene.popMatrix();
    }

    translateBottom(n) {
        this.scene.pushMatrix();
        this.scene.translate(0, this.step * n, 0);
        this.scene.popMatrix();
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