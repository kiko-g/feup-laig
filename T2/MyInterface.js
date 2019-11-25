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
        this.lights = this.gui.addFolder("Lighting");
        this.settings = this.gui.addFolder("General Settings");
        this.settings.open();

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
        this.gui.add(this.scene, "cameraSelected", this.scene.viewNames).
        onChange(this.scene.onViewChanged.bind(this.scene)).name("Perspective");
    }

    securityInterface(){
        this.gui.add(this.scene, "securitySelected", this.scene.viewNames).
        onChange(this.scene.onSecurityChanged.bind(this.scene)).name("Security Camera");
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