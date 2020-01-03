class Plant extends CGFobject {
    constructor(scene) {
        super(scene);

        this.outCP = [
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

        this.inCP = [
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
        
        this.initTextures();

        this.leaf_out = new Patch(scene, 5, 3, 10, 10, this.outCP);
        this.leaf_in = new Patch(scene, 5, 3, 10, 10, this.inCP);

        this.rim = new MyTorus(scene, 0.05, 0.45, 20, 20);
        this.vase = new MyCylinder(this.scene, 0.25, 0.5, 0.75, 20, 20);
    }

    initTextures() {
        this.leafTexture = new CGFappearance(this.scene);
        this.leafTexture.loadTexture("scenes/images/leaf.jpg");

        this.vaseTexture = new CGFappearance(this.scene);
        this.vaseTexture.setAmbient(0.361, 0.171, 0.076, 1.0);
        this.vaseTexture.setDiffuse(0.661, 0.271, 0.0176, 1.0);
        this.vaseTexture.setSpecular(0.25, 0.25, 0.25, 1.0);

    };

    display() {

        this.vaseTexture.apply();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.vase.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0.75, 0);
        this.scene.scale(1, 2, 1);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.rim.display();
        this.scene.popMatrix();

        this.leafTexture.apply();
        this.scene.pushMatrix()
        this.scene.translate(0, 0.75, 0);

        var k = 0;
        for (let i = 0; i <= 5; i++ , k++) {
            for (let j = k * 0.5; j < 4; j++) {
                this.scene.pushMatrix();
                this.scene.translate(0, i * 0.2, 0);
                this.scene.rotate(j * Math.PI / 2, 0, 1, 0);
                this.scene.rotate(k * Math.PI / 20, 0, 0, 1);
                this.leaf_out.display();
                this.leaf_in.display();
                this.scene.popMatrix();
            }
        }

        this.scene.popMatrix();

    }
}