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
        this.available = [];
        this.texture = new CGFtexture(this.scene, 'scenes/img/board.png');
        this.timer = new Timer(this.scene, this);
        
        this.scene.gameboard = this;
        this.game = this.scene.game;
        
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
        let B = this.game.initialboard;
        this.alltiles = [];         // 60x1 array with all tiles (60)
        this.innertiles = [];       // 6x6  array of inner tiles (36)
        this.outertiles = [];       // 4x6  array of outer tiles (24)
        this.tilestep = 1.05;       //tile step used to translate tiles
        this.tilescale = 0.72       //tile scale used to resize tile
        this.tileheight = 0.201;    //tile height
        
        //inner tiles
        for (let i=0; i<6; i++) {
            var aux = [];
            for (let j=0; j<6; j++) 
            {
                let has;
                if(B[i+1][j+1] == P.Empty) has = false;
                else has = true;

                let tile = new Tile(this.scene, false, has, B[i+1][j+1], j+1, i+1); 
                aux.push(tile);

            }
            this.innertiles[i] = aux;
            this.alltiles.push(aux);
        }

        //outer tiles
        for (let i=0; i<4; i++) {
            var aux = [];
            for (let j=0; j<6; j++) {
                let tile;
                if(i==0) tile = new Tile(this.scene, true, true, B[6-j][7],   7,  6-j);
                if(i==1) tile = new Tile(this.scene, true, true, B[0][6-j], 6-j,    0);
                if(i==2) tile = new Tile(this.scene, true, true, B[j+1][0],   0,  j+1);
                if(i==3) tile = new Tile(this.scene, true, true, B[7][j+1], j+1,    7);
                aux.push(tile);
            }
            this.outertiles[i] = aux;
            this.alltiles.push(aux);
        }
    }


    updateTiles() {
        if(this.game.boardready) { }
    }


    timeOut() {
        if(this.game.gamemode === 'PVP') {
            if(this.game.turn.color === this.game.turns.W) this.game.turn = {color: this.game.turns.B, player: this.game.turns.human };
            else this.game.turn = {color: this.game.turns.W, player: this.game.turns.human };
        }

        else if(this.game.gamemode === 'PVC') {
            if(this.game.turn.color === this.game.turns.W) {
                if(this.game.turn.player === this.game.players.human) this.game.turn = {color: this.game.turns.B, player: this.game.turns.CPU };
                else this.game.turn = {color: this.game.turns.B, player: this.game.turns.human };
            }
            else if(this.game.turn.color === this.game.turns.B) {
                if(this.game.turn.player === this.game.players.human) this.game.turn = {color: this.game.turns.W, player: this.game.turns.CPU };
                else this.game.turn = {color: this.game.turns.W, player: this.game.turns.human };
            }
        }

        else if(this.game.gamemode === 'CVC') {
            if(this.game.turn.color === this.turns.W) this.game.turn = {color: this.game.turns.B, player: this.game.turns.CPU };
            else this.game.turn = {color: this.game.turns.W, player: this.game.turns.CPU };
        }

        // this.scene.game.cameraAnimation();
    }

    // ======= PICKING FUNCTIONS START ========
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
                if(i<6) this.innertiles[i][j].states.available = false;
                else this.outertiles[i-6][j].states.available = false;
                if(i<6) this.innertiles[i][j].states.move = false;
                else this.outertiles[i-6][j].states.move = false;
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
                        
                        if (p.outer && p.pieceColor == this.game.P.White) 
                        {
                            this.available = [];
                            this.clearAllPicked();
                            this.outertiles[x-6][y].states.picked = true;
                            this.outertiles[x-6][y].states.available = false;
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

                        if (p.outer && p.pieceColor == this.game.P.Black) 
                        {
                            this.available = [];
                            this.clearAllPicked();
                            this.outertiles[x-6][y].states.picked = true;
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
        x = x - 6;
        var aux = 0;
        if (ID >= 37 && ID <= 42)
            for (let i=0; i<6; i++) {
                if(this.innertiles[5-y][i].hasPiece) aux++;
            }
        else return;
        // console.log(x, y);

        for (let i=0; i<6-aux; i++) {
            this.available.push({x: 5-y, y: i});
            this.innertiles[5-y][i].states.picked = true;
            this.innertiles[5-y][i].states.available = true;
        }
    }


    leftAvailable(ID, x, y) 
    {
        x = x - 6;
        var aux = 0;
        if (ID >= 49 && ID <= 54)
            for (let i=0; i<6; i++) {
                if(this.innertiles[y][i].hasPiece) aux++;
            }
        else return;
        // console.log(x, y);

        for (let i=0; i<(6-aux); i++) {
            this.available.push({x: y, y: i});
            this.innertiles[y][i].states.picked = true;
            this.innertiles[y][i].states.available = true;
        }
    }


    topAvailable(ID, x, y) 
    {
        //x and y are in "POS"
        x = x - 6;
        var aux = 0;
        if (ID >= 43 && ID <= 48)
            for (let i=0; i<6; i++) {
                if(this.innertiles[i][5-y].hasPiece) aux++;
            }
        else return;
        // console.log(x, y);

        for (let i=0; i<6-aux; i++) { 
            this.available.push({x: i, y: 5-y});
            this.innertiles[i][5-y].states.picked = true;
            this.innertiles[i][5-y].states.available = true;
        }
    }


    bottomAvailable(ID, x, y) 
    {
        x = x-6;
        var aux = 0;
        if (ID >= 55 && ID <= 60) 
            for (let i=0; i<6; i++) {
                if(this.innertiles[i][y].hasPiece) aux++;
            }
        else return;
        // console.log(x, y);

        for (let i=0; i<6-aux; i++) {
            this.available.push({x: i, y: y});
            this.innertiles[i][y].states.picked = true;
            this.innertiles[i][y].states.available = true;
        }
    } 

    pickAvailable() 
    {
        if(this.scene.pickMode == false)
          if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
          {
              for(var i = 0; i < this.scene.pickResults.length; i++) 
                if(this.scene.pickResults[i][0]) 
                {
                    let ID = this.scene.pickResults[i][1];
                    var x = parseInt((ID - 1) / 6);
                    var y = parseInt((ID - 1) % 6);

                    for(let j=0; j<this.available.length; j++) {
                        let a = this.available[j].x;
                        let b = this.available[j].y;
                        if(x==a && y==b) this.innertiles[a][b].states.move = true;
                        this.game.animActive = true;
                    }

                }
          }
    }
    // ======= END OF PICKING FUNCTIONS SECTION =======



    display() {
        if(!this.game.animActive) this.updateTiles();
        this.displayBoardBase();
        if (this.game.started && this.game.gamemode === 'PVP') {
            this.scene.logPicking();
            if(this.game.turn.color === this.game.turns.W) this.pickwhite();
            if(this.game.turn.color === this.game.turns.B) this.pickblack();
            this.pickAvailable();
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            this.scene.clearPickRegistration();

          
            this.timer.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
            this.scene.clearPickRegistration(); //clear last pick register
        }
        if (this.game.started && this.game.gamemode === 'PVC') {
            this.scene.logPicking();
            if(this.game.turn.color === this.game.turns.W) this.pickwhite();
            this.pickAvailable();
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            this.scene.clearPickRegistration();

            this.timer.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
            this.scene.clearPickRegistration(); //clear last pick register
        }
        if (this.game.started && this.game.gamemode === 'CVC') {
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.timer.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
        }
    }


    displayBoardBase() {
        this.texture.bind();
        this.top.display();
        this.texture.unbind();
        this.bottom.display();
        this.scene.pushMatrix();
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.side.display();
        this.scene.popMatrix();        
    }

    displayInnerTiles() {
        let dtr = Math.PI / 180;
        this.scene.scale(this.width / 6, this.depth / 6, 1);
        this.scene.translate(-1.89, 1.89, this.tileheight);
        this.scene.rotate(90 * dtr, 1, 0, 0);
        this.scene.scale(this.tilescale, this.tilescale, this.tilescale);        
        for (let i = 0; i < 6; i++)
            for (let j = 0; j < 6; j++) {
                this.scene.pushMatrix();
                this.scene.translate(5.25-this.tilestep * j, 0, 5.25-this.tilestep*i);
                this.scene.registerForPick(6 * i + j + 1, this.innertiles[i][j]);
                this.innertiles[i][j].display();
                if (this.innertiles[i][j].hasPiece) {
                    // let anim = this.innertiles[i][j].piece.animation;
                    this.innertiles[i][j].piece.display();
                    // if(!anim.animationDone && this.innertiles[i][j].animActive) anim.apply();
                } 
                this.scene.popMatrix();
            }
    }

    displayOuterTiles() {
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
    }


}





