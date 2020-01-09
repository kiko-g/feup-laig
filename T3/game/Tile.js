class Tile extends CGFobject
{
    constructor(scene, outer, hasPiece, pieceColor = undefined, x = null, y = null) 
    {
        super(scene);
        this.id = "TILE";
        this.x = x+1;       //used for prolog
        this.y = y+1;       //used for prolog
        this.outer = outer;
        this.hasPiece = hasPiece;
        this.pieceColor = pieceColor;
        this.quad = new Plane(scene, "tile", 1, 1);
        this.states = {picked: false, available: false, move: false};
        
        this.initBuffers();
    }

    RGBMaterial(r, g, b) 
    {
        let material = new CGFappearance(this.scene);
        material.setAmbient(r / 255, g / 255, b / 255, 1);
        material.setDiffuse(r / 255, g / 255, b / 255, 1);
        material.setSpecular(1, 1, 1, 1);
        material.setShininess(10);
        return material;
    }

    initBuffers() 
    {
        //tile materials
        this.activeMAT = new CGFappearance(this.scene);
        this.main  = this.RGBMaterial(0, 80, 130);       //inner tile color
        this.blue  = this.RGBMaterial(0, 172, 238);      //outer tile color
        this.pink  = this.RGBMaterial(255, 120, 120);    //picked tile color
        this.lime  = this.RGBMaterial(100, 255, 150);    //available tile color
        this.white = this.RGBMaterial(255, 255, 255);    //white color
        this.black = this.RGBMaterial(0, 0, 0);          //black color
        this.purp = this.RGBMaterial(204, 149, 232);     //movement material

        //other tile materials
        this.red = this.RGBMaterial(255, 0, 0);          //incorrect processing color
        this.green = this.RGBMaterial(116, 235, 106);    //just a green tile color
        
        //initialize Piece
        if (this.pieceColor == this.scene.game.P.Black) 
            this.piece = new Piece(this.scene, this.black, this.scene.game.P.Black);

        else if (this.pieceColor == this.scene.game.P.White) 
            this.piece = new Piece(this.scene, this.white, this.scene.game.P.White);
        }
    
    
    movePiece(x, y) {
        // this.hasPiece = false;
        // this.scene.board.innertiles[x][y].hasPiece = true;
        // this.piece = this.scene.board.outertiles[x][y].piece;
    }

    display() {
        this.scene.pushMatrix();
        if(!this.states.picked) {
            if (this.outer) this.activeMAT = this.blue;
            else this.activeMAT = this.main;
            this.activeMAT.apply();
        }
        else {
            if(this.states.available) this.activeMAT = this.lime;
            else this.activeMAT = this.pink;

            if(this.states.move) this.activeMAT = this.purp;
        }

        this.activeMAT.apply();
        this.quad.display();
        this.scene.popMatrix();
    }
}