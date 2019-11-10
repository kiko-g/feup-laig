/**
 * Patch
 * @constructor */
class Patch extends CGFobject
{
    /**
     * Builds a patch object 
     * @param {CGFscene} scene main scene
     * @param {Number} UDivs number of divisions in U
     * @param {Number} VDivs number of divisions in V
     * @param {Number} UControlPoints number of control points in U
     * @param {Number} VControlPoints number of control points in V
     */
    constructor(scene, id, uCtrlPoints, vCtrlPoints, UDivs, VDivs, controlArray)
    {
        super(scene);
        this.id = id;
        this.UDivs = UDivs;
        this.VDivs = VDivs;
        this.UCtrlPoints = uCtrlPoints;
        this.VCtrlPoints = vCtrlPoints;
        this.controlArray = controlArray;

        this.surface = new CGFnurbsSurface(uCtrlPoints-1, vCtrlPoints-1, controlArray);
        this.object = new CGFnurbsObject(this.scene, UDivs, VDivs, this.surface);
    }

    display() { this.object.display(); }
}