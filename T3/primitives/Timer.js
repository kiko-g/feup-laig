class Timer extends CGFobject {
    constructor(scene, numbers){
        super(scene);

        this.numbers = numbers;

        this.base = new MyQuad(this.scene, -1.0, -0.5, 0.0, 0.5);
        this.texture = new CGFtexture(this.scene, 'scenes/images/timer.png')
    }

    display(){
        let units = this.scene.game.time % 10;
        let dozens = Math.floor(this.scene.game.time / 10);

        this.scene.pushMatrix();
        this.texture.bind();
        this.scene.translate(1,1,0);
        this.scene.scale(2,1,1);
        this.base.display();
        this.texture.unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[dozens].bind();
        this.base.display();
        this.numbers[dozens].unbind();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.numbers[units].bind();
        this.scene.translate(1,0,0);
        this.base.display();
        this.numbers[units].unbind();
        this.scene.popMatrix();
    }
}