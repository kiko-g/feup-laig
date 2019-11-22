class KeyframeAnimation extends Animation
{
    constructor(scene, keyframesList)
    {
        super(scene);
        this.scene = scene;
        this.prevKF = 0;                        //prev keyframe index
        this.postKF = 1;                        //post keyframe index
        this.sumT = 0;                          //time accumulator
        this.T1 = 0;                            //time variable 1
        this.T2 = 0;                            //time variable 2 
        this.move = 0;                          //percentage of move to be done in iteration (T2-T1)
        this.animationDone = false;             //boolean controlling end of animation
        this.keyframes = [];                    //keyframe array
        this.firstKF = new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0);
        this.keyframes.push(this.firstKF);
        this.keyframes.push(...keyframesList);
        this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
        this.acc = 0;
    }
    
    
    calculateSegmentValues()
    {
        if(this.sumT > this.segmentTime)
        {
            if(this.postKF == this.keyframes.length-1)
                this.animationDone = true;

            else{
                //next segment
                this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
                this.T1 = 0;
                this.T2 = 0;
                this.sumT = 0;
                this.prevKF++;
                this.postKF++;
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
        this.aniMatrix = mat4.multiply(this.aniMatrix, this.aniMatrix, this.newMatrix);
        this.T1 = this.T2;
    }

    update(time) { this.generateAniMatrix(time); }
    apply() { this.scene.multMatrix(this.aniMatrix); }

    
    determineTransformation()
    {
        mat4.identity(this.newMatrix);

        // TRANSLATION
        var delta_tx = this.move * this.keyframes[this.postKF].translate[0];
        var delta_ty = this.move * this.keyframes[this.postKF].translate[1];
        var delta_tz = this.move * this.keyframes[this.postKF].translate[2];
        this.translation = vec3.create();
        this.translation = vec3.set(this.translation, delta_tx, delta_ty, delta_tz);
        this.newMatrix = mat4.translate(this.newMatrix, this.newMatrix, this.translation);


        // ROTATION
        var delta_rx = this.move * this.keyframes[this.postKF].rotateX * DEGREE_TO_RAD;
        var delta_ry = this.move * this.keyframes[this.postKF].rotateY * DEGREE_TO_RAD;
        var delta_rz = this.move * this.keyframes[this.postKF].rotateZ * DEGREE_TO_RAD;
        this.newMatrix = mat4.rotateX(this.newMatrix, this.newMatrix, delta_rx);
        this.newMatrix = mat4.rotateY(this.newMatrix, this.newMatrix, delta_ry);
        this.newMatrix = mat4.rotateZ(this.newMatrix, this.newMatrix, delta_rz);

        // SCALING
        var prev_sx = this.keyframes[this.prevKF].scale[0];
        var prev_sy = this.keyframes[this.prevKF].scale[1];
        var prev_sz = this.keyframes[this.prevKF].scale[2];
        var post_sx = this.keyframes[this.postKF].scale[0];
        var post_sy = this.keyframes[this.postKF].scale[1];
        var post_sz = this.keyframes[this.postKF].scale[2];
        
        // Considering non accumulative scale (delta scale)
        var delta_sx = post_sx - prev_sx;
        var delta_sy = post_sy - prev_sy;
        var delta_sz = post_sz - prev_sz;
        
        // delta_sn is signed and helps scale down or up
        var kx = 1, ky = 1, kz = 1;
        if (delta_sx != 0) kx = 1 + this.move * delta_sx;
        if (delta_sy != 0) ky = 1 + this.move * delta_sy;
        if (delta_sz != 0) kz = 1 + this.move * delta_sz;

        this.scale = vec3.create();
        this.scale = vec3.set(this.scale, kx, ky, kz);
        this.newMatrix = mat4.scale(this.newMatrix, this.newMatrix, this.scale);
    }
}