/** Auxiliar functions
 * @brief Coordinates translation
 */
function convertID(id) 
{
    if(id == 1) return {x: 0, y: 0};
    if(id == 2) return {x: 0, y: 1};
    if(id == 3) return {x: 0, y: 2};
    if(id == 4) return {x: 0, y: 3};
    if(id == 5) return {x: 0, y: 4};
    if(id == 6) return {x: 0, y: 5};
    if(id == 7) return {x: 1, y: 0};
    if(id == 8) return {x: 1, y: 1};
    if(id == 9) return {x: 1, y: 2};
    if(id == 10) return {x: 1, y: 3};
    if(id == 11) return {x: 1, y: 4};
    if(id == 12) return {x: 1, y: 5};
    if(id == 13) return {x: 2, y: 0};
    if(id == 14) return {x: 2, y: 1};
    if(id == 15) return {x: 2, y: 2};
    if(id == 16) return {x: 2, y: 3};
    if(id == 17) return {x: 2, y: 4};
    if(id == 18) return {x: 2, y: 5};
    if(id == 19) return {x: 3, y: 0};
    if(id == 20) return {x: 3, y: 1};
    if(id == 21) return {x: 3, y: 2};
    if(id == 22) return {x: 3, y: 3};
    if(id == 23) return {x: 3, y: 4};
    if(id == 24) return {x: 3, y: 5};
    if(id == 25) return {x: 4, y: 0};
    if(id == 26) return {x: 4, y: 1};
    if(id == 27) return {x: 4, y: 2};
    if(id == 28) return {x: 4, y: 3};
    if(id == 29) return {x: 4, y: 4};
    if(id == 30) return {x: 4, y: 5};
    if(id == 31) return {x: 5, y: 0};
    if(id == 32) return {x: 5, y: 1};
    if(id == 33) return {x: 5, y: 2};
    if(id == 34) return {x: 5, y: 3};
    if(id == 35) return {x: 5, y: 4};
    if(id == 36) return {x: 5, y: 5};
    //outer
    if(id == 37) return {x: 0, y: 0};
    if(id == 38) return {x: 0, y: 1};
    if(id == 39) return {x: 0, y: 2};
    if(id == 40) return {x: 0, y: 3};
    if(id == 41) return {x: 0, y: 4};
    if(id == 42) return {x: 0, y: 5};
    if(id == 43) return {x: 1, y: 0};
    if(id == 44) return {x: 1, y: 1};
    if(id == 45) return {x: 1, y: 2};
    if(id == 46) return {x: 1, y: 3};
    if(id == 47) return {x: 1, y: 4};
    if(id == 48) return {x: 1, y: 5};
    if(id == 49) return {x: 2, y: 0};
    if(id == 50) return {x: 2, y: 1};
    if(id == 51) return {x: 2, y: 2};
    if(id == 52) return {x: 2, y: 3};
    if(id == 53) return {x: 2, y: 4};
    if(id == 54) return {x: 2, y: 5};
    if(id == 55) return {x: 3, y: 0};
    if(id == 56) return {x: 3, y: 1};
    if(id == 57) return {x: 3, y: 2};
    if(id == 58) return {x: 3, y: 3};
    if(id == 59) return {x: 3, y: 4};
    if(id == 60) return {x: 3, y: 5};                
}

