/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
    constructor(scene, id, p1, p2, p3) {
        super(scene);
        this.id = id;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.vertices.push(...this.p1, ...this.p2, ...this.p3);
        this.vertices.push(...this.p1, ...this.p2, ...this.p3);

        let v1 = subtractVector(this.p3, this.p1);
        let v2 = subtractVector(this.p2, this.p1);
        let normal2 = crossProduct(v1, v2);
        let normal1 = reverseVector(normal2);

        this.normals.push(...normal1, ...normal1, ...normal1);
        this.normals.push(...normal2, ...normal2, ...normal2);

        let a = Math.sqrt(Math.pow(this.p2[0] - this.p1[0], 2) + Math.pow(this.p2[1] - this.p1[1]) + Math.pow(this.p2[2] - this.p1[2]));
        let b = Math.sqrt(Math.pow(this.p2[0] - this.p3[0], 2) + Math.pow(this.p2[1] - this.p3[1]) + Math.pow(this.p2[2] - this.p3[2]));
        let c = Math.sqrt(Math.pow(this.p1[0] - this.p3[0], 2) + Math.pow(this.p1[1] - this.p3[1]) + Math.pow(this.p1[2] - this.p3[2]));

        let beta = Math.acos((a * a - b * b + c * c) / (2 * a * c));
        let cos = ((a * a) - (b * b) + (c * c)) / (2 * a * c);
        let sin = Math.sqrt(1 - cos * cos);

		/*this.texCoords.push(
			0, 0,
			c, 0,
			a*cos, a*sin,
			0, 0,
			c, 0,
			a*cos, a*sin
		);*/
        this.texCoords = [
            0, 1,
            c, 1,
            c - a * Math.cos(beta), 1 - a * Math.sin(beta),
            0, 1,
            c, 1,
            c - a * Math.cos(beta), 1 - a * Math.sin(beta),
        ]

        this.indices.push(0, 1, 2);
        this.indices.push(3, 5, 4);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}