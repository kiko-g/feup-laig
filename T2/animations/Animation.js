class Animation
{
    constructor(scene) 
    {
        this.aniMatrix = mat4.create();
        this.newMatrix = mat4.create();
        
        mat4.identity(this.aniMatrix);
        mat4.identity(this.newMatrix);
    }

    apply() { }
    update(time) { }
    generateAniMatrix(time) { }
    calculateSegmentValues() { }
    determineTransformation() { }
}