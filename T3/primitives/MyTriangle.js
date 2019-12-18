/**
 * MyTriangle
 * @brief builds a Triangle object
 * @constructor
 */
class MyTriangle extends CGFobject
{
    constructor(scene, id, P1, P2, P3)
    {
        super(scene);
        this.id = id;
        //Point coords
        this.P1 = P1; 
        this.P2 = P2;
        this.P3 = P3;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.defaultTexCoords = [];

        this.vertices.push(...this.P1, ...this.P2, ...this.P3);
        this.vertices.push(...this.P1, ...this.P2, ...this.P3);
        this.indices.push(0, 1, 2);
        this.indices.push(5, 4, 3);

        let vec1, vec2, normal, revnormal;
        vec1 = [this.P3[0]-this.P1[0], this.P3[1]-this.P1[1], this.P3[2]-this.P1[2]];
        vec2 = [this.P2[0]-this.P1[0], this.P2[1]-this.P1[1], this.P2[2]-this.P1[2]];
        normal = this.crossproduct(vec1, vec2);
        revnormal = [-normal[0], -normal[1], -normal[2]];

        this.normals.push(...revnormal, ...revnormal, ...revnormal);
        this.normals.push(...normal, ...normal, ...normal);

        
        /**
         * MATH    ------> JS
         * 
         * x, y, z ------> 0, 1, 2
         * 1, 2, 3 ------> P1, P2, P3 
         * 
         * */
        let a, b, c;
        a = Math.sqrt(Math.pow(this.P2[0] - this.P1[0], 2) + Math.pow(this.P2[1] - this.P1[1], 2) + Math.pow(this.P2[2] - this.P1[2], 2));
        b = Math.sqrt(Math.pow(this.P2[0] - this.P3[0], 2) + Math.pow(this.P2[1] - this.P3[1], 2) + Math.pow(this.P2[2] - this.P3[2], 2));
        c = Math.sqrt(Math.pow(this.P1[0] - this.P3[0], 2) + Math.pow(this.P1[1] - this.P3[1], 2) + Math.pow(this.P1[2] - this.P3[2], 2));

        var cos_alpha = ((a*a) - (b*b) + (c*c)) / (2*a*c);
        var sin_alpha = Math.sqrt(1 - cos_alpha * cos_alpha);


        //3*2 points = 6 pairs of tex coords
        this.defaultTexCoords.push(
            0, 0,
            a, 0,
            c*cos_alpha, c*sin_alpha,
            0, 0,
            a, 0,
            c*cos_alpha, c*sin_alpha,
        );

        this.texCoords = [];
        for (var coord in this.defaultTexCoords)
            this.texCoords.push(this.defaultTexCoords[coord]);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    
    
    display(ls, lt) {
        if ((ls != null) && (lt != null))
            this.updateTexScale(ls, lt);
        super.display();
    }
    
    
    updateTexScale(ls, lt) {
        this.texCoords = [];
        var s, t;
        for (var i = 0; i < this.defaultTexCoords.length; i += 2) {
            s = this.defaultTexCoords[i] / ls;
            t = this.defaultTexCoords[i+1] / lt;
            this.texCoords.push(s, t);
        } this.updateTexCoordsGLBuffers();
    }

    crossproduct(v1, v2) {
        let x = v1[1] * v2[2] - v1[2] * v2[1];
        let y = v1[2] * v2[0] - v1[0] * v2[2];
        let z = v1[0] * v2[1] - v1[1] * v2[0];
        let L = Math.sqrt(x * x + y * y + z * z);
        return [x/L, y/L, z/L];
    }
    
	/**
	 * @brief Updates the list of texture coordinates of the rectangle
	 * @method updateTexCoords
	 * @param {Array} coords - Array of texture coordinates
	 */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}
