/**
 * MyCylinder2
 * @constructor
 */
class MyCylinder2 extends CGFobject
{
	/**
	 * Builds a cylinder2 object uncovered on both sides
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} slices number of slices/sectors
	 * @param {Number} stacks number of stacks
	 * @param {Number} base cylinder base radius
     * @param {Number} top cylinder base radius
	 * @param {Number} height cylinder height
	 */
    constructor(scene, id, slices, stacks, base, top, height)
    {
        super(scene);
        this.id = id;
        this.slices = slices;
        this.stacks = stacks;
        this.base = base;
        this.top = top;
        this.H = height;
        this.UCtrlPoints = 2;
        this.VCtrlPoints = 9;

        this.initBuffers();

        this.surface = new CGFnurbsSurface(this.UCtrlPoints - 1, this.VCtrlPoints - 1, this.controlArray);
        this.object  = new CGFnurbsObject(this.scene, this.stacks, this.slices, this.surface);
    };


    initBuffers()
    {
        this.controlArray = 
        [
            [[      0.0,  this.base, 0.0, 1.0],
            [ this.base,  this.base, 0.0, 1.0],
            [ this.base,        0.0, 0.0, 1.0],
            [ this.base, -this.base, 0.0, 1.0],
            [       0.0, -this.base, 0.0, 1.0],
            [-this.base, -this.base, 0.0, 1.0],
            [-this.base,        0.0, 0.0, 1.0],
            [-this.base,  this.base, 0.0, 1.0],
            [       0.0,  this.base, 0.0, 1.0]],
            
            [[      0.0,  this.top, this.H, 1.0],
            [  this.top,  this.top, this.H, 1.0],
            [  this.top,       0.0, this.H, 1.0],
            [  this.top, -this.top, this.H, 1.0],
            [       0.0, -this.top, this.H, 1.0],
            [ -this.top, -this.top, this.H, 1.0],
            [ -this.top,       0.0, this.H, 1.0],
            [ -this.top,  this.top, this.H, 1.0],
            [       0.0,  this.top, this.H, 1.0]],
        ];
    }

    display() { this.object.display(); }
}