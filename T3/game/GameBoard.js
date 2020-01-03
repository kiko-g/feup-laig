class GameBoard extends CGFobject 
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
        this.available = 0;

        this.prev_piece = {x: null, y: null, ID: null};

        this.alltiles = [];     // 60x1 array with all tiles (60)
        this.innertiles = [];   // 6x6  array of inner tiles (36)
        this.outertiles = [];   // 4x6  array of outer tiles (24)
        
        this.texture = new CGFtexture(this.scene, 'scenes/img/board.png');
        
        this.createFaces();
        this.initializeTiles();
    }

    createFaces() 
    {
        //TOP FACE
        let points = [
            [[this.x + (this.width/2), this.y + (this.width/2), this.height, 1.0],
             [this.x + (this.width/2), this.y - (this.width/2), this.height, 1.0]],

            [[this.x - (this.width/2), this.y + (this.width/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), this.height, 1.0]]
        ];
        let surface = new CGFnurbsSurface(1, 1, points);
        this.top = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);


        //BOTTOM FACE
        points = [
            [[this.x + (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x + (this.width/2), this.y + (this.width/2), 0.0, 1.0]],

            [[this.x - (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y + (this.width/2), 0.0, 1.0]]
        ];
        surface = new CGFnurbsSurface(1, 1, points);
        this.bottom = new CGFnurbsObject(this.scene, this.divs, this.divs, surface);


        //SIDE FACE
        points = [
            [[this.x + (this.width/2), this.y - (this.width/2), 0.0, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), 0.0, 1.0]],

            [[this.x + (this.width/2), this.y - (this.width/2), this.height, 1.0],
             [this.x - (this.width/2), this.y - (this.width/2), this.height, 1.0]]
        ];
        surface = new CGFnurbsSurface(1, 1, points);
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
    }

    

    // ========================================
    // ======= PICKING FUNCTIONS START ========
    // ========================================

    /** @brief function for general picking*/
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


    /** @brief function to clear all tiles picked*/
    clearAllPicked() 
    {
        for(let i=0; i<10; i++)
            for(let j=0; j<6; j++) 
            {
                if(i<6) this.innertiles[i][j].states.picked = false;
                else this.outertiles[i-6][j].states.picked = false;
            }
    }


    /** @brief function for white player turn*/
    pickwhite()
    {
        if(this.scene.pickMode == false)
            if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
                for(let i = 0; i < this.scene.pickResults.length; i++)
                {
                    if(this.scene.pickResults[i][0]) 
                    {
                        var ID = this.scene.pickResults[i][1];
                        var x = parseInt((ID-1) / 6);
                        var y = parseInt((ID-1) % 6);
                        var p = this.alltiles[x][y];
                        
                        if (p.outer && p.pieceColor == this.scene.game.P.White) 
                        {
                            this.clearAllPicked();
                            this.outertiles[x-6][y].states.picked = true;
                            this.prev_piece.x = x; this.prev_piece.y = y; this.prev_piece.ID = ID;
                            this.rightAvailable(ID, x, y);
                            this.topAvailable(ID, x, y);
                            this.leftAvailable(ID, x, y);
                            this.bottomAvailable(ID, x, y);
                        }
                    }
                }
    }


    /** @brief function for black player turn*/
    pickblack()
    {
        if(this.scene.pickMode == false)
            if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
                for(let i = 0; i < this.scene.pickResults.length; i++)
                {
                    if(this.scene.pickResults[i][0]) 
                    {
                        var ID = this.scene.pickResults[i][1];
                        var x = parseInt((ID-1) / 6);
                        var y = parseInt((ID-1) % 6);
                        var p = this.alltiles[x][y];

                        if (p.outer && p.pieceColor == this.scene.game.P.Black) 
                        {
                            this.clearAllPicked();
                            this.outertiles[x-6][y].states.picked = true;
                            this.prev_piece.x = x; this.prev_piece.y = y; this.prev_piece.ID = ID;
                            this.rightAvailable(ID, x, y);
                            this.topAvailable(ID, x, y);
                            this.leftAvailable(ID, x, y);
                            this.bottomAvailable(ID, x, y);
                        }
                    }
                }
    }


    /** @brief function to display available tiles after white/black pick*/
    rightAvailable(ID, x , y) 
    {
        this.available = 0;
        if (ID >= 37 && ID <= 42)
            for (let i=0; i<6; i++) 
                if(!this.innertiles[6 - x + i][y].hasPiece) this.available++;

        for (let i=0; i<this.available; i++) { 
            this.innertiles[6 - x + i][y].states.picked = true;
            this.innertiles[6 - x + i][y].states.available = true;
        }
        this.outertiles[x-6][y].piece.translateRight(2);
    }


    leftAvailable(ID, x, y) 
    {
        this.available = 0;
        if (ID >= 49 && ID <= 54)
            for (let i=0; i<6; i++) 
                if(!this.innertiles[x - i - 3][5 - y].hasPiece) this.available++;

        for (let i=0; i<this.available; i++) {
            this.innertiles[x - i - 3][5 - y].states.picked = true;
            this.innertiles[x - i - 3][5 - y].states.available = true;
        }
    }


    topAvailable(ID, x, y) 
    {
        this.available = 0;
        if (ID >= 43 && ID <= 48)
            for (let i=0; i<6; i++) 
                if(!this.innertiles[y][5 - i].hasPiece) this.available++;

        for (let i=0; i<this.available; i++) { 
            this.innertiles[y][5 - i].states.picked = true;
            this.innertiles[y][5 - i].states.available = true;
        }
    }


    bottomAvailable(ID, x, y) 
    {
        this.available = 0;
        if (ID >= 55 && ID <= 60) 
            for (let i=0; i<6; i++) 
                if(!this.innertiles[x - y - 4][i].hasPiece) this.available++;
        
        for (let i=0; i<this.available; i++) {
            this.innertiles[x - y - 4][i].states.picked = true;
            this.innertiles[x - y - 4][i].states.available = true;
        }
    } 
// ======= END OF PICKING FUNCTIONS SECTION =======


    display() 
    {
        let game = this.scene.game;
        if(game.blackTurn) this.pickblack();
        if(game.whiteTurn) this.pickwhite();
        this.scene.logPicking();
        this.scene.pickResults.splice(0, this.scene.pickResults.length);
        this.scene.clearPickRegistration();
        // -------------------------------------------------------------
        this.scene.translate(-0.1, 0, 0);
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
        this.scene.scale(this.width/6, this.depth/6, 1);
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

