class GameBoard extends CGFobject 
{
    /**
     * @brief builds a game board used to play fuse (prolog game)
     * This game board holds most of the logic for moving pieces and animating them
     * This class is also responsible for displaying the game itself
     * 
     * @constructor
     * @param scene MyScene object
     * @param x position of the center of the table
     * @param y position of the center of the table
     * @param width thickness of the table
     * @param depth length of the table side
     * @param height height of the table*/
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
        
        //associations
        this.game = this.scene.game;
        this.scene.gameboard = this;
        this.scene.game.gameboard = this;

        this.readyToPick = false;
        
        this.createFaces();
        this.initializeTiles();
    }



    /** @brief Object shape creation 
     *  Create nurbs surfaces for board display
     */
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



    /** @brief Initialize tile arrays
     *  Used to prepare game board
     */
    initializeTiles() 
    {
        let B = this.game.board;
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





    /** @brief function for general picking 
     * Used only for testing
     */
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




    /** @brief function to clear all tiles picked */
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




    /** @brief function for white human player turn */
    pickWhite()
    {
        if(this.scene.pickMode == false)
        if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
        for(let i = 0; i < this.scene.pickResults.length; i++)
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

    


    /** @brief function for black human player turn */
    pickBlack()
    {
        if(this.scene.pickMode == false)
        if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
        for(let i = 0; i < this.scene.pickResults.length; i++)
        if(this.scene.pickResults[i][0]) 
        {
            var ID = this.scene.pickResults[i][1];
            var x = parseInt((ID-1) / 6);
            var y = parseInt((ID-1) % 6);
            var p = this.alltiles[x][y];
            if(x > 5) this.move = {a: x-6, b: y};

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


    

    /** @brief 4 functions to display available tiles after white/black pick 
     * These functions are responsible for changing the material of available tiles
     * @param ID picking ID
     * @param x position for tiles array
     * @param y position for tiles array
     */
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




    /** 
     * @brief used for human to pick available tile to move piece 
     */
    pickAvailable() 
    {
        if(!this.readyToPick) return;

        if(this.scene.pickMode == false)
        if(this.scene.pickResults != null && this.scene.pickResults.length > 0)
        for(var i = 0; i < this.scene.pickResults.length; i++) 
        if(this.scene.pickResults[i][0]) 
        {
            let ID = this.scene.pickResults[i][1];
            var x = parseInt((ID - 1) / 6);
            var y = parseInt((ID - 1) % 6);
            if(x < 6) { this.move.c = x; this.move.d = y; }

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
                    this.readyToPick = false;
                    this.moveHumanPiece();
                } 
            }
        }
    }





    /** 
     * @brief used to change turn AKA timeout 
     */
    timeOut() 
    {
        if(this.game.ended) return;
        
        if(this.game.gamemode === 'PVP') {
            if(this.game.turn.color == this.game.turns.W) this.game.turn = {color: this.game.turns.B, player: this.game.players.human };
            else this.game.turn = {color: this.game.turns.W, player: this.game.players.human };
        }
        
        else if(this.game.gamemode === 'PVC') {
            if(this.game.turn.color == this.game.turns.W) {
                this.game.turn = {color: this.game.turns.B, player: this.game.players.CPU };
            }
            else if(this.game.turn.color == this.game.turns.B) {
                this.game.turn = {color: this.game.turns.W, player: this.game.players.human };
            }
        }
        
        else if(this.game.gamemode === 'CVC') {
            if(this.game.turn.color == this.game.turns.W) this.game.turn = {color: this.game.turns.B, player: this.game.players.CPU };
            else this.game.turn = {color: this.game.turns.W, player: this.game.players.CPU };
        }

        if(this.game.ended) return;
        
        setTimeout(() => { this.initializeTiles();       }, 400);
        setTimeout(() => { this.game.cameraAnimation();  }, 600);    //wait before rotating
        setTimeout(() => { this.timer.resetCount();      }, 100);   //wait before reseting timer
    }




    /**
     * @brief CPUs turn piece picking
     * @param {String} color 
     */
    moveCPU(color) 
    {
        if ((this.timer.time <= this.game.timePerPlay-2) && this.timer.movesReq && !this.timer.chosenReq)
        {
            if(this.game.gamemode === 'PVC' && this.game.turn.color == "black") {
                if (this.game.validmoves_ready) this.game.getChosenPlay("black");
                this.timer.chosenReq = true;
            }
            else if(this.game.gamemode === 'CVC'){
                if (this.game.validmoves_ready) this.game.getChosenPlay(this.game.turn.color);
                this.timer.chosenReq = true;
            } 
        }
        
        // console.log(this.game.board_ready);
        if(this.timer.chosenReq && this.game.cpuplay_ready && this.game.board_ready && (this.timer.time <= this.game.timePerPlay-3)) {

            var play = this.game.cpuplay[color];
            this.game.cpuplay_ready = false;

            let dir = this.determineDirection(play[0], play[1]);
            let aux = {x: play[0], y: play[1]};
            let pos = PLtoPOS(aux);

            this.outertiles[pos.x][pos.y].piece.anim = new PieceAnimation(this.scene, play[2], dir);

            setTimeout(() => { this.game.getMoveBoard(color, play[0], play[1], play[2]); }, 1700);
            setTimeout(() => { this.timeOut(); }, 2550);
        }
    }



    /**
     * @brief Move a Piece that belongs to human player
     */
    moveHumanPiece() 
    {
        let pos1 = {x: this.move.a, y: this.move.b};
        let pos2 = {x: this.move.c, y: this.move.d};
        
        let a = POStoPL(pos1, true);
        let b = POStoPL(pos2, false);
        
        let len;
        if(a.x == b.x) len = Math.abs(a.y-b.y);
        if(a.y == b.y) len = Math.abs(a.x-b.x);
        let color = this.game.board[a.x-1][a.y-1];

        let dir = this.determineDirection(a.x, a.y);
        this.outertiles[pos1.x][pos1.y].piece.anim = new PieceAnimation(this.scene, len, dir);

        setTimeout(() => { this.game.getMoveBoard(color, a.x, a.y, len); }, 1700);
        setTimeout(() => { this.timeOut(); this.clearAllPicked(); }, 2550);
    }


    determineDirection(i, j) {
        if(i == 1) return 'T';
        else if(i == 8) return 'B';
        else if(j == 8) return 'R';
        else if(j == 1) return 'L';
        else console.warn("ERROR!");
    }

    /** 
     * @brief Log result to console once game is over 
     */
    handleGameOver() 
    {
        if (this.game.gameover === true && !this.game.ended) 
        {
            let b = this.scoreboard.blackScore, w = this.scoreboard.whiteScore;
            if (b == w) console.log("GAME OVER! ITS A DRAW 🤝🤝\nBlack "+b+"-"+w+" White");
            else if (b > w) console.log("GAME OVER! BLACK PLAYER WINS 🏆⚫\n🥇 Black "+b+"-"+w+" White 🥈");
            else if (b < w) console.log("GAME OVER! WHITE PLAYER WINS 🏆⚪\n🥈 Black "+b+"-"+w+" White 🥇");

            this.timer.stopCount();
            this.game.ended = true;
        }
    }

    /** 
     * @brief Display Board
     */
    display() 
    {
        this.displayBoardBase();
        this.handleGameOver();
        this.displayPVP();
        this.displayPVC();
        this.displayCVC();
    }





    displayBoardBase() 
    {
        this.texture.bind();
        this.top.display();                     //top face
        this.texture.unbind();
        this.bottom.display();                  //bottom side
        this.scene.pushMatrix();
        this.blacksideTEX.bind();
        this.side.display();                    //back side
        this.blacksideTEX.unbind();
        this.scene.rotate(Math.PI/2,0,0,1);
        this.side.display();                    //left side
        this.scene.rotate(Math.PI/2,0,0,1);
        this.whitesideTEX.bind();
        this.side.display();                    //front side
        this.scene.rotate(Math.PI/2,0,0,1);
        this.whitesideTEX.unbind();
        this.side.display();                    //right side
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
                if (this.innertiles[i][j].piece != null) this.innertiles[i][j].piece.display();

                this.scene.popMatrix();
            }
    }

    displayOuterTiles() {
        for(let i=0; i<6; i++) {
            this.scene.pushMatrix();

            this.scene.translate(-this.tilestep, 0, this.tilestep * i);
            this.scene.registerForPick(i + 37, this.outertiles[0][i]);
            this.outertiles[0][i].display();
            if(this.outertiles[0][i].piece != null) 
            {
                if(this.outertiles[0][i].piece.anim != null) {
                    if((this.outertiles[0][i].piece.anim.len != 0) && !this.outertiles[0][i].piece.anim.animationDone) 
                        this.outertiles[0][i].piece.anim.apply();

                    if(this.outertiles[0][i].piece.anim.animationDone) this.outertiles[0][i].piece.anim = null;
                }
                this.outertiles[0][i].piece.display();
            } 

            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();

            this.scene.translate(this.tilestep * i, 0, this.tilestep*6);
            this.scene.registerForPick(i + 43, this.outertiles[1][i]);
            this.outertiles[1][i].display();
            if(this.outertiles[1][i].piece != null) 
            {
                if(this.outertiles[1][i].piece.anim != null) {
                    if((this.outertiles[1][i].piece.anim.len != 0) && !this.outertiles[1][i].piece.anim.animationDone) 
                        this.outertiles[1][i].piece.anim.apply();

                    if(this.outertiles[1][i].piece.anim.animationDone) this.outertiles[1][i].piece.anim = null;
                }
                this.outertiles[1][i].piece.display();
            } 

            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();
            
            this.scene.translate(this.tilestep*6, 0, this.tilestep*(5-i));
            this.scene.registerForPick(i + 49, this.outertiles[2][i]);
            this.outertiles[2][i].display();
            if(this.outertiles[2][i].piece != null) 
            {
                if(this.outertiles[2][i].piece.anim != null) 
                {
                    if((this.outertiles[2][i].piece.anim.len != 0) && !this.outertiles[2][i].piece.anim.animationDone) 
                        this.outertiles[2][i].piece.anim.apply();
                    if(this.outertiles[2][i].piece.anim.animationDone) this.outertiles[2][i].piece.anim = null;
                }
                this.outertiles[2][i].piece.display();
            } 

            this.scene.popMatrix();
        }
        for (let i = 0; i < 6; i++) {
            this.scene.pushMatrix();

            this.scene.translate(this.tilestep * (5-i), 0, -this.tilestep);
            this.scene.registerForPick(i + 55, this.outertiles[3][i]);
            this.outertiles[3][i].display();
            if(this.outertiles[3][i].piece != null) 
            {
                if(this.outertiles[3][i].piece.anim != null) 
                {
                    if((this.outertiles[3][i].piece.anim.len != 0) && !this.outertiles[3][i].piece.anim.animationDone) 
                        this.outertiles[3][i].piece.anim.apply();
                    if(this.outertiles[3][i].piece.anim.animationDone) this.outertiles[3][i].piece.anim = null;
                }                
                this.outertiles[3][i].piece.display();
            } 

            this.scene.popMatrix();
        }
    }





    displayPVP() 
    {
        if (this.game.started && this.game.gamemode === 'PVP') {
            if(!this.game.ended) 
            {
                if (this.game.whiteValidMoves.length == 0 && this.game.blackValidMoves.length == 0)
                    this.game.gameover = true;

                if(this.game.whiteValidMoves.length == 0 && this.game.turn.color === 'white') 
                    this.timeOut();

                if(this.game.blackValidMoves.length == 0 && this.game.turn.color === 'black') 
                    this.timeOut();

                if(this.game.turn.color === 'white') this.pickWhite();
                if(this.game.turn.color === 'black') this.pickBlack();

                if (this.game.whiteValidMoves.length == 0 && this.game.blackValidMoves.length == 0)
                    this.game.gameover = true;
    
                this.pickAvailable();
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
                this.scene.clearPickRegistration();
            }

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
            if (!this.game.ended) 
            {
                if(this.game.whiteValidMoves.length == 0 && this.game.blackValidMoves.length == 0) 
                    this.game.gameover = true;

                if(this.game.turn.color == this.game.turns.W) 
                    this.pickWhite();

                this.pickAvailable();
                this.scene.pickResults.splice(0, this.scene.pickResults.length);
                this.scene.clearPickRegistration();

                if((this.game.turn.color == 'black') && (this.game.turn.player == this.game.players.CPU)) 
                    this.moveCPU('black');
            }

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
            if (!this.game.ended) {
                if (this.game.whiteValidMoves.length == 0 && this.game.blackValidMoves.length == 0)
                    this.game.gameover = true;

                if(this.game.turn.color === 'white') this.moveCPU('white');
                if(this.game.turn.color === 'black') this.moveCPU('black');
            }
            
            this.timer.display();
            this.scoreboard.display();
            this.displayInnerTiles();
            this.displayOuterTiles();
        }
    }
}