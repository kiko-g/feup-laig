/**
 * Cylinder
 * @constructor
 */
class Cylinder extends CGFobject {
	constructor(scene, baseRadius, topRadius, height, slices, stacks) {
		super(scene);
		this._baseRadius = baseRadius;
		this._topRadius = topRadius;
		this._height = height;
		this._slices = slices;
		this._stacks = stacks;

		this.initBuffers();
	};

	initBuffers() {
		var i = 0, j = 0, h = 0, x = 0, y = 0, z = 0;

		var deltaAngle = 2 * Math.PI / this._slices;
		var deltaZ = this._height / this._stacks;

		var deltaRadius = (this._topRadius - this._baseRadius) / this._stacks;

		var angle = 0;
		var radius = this._baseRadius;
		var sText = 0; var tText = 0;

		this.vertices = [];
		this.indices = [];
		this.normals = [];

		/*-----------------------------------------------------------------------------------*/
		/*-------------------------------------VERTICES--------------------------------------*/
		/*-----------------------------------------------------------------------------------*/

		//Vertices da base, repetidos p/ normais diferentes
		for (j = 0; j <= this._slices; j++) {
			x = Math.cos(angle) * radius;
			y = Math.sin(angle) * radius;
			this.vertices.push(x, y, z);
			angle += deltaAngle;
		}

		z = deltaZ;
		radius += deltaRadius;

		for (i = 0; i < this._stacks; i++) {
			angle = 0;
			for (j = 0; j <= this._slices; j++) {
				x = Math.cos(angle) * radius;
				y = Math.sin(angle) * radius;
				this.vertices.push(x, y, z);
				angle += deltaAngle;
			}
			z += deltaZ;
			radius += deltaRadius;
		}

		/*-----------------------------------------------------------------------------------*/
		/*--------------------------------------INDICES--------------------------------------*/
		/*-----------------------------------------------------------------------------------*/

		var sum;

		for (h = 0; h < this._stacks; h++) {
			sum = (this._slices + 1) * h;
			for (i = 0; i <= this._slices - 1; i++) {
				this.indices.push(sum + i, sum + this._slices + i + 1, sum + this._slices + i, sum + i, sum + i + 1, sum + this._slices + i + 1);
			}

			this.indices.push(sum + this._slices - 1, sum + this._slices, sum + (this._slices + 1) * 2 - 1, sum + this._slices - 1, sum + (this._slices + 1) * 2 - 1, sum + (this._slices + 1) * 2 - 2);
		}

		/*-----------------------------------------------------------------------------------*/
		/*--------------------------------------NORMALS--------------------------------------*/
		/*-----------------------------------------------------------------------------------*/

		var k = 0;
		for (k = 0; k < this._stacks + 1; k++) {
			angle = 0;

			for (i = 0; i <= this._slices; i++) {
				this.normals.push(Math.cos(angle), Math.sin(angle), 0);
				angle += deltaAngle;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
	
	setTextureCoords(lengthS, lengthT) {
	}
};
