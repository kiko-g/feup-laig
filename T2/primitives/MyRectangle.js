/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyRectangle extends CGFobject
{
    constructor(scene, id, x1, x2, y1, y2, bothSides = false, secCam = false)
    {
        super(scene);
        this.id = id;
		this.x1 = x1;
		this.x2 = x2;
		this.y1 = y1;
        this.y2 = y2;
        this.bothSides = bothSides;
        this.secCam = secCam;
        //we made some changes to the ractangle, the first boolean (false) controls if the ractangle
        //has two sides and the second boolean (true) controls if the rectangle created corresponds
        //to the security camera

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
        this.indices = [ 0, 1, 2, 1, 3, 2 ];
        if(this.bothSides) this.indices.push(2, 1, 0, 2, 3, 1);

        
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

        var dx = this.x2 - this.x1;
        var dy = this.y2 - this.y1;

        if(!this.secCam) this.defaultTexCoords = [
             0, dy,
            dx, dy,
			 0,  0,
            dx,  0
        ];
        
        else this.defaultTexCoords = [
              0, 0,
             dx, 0,
             0, dy,
            dx, dy
        ];
        
        this.texCoords = [];
        for(var coord in this.defaultTexCoords)
            this.texCoords.push(this.defaultTexCoords[coord]);
            
		this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
	}

    display(ls, lt) 
    {
        if ((ls != null) && (lt != null))
            this.updateTexScale(ls, lt);
        super.display();
    }
    
    updateTexScale(ls, lt)
    {
        this.texCoords = [];
        var s, t;
        for(var i=0; i<this.defaultTexCoords.length; i+=2)
        {
            s = this.defaultTexCoords[i]/ls;
            t = this.defaultTexCoords[i+1]/lt;
            this.texCoords.push(s, t);
        }
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

