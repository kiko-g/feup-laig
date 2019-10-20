/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface
{
    constructor() { super(); }
    init(application)
    {
        super.init(application);

        this.gui = new dat.GUI();
        this.settings = this.gui.addFolder("General");
        this.normals = this.gui.addFolder("Regular Object Normals");
        this.lights = this.gui.addFolder("Lighting");
        this.camera = this.gui.addFolder("Camera");
        this.lights.open();
        this.camera.open();

        this.settings.add(this.scene, 'displayAxis').name("Axis");
        this.settings.add(this.scene, 'viewLightBoxes').name("Light Boxes");
        this.settings.add(this.scene, 'allNormals').name("All Normals");
        this.normals.add(this.scene, 'sphNormals').name("Sphere");
        this.normals.add(this.scene, 'torNormals').name("Torus");
        this.normals.add(this.scene, 'cylNormals').name("Cylinder");
        this.normals.add(this.scene, 'rectNormals').name("Rectangle");

        this.initKeys();
        return true;
    }
    
    lightsInterface(){
        for(let key in this.scene.graph.lights)
            this.lights.add(this.scene.graph.lights[key], 0).name(key);
    }

    viewsInterface(){
        this.camera.add(this.scene, "selected", this.scene.viewNames).onChange(this.scene.onViewChanged.bind(this.scene)).name("Perspective");
    }
    
    initKeys()
    {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event){ this.activeKeys[event.code]=true; }
    processKeyUp(event){ this.activeKeys[event.code]=false; }
    isKeyPressed(keyCode) { return this.activeKeys[keyCode] || false; }
}