class KeyframeAnimation extends Animation
{
    constructor(scene, keyframesList)
    {
        super(scene);
        this.scene = scene;
        this.prevKF = 0;                        //prev keyframe index
        this.postKF = 1;                        //post keyframe index
        this.time_acc = 0;                      //time accumulator
        this.T1 = 0;                            //time variable 1
        this.T2 = 0;                            //time variable 2 
        this.move = 0;                          //percentage of move to be done in iteration (T2-T1)
        this.move_acc = 0                       //move accumulator
        this.lastExtraMove = false              //boolean controlling last move of the segment executed
        this.lastSegment = false;               //boolean that tells us if we're in the last segment
        this.animationDone = false;             //boolean controlling end of animation
        this.keyframes = [];                    //keyframe array
        this.firstKF = new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0);
        this.keyframes.push(this.firstKF);
        this.keyframes.push(...keyframesList);
        this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
    }
    
    
    calculateSegmentValues()
    {
        if(this.time_acc >= this.segmentTime && this.move_acc >= 1)
        {
            if(this.postKF == this.keyframes.length - 1)
                this.animationDone = true;
            else
            { 
                //next segment
                this.T1 = 0;
                this.T2 = 0;
                this.time_acc = 0;
                this.move_acc = 0;
                this.prevKF++;
                this.postKF++;
                this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
                if (this.postKF == this.keyframes.length - 1) this.lastSegment = true;
            }
        }
    }

    generateAniMatrix(time)
    {
        this.calculateSegmentValues();
        this.time_acc += time;
        this.T2 = (this.time_acc / this.segmentTime);
        this.move = this.T2 - this.T1;

        this.determineTransformation();
        if(!this.lastExtraMove) this.aniMatrix = mat4.multiply(this.aniMatrix, this.aniMatrix, this.newMatrix);
        
        this.T1 = this.T2;
    }

    update(time) { this.generateAniMatrix(time); }
    apply() { this.scene.multMatrix(this.aniMatrix); }

    
    determineTransformation()
    {
        mat4.identity(this.newMatrix);
        this.move_acc += this.move;

        // used to prevent an extra movement in last segment
        if(this.lastSegment)
            if(this.move_acc >= 1) this.lastExtraMove = true;

        // used to correct last movement in segment
        // for example move.acc = 1.1, move = 0.2 -> move = 0.1
        if(this.move_acc >= 1) this.move -= this.move_acc - 1;

        // TRANSLATION
        var delta_tx = this.move * this.keyframes[this.postKF].translate[0];
        var delta_ty = this.move * this.keyframes[this.postKF].translate[1];
        var delta_tz = this.move * this.keyframes[this.postKF].translate[2];
        this.translation = vec3.create();
        this.translation = vec3.set(this.translation, delta_tx, delta_ty, delta_tz);
        
        // ROTATION
        var delta_rx = this.move * this.keyframes[this.postKF].rotateX * DEGREE_TO_RAD;
        var delta_ry = this.move * this.keyframes[this.postKF].rotateY * DEGREE_TO_RAD;
        var delta_rz = this.move * this.keyframes[this.postKF].rotateZ * DEGREE_TO_RAD;

        // SCALING
        var prev_sx = this.keyframes[this.prevKF].scale[0];
        var prev_sy = this.keyframes[this.prevKF].scale[1];
        var prev_sz = this.keyframes[this.prevKF].scale[2];
        var post_sx = this.keyframes[this.postKF].scale[0];
        var post_sy = this.keyframes[this.postKF].scale[1];
        var post_sz = this.keyframes[this.postKF].scale[2];
        
        // Considering non cumulative scale (delta scale)
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

        this.newMatrix = mat4.translate(this.newMatrix, this.newMatrix, this.translation);
        this.newMatrix = mat4.rotateX(this.newMatrix, this.newMatrix, delta_rx);
        this.newMatrix = mat4.rotateY(this.newMatrix, this.newMatrix, delta_ry);
        this.newMatrix = mat4.rotateZ(this.newMatrix, this.newMatrix, delta_rz);
        this.newMatrix = mat4.scale(this.newMatrix, this.newMatrix, this.scale);        
    }
}