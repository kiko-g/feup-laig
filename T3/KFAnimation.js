/**
 * @brief file for creating animations with keyframes
 */

class Animation //abstract class
{
    constructor(scene)
    {
        this.scene = scene;
        this.aniMatrix = mat4.create();
        mat4.identity(this.aniMatrix);
    }

    apply() { }
    update(time) { }
    generateAniMatrix(time) { }
    calculateSegmentValues() { }
    determineTransformation() { }
}



class Keyframe {
    constructor(translate, rotate, scale, instant) {
        this.translate = translate;
        this.rotateX = rotate[0];
        this.rotateY = rotate[1];
        this.rotateZ = rotate[2];
        this.instant = instant;
        this.scale = scale;
    }
}




class KeyframeAnimation extends Animation
{
    constructor(scene, id, keyframesList)
    {
        super(scene);
        this.id = id;
        this.scene = scene;
        this.prevKF = 0;                        //prev keyframe index
        this.postKF = 1;                        //post keyframe index
        this.time_acc = 0;                      //time accumulator
        this.T1 = 0;                            //time 1
        this.T2 = 0;                            //time 2 
        this.move = 0;                          //percentage of move to be done in iteration (T2-T1)
        this.move_acc = 0                       //move accumulator
        this.animationDone = false;             //boolean controlling end of animation
        this.keyframes = [];                    //keyframe array
        this.keyframes.push(new Keyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0));
        this.keyframes.push(...keyframesList);
        this.segmentTime = this.keyframes[this.postKF].instant - this.keyframes[this.prevKF].instant;
    }
    
    
    calculateSegmentValues()
    {
        if(this.time_acc >= this.segmentTime && this.move_acc >= 1)
        {
            if(this.postKF == this.keyframes.length-1) {
                this.animationDone = true;
            } 
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
    determineTransformation()
    {
        mat4.identity(this.aniMatrix);
        // used to prevent extra movement in last iteration of segment
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


class PieceAnimation extends KeyframeAnimation {
    constructor(scene, len, kind)
    {
        let kfs = [];
        let step = 1.05;
        let h = 1.8;
        //left to right move ---> positive x (case L)
        //right to left move ---> negative x (case R)
        //bottom to top move ---> positive z (case B)
        //top to bottom move ---> negative z (case T)

        switch(kind) 
        {
            case 'L': kfs.push(new Keyframe([          0,  h/2,  0],  [0, 0, 0],  [1, 1, 1], 0.5),
                               new Keyframe([          0,  h/2,  0],  [90,90,90] ,[1, 1, 1], 1.5),
                               new Keyframe([-step*len/2,  h*1,  0],  [0, 0, 0],  [1, 1, 1], 2.0),
                               new Keyframe([-step*len,    h/2,  0],  [0, 0, 0],  [1, 1, 1], 2.5),
                               new Keyframe([-step*len,      0,  0],  [0, 0, 0],  [1, 1, 1], 3.0));


            case 'R': kfs.push(new Keyframe([         0,  h/2,  0],  [0, 0, 0],   [1, 1, 1], 0.5),
                               new Keyframe([         0,  h/2,  0],  [90,90,90],  [1, 1, 1], 1.5),
                               new Keyframe([step*len/2,  h*1,  0],  [0, 0, 0],   [1, 1, 1], 2.0),
                               new Keyframe([step*len,    h/2,  0],  [0, 0, 0],   [1, 1, 1], 2.5),
                               new Keyframe([step*len,      0,  0],  [0, 0, 0],   [1, 1, 1], 3.0));


            case 'B': kfs.push(new Keyframe([0,     h/2,           0],  [0, 0, 0],        [1, 1, 1], 0.5),
                               new Keyframe([0,     h/2,           0],  [90,90,90],       [1, 1, 1], 1.5),
                               new Keyframe([0,     h*1,  step*len/2],  [0, 0, 0],        [1, 1, 1], 2.0),
                               new Keyframe([0,     h/2,    step*len],  [0, 0, 0],        [1, 1, 1], 2.5),
                               new Keyframe([0,       0,    step*len],  [0, 0, 0],        [1, 1, 1], 3.0));


            case 'T': kfs.push(new Keyframe([0,     h/2,           0],  [0, 0, 0],     [1, 1, 1], 0.5),
                               new Keyframe([0,     h/2,           0],  [90,90,90],    [1, 1, 1], 1.5),
                               new Keyframe([0,     h*1, -step*len/2],  [0, 0, 0],     [1, 1, 1], 2.0),
                               new Keyframe([0,     h/2,   -step*len],  [0, 0, 0],     [1, 1, 1], 2.5),
                               new Keyframe([0,       0,   -step*len],  [0, 0, 0],     [1, 1, 1], 3.0));

            default:
                kfs.push(new Keyframe([0, 0, 0], [0, 0, 0], [1, 1, 1], 0.1));
                break;
        }


        super(scene, 'piece_anim', kfs);
        this.keyframes[0].instant = performance.now()
        this.len = len;
        this.scene = scene;
    }
}