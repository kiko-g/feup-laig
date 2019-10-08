/**
 * MyCylinder
 * @constructor
 */

class MyCylinder extends CGFobject
{
	/**
	 * Builds a cylinder object uncovered on both sides
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} slices number of slices/sectors
	 * @param {Number} stacks number of stacks
	 * @param {Number} radius cylinder radius
	 * @param {Number} height cylinder height
	 */
    constructor(scene, id, slices, stacks, radius, height)
    {
		super(scene);

		this.slices = slices;
		this.stacks = stacks;
		this.radius = radius
		this.height = height;

		this.initBuffers();
	};

	/**
	 * Initializes vertices, indices, normals and texture coordinates.
	 */
    initBuffers()
    {
		var theta = 2 * Math.PI / this.slices;
		var radius = this.radius;

		this.vertices   = [];
		this.normals    = [];
		this.indices    = [];
		this.texCoords  = [];

		var stackPile = 0; //works as a "current height"

        for (var i = 0; i <= this.stacks; i++)
        {
            for (var j = 0; j <= this.slices; j++)
            {
				this.vertices.push(Math.cos(j * theta) * radius, Math.sin(j * theta) * radius, stackPile);
				this.normals.push(Math.cos(j * theta), Math.sin(j * theta), stackPile);
                this.texCoords.push(1.0 - j / this.slices, 0.0 + i / this.stacks);
            }
            
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
		for (var i = 0; i < this.stacks; i++){
            for (var j = 0; j <= this.slices; j++)
            {
                if (j != this.slices)
                {
                    a = k; 
                    b = k + this.slices +1;
                    c = a + 1;
                    d = b + 1;

                    this.indices.push(c, b, a);
                    this.indices.push(c, d, b);
				}
				k++;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};



	/**
	 * Used to update texture coordinates upon drawing. Not required for this object.
	 * @param {Number} length_s scale factor (length)
	 * @param {Number} length_t scale factor (width)
	 */
	updateTexCoords(length_s, length_t) {

	}
};