/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
	/**
	 * Builds a cylinder object uncovered on both sides
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} slices number of slices/sectors
	 * @param {Number} stacks number of stacks
	 * @param {Number} radius cylinder radius
	 * @param {Number} height cylinder height
	 */
    constructor(scene, id, slices, stacks, base, top, height, bothSides = false) {
        super(scene);
        this.id = id;
        this.slices = Math.floor(slices);
        this.stacks = Math.floor(stacks);
        this.base = base;
        this.top = top;
        this.height = height;
        this.bothSides = bothSides

        this.initBuffers();
    };

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
    initBuffers() {
        var theta = 2 * Math.PI / this.slices;
        //current radius
        if(this.top != this.base) var radius = this.top - this.base;
        else var radius = this.top
        var stackPile = 0;                          //works as a "current height"
        var slicePile;                              //works as a "current thehta"
        var dif = this.base-this.top;               //difference between base and top radius
        var slope = dif/this.height;

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        for (var i = 0; i <= this.stacks; i++) {
            slicePile=0;
            for (var j = 0; j <= this.slices; j++) {
                this.vertices.push(Math.cos(slicePile) * radius, Math.sin(slicePile) * radius, stackPile);
                this.normals.push(Math.cos(slicePile), Math.sin(slicePile), slope);
                this.texCoords.push(1.0 - j / this.stacks, i / this.slices);
                slicePile = (j+1)*theta;
            }
            radius += dif / this.stacks;
            stackPile += this.height / this.stacks;
        }


        /**
         * Simpler to use k instead of combination
         * of i and j. k counts the toral number of cycles
         * 
         * A -> k
         * B -> k + this.slices + 1
         * C -> k+1                 (A+1)
         * D -> k + this.slices + 2 (B+1)
         * 
         * INDICES:
         * C, B, A
         * D, C, B 
         * 
         * Notice that the indices order is the
         * same with the torus, but reversed
         */


        var a, b, c, d;
        var k = 0;
        for (var i = 0; i < this.stacks; i++) {
            for (var j = 0; j <= this.slices; j++) {
                if (j != this.slices) {
                    a = k;
                    b = k + this.slices + 1;
                    c = a + 1;
                    d = b + 1;

                    this.indices.push(c, b, a);
                    if(this.bothSides) this.indices.push(a, b, c);
                    this.indices.push(c, d, b);
                    if(this.bothSides) this.indices.push(b, d, c);
                }
                k++;
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        if (this.scene.displayNormals) this.enableNormalViz();
        if (!this.scene.displayNormals) this.normalViz = false;
    }
    display(ls, lt) { super.display(); }
}