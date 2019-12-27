class Piece extends CGFobject {
    constructor(scene, appearance, piece) {
        super(scene);
        this.piece = piece;
        this.rotate = rotate;
        this.appearance = appearance;
    }

    display() {
        this.scene.pushMatrix();
        this.appearance.apply();
        this.piece.display();
        this.scene.popMatrix();
    }
}