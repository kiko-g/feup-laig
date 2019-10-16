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

    apply(appearance) {
        //use ... because of vector
        appearance.setShininess(this.shininess); //one number
        appearance.setEmission(...this.emission);
        appearance.setAmbient(...this.ambient);
        appearance.setDiffuse(...this.diffuse);
        appearance.setSpecular(...this.specular);
    }
}