function convertPOS(pos, outer) 
{
    if(outer > 36) outer = true;
    else outer = false;

    if(outer) {
        if (pos.x == 0) for (let i=0; i<6; i++) if (pos.y == i) return (37 + i);
        if (pos.x == 1) for (let i=0; i<6; i++) if (pos.y == i) return (43 + i);
        if (pos.x == 2) for (let i=0; i<6; i++) if (pos.y == i) return (49 + i);
        if (pos.x == 3) for (let i=0; i<6; i++) if (pos.y == i) return (55 + i);
    }

    else {
        if (pos.x == 0) for (let i=0; i<6; i++) if (pos.y == i) return (1 + i);
        if (pos.x == 1) for (let i=0; i<6; i++) if (pos.y == i) return (7 + i);
        if (pos.x == 2) for (let i=0; i<6; i++) if (pos.y == i) return (13 + i);
        if (pos.x == 3) for (let i=0; i<6; i++) if (pos.y == i) return (19 + i);
        if (pos.x == 4) for (let i=0; i<6; i++) if (pos.y == i) return (25 + i);
        if (pos.x == 5) for (let i=0; i<6; i++) if (pos.y == i) return (31 + i);
    }
}

function PLtoPOS(PL) 
{
    if(PL.x == 8){ for (let i=2; i<8; i++) if (PL.y == i) return {x: 0, y: 7-i}; }
    else if(PL.y == 1){ for (let i=2; i<8; i++) if (PL.x == i) return {x: 1, y: 7-i}; }
    else if(PL.x == 1){ for (let i=2; i<8; i++) if (PL.y == i) return {x: 2, y: i-2}; }
    else if(PL.y == 8){ for (let i=2; i<8; i++) if (PL.x == i) return {x: 3, y: i-2}; }
    else {
        var X, Y;
        for(let i=1; i<9; i++) {
            if(PL.x == i) X = 7-i;
        } 
        for(let i=1; i<9; i++) if(PL.y == i) Y = 7-i;
        
        return {x: X, y: Y};
    }
}

