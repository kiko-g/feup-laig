class Plant extends CGFobject {
    constructor(scene) {
        super(scene);

        let exterior_controlpoints = [
            [
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0]
            ],
            [
                [0.5, 0.5, 0.2, 1.0],
                [0.5, 0.5, 0.0, 1.0],
                [0.5, 0.5, -0.2, 1.0]
            ],

            [
                [0.75, 0.75, 0.4, 1.0],
                [0.75, 0.75, 0.0, 1.0],
                [0.75, 0.75, -0.4, 1.0]
            ],
            [
                [1.0, 1.0, 0.2, 1.0],
                [1.0, 1.0, 0.0, 1.0],
                [1.0, 1.0, -0.2, 1.0]
            ],
            [
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0]
            ]
        ];

        let interior_controlpoints = [
            [
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0],
                [0.0, 0.0, 0.0, 1.0]
            ],
            [
                [0.5, 0.5, -0.2, 1.0],
                [0.5, 0.5, 0.0, 1.0],
                [0.5, 0.5, 0.2, 1.0]
            ],

            [
                [0.75, 0.75, -0.4, 1.0],
                [0.75, 0.75, 0.0, 1.0],
                [0.75, 0.75, 0.4, 1.0]
            ],
            [
                [1.0, 1.0, -0.2, 1.0],
                [1.0, 1.0, 0.0, 1.0],
                [1.0, 1.0, 0.2, 1.0]
            ],
            [
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0],
                [1.5, 0.75, 0.0, 1.0]
            ]
        ];
        
        this.leaf_tex = new CGFappearance(this.scene);
        this.leaf_tex.loadTexture("scenes/img/leaf.jpg");
        this.vase_tex = new CGFappearance(this.scene);
        this.vase_tex.setAmbient(0.361, 0.171, 0.076, 1.0);
        this.vase_tex.setDiffuse(0.661, 0.271, 0.0176, 1.0);
        this.vase_tex.setSpecular(0.25, 0.25, 0.25, 1.0);

        this.leaf_out = new Patch(this.scene, "leaf_out", 5, 3, 10, 10, exterior_controlpoints);
        this.leaf_in = new Patch(this.scene, "leaf_in", 5, 3, 10, 10, interior_controlpoints);
        this.ring = new MyTorus(this.scene, "torus-vase", 20, 20, 0.05, 0.45);
        this.aux = new MySphere(this.scene, "vase-sand", 0.5, 20, 20);
        this.vase = new MyCylinder(this.scene, "vase-body", 20, 20, 0.5, 0.5, 0.75);
    }

    display() {

        this.vase_tex.apply();
        this.scene.translate(0, 0.25, 0);
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.vase.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(0.99, 0.5, 0.99);
        this.aux.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.graph.materials["donutMAT"].apply();
        this.scene.translate(0, 0.7, 0);
        this.scene.scale(0.9, 0.05, 0.9);
        this.aux.display();
        this.scene.popMatrix();        

        this.vase_tex.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0.75, 0);
        this.scene.scale(1, 2, 1);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.ring.display();
        this.scene.popMatrix();

        this.leaf_tex.apply();
        this.scene.pushMatrix()
        this.scene.translate(0, 0.75, 0);

        var k = 0;
        for (let i = 0; i <= 5; i++ , k++) {
            for (let j = k * 0.5; j < 4; j++) {
                this.scene.pushMatrix();
                this.scene.translate(0, i*0.2, 0);
                this.scene.rotate(j * Math.PI / 2, 0, 1, 0);
                this.scene.rotate(k * Math.PI / 20, 0, 0, 1);
                this.leaf_in.display();
                this.leaf_out.display();
                this.scene.popMatrix();
            }
        }
        this.scene.popMatrix();
    }
}