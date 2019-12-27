class Animation
{
    constructor(scene, keyframesList)
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