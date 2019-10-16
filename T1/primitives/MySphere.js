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
        this.vertices   = [];
        this.indices    = [];
        this.normals    = [];
        this.texCoords  = [];
        
        let sliceStep = 2*Math.PI/this.slices;
        let stackStep = Math.PI/this.stacks;
        let x, y, z, nx, ny, nz, sliceAngle=0, stackAngle=0;

        for (let i = 0; i <= this.stacks; i++)
        {
            sliceAngle = 0;
            stackAngle = stackStep*i;
            for (let j = 0; j <= this.slices; j++) 
            {
                sliceAngle = sliceStep*j;
                x = this.radius * Math.cos(sliceAngle) * Math.sin(stackAngle);
                y = this.radius * Math.sin(sliceAngle) * Math.sin(stackAngle);
                z = this.radius * Math.cos(stackAngle);
                this.vertices.push(x, y, z);
                
                nx = x/this.radius;
                ny = y/this.radius;
                nz = z/this.radius;
                this.normals.push(nx, ny, nz);
                this.texCoords.push(j/this.slices, i/this.stacks);
            }
        }


        let a, b, c, d, k = 0;
        for (let i = 0; i < this.stacks; i++)
        {
            for (let j = 0; j <= this.slices; j++)
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
    };
    
    display(length_s, length_t) { super.display(); }
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