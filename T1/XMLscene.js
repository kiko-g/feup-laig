var DEGREE_TO_RAD = Math.PI / 180;
/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene 
{
    /**
     * @constructor
     * @param {MyInterface} myinterface*/
    constructor(myinterface)
    {
        super();
        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application */
    init(application)
    {
        super.init(application);
        this.sceneInited = false;
        this.displayAxis = true;
        this.displayNormals = false;

        //fov (radians), near, far, position, target 
        this.camera = new CGFcamera(20*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, 0));
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

    // Use camera with default ID if it exists
    initCameras()
    {
        let V;
        this.viewNames = [];

        if(this.graph.defaultViewDefined)
        {
            for (let key in this.graph.views)
            {
                this.viewNames.push(key);
                this.view = this.graph.views[key];
                
                if (this.view.id == this.graph.defaultViewID){ 
                    V = this.view;
                    this.selected = this.view.id;
                }
            }
        }
        else return;


        if (V == null) return;
        else if (V.type == "perspective") 
            this.camera = new CGFcamera(V.angle*DEGREE_TO_RAD, V.near, V.far, V.from, V.to);
        else if (V.type = "ortho") 
            this.camera = new CGFcameraOrtho(V.left, V.right, V.bottom, V.top, V.near, V.far, V.from, V.to, V.up);
        
        this.interface.setActiveCamera(this.camera);
    }
    

    
    
    
    onViewChanged()
    {
        let curV = this.graph.views[this.selected];
        if(curV == null) return null;
        else if(curV.type == "perspective") this.camera = new CGFcamera(DEGREE_TO_RAD*curV.angle, curV.near, curV.far, curV.from, curV.to);
        else if(curV.type == "ortho") this.camera = new CGFcameraOrtho(curV.left, curV.right, curV.bottom, curV.top, curV.near, curV.far, curV.from, curV.to, curV.up);
          
        this.interface.setActiveCamera(this.camera);
    }
    

    //Initializes the scene lights with the values read from the XML file
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
     *  As loading is asynchronous, this may be called already after the application has started the run loop */
    onGraphLoaded()
    {
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        
        this.initLights();
        this.interface.switchLights();
        this.initCameras();
        this.interface.switchViews();
        
        this.sceneInited = true;
    }



    // Displays the scene
    display()
    {
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
                this.graph.primitives['rectangle'].enableNormalViz();
                this.graph.primitives['sphere'].enableNormalViz();
                this.graph.primitives['tinysphere'].enableNormalViz();
                this.graph.primitives['torus'].enableNormalViz();
                this.graph.primitives['ring'].enableNormalViz();
            }
            else {
                this.graph.primitives['cylinder'].disableNormalViz();
                this.graph.primitives['rectangle'].disableNormalViz();
                this.graph.primitives['sphere'].disableNormalViz();
                this.graph.primitives['tinysphere'].disableNormalViz();
                this.graph.primitives['torus'].disableNormalViz();
                this.graph.primitives['ring'].disableNormalViz();
            }
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}