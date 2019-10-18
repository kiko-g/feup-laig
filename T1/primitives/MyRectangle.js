/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class MyRectangle extends CGFobject
{
    constructor(scene, id, x1, x2, y1, y2)
    {
        super(scene);
        this.id = id;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
		this.y2 = y2;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y1, 0,	//1
			this.x1, this.y2, 0,	//2
			this.x2, this.y2, 0,	//3
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
            1, 3, 2,
            2, 1, 0,
            2, 3, 1
		];

		//Facing Z positive
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
            0, 0, 1,
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

        var dx = this.x2-this.x1;
        var dy = this.y2-this.y1;

		this.defaultTexCoords = [
             0, dy,
            dx, dy,
			 0,  0,
            dx,  0,
        ]
        
        this.texCoords = [];
        for(var coord in this.defaultTexCoords)
        {
            this.texCoords.push(this.defaultTexCoords[coord]);
        }

		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        if (this.scene.displayNormals) this.enableNormalViz();
        if (!this.scene.displayNormals) this.normalViz = false;
	}

    display(length_s, length_t) 
    {
        if ((length_s != null) && (length_t != null))
            this.updateTexScale(length_s, length_t);
        super.display();
    }
    
    
    updateTexScale(length_s, length_t)
    {
        this.texCoords = [];
        var s, t;
        for(var i=0; i<this.defaultTexCoords.length; i+=2)
        {
            s = this.defaultTexCoords[i]/length_s;
            t = this.defaultTexCoords[i+1]/length_t;
            this.texCoords.push(s, t);
        }
        // this.defaultTexCoords = this.texCoords;
        this.updateTexCoordsGLBuffers();
    }


	/**
	 * Updates the list of texture coordinates of the rectangle
	 * @method updateTexCoords
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}

