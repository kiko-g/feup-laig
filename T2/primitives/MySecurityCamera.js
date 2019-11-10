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
    constructor(scene)
    {
        super(scene);

        this.rectangle = new MyRectangle(scene, "security_rect", 1, 0, 1, 0);
        this.shader    = new CGFshader(this.scene.gl, "shaders/security.vert", "shaders/security.frag");
        console.log(shader);
    }

    display()
    {
        this.scene.setActiveShader(this.shader);
        this.pushMatrix();
        this.scene.sec_texture.bind(0);
        this.rectangle.display();
        this.popMatrix();
        this.scene.setActiveShader(this.defaultShader); //reset shader
    }
}