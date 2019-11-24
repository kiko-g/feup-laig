/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface
{
    constructor() { super(); }
    init(application)
    {
        super.init(application);
        this.scene.displayAxis = true;
        this.scene.viewLightBoxes = false;

        this.gui = new dat.GUI();
        this.settings = this.gui.addFolder("General");
        this.lights = this.gui.addFolder("Lighting");
        this.camera = this.gui.addFolder("Camera");
        this.SecCam = this.gui.addFolder("Securtiy Camera");
        this.settings.open();
        this.camera.open();
        this.SecCam.open();

        this.settings.add(this.scene, 'displayAxis').name("Axis");
        this.settings.add(this.scene, 'viewLightBoxes').name("Light Boxes");

        this.initKeys();
        return true;
    }
    
    lightsInterface(){
        for(let key in this.scene.graph.lights)
            this.lights.add(this.scene.graph.lights[key], 0).name(key);
    }

    viewsInterface(){
        this.camera.add(this.scene, "selected", this.scene.viewNames).
        onChange(this.scene.onViewChanged.bind(this.scene)).name("Perspective");
    }
    
    initKeys()
    {
        this.scene.gui = this;
        this.processKeyboard = function(){};
        this.activeKeys = {};
    }

    processKeyDown(event){ this.activeKeys[event.code] = true; }
    processKeyUp(event){ this.activeKeys[event.code] = false; }
    isKeyPressed(keyCode) { return this.activeKeys[keyCode] || false; }
}