class KeyframeAnimation extends Animation
{
    constructor(scene, keyframesList)
    {
        super(scene);
        this.scene = scene;
        this.keyframes = [];
        this.keyframes.push(new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0));
        this.keyframes.push(...keyframesList);
        this.prevKFIndex = 0;
        this.postKFIndex = 1;
        this.sumT = 0;
        this.segmentTime = this.keyframes[this.postKFIndex].instant - this.keyframes[this.prevKFIndex].instant;
        this.calculateSegmentValues();
        this.animationDone = false;
        this.move = 0; //percentage of move done
        this.lastMatrix = mat4.create();
        mat4.identity(this.lastMatrix);
    }
    
    
    calculateSegmentValues()
    {
        if(this.sumT > this.segmentTime) 
        {
            if(this.postKFIndex == this.keyframes.length-1) { this.animationDone = true; }
            else{
                this.lastMatrix = this.aniMatrix;
                
                this.prevKFIndex++;
                this.postKFIndex++;
                this.sumT -= this.segmentTime;
                this.segmentTime = this.keyframes[this.postKFIndex].instant - this.keyframes[this.prevKFIndex].instant;
            }
        }

    }

    generateAniMatrix(time)
    {
        this.sumT += time;
        this.calculateSegmentValues();
        this.move = (this.sumT/this.segmentTime);
        console.log(this.aniMatrix);
        
        this.determineTranslate();
        mat4.translate(this.aniMatrix, this.aniMatrix, this.translation);

        var delta_rx = this.keyframes[this.postKFIndex].rotateX;
        var delta_ry = this.keyframes[this.postKFIndex].rotateY;
        var delta_rz = this.keyframes[this.postKFIndex].rotateZ;
        mat4.rotate(this.aniMatrix, this.aniMatrix, this.move * delta_rx, [1, 0, 0]);
        mat4.rotate(this.aniMatrix, this.aniMatrix, this.move * delta_ry, [0, 1, 0]);
        mat4.rotate(this.aniMatrix, this.aniMatrix, this.move * delta_rz, [0, 0, 1]);

        this.determineScale();
        mat4.scale(this.aniMatrix, this.aniMatrix, this.scale);
        
        this.apply();
    }

    update(deltaTime) { if(!this.animationDone) this.generateAniMatrix(deltaTime); }
    apply(){ this.scene.multMatrix(this.aniMatrix); }


    determineTranslate()
    {
        var delta_tx = this.keyframes[this.postKFIndex].translate[0];
        var delta_ty = this.keyframes[this.postKFIndex].translate[1];
        var delta_tz = this.keyframes[this.postKFIndex].translate[2];
        this.translation = vec3.create();
        vec3.set(this.translation, this.move * delta_tx, this.move * delta_ty, this.move * delta_tz);
    }

    determineScale()
    {
        var delta_sx = this.keyframes[this.postKFIndex].scale[0] / this.keyframes[this.prevKFIndex].scale[0];
        var delta_sy = this.keyframes[this.postKFIndex].scale[1] / this.keyframes[this.prevKFIndex].scale[1];
        var delta_sz = this.keyframes[this.postKFIndex].scale[2] / this.keyframes[this.prevKFIndex].scale[2];
        this.scale = vec3.create();

        if(delta_sx == 1) var kx = 1;
        else var kx = this.move*delta_sx;
        
        if(delta_sy == 1) var ky = 1;
        else var ky = this.move*delta_sy;
        
        if (delta_sz == 1) var kz = 1;
        else var kz = this.move * delta_sz;
        
        vec3.set(this.scale, kx, ky, kz);
    }

    
}