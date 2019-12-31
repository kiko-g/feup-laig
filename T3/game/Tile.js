class Tile extends CGFobject
{
    constructor(scene, outer, hasPiece, pieceColor = undefined) 
    {
        super(scene);
        this.id = "TILE";
        this.outer = outer;
        this.hasPiece = hasPiece;
        this.pieceColor = pieceColor;
        this.quad = new Plane(scene, "tile", 1, 1);
        this.states = {picked: false, available: false};
        
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
        this.active = new CGFappearance(this.scene);
        this.main = this.RGBMaterial(0, 80, 130);       //inner tile color
        this.blue = this.RGBMaterial(0, 172, 238);      //outer tile color
        this.white = this.RGBMaterial(255, 255, 255);   //white color
        this.black = this.RGBMaterial(0, 0, 0);         //black color
        this.pink = this.RGBMaterial(255, 120, 120);    //picked tile color
        this.lime = this.RGBMaterial(100, 255, 150);    //available tile color

        //other tile materials
        this.red = this.RGBMaterial(255, 0, 0);         //incorrect processing color
        this.green = this.RGBMaterial(116, 235, 106);   //just a green tile color
        
        //initialize Piece
        if (this.pieceColor == this.scene.game.P.Black && this.hasPiece) 
            this.piece = new Piece(this.scene, this.black, this.scene.game.P.Black);

        else if (this.pieceColor == this.scene.game.P.White && this.hasPiece) 
            this.piece = new Piece(this.scene, this.white, this.scene.game.P.White);
        }
    
    /** @brief converts ID of inner tiles - used to make plays */
    convertID(id) {
        let pos = {x: 0, y: 0};

        return pos;
    }


    /** @brief converts POS coming from prolog - used to make CPU plays */
    convertPOS(pos) {
        let id = 0;

        return id;
    }
    
    
    movePiece() {

    }

    display() {
        this.scene.pushMatrix();
        if(!this.states.picked) {
            if (this.outer) this.active = this.blue;
            else this.active = this.main;
            this.active.apply();
        }
        else {
            if(this.states.available) this.active = this.lime;
            else this.active = this.pink;
            this.active.apply();
        }
        this.quad.display();
        this.scene.popMatrix();
    }
}