function POStoPL(pos, outer) 
{
    if (Number.isInteger() && outer>36) outer = true;
    else if (Number.isInteger() && outer<=36) outer = false;

    if(outer) {
        if (pos.x == 0) for (let i=0; i<6; i++) if (pos.y == i) return {x: 8, y: 7-i};
        if (pos.x == 1) for (let i=0; i<6; i++) if (pos.y == i) return {x: 7-i, y: 1};
        if (pos.x == 2) for (let i=0; i<6; i++) if (pos.y == i) return {x: 1, y: 2+i};
        if (pos.x == 3) for (let i=0; i<6; i++) if (pos.y == i) return {x: 2+i, y: 8};
    }
    else {
        if (pos.x == 0) for (let i=0; i<6; i++) if (pos.y == i) return {x: 7, y: 7-i};
        if (pos.x == 1) for (let i=0; i<6; i++) if (pos.y == i) return {x: 6, y: 7-i};
        if (pos.x == 2) for (let i=0; i<6; i++) if (pos.y == i) return {x: 5, y: 7-i};
        if (pos.x == 3) for (let i=0; i<6; i++) if (pos.y == i) return {x: 4, y: 7-i};
        if (pos.x == 4) for (let i=0; i<6; i++) if (pos.y == i) return {x: 3, y: 7-i};
        if (pos.x == 5) for (let i=0; i<6; i++) if (pos.y == i) return {x: 2, y: 7-i};
    }
}