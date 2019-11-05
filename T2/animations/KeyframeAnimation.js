class KeyframeAnimation extends Animation
{

    constructor(scene, keyframes){
        super(scene);
        this.keyframes = [new MyKeyFrame[0, 0, 0], [0, 0, 0], [1, 1, 1], 0];
        this.keyframes.push(...keyframes); 
        this.anteriorKeyframeIndex = 0;
        this.posteriorKeyframeIndex = 1;
        this.sumT; //soma de tempo dentro do segmento //sumT / segment time dá ppercentagem do segmento feito
        this.segmentTime = this.keyframes[posteriorKeyframeIndex].instant - this.keyframes[anteriorKeyframeIndex].instant;
        this.calculateSegmentValues();
        this.animationDone = false;

    }

    
    calculateSegmentValues(){
        
    }



}