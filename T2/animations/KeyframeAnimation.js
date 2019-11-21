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
        this.animationDone = false;
        this.move = 0; //percentage of move to be done in iteration (per say, t2 - t1)
        this.T1 = 0;
        this.T2 = 0;
    }
    
    
    calculateSegmentValues()
    {
        if(this.sumT > this.segmentTime)
        {
            if(this.postKFIndex == this.keyframes.length-1) { this.animationDone = true; }
            else{
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
        this.T2 = (this.sumT/this.segmentTime);
        this.calculateSegmentValues();
        this.move = this.T2 - this.T1;
        
        this.determineTransformation();
        this.aniMatrix = mat4.multiply(this.aniMatrix, this.prevMatrix, this.newMatrix);
        
        this.apply();
        this.prevMatrix = this.aniMatrix;
        this.T1 = this.T2;
    }

    update(deltaTime) { this.generateAniMatrix(deltaTime); }
    apply() { this.scene.multMatrix(this.aniMatrix); }

    
    determineTransformation()
    {
        mat4.identity(this.newMatrix);
        var delta_tx = this.move * this.keyframes[this.postKFIndex].translate[0];
        var delta_ty = this.move * this.keyframes[this.postKFIndex].translate[1];
        var delta_tz = this.move * this.keyframes[this.postKFIndex].translate[2];
        this.translation = vec3.create();
        vec3.set(this.translation, delta_tx, delta_ty, delta_tz);
        this.newMatrix = mat4.translate(this.newMatrix, this.newMatrix, this.translation);
        
        var delta_rx = this.move * this.keyframes[this.postKFIndex].rotateX * DEGREE_TO_RAD;
        var delta_ry = this.move * this.keyframes[this.postKFIndex].rotateY * DEGREE_TO_RAD;
        var delta_rz = this.move * this.keyframes[this.postKFIndex].rotateZ * DEGREE_TO_RAD;
        this.newMatrix = mat4.rotateX(this.newMatrix, this.newMatrix, delta_rx);
        this.newMatrix = mat4.rotateY(this.newMatrix, this.newMatrix, delta_ry);
        this.newMatrix = mat4.rotateZ(this.newMatrix, this.newMatrix, delta_rz);
    
        var delta_sx = this.keyframes[this.postKFIndex].scale[0];
        var delta_sy = this.keyframes[this.postKFIndex].scale[1];
        var delta_sz = this.keyframes[this.postKFIndex].scale[2];
        this.scale = vec3.create();
        vec3.set(this.scale, delta_sx, delta_sy, delta_sz);
        this.newMatrix = mat4.scale(this.newMatrix, this.newMatrix, this.scale);
        
        // if (delta_sx == 1) var kx = 1;
        // else var kx = this.move * delta_sx;
        // if (delta_sy == 1) var ky = 1;
        // else var ky = this.move * delta_sy;
        // if (delta_sz == 1) var kz = 1;
        // else var kz = this.move * delta_sz;

    }
}