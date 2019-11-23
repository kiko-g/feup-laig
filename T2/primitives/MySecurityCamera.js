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
	 * @param {Number} 
	 * @param {Number} 
	 */
    constructor(scene, RTT)
    {
        super(scene);
        this.RTT = RTT;
        this.rectangle = new MyRectangle(scene, "security_rect", 1, 0, 1, 0);
        this.shader = new CGFshader(this.scene.gl, "shaders/security.vert", "shaders/security.frag");
        this.shader.setUniformsValues({ uSampler2: 0, timeFactor: 0 });
    }

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();
        this.RTT.bind(0);
        this.rectangle.display();
        this.RTT.unbind(0);
        this.scene.popMatrix();
        this.scene.setActiveShader(this.defaultShader); //reset shader
    }

    updateTimeFactor(t) { this.shader.setUniformsValues({ timeFactor: t }); }
}