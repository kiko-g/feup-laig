class MyKeyframe
{
    constructor(translate, rotate, scale, instant)
    {
        this.translate = translate;
        this.rotateX = rotate[0];
        this.rotateY = rotate[1];
        this.rotateZ = rotate[2];
        this.scale = scale;
        this.instant = instant;
    }
}