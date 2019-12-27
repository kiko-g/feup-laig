class GameBoard extends CGFobject 
{
    /**
     * @brief builds a game board used to play fuse (prolog game)
     * *********************************************************
     * @constructor
     * @param scene MyScene object
     * @param x position of the center of the table
     * @param y position of the center of the table
     * @param thickness thickness of the table
     * @param side length of the table side
     * @param height height of the table
     */
    constructor(scene, id, x, y, width, depth, height) 
    {
        super(scene);
        this.x = x;
        this.y = y;
        this.id = id;
        this.divs = 30;
        this.width = width;
        this.depth = depth;
        this.height = height;
        this.tile = new Tile(scene);
        this.initBuffers();

        this.boardtex = new CGFtexture(this.scene, 'img/board.png');
    }

    // -----------------------------------------------------------------------------
    createTopFace() 
    {
        let points = [
            [[this.x + (this.width / 2), this.y + (this.width / 2), this.height, 1.0],
             [this.x + (this.width / 2), this.y - (this.width / 2), this.height, 1.0]],

            [[this.x - (this.width / 2), this.y + (this.width / 2), this.height, 1.0],
             [this.x - (this.width / 2), this.y - (this.width / 2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.top = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);
    }
    // -----------------------------------------------------------------------------
    createBottomFace() 
    {
        let points = [
            [[this.x + (this.width / 2), this.y - (this.width / 2), 0.0, 1.0],
             [this.x + (this.width / 2), this.y + (this.width / 2), 0.0, 1.0]],

            [[this.x - (this.width / 2), this.y - (this.width / 2), 0.0, 1.0],
             [this.x - (this.width / 2), this.y + (this.width / 2), 0.0, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);
    }
    // -----------------------------------------------------------------------------
    createSideFace() 
    {
        let points = [
            [[this.x + (this.width / 2), this.y - (this.width / 2), 0.0, 1.0],
             [this.x - (this.width / 2), this.y - (this.width / 2), 0.0, 1.0]],

            [[this.x + (this.width / 2), this.y - (this.width / 2), this.height, 1.0],
             [this.x - (this.width / 2), this.y - (this.width / 2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        let sidedivs = Math.round((this.depth / this.height) * this.divs);
        this.side = new CGFnurbsObject(this.scene, sidedivs, this.divs, surface);
    }


    initBuffers() {
        this.createTopFace();
        this.createSideFace();
        this.createBottomFace();

        this.tileH = 0.2005;    //tile height
        this.tilestep = 0.753;  //tile step used to translate tiles
    }
    

    display() 
    {
        this.boardtex.bind();
        this.top.display();
        this.boardtex.unbind();
        this.bottom.display();
        // ---------------------
        this.scene.pushMatrix();
        
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();

        this.scene.popMatrix();

        for(let i=0; i<6; ++i)
            for(let j=0; j<6; ++j)
            {
                this.scene.pushMatrix();
                this.scene.translate(1.873-this.tilestep*i, 1.89-this.tilestep*j, this.tileH);
                this.scene.scale(0.72, 0.72, 0.72);
                this.tile.display();
                this.scene.popMatrix();
            }
        // ---------------------
    }
}
