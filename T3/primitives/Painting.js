class Painting extends CGFobject 
{
    /**
     * @brief builds a game board used to play fuse (prolog game)
     * *********************************************************
     * @constructor
     * @param scene MyScene object
     * @param x position of the center of the table
     * @param y position of the center of the table
     * @param width thickness of the table
     * @param depth length of the table side
     * @param height height of the table
     */
    constructor(scene, id, x, y, width, depth, height) 
    {
        super(scene);
        this.x = x;
        this.y = y;
        this.id = id;
        this.divs = 40;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(1, 1, 1, 1);
        this.material.setDiffuse(1, 1, 1, 1);
        this.material.setSpecular(1, 1, 1, 1);
        this.material.setShininess(10);
        this.createFaces();
    }

    createFaces() 
    {
        //TOP FACE
        let points = [
            [[this.x + (this.width/2), this.y + (this.depth/2), this.height, 1.0],
             [this.x + (this.width/2), this.y - (this.depth/2), this.height, 1.0]],

            [[this.x - (this.width/2), this.y + (this.depth/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.depth/2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.top = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);


        //BOTTOM FACE
        points = [
            [[this.x + (this.width/2), this.y - (this.depth/2), 0.0, 1.0],
             [this.x + (this.width/2), this.y + (this.depth/2), 0.0, 1.0]],

            [[this.x - (this.width/2), this.y - (this.depth/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y + (this.depth/2), 0.0, 1.0]]
        ];
        surface = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);


        //SIDE FACE
        points = [
            [[this.x + (this.width/2), this.y - (this.depth/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y - (this.depth/2), 0.0, 1.0]],

            [[this.x + (this.width/2), this.y - (this.depth/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.depth/2), this.height, 1.0]]
        ];
        surface = new CGFnurbsSurface(1, 1, points);
        let sidedivs = Math.round((this.depth/this.height) * this.divs);
        this.side = new CGFnurbsObject(this.scene, sidedivs, this.divs, surface);
    }


    display() 
    {
        this.scene.translate(4.5, 0, 3.5);
        this.scene.scale(0.6, 0.6, 0.6);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0);
        this.top.display();
        
        // this.material.apply();
        // this.scene.pushMatrix();
        // this.side.display();
        // this.scene.rotate(Math.PI, 0, 0, 1);
        // this.side.display();
        // this.scene.popMatrix();
    } //display
}

