/**
 * Plane
 * @constructor */
class Plane extends CGFobject
{
	/**
	 * Builds a plane object 
	 * 
	 * @param {CGFscene} scene main scene
	 * @param {Number} UDivs number of divisions in U
     * @param {Number} VDivs number of divisions in V
	 */
    constructor(scene, id, UDivs, VDivs)
    {
        super(scene);
        this.id = id;
        this.npartsU = UDivs;
        this.npartsV = VDivs;

        this.surface = new CGFnurbsSurface(
          1,  // degree on U: 2 control vertexes U
          1,  // degree on V: 2 control vertexes on V
          [
              [   // U = 0 | V = 0..1
                  [-0.5, 0.0,  0.5, 1.0 ],
                  [-0.5, 0.0, -0.5, 1.0 ]
              ],
              [   // U = 1 | V = 0..1
                  [ 0.5, 0.0,  0.5, 1.0 ],
                  [ 0.5, 0.0, -0.5, 1.0 ]
              ],
          ]
        );
        this.object = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, this.surface);
    }

    display() { this.object.display(); }
}