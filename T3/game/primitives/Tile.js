class Tile extends CGFobject
{
    constructor(scene) {
        super(scene);
        this.quad = new Plane(scene, "tile", 30, 30);
        this.initBuffers();
    }
    
    initBuffers() {
        this.main = new CGFappearance(this.scene);
        this.RGBMaterial(34, 122, 181);
        // this.RGBMaterial(255, 0, 255);
    }

    RGBMaterial(r, g, b) {
        this.main.setAmbient(r/255, g/255, b/255, 1);
        this.main.setDiffuse(r/255, g/255, b/255, 1);
        this.main.setSpecular(r/255, g/255, b/255, 1);
        this.main.setShininess(10);
    }

    display() {
        var dtr = Math.PI / 180;
        this.main.apply();
        this.scene.rotate(90 * dtr, 1, 0, 0);
        this.quad.display();
    }
}