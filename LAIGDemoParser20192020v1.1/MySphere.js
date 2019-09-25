/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MySphere extends CGFobject {
	constructor(scene, sectors, stacks, radius) {
            super(scene);
        this.sectors = sectors;
        this.stacks = stacks;
        this.radius = radius;

		
		this.initBuffers();
	}

    initBuffers()
    {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		var stackStep = Math.PI  / this.stacks;
        var sectorStep = Math.PI* 2  / this.sectors;
        var normLength = 1.0 / this.radius;

        for(var i = 0; i <= this.stacks; i++)
        {
			var stackAngle = (Math.PI / 2) - i * stackStep; 	// starting from pi/2 to -pi/2
			var xy = this.radius * Math.cos(stackAngle);		// r * cos(alpha)
            var z = this.radius * Math.sin(stackAngle);			// r * sin(alpha)

            for (var j = 0; j <= this.sectors; j++)
            {
                var sectorAngle = j* sectorStep;				// starting from 0 to 2pi

                // Vortex positions
				var x = xy * Math.cos(sectorAngle);				// (r * cos(alpha)) * cos(beta)
                var y = xy * Math.sin(sectorAngle);
                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                //normais
                var nx = x * normLength;
                var ny = y * normLength;
                var nz = z * normLength;
                this.normals.push(nx);
                this.normals.push(ny);
                this.normals.push(nz);

                var s = j / this.sectors;
                var t = i / this.stacks;
                this.texCoords.push(s);
                this.texCoords.push(t);
            }
        }

        for(var i = 0; i < this.stacks; i++)
        {
            var k1 = i * (this.sectors + 1);
            var k2 = k1 + this.sectors + 1;

            for(var j = 0; j < this.sectors; j++, k1++, k2++)
            {
                if(i != 0){
                    this.indices.push(k1);
                    this.indices.push(k2);
                    this.indices.push(k1 + 1);
                }

                if(i != (this.stacks - 1)){
                        this.indices.push(k1 + 1);
                        this.indices.push(k2);
                        this.indices.push(k2 + 1);
                }
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

    display() 
    {
		this.scene.pushMatrix();
		// this.scene.scale(this.radius, this.radius, this.radius);
		this.drawElements(this.scene.gl.TRIANGLES);
		this.scene.popMatrix();
    }
    
   
	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
    		this.texCoords = [...coords];
    		this.updateTexCoordsGLBuffers();
	}
}






// /**
//  * MySphere
//  * @param gl {WebGLRenderingContext}
//  * @constructor
//  */

// // TODO: radius

// class MySphere extends CGFobject {
// 	/**
// 	 * Builds a MySphere object.
// 	 * 
// 	 * @param {CGFscene} scene main scene
// 	 * @param {Number} radius radius of the sphere
// 	 * @param {Number} slices number of slices
// 	 * @param {Number} stacks number of stacks
// 	 */
//     constructor(scene, radius, slices, stacks) {
//         super(scene);

//         this.radius = radius;
//         this.slices = slices;
//         this.stacks = stacks;

//         this.initBuffers();
//     };

// 	/**
// 	 * Initializes vertices, normals, indices and texture coordinates
// 	 */
//     initBuffers() {
//         var beta = Math.PI / this.stacks;
//         var alpha = 2 * Math.PI / this.slices;

//         this.vertices = [];
//         this.normals = [];
//         this.indices = [];
//         this.texCoords = [];

//         var z = 0;

//         var incS = 1.0 / this.slices;
//         var incT = 1.0 / this.stacks;

//         for (let i = 0; i <= this.stacks; i++) {
//             for (var j = 0; j <= this.slices; j++) {
//                 this.vertices.push(- Math.cos(j * alpha) * Math.sin(i * beta), -Math.sin(j * alpha) * Math.sin(i * beta), -Math.cos(i * beta));
//                 this.normals.push(Math.cos(j * alpha), Math.sin(j * alpha), -Math.cos(i * beta));
//                 this.texCoords.push(1.0 - incS * j, 0.0 + incT * i);
//             }
//         }

//         console.log(this.vertices.length);

//         var ind = 0;

//         for (let i = 0; i < this.stacks; i++) {
//             for (let j = 0; j <= this.slices; j++) {
//                 if (j != this.slices) {
//                     this.indices.push(ind, ind + 1, ind + this.slices + 1);
//                     this.indices.push(ind + this.slices + 1, ind + 1, ind + this.slices + 2);
//                 }
//                 ind++;
//             }
//         }

//         console.log(this.indices.length);


//         this.primitiveType = this.scene.gl.TRIANGLES;
//         this.initGLBuffers();
//     };

// 	/**
// 	 * Displays this object according to its radius.
// 	 */
//     display() {
//         this.scene.pushMatrix();
//         this.scene.scale(this.radius, this.radius, this.radius);
//         this.drawElements(this.scene.gl.TRIANGLES);
//         this.scene.popMatrix();
//     }

// 	/**
// 	 * Used to update texture coordinates upon drawing. Not required for this object.
// 	 * @param {Number} length_s scale factor (length)
// 	 * @param {Number} length_t scale factor (width)
// 	 */
//     updateTexCoords(length_s, length_t) {

//     }
// };