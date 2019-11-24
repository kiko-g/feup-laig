class KeyframeAnimation extends Animation
{
    constructor(scene, keyframesList)
    {
        super(scene);
        this.scene = scene;
        this.prevKF = 0;                        //prev keyframe index
        this.postKF = 1;                        //post keyframe index
        this.time_acc = 0;                      //time accumulator
        this.T1 = 0;                            //time 1
        this.T2 = 0;                            //time 2 
        this.move = 0;                          //percentage of move to be done in iteration (T2-T1)
        this.move_acc = 0                       //move accumulator
        this.lastExtraMove = false              //boolean controlling last move of the segment executed
        this.lastSegment = false;               //boolean that tells us if we're in the last segment
        this.animationDone = false;             //boolean controlling end of animation
        this.keyframes = [];                    //keyframe array
        this.keyframes.push(new MyKeyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0));
        this.keyframes.push(...keyframesList);
        this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
    }
    
    
    calculateSegmentValues()
    {
        if(this.time_acc >= this.segmentTime && this.move_acc >= 1)
        {
            if(this.postKF == this.keyframes.length-1) this.animationDone = true;
            else //next segment
            {
                this.T1 = 0;
                this.T2 = 0;
                this.time_acc = 0;
                this.move_acc = 0;
                this.prevKF++;
                this.postKF++;
                this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
            }
        }
    }

    generateAniMatrix(time)
    {
        this.calculateSegmentValues();
        this.time_acc += time;
        this.T2 = (this.time_acc / this.segmentTime);
        this.move = this.T2 - this.T1;
        this.move_acc += this.move;
        this.determineTransformation();
        this.T1 = this.T2;
    }

    update(time) { this.generateAniMatrix(time); }
    apply() { this.scene.multMatrix(this.aniMatrix); }
    // console.log(">"+this.aniMatrix);
    determineTransformation()
    {
        mat4.identity(this.aniMatrix);
        // used to prevent an extra movement in last segment
        if(this.lastSegment && this.move_acc >= 1) this.lastExtraMove = true;
        if(this.move_acc >= 1) this.move_acc = 1;
        
        // TRANSLATION
        let prev_tx = this.keyframes[this.prevKF].translate[0];
        let prev_ty = this.keyframes[this.prevKF].translate[1];
        let prev_tz = this.keyframes[this.prevKF].translate[2];
        let post_tx = this.keyframes[this.postKF].translate[0];
        let post_ty = this.keyframes[this.postKF].translate[1];
        let post_tz = this.keyframes[this.postKF].translate[2];
        let delta_tx = prev_tx + this.move_acc * (post_tx - prev_tx);
        let delta_ty = prev_ty + this.move_acc * (post_ty - prev_ty);
        let delta_tz = prev_tz + this.move_acc * (post_tz - prev_tz);

        // ROTATION
        let prev_rx = this.keyframes[this.prevKF].rotateX;
        let prev_ry = this.keyframes[this.prevKF].rotateY;
        let prev_rz = this.keyframes[this.prevKF].rotateZ;
        let post_rx = this.keyframes[this.postKF].rotateX;
        let post_ry = this.keyframes[this.postKF].rotateY;
        let post_rz = this.keyframes[this.postKF].rotateZ;
        let delta_rx = (prev_rx + this.move_acc * (post_rx - prev_rx)) * DEGREE_TO_RAD;
        let delta_ry = (prev_ry + this.move_acc * (post_ry - prev_ry)) * DEGREE_TO_RAD;
        let delta_rz = (prev_rz + this.move_acc * (post_rz - prev_rz)) * DEGREE_TO_RAD;

        // SCALING
        // delta_s<axis> is signed and helps scale down or up
        let prev_sx = this.keyframes[this.prevKF].scale[0];
        let prev_sy = this.keyframes[this.prevKF].scale[1];
        let prev_sz = this.keyframes[this.prevKF].scale[2];
        let post_sx = this.keyframes[this.postKF].scale[0];
        let post_sy = this.keyframes[this.postKF].scale[1];
        let post_sz = this.keyframes[this.postKF].scale[2];
        let delta_sx = (post_sx / prev_sx) - 1;
        let delta_sy = (post_sy / prev_sy) - 1;
        let delta_sz = (post_sz / prev_sz) - 1;
        let kx = 1, ky = 1, kz = 1;
        if (delta_sx != 0) kx = prev_sx + (this.move_acc * delta_sx * prev_sx);
        if (delta_sy != 0) ky = prev_sy + (this.move_acc * delta_sy * prev_sy);
        if (delta_sz != 0) kz = prev_sz + (this.move_acc * delta_sz * prev_sz);
        
        //BUILDING VECTORS
        this.translation = vec3.create();
        this.scale = vec3.create();
        vec3.set(this.translation, delta_tx, delta_ty, delta_tz);
        vec3.set(this.scale, kx, ky, kz);

        //CREATING MATRIX
        this.aniMatrix = mat4.translate(this.aniMatrix, this.aniMatrix, this.translation);
        this.aniMatrix = mat4.rotateX(this.aniMatrix, this.aniMatrix, delta_rx);
        this.aniMatrix = mat4.rotateY(this.aniMatrix, this.aniMatrix, delta_ry);
        this.aniMatrix = mat4.rotateZ(this.aniMatrix, this.aniMatrix, delta_rz);
        this.aniMatrix = mat4.scale(this.aniMatrix, this.aniMatrix, this.scale);
    }
}