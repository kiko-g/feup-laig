//Piece structure
const P = { Null: 'null', Empty: 'empty', Black: 'black', White: 'white' };
// ----------------------------------------------------------
class Game 
{
    constructor(scene)
    {
        this.scene = scene;
        this.started = false;
        this.gamemode = 'PVP';
        this.initialize();
        
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
        this.moves = [];                // moves array (holds the plays)
        this.getValidMoves(this.turns.W);
        
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

        this.boardtest = [
            [P.Null,  P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty,  P.Null],
            [P.Empty, P.Empty, P.White, P.White, P.Black, P.Black, P.Black, P.Empty],
            [P.White, P.White, P.White, P.Black, P.Black, P.White, P.White, P.Empty],
            [P.White, P.Empty, P.White, P.Black, P.Black, P.Empty, P.White, P.Empty],
            [P.White, P.Empty, P.White, P.Black, P.Black, P.Empty, P.White, P.Empty],
            [P.Empty, P.Empty, P.Empty, P.Empty, P.Black, P.Empty, P.White, P.Empty],
            [P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty],
            [P.Null,  P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty,  P.Null],
        ];
        this.initialboard = this.board;
        // this.initialboard = this.boardtest;
        // this.board = this.boardtest;
    }

    update(time) {
        // if(this.scene.sceneInited)
    }

    startGame() {
        if (this.started) {
            console.log("📈 Game in progress already");
            return false;
        } 
        else console.log("🎲 Started Game");

        this.turn.color = this.turns.W;
        this.scene.gameboard.timer.resetCount();
        this.started = true;
        console.log(this.whiteValidMoves);

        return true;
    }

    stopTimer() {
        this.scene.gameboard.timer.stopCount();
    }

    resetTimer() {
        this.scene.gameboard.timer.resetCount();
    }

    quitGame() {
        if(!this.started) console.log("📈 No game session in progress!");
        else console.log("🚪 Exited Game");
        this.started = false;
        this.scene.gameboard.timer.stopCount();
        this.initialize();
        this.scene.gameboard.initializeTiles();
        this.scene.gameboard.scoreboard.board = this.board;

        return true;
    }

    undoPlay() {
        if(!this.started) return false;
        return true;
    }

    cameraAnimation() { this.scene.rotateCamera = true; }
    
    changeDifficulty() {
        if(this.difficulty.name == 'Easy') this.difficulty.number = 0;
        else this.difficulty = {number: 1, name: 'Medium'};

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
                else{ console.log("❌ Bad Request: Invalid piece color"); return; }

                thisgame.validmoves_ready = true;
            }
        );

        setTimeout(() => { this.validmoves_ready = true; }, 2000);
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

/** @brief determine winner functions using flood fill methods*/
function floodFill(data, x0, y0, newValue) {
    let minX = x0, maxX = x0;
    let minY = y0, maxY = y0;
    let R = {value: 0, color: undefined };

    // perform a deep clone, copying data to newData
    let newData = [];
    for (let i = 0; i < data.length; i++)
        newData[i] = data[i].slice();

    // from now on we make modifications to newData, not data
    let target = newData[x0][y0];
    if(target!="white" && target!="black") return null;

    R.color = target;
    function flow(x,y) {
        if (x >= 0 && x < newData.length && y >= 0 && y < newData[x].length) {
            if (newData[x][y] === target) {
                minX = Math.min(x, minX);
                maxX = Math.max(x, maxX);
                minY = Math.min(y, minY);
                maxY = Math.max(y, maxY);

                newData[x][y] = newValue;
                R.value++;
                flow(x-1, y);
                flow(x+1, y);
                flow(x, y-1);
                flow(x, y+1);
            }
        }
    }
    flow(x0,y0);
    return R;
}

function getWinner(board) 
{
    let max = {white: {value: 0, color: "white"}, black: {value: 0, color: "black"}};

    for(let i=1; i<7; i++)
        for(let j=1; j<7; j++)
        {
            let res = floodFill(board, i, j, 0);
            if(res == null) continue;
            
            if(res.color == "white" && res.value > max.white.value) max.white = res;
            if(res.color == "black" && res.value > max.black.value) max.black = res;
        }
    return max;
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
    else for(let i=0; i<6; i++) if (pos.y == i) return {x: PL.x-2, y: i-2};
}

function POStoPL(pos, outer) 
{
    if(typeof outer != "boolean") {
        if (Number.isInteger(outer) && outer>36) outer = true;
        else if (Number.isInteger(outer) && outer<=36) outer = false;
        else console.log("ERROR in POS to PL");
    }


    if(outer) {
        if (pos.x == 0) for (let i=0; i<6; i++) if (pos.y == i) return {x: 7-i, y:   8};
        if (pos.x == 1) for (let i=0; i<6; i++) if (pos.y == i) return {x: 1,   y: 7-i};
        if (pos.x == 2) for (let i=0; i<6; i++) if (pos.y == i) return {x: i+2, y:   1};
        if (pos.x == 3) for (let i=0; i<6; i++) if (pos.y == i) return {x:   8, y: i+2};
    }
    else return {x: pos.x+2, y: pos.y+2};
}