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
    * @param {Number} slices number of slices | torus sectors | "edge count"
    * @param {Number} loops number of "loops" | A 2D Section of the torus has #loops sides
    * @param {Number} inner distance from the surface to the inside "center" -- inner radius
    * @param {Number} outer distance from the center to the inside "center"  -- outer radius
    */

    constructor(scene, id, loops, slices, inner, outer)
    {
        super(scene);
        this.id = id;
        this.loops = loops;
		this.slices = slices;
        this.inner = inner;
        this.outer = outer;

        this.initBuffers();
    }

    initBuffers()
    {
        var phi = 2 * Math.PI / this.loops;
        var theta = 2 * Math.PI / this.slices;
        var phiPile = 0; //phi counter per say (pile)

        this.vertices   = [];
        this.indices    = [];
        this.normals    = [];
        this.texCoords  = [];
		
        for(var i = 0; i <= this.loops; i++){
            for (var j = 0; j <= this.slices; j++){
                this.vertices.push(Math.sin(phiPile)*this.outer + Math.sin(j*theta) * Math.sin(phiPile)*this.inner,
                                   Math.cos(phiPile)*this.outer + Math.sin(j*theta) * Math.cos(phiPile)*this.inner,
                                   Math.cos(j * theta) * this.inner);
                
                this.normals.push(Math.sin(j * theta) * Math.sin(phiPile), Math.sin(j*theta) * Math.cos(phiPile), Math.cos(j * theta));
                this.texCoords.push(i / this.loops, j / this.slices);
			}
			phiPile += phi;
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
         * 
         * Notice that the indices order is the
         * same with the cylinder but reversed
         */
        
        var a, b, c, d;
        var k = 0;
        for (var i = 0; i < this.loops; i++){
            for (var j = 0; j <= this.slices; j++)
            {
                if (j != this.slices)
                {
                    a = k;
                    b = k + this.slices + 1;
                    c = a + 1;
                    d = b + 1;

					this.indices.push(a, b, c);
					this.indices.push(b, d, c);
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