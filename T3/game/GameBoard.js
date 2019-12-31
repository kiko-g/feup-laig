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
        this.alltiles = [];     //10x6 array all tiles
        this.innertiles = [];   //6x6 array of inner tiles
        this.outertiles = [];   //4x6 array of outer tiles
        this.boardtiles = [];   //8x8 board array of tiles
        
        this.texture = new CGFtexture(this.scene, 'img/board.png');
        
        this.initBuffers();
    }


    createTopFace() {
        let points = [
            [[this.x + (this.width/2), this.y + (this.width/2), this.height, 1.0],
             [this.x + (this.width/2), this.y - (this.width/2), this.height, 1.0]],

            [[this.x - (this.width/2), this.y + (this.width/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.top = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);
    }
    createBottomFace() {
        let points = [
            [[this.x + (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x + (this.width/2), this.y + (this.width/2), 0.0, 1.0]],

            [[this.x - (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y + (this.width/2), 0.0, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);
    }
    createSideFace() {
        let points = [
            [[this.x + (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), 0.0, 1.0]],

            [[this.x + (this.width/2), this.y - (this.width/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        let sidedivs = Math.round((this.depth/this.height) * this.divs);
        this.side = new CGFnurbsObject(this.scene, sidedivs, this.divs, surface);
    }


    initializeTiles() 
    {
        let game = this.scene.game;
        this.tilestep = 1.05;       //tile step used to translate tiles
        this.tilescale = 0.72       //tile scale used to resize tile
        this.tileheight = 0.201;    //tile height

        //inner tiles
        for (let i=0; i<6; i++) {
            let aux = [];
            for (let j=0; j<6; j++) {
                //scene, isOuter, hasPiece, pieceColor
                let tile = new Tile(this.scene, false, false, undefined);
                aux.push(tile);
            }
            this.innertiles[i] = aux;
            this.alltiles.push(aux);
        }

        //outer tiles
        for (let i=0; i<4; i++) {
            let aux = [];
            for (let j=0; j<6; j++) {
                let tile = new Tile(this.scene, true, true, game.RL[i][j]);
                aux.push(tile);
            }
            this.outertiles[i] = aux;
            this.alltiles.push(aux);
        }
        
        //build 8x8 board tiles
        // this.boardtiles = this.buildBoard(); 
    }

    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------

    initBuffers() {
        this.createTopFace();
        this.createSideFace();
        this.createBottomFace();
        this.initializeTiles();
    }

    
    picking()
    {
        if(this.scene.pickMode == false)
        if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
            for(let i = 0; i < this.scene.pickResults.length; i++)
                if(this.scene.pickResults[i][0]) 
                {
                    let ID = this.scene.pickResults[i][1];
                    var x = parseInt((ID-1) / 6);
                    var y = parseInt((ID-1) % 6);

                    if(!this.alltiles[x][y].outer) {
                        if (this.innertiles[x][y].states.picked) this.innertiles[x][y].states.picked = false;
                        else this.innertiles[x][y].states.picked = true;
                    }
                    else {
                        if (this.outertiles[x-6][y].states.picked) this.outertiles[x-6][y].states.picked = false;
                        else this.outertiles[x-6][y].states.picked = true;
                    }
            }
    }


    display() 
    {
        this.picking();
        this.scene.logPicking();
        this.scene.pickResults.splice(0, this.scene.pickResults.length);
        this.scene.clearPickRegistration();
        // ---------------------
        this.texture.bind();
        this.top.display();
        this.texture.unbind();
        this.bottom.display();

        this.scene.pushMatrix();
        this.side.display();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.side.display();
        this.scene.popMatrix();

        //display inner tiles
        let dtr = Math.PI / 180;
        this.scene.translate(-1.89, 1.89, this.tileheight);
        this.scene.rotate(90 * dtr, 1, 0, 0);
        this.scene.scale(this.tilescale, this.tilescale, this.tilescale);
        for(let i=0; i<6; i++) {
            for(let j=0; j<6; j++) {
                this.scene.pushMatrix();
                this.scene.translate(this.tilestep * i, 0, this.tilestep*j);
                this.scene.registerForPick(6*i + j + 1, this.innertiles[i][j]);
                this.innertiles[i][j].display();
                if(this.innertiles[0][i].hasPiece) this.innertiles[i][j].piece.display();
                this.scene.popMatrix();
            }
        }

        //display outer tiles
        for(let i=0; i<6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(-this.tilestep, 0, this.tilestep * i);
            this.scene.registerForPick(i + 37, this.outertiles[0][i]);
            this.outertiles[0][i].display();
            if(this.outertiles[0][i].hasPiece) this.outertiles[0][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep * i, 0, this.tilestep*6);
            this.scene.registerForPick(i + 43, this.outertiles[1][i]);
            this.outertiles[1][i].display();
            if(this.outertiles[1][i].hasPiece) this.outertiles[1][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep*6, 0, this.tilestep*(5-i));
            this.scene.registerForPick(i + 49, this.outertiles[2][i]);
            this.outertiles[2][i].display();
            if(this.outertiles[2][i].hasPiece) this.outertiles[2][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep * (5-i), 0, -this.tilestep);
            this.scene.registerForPick(i + 55, this.outertiles[3][i]);
            this.outertiles[3][i].display();
            if(this.outertiles[3][i].hasPiece) this.outertiles[3][i].piece.display();
            this.scene.popMatrix();
        }

        this.scene.clearPickRegistration(); //clear last pick register
    } //display
}

