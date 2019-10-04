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

		var z = 0;

        for (var i = 0; i <= this.stacks; i++)
        {
            for (var j = 0; j <= this.slices; j++)
            {
				this.vertices.push(Math.cos(j * theta) * radius, Math.sin(j * theta) * radius, z);
				this.normals.push(Math.cos(j * theta), Math.sin(j * theta), z);
                this.texCoords.push(1.0 - j / this.slices, 0.0 + i / this.stacks);
            }
            
            z += this.height / this.stacks;
		}



		var k = 0;
		for (var i = 0; i < this.stacks; i++){
            for (var j = 0; j <= this.slices; j++)
            {
                if (j != this.slices)
                {
                    this.indices.push(k + 1, k + this.slices + 1, k);
                    this.indices.push(k + 1, k + this.slices + 2, k + this.slices + 1);
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