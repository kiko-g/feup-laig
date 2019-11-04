class Animation
{
    constructor(scene, time, id) 
    {
        if (this.constructor == Animation) {
            throw new Error('Abstract classes can\'t be instantiated.');
        }
        this.id = id;
        this.scene = scene;
        this.time = time;
        this.over = false;
        this.timeElapsed = 0;
        
        this.matrix = mat4.create();
        this.matrix = mat4.identity(this.matrix);
    }


    update(deltaTime)
    {
        
    }

    apply() { }
}