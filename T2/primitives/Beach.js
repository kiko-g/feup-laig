/** 
 * Beach
 * @constructor
 */
class Beach extends CGFobject
{
    /**
     * Builds a Beach object
	 * @param {CGFscene} scene main scene
	 */
    constructor(scene, texture, mask, heightmap)
    {
        super(scene);
    
        this.R = new Plane(scene, "beach", 64, 64);
        this.shader = new CGFshader(scene.gl, "shaders/beach.vert", "shaders/beach.frag");

        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
        this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        this.seaTex = new CGFtexture(scene, texture);
        this.appearance.setTexture(this.seaTex);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.heightmapTex = new CGFtexture(scene, heightmap);
        this.beachmaskTex = new CGFtexture(scene, mask);

        this.shader.setUniformsValues({ heightSampler: 1, maskSampler: 2});
    }
    
    display()
    {
        this.appearance.apply();
        this.scene.setActiveShader(this.shader);
        this.seaTex.bind();
        this.heightmapTex.bind(1);
        this.beachmaskTex.bind(2);
        this.scene.pushMatrix();
        this.scene.scale(4, 1, 4);
        this.R.display();
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader); //reset shader
    }
}