/** 
 * MySecurityCamera
 * @constructor
 */
class MySecurityCamera extends CGFobject
{
    /**
     * Builds a MySecurityCamera object 
	 * 
	 * @param {CGFscene} scene main scene
     * @param {CGFtextureRTT} RTT Render To Texture object 
	 */
    constructor(scene, RTT)
    {
        super(scene);
        this.RTT = RTT;
        
        this.securityrec = new MyRectangle(scene, "security_rect", -0.125, 0.125, 0.75, 1, false, true);
        this.shader = new CGFshader(scene.gl, "shaders/security.vert", "shaders/security.frag");
        this.shader.setUniformsValues({ timeFactor: 0 });
        
        //we made some changes to the ractangle, the first boolean (false) controls if the ractangle
        //has two sides and the second boolean (true) controls if the rectangle created corresponds
        //to the security camera
    }
    
    display()
    {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.RTT.bind(0);
        this.securityrec.display();
        this.RTT.unbind(0);
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader); //reset shader
    }

    updateTimeFactor(t) { this.shader.setUniformsValues( {timeFactor: t} ); }
}