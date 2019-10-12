/**
 * MyMaterial
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyMaterial {
    constructor(shininess, emission, ambient, diffuse, specular)
    {
        this.shininess = shininess;
        this.emission = emission;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
    }

    apply(appearence) {
        //use ... because of vector
        appearence.setShininess(this.shininess); //one number
        appearence.setEmission(...this.emission);
        appearence.setAmbient(...this.ambient);
        appearence.setDiffuse(...this.diffuse);
        appearence.setSpecular(...this.specular);
    }

}

class MyMaterialInherit extends MyMaterial
{
    // apply(appearence) { /* do Nothing */ }
}