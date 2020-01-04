/** MyInterface class, creating a GUI interface. */
class MyInterface extends CGFinterface
{
    constructor() { super(); }
    init(application)
    {
        super.init(application);
        this.scene.displayAxis = false;
        this.scene.viewLightBoxes = false;

        this.gui = new dat.GUI();
        this.lights = this.gui.addFolder("Lighting");
                
        this.settings = this.gui.addFolder("Settings");
        this.settings.add(this.scene, 'displayAxis').name("Axis");
        this.settings.add(this.scene, 'viewLightBoxes').name("Light Boxes");
        this.settings.add(this.scene.securityPOV, 'active').name("Security Camera");
        
        this.sceneset = this.gui.addFolder("Scene");
        this.sceneset.open();

        this.initKeys();
        // this.gui.close();
        return true;
    }
    
    lightsInterface() {
        for(let key in this.scene.graph.lights)
            this.lights.add(this.scene.graph.lights[key], 0).name(key);
    }

    sceneInterface() { 
        this.sceneset.add(this.scene, "cameraSelected", this.scene.viewNames).onChange(this.scene.onViewChanged.bind(this.scene)).name("Perspective");
        this.sceneset.add(this.scene, "securitySelected", this.scene.viewNames).onChange(this.scene.onSecurityChanged.bind(this.scene)).name("Security Cam");
        this.sceneset.add(this.scene, "activeSceneString", ["Room", "Original"]).onChange(this.scene.onSceneChanged.bind(this.scene)).name("Scene");
    }

    optionsInterface() {
        this.options = this.gui.addFolder("Game Options");
        this.options.open();
        this.options.add(this.scene.game, "startGame").name("Start Game");
        this.options.add(this.scene.game, "undoPlay").name("Undo Play");
        this.options.add(this.scene.game, "resetAndQuit").name("Reset Game");
        this.options.add(this.scene.game, "generateGameMovie").name("Watch Movie");
        this.options.add(this.scene.game, "changeTurn").name("Change Turn");
        this.options.add(this.scene.game, "cameraAnimation").name("Rotate");
    }

    //keys
    initKeys() { this.scene.gui = this; this.processKeyboard = function(){}; this.activeKeys = {}; }
    processKeyDown(event) { this.activeKeys[event.code] = true; }
    processKeyUp(event)   { this.activeKeys[event.code] = false; }
    isKeyPressed(keyCode) { return this.activeKeys[keyCode] || false; }
}