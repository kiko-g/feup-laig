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
        this.rectangle = new MyRectangle(scene, "security_rect", 0.5, 2, -2, -0.5);
        this.shader = new CGFshader(scene.gl, "shaders/security.vert", "shaders/security.frag");
        this.shader.setUniformsValues({ timeFactor: 0 });
    }

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.RTT.bind(0);
        this.rectangle.display();
        this.RTT.unbind(0);
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader); //reset shader
    }

    updateTimeFactor(t) { this.shader.setUniformsValues( {timeFactor: t} ); }
}