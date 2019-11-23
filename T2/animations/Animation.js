class Animation
{
    constructor(scene) 
    {
        this.aniMatrix = mat4.create();
        this.saveMatrix = mat4.create();
        mat4.identity(this.aniMatrix);
        mat4.identity(this.saveMatrix);
    }

    apply() { }
    update(time) { }
    generateAniMatrix(time) { }
    calculateSegmentValues() { }
    determineTransformation() { }
}