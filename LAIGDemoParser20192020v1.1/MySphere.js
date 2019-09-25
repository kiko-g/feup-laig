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
	
	initBuffers() {
        
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

		var stackStep = Math.PI  / this.stacks;
        var sectorStep = Math.PI* 2  / this.sectors;

        var normLength = 1.0 / this.radius;


        for(var i = 0; i <= this.stacks; i++){

			var stackAngle = (Math.PI / 2) - i * stackStep; 	// starting from pi/2 to -pi/2
			var xy = this.radius * Math.cos(stackAngle);				// r * cos(alpha)
            var z = this.radius * Math.sin(stackAngle);				// r * sin(alpha)

            for (var j = 0; j <= this.sectors; j++){

                var sectorAngle = j* sectorStep;				// starting from 0 to 2pi
                
                //Posicoes dos vertices
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

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
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

