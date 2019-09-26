/**
 * MySemiSphere
 * @constructor
 */
class MySemiSphere extends CGFobject
{
    constructor(scene, edges, stacks)
    {
        super(scene);
        this.edges = edges;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers()
    {
        this.vertices   = [];
        this.indices    = [];
        this.normals    = [];
        this.texCoords  = [];

        var theta = 2 * Math.PI / this.edges;
        var alpha = Math.PI / (2 * this.stacks);

        for (var i=0; i <= this.edges; i++)
        {
            for (var j=0; j <= this.stacks; j++)
            {
                this.vertices.push(Math.cos(alpha * j) * Math.cos(theta * i),
                                   Math.cos(alpha * j) * Math.sin(theta * i),
                                   Math.sin(alpha * j));

                this.normals.push(Math.cos(alpha * j) * Math.cos(theta * i),
                                  Math.cos(alpha * j) * Math.sin(theta * i),
                                  Math.sin(alpha * j));

                this.texCoords.push(((Math.cos(alpha*j) * Math.cos(theta*i))+1)/2,
                                    1 - ((Math.cos(alpha*j) * Math.sin(theta*i))+1)/2);
            }

        }

        for (var i = 0; i < this.edges; i++)
        {
            for (var j = 0; j < this.stacks; j++)
            {
                this.indices.push(
                (i+1) * (this.stacks + 1) + j, i * (this.stacks + 1) + j + 1,
                (i)   * (this.stacks + 1) + j, i * (this.stacks + 1) + j + 1,
                (i+1) * (this.stacks + 1) + j, (i+1) * (this.stacks + 1) + j + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}