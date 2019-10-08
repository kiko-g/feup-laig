/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() { super(); }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        var settings_dropdown = this.gui.addFolder('Global Settings');
        var lights_dropdown = this.gui.addFolder('Lighting Settings');

        settings_dropdown.open();
        settings_dropdown.add(this.scene, 'displayAxis').name('Display Axis');
        settings_dropdown.add(this.scene, 'displayNormals').name('Display Normals');

        lights_dropdown.open();
        // lights_dropdown.add(this.scene, 'displayLights').name('Display Light 0');
        // add a group of controls (and open/expand by defult)

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys()
    {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event){
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event){
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode){
        return this.activeKeys[keyCode] || false;
    }
}