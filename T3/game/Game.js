//Piece structure
const P = { Null: 'null', Empty: 'empty', Black: 'black', White: 'white' };
// ----------------------------------------------------------
class Game 
{
    constructor(scene)
    {
        // super(scene);
        this.scene = scene;
        this.states = Object.freeze(
        {
            'MENU':     0,
            'PvP':      1,
            'PvC ez':   2,
            'PvC med':  3,
            'CvC':      4,
        });

        this.initialize();
        this.P = P;
        this.whiteTurn = true;
        this.blackTurn = false;
        this.difficulty = 'Easy';
    }


    startGame() {
        return false;
    }

    undoPlay() {
        return false;
    }

    generateGameMovie() {
        return false;
    }

    resetAndQuit() {
        return false;
    }



    initialize() 
    {
        this.RL = [];   //(R)andom (L)ines
        this.aux = [];
        this.index = 0;
        for(let i=0; i<4; i++) 
            this.RL.push(this.generateRandomLine());
        
        while(!this.validCorner()) {
            this.RL = [];
            this.aux = [];
            this.index = 0;
            for(let i=0; i<4; i++)
                this.RL.push(this.generateRandomLine());
        }

        delete this.aux;
        
        let R = this.RL;
        this.board = 
        [
            [P.Null,  R[1][5], R[1][4], R[1][3], R[1][2], R[1][1], R[1][0],  P.Null],
            [R[2][0], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][5]],
            [R[2][1], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][4]],
            [R[2][2], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][3]],
            [R[2][3], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][2]],
            [R[2][4], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][1]],
            [R[2][5], P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, P.Empty, R[0][0]],
            [P.Null,  R[3][0], R[3][1], R[3][2], R[3][3], R[3][4], R[3][5],  P.Null],
        ];
    }




    /**
     * @brief - used to generate a random line of board each time we load up the game. 
     * 
     * Note that there are 6 pieces in each line. 
     * There should be 12 black pieces and 12 whites pieces, so for the sake of
     * making this solution simpler there are 3 black pieces and 3 white pieces in each line.
     *  
     * There cant be more than 2 pieces of the same color in a row.
     * @return board line with 6 pieces correctly sorted (Array with 6 blocks)
     */
    generateRandomLine()
    {
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

    /**@brief deals with right hand low corner exception 
     * @return boolean - true if the board is valid, false otherwise
     */
    validCorner()
    {
        if((this.RL[3][5] == P.Black) && (this.RL[0][0] == P.Black) && (this.RL[0][1] == P.Black)) return false;
        else if((this.RL[3][4] == P.Black) && (this.RL[3][5] == P.Black) && (this.RL[0][0] == P.Black)) return false;
        else if((this.RL[3][5] == P.White) && (this.RL[0][0] == P.White) && (this.RL[0][1] == P.White)) return false;
        else if((this.RL[3][4] == P.White) && (this.RL[3][5] == P.White) && (this.RL[0][0] == P.White)) return false;
        else return true;
    }
}