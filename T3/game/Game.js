//Piece structure
const P = { Null: 'null', Empty: 'empty', Black: 'black', White: 'white' };
// ----------------------------------------------------------
class Game 
{
    constructor(scene)
    {
        this.scene = scene;
        this.started = true;
        this.gamemode = 'PVP';
        this.animActive = false;
        
        this.gameover = undefined;      //gameover is read from server
        this.board_ready = false;       //new board after cpu play
        this.validmoves_ready = false;  //valid moves reply is stored
        this.difficulty = {number: 1, name: 'Medium'};
        this.timePerPlay = 60;

        this.P = P;
        this.turns = Object.freeze({ W: 'white', B: 'black', });
        this.players = Object.freeze({ human: 'human', CPU: 'computer', });
        this.turn = { color: this.turns.W, player: this.players.human };
        
        this.whiteValidMoves = [];      // white valid moves array
        this.blackValidMoves = [];      // black valid moves array
        this.valid_moves_str  = '';     // valid moves string, prolog
        
        this.time = 0;
        this.initialize();
    }

    initialize() 
    {
        this.RL = this.generateRandomBoard();
        let R = this.RL;
        this.board = [
            [P.Null,  R[1][5], R[1][4], R[1][3], R[1][2], R[1][1], R[1][0],  P.Null],
            [R[2][0], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][5]],
            [R[2][1], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][4]],
            [R[2][2], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][3]],
            [R[2][3], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][2]],
            [R[2][4], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][1]],
            [R[2][5], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][0]],
            [P.Null,  R[3][0], R[3][1], R[3][2], R[3][3], R[3][4], R[3][5],  P.Null],
        ];
        this.initialboard = this.board;
    }

    update(time) {
        // if(this.scene.sceneInited)
            // for(let i=0; i<6; i++) {
            //     for(let j=0; j<6; j++)
            //         if(this.scene.gameboard.innertiles[i][j].hasPiece) 
            // }
    }

    startGame() {
        if (this.started) console.log("📈 Game in progress already");
        else console.log("🎲 Started Game");
        this.started = true;

        return true;
    }

    quitGame() {
        if(!this.started) console.log("📈 No game session in progress!");
        else console.log("🚪 Exited Game");
        this.started = false;
        this.scene.gameboard.initializeTiles();

        return true;
    }

    undoPlay() {
        if(!this.started) return false;
        return true;
    }

    gameMovie() {

    }

    cameraAnimation() { this.scene.rotateCamera = true; }
    
    changeDifficulty() {
        if(this.difficulty.name == 'Easy') this.difficulty.number = 0;
        else this.difficulty = {number: 1, name: 'Medium'};

        return true;
    }

    changeTurn() {
        if(this.turn == this.turns.W) this.turn = this.turns.B;
        else this.turn = this.turns.W;

        this.scene.gameboard.clearAllPicked();
        return true;
    }


    compareBoards() {
        let found = false;
        let pos = {x: -1, y: -1, len: -1};

        for(let i=0; i<4; i++) {
            if(found) break;
            for(let j=0; j<6; j++) {
                if(i==0 && this.board[1+j][7] != this.prevboard[1+j][7]) {
                    pos.x = 8;
                    pos.y = 2+j;
                    found = true;
                    break;
                }
                if(i==1 && this.board[0][6-j] != this.prevboard[0][6-j]) {
                    pos.x = 7-j;
                    pos.y = 1;
                    found = true;
                    break;
                }
                if(i==2 && this.board[j+1][0] != this.prevboard[j+1][0]) {
                    pos.x = 1;
                    pos.y = j+2;
                    found = true;
                    break;
                }
                if(i==3 && this.board[7][j+1] != this.prevboard[7][j+1]) {
                    pos.x = 2+j;
                    pos.y = 8;
                    found = true;
                    break;
                }
            }
        }
        
        if(pos.x == 1) for(let i=1; i<7; i++) if(this.board[pos.y-1][pos.x+i-1] != this.prevboard[pos.y-1][pos.x+i-1]) { pos.len = i; break; }
        else if(pos.x == 8) for(let i=1; i<7; i++) if(this.board[pos.y-1][pos.x-1-i] != this.prevboard[pos.y-1][pos.x-1-i]) { pos.len = i; break; }
        else if(pos.y == 1) for(let i=1; i<7; i++) if(this.board[pos.y+i-1][pos.x-1] != this.prevboard[pos.y+i-1][pos.x-1]) { pos.len = i; break; }
        else if(pos.y == 8) for(let i=1; i<7; i++) if(this.board[pos.y-1-i][pos.x-1] != this.prevboard[pos.y-1-i][pos.x-1]) { pos.len = i; break; }
        else console.log("ERROR");

        return pos;
    }


    generateRandomBoard() {
        this.RL = [];   //4 Random Lines (RL)
        this.aux = [];
        this.index = 0;
        for (let i = 0; i < 4; i++)
            this.RL.push(this.generateRandomLine());

        while (!this.validCorner()) {
            this.RL = [];
            this.aux = [];
            this.index = 0;
            for (let i = 0; i < 4; i++)
                this.RL.push(this.generateRandomLine());
        }

        let R = this.RL;
        delete this.RL;
        delete this.aux;
        delete this.index;

        return R;
    }

    /** @brief used to generate a random line of board each time we load up the game. 
     * 
     * Note that there are 6 pieces in each line. 
     * There should be 12 black pieces and 12 whites pieces, so for the sake of
     * making this solution simpler there are 3 black pieces and 3 white pieces in each line.
     *  
     * There cant be more than 2 pieces of the same color in a row.
     * @return board line with 6 pieces correctly sorted (Array with 6 blocks)
     */
    generateRandomLine() {
        var L = [];
        var black_cnt = 0;
        var white_cnt = 0;

        for(let i=0; i<6; i++)
        {
            let piece = Math.floor(Math.random() * 2); //0 or 1 - 0 is white, 1 is black

            //restrictions
            if (piece == 0 && white_cnt == 3) piece = 1;
            if (piece == 1 && black_cnt == 3) piece = 0;

            //no more than 2 in a row
            if(this.index > 1 && ((this.aux[this.index-2] == P.White) && (this.aux[this.index-1] == P.White))) piece = 1;
            if(this.index > 1 && ((this.aux[this.index-2] == P.Black) && (this.aux[this.index-1] == P.Black))) piece = 0;

            //after restriction parse piece and counters
            if(piece == 0) {
                white_cnt++;
                piece = P.White;
            } 
            else if(piece == 1) {
                black_cnt++;
                piece = P.Black;
            }

            this.index++;
            this.aux.push(piece);
            L.push(piece);
        }

        return L;
    }

    /** @brief deals with right hand low corner exception 
     * @return boolean - true if the board is valid, false otherwise
     */
    validCorner() {
        if((this.RL[3][5] == P.Black) && (this.RL[0][0] == P.Black) && (this.RL[0][1] == P.Black)) return false;
        else if((this.RL[3][4] == P.Black) && (this.RL[3][5] == P.Black) && (this.RL[0][0] == P.Black)) return false;
        else if((this.RL[3][5] == P.White) && (this.RL[0][0] == P.White) && (this.RL[0][1] == P.White)) return false;
        else if((this.RL[3][4] == P.White) && (this.RL[3][5] == P.White) && (this.RL[0][0] == P.White)) return false;
        else return true;
    }



    // ==============================================
    // ============ PROLOG COMMUNICATION ============
    // ==============================================
    getBoardString() {
        let board_string = '';
        for (let i=0; i < this.board.length; i++) 
        {
            if (i > 0) board_string += ',';
            board_string += '[';
            for (let j = 0; j < this.board.length; j++) {
                if (j > 0) board_string += ',';
                board_string += this.board[i][j];
            }
            board_string += ']';
        }
        return board_string;
    }


    getValidMoves(color) {
        this.validmoves_ready = false;
        this.prevboard = this.board;
        let thisgame = this;

        // console.log("valid_moves(["+this.getBoardString()+"],"+color+")");
        this.getPrologRequest(
            "valid_moves(["+this.getBoardString()+"],"+color+")",
            function(data) {
                let board_str = data.target.response;
                thisgame.valid_moves_str = board_str;

                if(color === "white") thisgame.whiteValidMoves = JSON.parse(board_str);
                else if(color === "black") thisgame.blackValidMoves = JSON.parse(board_str);
                else console.log("❌ Bad Request: Invalid piece color");
            }
        );

        setTimeout(() => { this.validmoves_ready = true; }, 3000);
    }

    getCPUMove(color) {
        this.board_ready = false;
        let thisgame = this;
        this.prevboard = this.board;

        this.getPrologRequest(
            "choose_move("+color+","+this.difficulty.number+","+this.valid_moves_str+",["+this.getBoardString()+"])", 
            function (data) {
                // handleReply(data);
                let newBoard = JSON.parse(data.target.response.replace(/(null|empty|white|black)/g, '"$1"'));
                thisgame.board = newBoard;
            }
        );

        setTimeout(() => { this.board_ready = true; }, 3000);
    }


    checkGameOver() {
        let thisgame = this;

        this.getPrologRequest(
            "game_over(["+this.getBoardString()+"])",
            function (data) {
                let isGameOver = data.target.response;
                thisgame.gameover = isGameOver;
            }
        );
        setTimeout(() => {
            if(this.gameover === '0') this.gameover = false;
            else if (this.gameover === '1') this.gameover = true;
         }, 2000);
    }
    
    
    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        // http://localhost:8081/handshake
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);
        request.onload = onSuccess || function(data) { console.log("Request successful. Reply: " + data.target.response); };
        request.onerror = onError  || function() { console.log("Error waiting for response"); };
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

}
function handleReply(data){ document.querySelector("#query_result").innerHTML=data.target.response; }