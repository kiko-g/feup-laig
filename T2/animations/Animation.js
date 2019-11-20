class Animation
{
    constructor(scene) 
    {
        this.aniMatrix = mat4.create();
        mat4.identity(this.aniMatrix);
    }

    apply(){ }
    update(deltaTime) { }
}