class Tile extends CGFobject
{
    constructor(scene, outer, hasPiece, pieceColor = undefined) 
    {
        super(scene);
        this.outer = outer;
        this.hasPiece = hasPiece;
        this.pieceColor = pieceColor;
        
        this.id = "TILE";
        this.quad = new Plane(scene, "tile", 1, 1);
        this.states = {picked: false, available: false};

        this.initBuffers();
    }
    


    initBuffers() 
    {
        this.active = new CGFappearance(this.scene);

        //tile materials
        this.red = this.RGBMaterial(255, 0, 0);         //incorrect processing color
        this.main = this.RGBMaterial(0, 80, 130);       //inner tile color
        this.blue = this.RGBMaterial(0, 172, 238);      //outer tile color
        this.green = this.RGBMaterial(116, 235, 106);   //picked tile color
        this.white = this.RGBMaterial(255, 255, 255);   //white color
        this.black = this.RGBMaterial(  0,   0,   0);   //black color

        //initialize Piece
        if (this.pieceColor == this.scene.game.P.Black && this.hasPiece) 
            this.piece = new Piece(this.scene, this.black, this.scene.game.P.Black);

        else if (this.pieceColor == this.scene.game.P.White && this.hasPiece) 
            this.piece = new Piece(this.scene, this.white, this.scene.game.P.White);
    }
    
    RGBMaterial(r, g, b) {
        let material = new CGFappearance(this.scene);
        material.setAmbient(r/255, g/255, b/255, 1);
        material.setDiffuse(r/255, g/255, b/255, 1);
        material.setSpecular(1, 1, 1, 1);
        material.setShininess(10);

        return material;
    }
    
    display() {
        this.scene.pushMatrix();
        if(!this.states.picked && this.outer != undefined) {
            if (this.outer) this.active = this.blue;
            else this.active = this.main;
            this.active.apply();
        }
        else if(this.outer == undefined) {
            this.active = this.main;
            this.active.apply();
        }
        else {
            this.active = this.green;
            this.active.apply();
        }
        this.quad.display();
        this.scene.popMatrix();
    }
}