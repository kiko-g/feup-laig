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

        this.timer = new Timer(this.scene, this);
        this.scoreboard = new Scoreboard(this.scene, this.scene.game.board, this);

        this.texture = new CGFtexture(this.scene, 'scenes/img/board.png');
        this.whitesideTEX = new CGFtexture(this.scene, 'scenes/img/numbers/white-side.png');
        this.blacksideTEX = new CGFtexture(this.scene, 'scenes/img/numbers/black-side.png');
        
        this.scene.gameboard = this;
        this.game = this.scene.game;
        this.readyToPick = false;
        
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

                let tile = new Tile(this.scene, false, B[i+1][j+1], i+1, j+1); 
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
                if(i==0) tile = new Tile(this.scene, true, B[6-j][7], 6-j,   7);
                if(i==1) tile = new Tile(this.scene, true, B[0][6-j],   0, 6-j);
                if(i==2) tile = new Tile(this.scene, true, B[j+1][0], j+1,   0);
                if(i==3) tile = new Tile(this.scene, true, B[7][j+1],   7, j+1);
                aux.push(tile);
            }
            this.outertiles[i] = aux;
            this.alltiles.push(aux);
        }
    }


    /**@brief used to change turn AKA timeout */
    timeOut() 
    {
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

        this.clearAllPicked();
        setTimeout(() => { this.scene.game.cameraAnimation(); }, 500);
        setTimeout(() => { this.timer.resetCount(); }, 1500);
        
    }


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


    pickcpu(color) {

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
                    if(x > 5) this.move = {a: x-6, b: y };

                    if (p.outer && p.pieceColor==this.game.P.White && p.piece!=null) 
                    {
                        this.available = [];
                        this.clearAllPicked();
                        this.outertiles[x-6][y].states.picked = true;
                        this.outertiles[x-6][y].states.available = false;
                        this.readyToPick = true;
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

                if (p.outer && p.pieceColor == this.game.P.Black && p.piece!=null) 
                {
                    this.available = [];
                    this.clearAllPicked();
                    this.outertiles[x-6][y].states.picked = true;
                    this.outertiles[x-6][y].states.available = false;
                    this.readyToPick = true;
                    this.rightAvailable(ID, x, y);
                    this.topAvailable(ID, x, y);
                    this.leftAvailable(ID, x, y);
                    this.bottomAvailable(ID, x, y);
                }
            }
        }
    }


    /** @brief 4 functions to display available tiles after white/black pick*/
    rightAvailable(ID, x , y) 
    {
        x = x - 6;
        var aux = 0;
        if (ID >= 37 && ID <= 42)
            for (let i=0; i<6; i++) {
                if(this.innertiles[5-y][5-i].piece != null) aux++;
            }
        else return;

        for (let i=0; i<6-aux; i++) {
            this.available.push({x: 5-y, y: 5-i});
            this.innertiles[5-y][5-i].states.picked = true;
            this.innertiles[5-y][5-i].states.available = true;
        }
    }


    leftAvailable(ID, x, y) 
    {
        x = x - 6;
        var aux = 0;
        if (ID >= 49 && ID <= 54)
            for (let i=0; i<6; i++) {
                if(this.innertiles[y][i].piece != null) aux++;
            }
        else return;

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
                if(this.innertiles[i][5-y].piece != null) aux++;
            }
        else return;

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
                if(this.innertiles[5-i][y].piece != null) aux++;
            }
        else return;

        for (let i=0; i<6-aux; i++) {
            this.available.push({x: 5-i, y: y});
            this.innertiles[5-i][y].states.picked = true;
            this.innertiles[5-i][y].states.available = true;
        }
    } 


    /** @brief used for human to pick available tile to move piece in game */
    pickAvailable() 
    {
        if(!this.readyToPick) return;
        if(this.scene.pickMode == false)
          if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
          {
              for(var i = 0; i < this.scene.pickResults.length; i++) 
                if(this.scene.pickResults[i][0]) 
                {
                    let ID = this.scene.pickResults[i][1];
                    var x = parseInt((ID - 1) / 6);
                    var y = parseInt((ID - 1) % 6);
                    if(x < 6) {
                        this.move.c = x;
                        this.move.d = y;
                    }

                    //check if there's a position locked already (purple)
                    for (let j = 0; j < this.available.length; j++) {
                        let a = this.available[j].x;
                        let b = this.available[j].y;
                        if (this.innertiles[a][b].states.move) return;
                    }

                    //movePiece upon click
                    for(let j=0; j<this.available.length; j++) {
                        let a = this.available[j].x;
                        let b = this.available[j].y;
                        if(x==a && y==b) {
                            this.innertiles[a][b].states.move = true;
                            this.movePiece();
                            this.readyToPick = false;
                        } 
                    }
                }
          }
    }

    movePiece() {
        let pos1 = {x: this.move.a, y: this.move.b};
        let pos2 = {x: this.move.c, y: this.move.d};
        console.log(pos1);
        console.log(pos2);
        let a = POStoPL(pos1, true);
        let b = POStoPL(pos2, false);

        // if(this.game.animations[this.game.moves.length].animationDone) 
        this.updateBoardStatus(pos1, pos2, a, b);
        console.log(this.game.board);
    }

    updateBoardStatus(pos1, pos2, a, b) {
        let color = this.game.board[a.x-1][a.y-1];
        this.game.board[a.x-1][a.y-1] = "empty";
        this.game.board[b.x-1][b.y-1] = color;
        this.innertiles[pos2.x][pos2.y].piece = this.outertiles[pos1.x][pos1.y].piece;
        this.outertiles[pos1.x][pos1.y].piece = null;
        setTimeout(() => { this.timeOut() }, 100);
    }

    /**@brief Log result to console upon gameover */
    handleGameOver() 
    {
        if (this.game.gameover === true)
        if (this.scoreboard.blackScore == this.scoreboard.whiteScore) console.log("GAME OVER! ITS A DRAW 🤝");
        else if (this.scoreboard.blackScore > this.scoreboard.whiteScore) console.log("GAME OVER! BLACK PLAYER WINS 🥇⚫");
        else if (this.scoreboard.blackScore < this.scoreboard.whiteScore) console.log("GAME OVER! WHITE PLAYER WINS 🥇⚪");
    }

    /**@brief Display Board */
    display() 
    {
        this.displayBoardBase();
        this.displayPVP();
        this.displayPVC();
        this.displayCVC();
    }



    displayBoardBase() 
    {
        //top and bottom
        this.texture.bind();
        this.top.display();
        this.texture.unbind();
        this.bottom.display();
        //back side
        this.scene.pushMatrix();
        this.blacksideTEX.bind();
        this.side.display(); 
        this.blacksideTEX.unbind();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        //left side
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        //front side
        this.whitesideTEX.bind();
        this.side.display();
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.whitesideTEX.unbind();
        //right side
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
                if (this.innertiles[i][j].piece != null) {
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
            if(this.outertiles[0][i].piece != null) this.outertiles[0][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep * i, 0, this.tilestep*6);
            this.scene.registerForPick(i + 43, this.outertiles[1][i]);
            this.outertiles[1][i].display();
            if(this.outertiles[1][i].piece != null) this.outertiles[1][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep*6, 0, this.tilestep*(5-i));
            this.scene.registerForPick(i + 49, this.outertiles[2][i]);
            this.outertiles[2][i].display();
            if(this.outertiles[2][i].piece != null) this.outertiles[2][i].piece.display();
            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.tilestep * (5-i), 0, -this.tilestep);
            this.scene.registerForPick(i + 55, this.outertiles[3][i]);
            this.outertiles[3][i].display();
            if(this.outertiles[3][i].piece != null) this.outertiles[3][i].piece.display();
            this.scene.popMatrix();
        }
    }

    displayPVP() 
    {
        if (this.game.started && this.game.gamemode === 'PVP') {
            // this.scene.logPicking();
            if(this.game.turn.color === this.game.turns.W) this.pickwhite();
            if(this.game.turn.color === this.game.turns.B) this.pickblack();
            this.pickAvailable();
            this.handleGameOver();
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            this.scene.clearPickRegistration();

            this.timer.display();
            this.scoreboard.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
            this.scene.clearPickRegistration(); //clear last pick register
        }
    }

    displayPVC() 
    {
        if (this.game.started && this.game.gamemode === 'PVC') 
        {
            // this.scene.logPicking();
            if(this.game.turn.color === this.game.turns.W) this.pickwhite();
            this.pickAvailable();
            this.handleGameOver();
            this.scene.pickResults.splice(0, this.scene.pickResults.length);
            this.scene.clearPickRegistration();

            if(this.game.turn.color === this.game.turns.B) this.pickcpu(this.game.turns.B);
            this.handleGameOver();

            this.timer.display();
            this.scoreboard.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
            this.scene.clearPickRegistration(); //clear last pick register
        }
    }

    displayCVC()
    {
        if (this.game.started && this.game.gamemode === 'CVC') 
        {
            if (this.game.turn.color === this.game.turns.W) this.pickcpu(this.game.turns.W);
            if (this.game.turn.color === this.game.turns.B) this.pickcpu(this.game.turns.B);
            this.handleGameOver();

            this.timer.display();
            this.scoreboard.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
        }
    }
}