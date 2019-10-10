/**
 * MySphere
 * @param gl {WebGLRenderingContext}
 * @constructor
 * @param scene - Reference to XMLScene object
 */
class MySphere extends CGFobject
{
  /**
    * Builds a MySphere object.
    * 
    * @param {CGFscene} scene scene
    * @param {Number} radius sphere radius
    * @param {Number} slices number of slices
    * @param {Number} stacks number of stacks
  */

    constructor(scene, id, radius, slices, stacks) 
    {
        super(scene);
        this.id = id;
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
		
		this.initBuffers(); 
	}


    initBuffers()
    {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        var sliceStep = (2*Math.PI) / this.slices;    //theta slice
        var stackStep = Math.PI / this.stacks;        //fi stack

        for(var i = 0; i <= 2*this.stacks; i++)
        {
            for (var j = 0; j <= this.slices; j++)
            {
                var stackAngle = i * stackStep;     // starting from 0 to pi
                var sliceAngle = j * sliceStep;     // starting from 0 to 2pi
                var x = this.radius * Math.cos(stackAngle) * Math.cos(sliceAngle);	    // (r * cos(fi)) * cos(theta)
                var y = this.radius * Math.cos(stackAngle) * Math.sin(sliceAngle);      // (r * cos(fi)) * sin(theta)
                var z = this.radius * Math.sin(stackAngle);	                            // (r * sin(fi))
                this.vertices.push(x, y, z);
                
                var nx = x / this.radius;
                var ny = y / this.radius;
                var nz = z / this.radius;
                this.normals.push(nx, ny, nz);
               
                var s = j / this.slices;
                var t = i / this.stacks;
                this.texCoords.push(s, 1-t);
            }
        }


        var k = 0;
        for(var i = 0; i < 2*this.stacks; i++)
        {
            for(var j = 0; j <= this.slices; j++)
            {
                if(j != this.slices)
                {
                    this.indices.push(k, k+1, k+this.slices+1);
                    this.indices.push(k+this.slices+1, k+1, k+this.slices+2);
                }
                k++;
            }
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

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
	 */
    updateTexCoords(coords)
    {
    		this.texCoords = [...coords];
    		this.updateTexCoordsGLBuffers();
	}
}


// ==== APONTAMENTOS ====
// theta = pi/2 / stacks
// fi = 2pi / slices
// theta 0 - pi
// fi 0 - 2pi
//
// N = (P-C) / abs(P-C)
// nx = cos(beta) cos(alpha) (lembrar R*cos(beta)*cos(alpha)) 
// div por R vortex
// ny = cos(beta) sin(alpha)
// nz = sin(beta)