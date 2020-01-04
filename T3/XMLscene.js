var DEGREE_TO_RAD = Math.PI / 180;
/** XMLscene class, representing the scene that is to be rendered. */
class XMLscene extends CGFscene 
{
    /**
     * @constructor
     * @param {MyInterface} Interface */
    constructor(Interface)
    {
        super();
        this.interface = Interface;        
        this.graphlist = [];
        
        this.graphid = 0; //starting graph
        this.determine_graph();
        
        this.fps = 60.0;
        this.MPress = false;
        this.displayAxis = true;
        this.sceneInited = false;
        this.viewLightBoxes = true;
    }
    
    /** Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     *  @param {CGFApplication} application */
    init(application)
    {
        super.init(application);
        this.enableTextures(true);
        this.setPickEnabled(true);
        this.setUpdatePeriod(1000.0 / this.fps);
        
        //security camera
        this.RTT = new CGFtextureRTT(this, this.gl.canvas.width * 3, this.gl.canvas.height * 3);
        this.securityPOV = new MySecurityCamera(this, this.RTT);
        this.securityPOV.active = false;
        
        //game
        this.game = new Game(this);
        this.axis = new CGFaxis(this);
        this.appearance = new CGFappearance(this);

        //camera
        this.camera = new CGFcamera(20*DEGREE_TO_RAD, 0.1, 500, vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, 0));
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    update(t)
    {
        this.securityPOV.updateTimeFactor(t/1500 % 2000);

        if(this.prev == undefined) this.prev = 0.0;
        if(this.current == undefined) this.current = 0.0;
        if(this.timeDif == undefined) this.timeDif = 0.0;
        
        this.timeDif = (t - this.prev) / 1000.0;
        this.current = (this.current + this.timeDif);
        this.prev = t;
        if(this.timeDif > 1) this.current = 0;
        
        for(let key in this.graph.animations)
            if(!this.graph.animations[key].animationDone) 
                this.graph.animations[key].update(this.timeDif);

        // for(let key in this.graph.animations)
        //     if(!this.graph.animations[key].animationDone) 
        //         this.graph.animations[key].update(this.timeDif);        
    }


    /** @brief Use camera with default ID if it exists */
    initCameras()
    {
        this.viewNames = [];
        this.camerasInited = [];
        if(this.graph.defaultViewDefined)
        {
            for (let key in this.graph.views)
            {
                this.viewNames.push(key);
                var V = this.graph.views[key];
                    
            if(V.id == this.graph.defaultViewID){ 
                    this.cameraSelected = V.id;
            }

            if (V.type == "perspective")
            this.camerasInited[V.id]=new CGFcamera(DEGREE_TO_RAD * V.angle, V.near, V.far, V.from, V.to);
                    
            else if (V.type == "ortho")
            this.camerasInited[V.id]=new CGFcameraOrtho(V.left,V.right,V.bottom,V.top,V.near,V.far,V.from,V.to,V.up);
            }
        } 
        else return;
        
        this.securitySelected = "Corner";
        this.camera = this.camerasInited[this.cameraSelected];
        this.securityCAM = this.camerasInited[this.securitySelected];
    }
    

    //INTERFACES
    onViewChanged() { this.camera = this.graph.views[this.cameraSelected]; }
    onSecurityChanged() { this.securityCAM = this.camerasInited[this.securitySelected]; }
    onSceneChanged() { this.graphid++; this.graph = this.graphlist[this.graphid % this.graphlist.length]; }


    /** @brief Initializes the scene lights with the values read from the XML file */
    initLights()
    {
        var i = 0;  // Lights index.
        // Reads the lights from the scene graph.
        for (let key in this.graph.lights) {
            if (i >= 8) break; // Only eight lights allowed by WebGL.
            if (this.graph.lights.hasOwnProperty(key)) {
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
    
    
    toggleLights() {
        var i = 0;
        for (let key in this.graph.lights)
        {
            //there are two different arrays of lights
            var light = this.graph.lights[key];
            if (light[0]) this.lights[i].enable();
            else this.lights[i].disable();
            if(!this.viewLightBoxes) this.lights[i].setVisible(false);
            else this.lights[i].setVisible(true);

            this.lights[i].setConstantAttenuation(light[6][0]);
            this.lights[i].setLinearAttenuation(light[6][1]);
            this.lights[i].setQuadraticAttenuation(light[6][2]);
            this.lights[i].update();
            i++;
        }
    }


    setDefaultAppearance()
    {
        this.setAmbient(0/255, 0/255, 0/255, 1.0);
        this.setDiffuse(255/255, 255/255, 255/255, 1.0);
        this.setSpecular(255/255, 255/255, 255/255, 1.0);
        this.setShininess(10.0);
    }


    determine_graph() {
        if (this.graphid == 0) this.activeSceneString = "Room";
        else if (this.graphid == 1) this.activeSceneString = "Original";
        else {
            this.graphid = 0;
            this.activeSceneString = "Room";
        }
    }

    
    /** Handler called when the graph is finally loaded. 
     *  As loading is asynchronous, this may be called already after the application has started the run loop */
    onGraphLoaded()
    {
        this.axis = new CGFaxis(this, this.graph.referenceLength);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();
        this.initCameras();
        this.interface.sceneInterface();
        this.interface.lightsInterface();
        this.interface.optionsInterface();
        
        this.sceneInited = true;
    }


    // Displays the scene
    render(camera)
    {
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    
        this.camera = camera;
        this.interface.setActiveCamera(this.camera);    // COMMENT THIS LINE TO FREEZE CAMERA

        this.updateProjectionMatrix();  // Initialize Model-View matrix as identity (no transformation)
        this.loadIdentity();   
        this.applyViewMatrix(); // Apply transformations corresponding to the camera position relative to the origin
        this.pushMatrix();
        
        if (this.sceneInited)
        {
            this.setUpdatePeriod(1000.0 / this.fps);
            this.toggleLights();
            this.setDefaultAppearance();    // Draw Axis
            this.graph.displayScene();      // Displays the scene (xml)
            if(this.displayAxis) this.axis.display();
            this.updateMAT();
        }
        this.popMatrix();
    }

    display()
    {
        if(!this.sceneInited) return;
        
        this.RTT.attachToFrameBuffer();
        this.render(this.securityCAM);
        this.RTT.detachFromFrameBuffer();
        this.render(this.camerasInited[this.cameraSelected]);

        this.gl.disable(this.gl.DEPTH_TEST);
        if(this.securityPOV.active) this.securityPOV.display();
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    updateMAT()
    {
        if (this.interface.isKeyPressed('KeyM') && !this.MPress){
            this.MPress = true;
            for (let key in this.graph.components)
                this.graph.cycleMaterial(this.graph.components[key]);
        }
        else if (!this.interface.isKeyPressed('KeyM')) this.MPress = false;
    }

    logPicking() 
    {
        if(this.pickMode == false)
          if(this.pickResults != null && this.pickResults.length > 0)
          {
              for(var i = 0; i < this.pickResults.length; i++) 
                 if(this.pickResults[i][0]) 
                   console.log("⛏️ " + this.pickResults[i][0].id + " " + this.pickResults[i][1]);
          }
    }
}