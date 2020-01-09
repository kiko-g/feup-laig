class Drawers extends CGFobject {
    constructor(scene)
    {
        super(scene);
        this.drawer = new CGFOBJModel(this.scene, 'primitives/obj/models/drawer.obj');
        this.D = new CGFOBJModel(this.scene, 'primitives/obj/models/dresser.obj');
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-2.5, 2, 0);
        this.scene.scale(3, 3, 3);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.D.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-4, 1.8, 1.5);
        this.scene.scale(3, 3, 3);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.drawer.display();
        this.scene.popMatrix();
    }
}
