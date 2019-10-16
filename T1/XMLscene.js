var DEGREE_TO_RAD = Math.PI / 180;
/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene 
{
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface)
    {
        super();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application)
    {
        super.init(application);
        
        this.sceneInited = false;
        this.displayAxis = true;
        this.displayNormals = true;
        this.light0 = true;
        this.light1 = true;
        this.light2 = true;
        this.light3 = true;
        this.light4 = true;
        this.light5 = true;
        this.light6 = true;
        this.light7 = true;


        //fov (radians), near, far, position, target 
        this.camera = new CGFcamera(30*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(0, 0, 0), vec3.fromValues(0, 0, 0));
        this.interface.setActiveCamera(this.camera);
        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.appearance = new CGFappearance(this);
        this.setUpdatePeriod(50);
    }

    // Initializes the scene cameras.
    initCameras()
    {
        let V;
        //Use camera with default ID if it exists
        if (this.graph.defaultViewDefined){
            for (let i = 0; i < this.graph.views.length; i++){
                let view = this.graph.views[i];
                if (view.id = this.graph.defaultViewID) { V = view; break; }
            }
        }
        else return;

        if (V == null) return;
        else if (V.type == "perspective") 
            this.camera = new CGFcamera(V.angle, V.near, V.far, V.from, V.to);
        else if (V.type = "ortho") 
            this.camera = new CGFcameraOrtho(V.left, V.right, V.bottom, V.top, V.near, V.far, V.from, V.to, V.up);
        
        this.interface.setActiveCamera(this.camera);
    }
    
    
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights()
    {
        var i = 0;  // Lights index.

        // Reads the lights from the scene graph.
        for (let key in this.graph.lights)
        {
            if (i >= 8) break; // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key))
            {
                var light = this.graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                if (light[1] == "spot"){
                    this.lights[i].setSpotCutOff(light[6]);
                    this.lights[i].setSpotExponent(light[7]);
                    this.lights[i].setSpotDirection(light[8][0], light[8][1], light[8][2]);
                }

                this.lights[i].setVisible(true);
                if(light[0]) this.lights[i].enable();
                else this.lights[i].disable();

                this.lights[i].update();
                i++;
            }
        }
    }

    setDefaultAppearance()
    {
        this.setAmbient(0/255, 0/255, 0/255, 1.0);
        this.setDiffuse(255/255, 255/255, 255/255, 1.0);
        this.setSpecular(255/255, 255/255, 255/255, 1.0);
        this.setShininess(10.0);
    }

    
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded()
    {
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        
        this.initLights();
        this.initCameras();
        
        this.sceneInited = true;
    }



    // Displays the scene.
    display()
    {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.updateProjectionMatrix();  
        this.loadIdentity();            // Initialize Model-View matrix as identity (no transformation)
        this.applyViewMatrix();         // Apply transformations corresponding to the camera position relative to the origin

        this.pushMatrix();
        
        for (let i = 0; i < this.lights.length; i++)
        {
            this.lights[i].setVisible(true);
            this.lights[i].enable();
        }
        
        if (this.sceneInited)
        {
            this.setDefaultAppearance();    // Draw Axis
            this.graph.displayScene();      // Displays the scene (MySceneGraph function).
            if(this.displayAxis) this.axis.display();

            if (this.displayNormals) {
                this.graph.primitives['cylinder'].enableNormalViz();
                this.graph.primitives['sphere'].enableNormalViz();
                this.graph.primitives['torus'].enableNormalViz();
                this.graph.primitives['rectangle'].enableNormalViz();
            }
            else {
                this.graph.primitives['cylinder'].disableNormalViz();
                this.graph.primitives['rectangle'].disableNormalViz();
                this.graph.primitives['sphere'].disableNormalViz();
                this.graph.primitives['torus'].disableNormalViz();
            }
        }

        if(!this.light0) this.lights[0].disable()
        else this.lights[0].enable();
        if (!this.light1) this.lights[1].disable()
        else this.lights[1].enable();
        if (!this.light2) this.lights[2].disable()
        else this.lights[2].enable();
        if (!this.light3) this.lights[3].disable()
        else this.lights[3].enable();
        if (!this.light4) this.lights[4].disable()
        else this.lights[4].enable();
        if (!this.light5) this.lights[5].disable()
        else this.lights[5].enable();
        if (!this.light6) this.lights[6].disable()
        else this.lights[6].enable();
        if (!this.light7) this.lights[7].disable()
        else this.lights[7].enable();

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}