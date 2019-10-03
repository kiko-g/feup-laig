/**
 * MySemiSphere
 * @constructor
 */
class MyTorus extends CGFobject
{
    /**
    * Builds a MySphere object.
    *
    * @param {CGFscene} scene scene
    * @param {Number} slices number of slices | a 2D Section of the torus has 'slices' sides
    * @param {Number} loops number of "loops" aka torus sections/edge count
    * @param {Number} inner distance from the surface to the inside "center" -- inner radius
    * @param {Number} outer distance from the center to the inside "center"  -- outer radius
    */

    constructor(scene, id, slices, loops, inner, outer)
    {
		super(scene);
		this.slices = slices;
        this.loops = loops;
        this.inner = inner;
        this.outer = outer;

        this.initBuffers();
    }

    initBuffers()
    {
        var fi = 2 * Math.PI / this.loops;
        var theta = 2 * Math.PI / this.slices;
        var fiPile = 0; //fi counter per say (pile)

        this.vertices   = [];
        this.indices    = [];
        this.normals    = [];
        this.texCoords  = [];
		
        for(var i = 0; i <= this.loops; i++){
            for (var j = 0; j <= this.slices; j++){
                this.vertices.push(Math.sin(fiPile)*this.outer + Math.sin(j*theta) * Math.sin(fiPile)*this.inner,
                                   Math.cos(fiPile)*this.outer + Math.sin(j*theta) * Math.cos(fiPile)*this.inner,
                                   Math.cos(j * theta) * this.inner);
                
                this.normals.push(Math.sin(j * theta) * Math.sin(fiPile), Math.sin(j*theta) * Math.cos(fiPile), Math.cos(j * theta));
                this.texCoords.push(i / this.slices, j / this.loops);
			}
			fiPile += fi;
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
         * A, B, C
         * B, D, C
         */
        
        var k = 0;
        for (var i = 0; i < this.loops; i++){
            for (var j = 0; j <= this.slices; j++)
            {
                if (j != this.slices)
                {
					this.indices.push(k, k + this.slices + 1, k+1);
					this.indices.push(k + this.slices + 1, k + this.slices + 2,  k+1);
				}
				k++;
			}
		}

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    display()
    {
        this.scene.pushMatrix();
        this.drawElements(this.scene.gl.TRIANGLES);
        this.scene.popMatrix();
    }


    /**
    * Updates the list of texture coordinates of the rectangle
    * @method updateTexCoords
    * @param {Array} coords - Array of texture coordinates
    **/ 

    updateTexCoords(coords)
    {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}