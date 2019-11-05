class Animation
{
    constructor(scene) 
    {
        this.scene = scene.Animation
        this.aniMatrix = mat4.create();
        mat4.identity(this.aniMatrix);
    }

    /**
     * funcao abstrata que
     * @param {
     */
    generateAniMatrix(deltaTime){
        
    }

    update(deltaTime)
    {
        this.generateAniMatrix(deltaTime);
    }

    apply() { 
        this.scene.multMatrix(this.aniMatrix);
    }
}