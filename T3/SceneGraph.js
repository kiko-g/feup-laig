var DEGREE_TO_RAD = Math.PI / 180;
// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph
{
    /**
     * @constructor
     * @param {String} filename XML file name (contains scene)
     * @param {CGFscene} scene scene
     */
    constructor(filename, scene)
    {
        this.scene = scene;
        this.scene.graph = this;        // Bidirectional references between scene and graph
        this.idRoot = null;             // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading
        this.reader = new CGFXMLreader();

        /*
        * Read the contents of the xml file, and refer to this class for loading and error handlers.
        * After the file is read, the reader calls onXMLReady on this object.
        * If any error occurs, the reader calls onXMLError on this object, with an error message */
        this.reader.open('scenes/' + filename, this);
    }

    cycleMaterial(component) {
        component.materials.current++;
        component.materials.current = (component.materials.current % component.materials.materials.length);
    }

    // Callback to be executed after successful reading
    onXMLReady()
    {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;
        
        var error = this.parseXMLFile(rootElement); // Here should go the calls for different functions to parse the various blocks
        if (error != null) { this.onXMLError(error); return; }
        this.loadedOk = true;
        
        /**
         * As the graph loaded ok, signal the scene so that any
         * additional initialization depending on the graph can take place */
        this.scene.graphlist.push(this);
        console.log("☑️ Graph " + this.scene.graphlist.length + " loaded");
        if(this.scene.graphlist.length == 2) {
            this.scene.onGraphLoaded();
            this.scene.graph = this.scene.graphlist[this.scene.graphid];
        } 
    }


    
    /**
     * Originally Implemented
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement)
    {
        if (rootElement.nodeName != "lxs") return "root tag <lxs> missing";
                
        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];
        var nodes = rootElement.children;
        for (var i = 0; i < nodes.length; i++)
            nodeNames.push(nodes[i].nodeName);

        
        /* ========================================= */
        /* PROCESS EVERY XML NODE, verifying errors. */
        /* ========================================= */
        // <scene>
        var error, index;
        if ((index = nodeNames.indexOf("scene")) == -1) return "tag <scene> missing";
        else{
            if(index != SCENE_INDEX) this.onXMLMinorError("tag <scene> out of order (at " + index + ")");
            if((error = this.parseScene(nodes[index])) != null) return error;
            //Parse scene block
        }


        // <views>
        if ((index = nodeNames.indexOf("views")) == -1) return "tag <views> missing";
        else{
            if (index != VIEWS_INDEX) this.onXMLMinorError("tag <views> out of order");
            if ((error = this.parseViews(nodes[index])) != null) return error;
            //Parse views block
        }


        // <globals>
        if ((index = nodeNames.indexOf("globals")) == -1) return "tag <globals> missing";
        else {
            if (index != GLOBALS_INDEX) this.onXMLMinorError("tag <globals> out of order");
            if ((error = this.parseGlobals(nodes[index])) != null) return error;
            //Parse globals block
        }

        
        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1) return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX) this.onXMLMinorError("tag <lights> out of order");
            if ((error = this.parseLights(nodes[index])) != null) return error;
            //Parse lights block
        }
        
        
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1) return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX) this.onXMLMinorError("tag <textures> out of order");
            if ((error = this.parseTextures(nodes[index])) != null) return error;
            //Parse textures block
        }

        
        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1) return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX) this.onXMLMinorError("tag <materials> out of order");
            if ((error = this.parseMaterials(nodes[index])) != null) return error;
            //Parse materials block
        }

        
        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1) return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX) this.onXMLMinorError("tag <transformations> out of order");
            if ((error = this.parseTransformations(nodes[index])) != null) return error;
            //Parse transformations block
        }

        
        if ((index = nodeNames.indexOf("animations")) == -1) return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX) this.onXMLMinorError("tag <animations> out of order");
            if ((error = this.parseAnimations(nodes[index])) != null) return error;
            //Parse animations block
        }


        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1) return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX) this.onXMLMinorError("tag <primitives> out of order");
            if ((error = this.parsePrimitives(nodes[index])) != null) return error;
            //Parse primitives block
        }

        
        // <components>
        if ((index = nodeNames.indexOf("components")) == -1) return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX) this.onXMLMinorError("tag <components> out of order");
            if ((error = this.parseComponents(nodes[index])) != null) return error;
            //Parse components block
        }
    }




    /**
     * ==== START PARSING FUNCTIONS ====
     * Originally implemented
     * Parses the <scene> block. 
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode)
    {
        // Get root of the scene.
        var root = this.reader.getString(sceneNode, 'root');
        if (root == null) return "no root defined for scene";

        this.idRoot = root;

        // Get axis length        
        var axis_length = this.reader.getFloat(sceneNode, 'axis_length');
        if (axis_length == null) this.onXMLMinorError("no axis_length defined for scene; assuming length=1");

        this.referenceLength = axis_length || 1;
        this.log("Parsed scene");
        return null;
    }


    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode)
    {
        this.defaultViewID = viewsNode.getAttribute("default");
        if (this.defaultViewID == null) this.onXMLMinorError("No default view defined.");
        
        this.views = [];
        this.defaultViewDefined = false;
        var children = viewsNode.children;

        for (var i = 0; i < children.length; ++i)
        {
            var childNode = children[i];
            var viewtype = childNode.nodeName;
            if (viewtype != 'ortho' && viewtype != 'perspective') {
                this.onXMLMinorError('unknown tag <' + viewtype + '>');
                continue;
            }

            //perspective/ortho children
            var id = childNode.getAttribute("id");
            if (id == null) this.onXMLMinorError("ID for " + viewtype + " view not specified");
            if (id == this.defaultViewID) this.defaultViewDefined = true;
            
            var near = this.reader.getFloat(children[i], "near"); //getFloat makes sure getAttribute doesnt have a string 
            if (near == null) this.onXMLMinorError("Near attribute for " + viewtype + " view not specified");
            var far = this.reader.getFloat(children[i], "far");
            if (far == null) this.onXMLMinorError("Far attribute for " + viewtype + " view not specified");


            // Reads the names of the nodes to an auxiliary buffer.
            var gcNodeNames = [];
            var grandChildren = childNode.children;
            for (var j = 0; j < grandChildren.length; j++)
                gcNodeNames.push(grandChildren[j].nodeName);

            var from, to;
            var fromx, fromy, fromz;
            var tox, toy, toz;
            
            from = childNode.getElementsByTagName("from");
            if(from.length == 0) this.onXMLMinorError("FROM element for " + viewtype + " view");
            else if (from.length > 1) this.onXMLMinorError("More than 1 FROM element for " + viewtype + " view");
            else {
                fromx = this.reader.getFloat(from[0], "x");
                fromy = this.reader.getFloat(from[0], "y");
                fromz = this.reader.getFloat(from[0], "z");
            }


            to = childNode.getElementsByTagName("to");
            if(to.length == 0) this.onXMLMinorError("FROM element for " + viewtype + " view");
            if(to.length > 1) this.onXMLMinorError("More than 1 FROM element for " + viewtype + " view");
            else {
                tox = this.reader.getFloat(to[0], "x");
                toy = this.reader.getFloat(to[0], "y");
                toz = this.reader.getFloat(to[0], "z");
            }


            //create structure w/ attributes common to ortho and pespective
            var currentView = {
                id: id, 
                near: near,
                far: far,
                from: vec3.fromValues(fromx, fromy, fromz), //this way we can pass from/to to CGFcamera()
                to: vec3.fromValues(tox, toy, toz),
            }

            //add exclusive attributes for each view type
            if (viewtype == "perspective") {
                var angle = this.reader.getFloat(children[i], "angle");
                if (angle == null) this.onXMLMinorError("no angle attribute for " + viewtype);
                currentView.type = "perspective";
                currentView.angle = angle;
            }

            else if (viewtype == "ortho") {
                var leftv = this.reader.getFloat(childNode, "left");
                var rightv = this.reader.getFloat(childNode, "right");
                var topv = this.reader.getFloat(childNode, "top");
                var bottomv = this.reader.getFloat(childNode, "bottom");

                var up = childNode.getElementsByTagName("up");
                var upx = this.reader.getFloat(up[0], "x");
                var upy = this.reader.getFloat(up[0], "y");
                var upz = this.reader.getFloat(up[0], "z");

                currentView.type = "ortho";
                currentView.left = leftv;
                currentView.right = rightv;
                currentView.top = topv;
                currentView.bottom = bottomv;
                currentView.up = vec3.fromValues(upx, upy, upz); //this way we can pass this to CGFcamera

            }
            this.views[id] = currentView;
        }
        if (this.defaultViewDefined == false) this.onXMLMinorError("Default View not defined");

        this.log("Parsed views");
        return null;
    }


    /**
     * Originally implemented
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode)
    {
        var children = ambientsNode.children;
        var nodeNames = [];

        this.ambient = [];
        this.background = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color)) return color;
        else this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color)) return color;
        else this.background = color;

        this.log("Parsed ambient");

        return null;
    }



    /**
     * Originally implemented
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode)
    {
        this.lights = [];
        var numLights = 0;
        var children = lightsNode.children;
        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++)
        {
            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["location", "ambient", "diffuse", "specular", "attenuation"]);
                attributeTypes.push(...["position", "color", "color", "color", "attenuation"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = false;

            var aux = this.reader.getString(children[i], 'enabled');
            if (aux == "1") enableLight = true;
            else if (aux == "0") enableLight = false;
            else this.onXMLMinorError("Value for 'enabled' field for " + lightId + " should be 0 or 1");

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            for (var j = 0; j < attributeNames.length; j++)
            {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") 
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else if (attributeTypes[j] == "attenuation")
                        var aux = this.parseAttenuationValues(grandChildren[attributeIndex], "light attenuation for ID" + lightId);                        
                    else var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j]+" illumination for ID"+lightId);

                    if (!Array.isArray(aux)) return aux;
                    global.push(aux);
                }
                else return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            // Gets the additional attributes of the spot light
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle of the light for ID = " + lightId;

                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent of the light for ID = " + lightId;

                var targetIndex = nodeNames.indexOf("target");

                // Retrieves the light target.
                var targetLight = [];
                if (targetIndex != -1) {
                    var aux = this.parseCoordinates3D(grandChildren[targetIndex], "target light for ID " + lightId);
                    if (!Array.isArray(aux)) return aux;
                    targetLight = aux;
                }
                else return "light target undefined for ID = " + lightId;

                global.push(...[angle, exponent, targetLight])
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0) return "at least one light must be defined";
        else if (numLights > 8) this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }



    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode)
    {
        //For each texture in textures block, check ID and file URL
        var children = texturesNode.children;
        this.numtextures = 0;
        this.textures = [];
        
        // Any number of textures.
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "texture") continue;

            // Gets the texture id
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) return "No ID";
            if (this.textures[textureID] != null) return "ID's must be unique";

            // Checking for a valid file
            var file = this.reader.getString(children[i], 'file');
            if(file == null) return "No file defined for " + textureID;

            // Checking if file exists
            var reader = new File([""], file);
            if(reader.fileSize == undefined && reader.size == undefined)
                return "File doesnt exist for " + textureID;

            // Checking extension 
            var png = file.match(/\.png$/i);
            var jpg = file.match(/\.jpg$/i);
            if(jpg == null && png == null) 
                return "Invalid file extension for " + textureID;

            var texture = new CGFtexture(this.scene, file);
            this.textures[textureID] = texture;
            this.numtextures++;
        }
        
        if(this.numtextures == 0) return "No textures were defined.";
        this.log("Parsed Textures");
        return null;
    }



    /**
     * Done
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode)
    {
        var children = materialsNode.children;
        this.materials = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], "id");
            if (materialID == null) return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            // get shininess for material and check for errors
            var shininess = this.reader.getFloat(children[i], "shininess");
            if (shininess == null) return "no shininess defined for material w/ ID: " + materialID;

            // get emission for material and check for errors, then parse color into list
            var emission = children[i].getElementsByTagName("emission"); //get rgba
            if (emission.length == 0) return "no emission specified for material w/ ID: " + materialID;
            else emission = this.parseColor(emission[0], "emission in " + materialID + "has an incorrect format");

            // get ambient for material and check for errors, then parse color into list
            var ambient = children[i].getElementsByTagName("ambient"); //get rgba
            if (ambient.length == 0) return "no ambient specified for material w/ ID: " + materialID;
            else ambient = this.parseColor(ambient[0], "ambient in " + materialID + "has an incorrect format");
            
            // get diffuse for material and check for errors, then parse color into list
            var diffuse = children[i].getElementsByTagName("diffuse"); //get rgba
            if (diffuse.length == 0) return "no diffuse specified for material w/ ID: " + materialID;
            else diffuse = this.parseColor(diffuse[0], "diffuse in " + materialID + "has an incorrect format");
            
            // get specular for material and check for errors, then parse color into list
            var specular = children[i].getElementsByTagName("specular"); //get rgba
            if (specular.length == 0) return "no specular specified for material w/ ID: " + materialID;
            else specular = this.parseColor(specular[0], "specular in " + materialID + "has an incorrect format");


            // build final material with all attributes
            var material = new MyMaterial(shininess, emission, ambient, diffuse, specular);
            var mat = new CGFappearance(this.scene);
            material.apply(mat);
            this.materials[materialID] = mat;
        }

        this.log("Parsed materials");
        return null;
    }

    

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode)
    {
        this.transformations = [];                      //fill this
        var children = transformationsNode.children;    //transformation block
        var grandChildren = [];                         //transformation type

        // Any number of transformations.
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null) return "no ID defined for transformation";
            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null) 
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";


            var transfMatrix = mat4.create();
            var transformation;
            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++)
            {
                transformation = grandChildren[j];
                switch (transformation.nodeName) {
                    case 'translate': transfMatrix = this.parseTranslate(transfMatrix, transformation, transformationID); break;
                    case 'rotate': transfMatrix = this.parseRotate(transfMatrix, transformation, transformationID); break;
                    case 'scale': transfMatrix = this.parseScale(transfMatrix, transformation, transformationID); break;
                    
                    default: this.onXMLMinorError("transformation '" + transformation.nodeName + "' is invalid"); break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }

    

    /**
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode)
    {
        this.transformations = [];                      //fill this
        var children = transformationsNode.children;    //transformation block
        var grandChildren = [];                         //transformation type

        // Any number of transformations.
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null) return "no ID defined for transformation";
            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null) return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";


            var transfMatrix = mat4.create();
            var transformation;
            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++)
            {
                transformation = grandChildren[j];
                switch (transformation.nodeName) {
                    case 'translate': transfMatrix = this.parseTranslate(transfMatrix, transformation, transformationID); break;
                    case 'rotate': transfMatrix = this.parseRotate(transfMatrix, transformation, transformationID); break;
                    case 'scale': transfMatrix = this.parseScale(transfMatrix, transformation, transformationID); break;
                    
                    default: this.onXMLMinorError("transformation '" + transformation.nodeName + "' is invalid"); break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }


    parseAnimations(animationNode)
    {
        var children = animationNode.children;
        var grandChildren = [];      //keyframes
        this.animations = [];

        for (var i = 0; i < children.length; i++)
        {
            let keyframes = [];
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var animationID = this.reader.getString(children[i], "id");
            if (animationID == null) return "no ID defined for animation";

            // Checks for repeated IDs.
            if (this.animations[animationID] != null)
                return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

            grandChildren = children[i].children;
            if(grandChildren.length == 0) return "no keyframes defined for animation " + children[i];
            for (var j = 0; j < grandChildren.length; j++)
            {
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }

                var keyframeInstant = this.reader.getFloat(grandChildren[j], "instant");
                if (keyframeInstant == null) return "no instant defined for keyframe";
                
                keyframes.push(this.parseKeyframe(grandChildren[j], keyframeInstant));
            }
            this.animations[animationID] = new KeyframeAnimation(this.scene, animationID, keyframes);
        }
            this.log("Parsed animations");
            return null;
    }


    parseKeyframe(keyframe, keyframeInstant)
    {
        //keyframe: 0 -> translate, 1-> rotate, 2 -> scale
        var translate = []; 
        var rotate = []; 
        var scale = [];

        var T = keyframe.getElementsByTagName("translate");
        translate.push(parseFloat(T[0].getAttribute("x")));
        translate.push(parseFloat(T[0].getAttribute("y")));
        translate.push(parseFloat(T[0].getAttribute("z")));

        var R = keyframe.getElementsByTagName("rotate");
        rotate.push(parseFloat(R[0].getAttribute("angle_x")));
        rotate.push(parseFloat(R[0].getAttribute("angle_y")));
        rotate.push(parseFloat(R[0].getAttribute("angle_z")));    

        var S = keyframe.getElementsByTagName("scale");
        scale.push(parseFloat(S[0].getAttribute("x")));
        scale.push(parseFloat(S[0].getAttribute("y")));
        scale.push(parseFloat(S[0].getAttribute("z")));

        return new Keyframe(translate, rotate, scale, keyframeInstant);
    }


    /**
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode)
    {
        var children = primitivesNode.children;
        var grandChildren = [];
        this.primitives = [];

        // Any number of primitives.
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveID = this.reader.getString(children[i], 'id');
            if (primitiveID == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveID] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveID + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            var primitiveType = grandChildren[0].nodeName;
            if (grandChildren.length != 1 || 
                (primitiveType != 'rectangle' && 
                 primitiveType != 'triangle'  && 
                 primitiveType != 'cylinder'  && 
                 primitiveType != 'cylinder2' &&
                 primitiveType != 'sphere'    &&
                 primitiveType != 'torus'     &&
                 primitiveType != 'gameboard' &&
                 primitiveType != 'painting'  &&
                 primitiveType != 'plant'     &&
                 primitiveType != 'plane'     &&
                 primitiveType != 'drawer'    &&
                 primitiveType != 'patch')) return "Invalid primitive type";
    
            // Specifications for the current primitive.
            var primitiveType = grandChildren[0].nodeName;


            // Retrieves the primitive coordinates.
            if (primitiveType == 'rectangle')
            {
                let x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (x1 == null && isNaN(x1))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveID;

                let y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (y1 == null || isNaN(y1))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveID;

                let x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (x2 == null || isNaN(x2) || x2 < x1)
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveID;

                let y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (y2 == null || isNaN(y2) || y2 < y1)
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveID;

                let bothSides = this.reader.getString(grandChildren[0], 'bothSides');
                if(bothSides == "true") bothSides = true;
                else bothSides = false;

                let rect = new MyRectangle(this.scene, primitiveID, x1, x2, y1, y2, bothSides);
                this.primitives[primitiveID] = rect;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'triangle')
            {
                let x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (x1 == null || isNaN(x1)) 
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveID;

                let x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (x2 == null || isNaN(x2)) 
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveID;

                let x3 = this.reader.getFloat(grandChildren[0], 'x3');
                if (x3 == null || isNaN(x3)) 
                    return "unable to parse x3 of the primitive coordinates for ID = " + primitiveID;

                let y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (y1 == null || isNaN(y1)) 
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveID;

                let y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (y2 == null || isNaN(y2)) 
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveID;

                let y3 = this.reader.getFloat(grandChildren[0], 'y3');
                if (y3 == null || isNaN(y3)) 
                    return "unable to parse y3 of the primitive coordinates for ID = " + primitiveID;

                let z1 = this.reader.getFloat(grandChildren[0], 'z1');
                if (z1 == null || isNaN(z1)) 
                    return "unable to parse z1 of the primitive coordinates for ID = " + primitiveID;

                let z2 = this.reader.getFloat(grandChildren[0], 'z2');
                if (z2 == null || isNaN(z2)) 
                    return "unable to parse z2 of the primitive coordinates for ID = " + primitiveID;

                let z3 = this.reader.getFloat(grandChildren[0], 'z3');
                if (z3 == null || isNaN(z3)) 
                    return "unable to parse z3 of the primitive coordinates for ID = " + primitiveID;      
                    
                let v1 = [], v2 = [], v3 = [];
                v1.push(x1, x2, x3); v2.push(y1, y2, y3); v3.push(z1, z2, z3);
                let tri = new MyTriangle(this.scene, primitiveID, v1, v2, v3);
                this.primitives[primitiveID] = tri;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'sphere')
            {
                let radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (radius == null || isNaN(radius) || radius < 0)
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveID;

                let slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (slices == null || isNaN(slices) || slices < 0)
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveID;

                let stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (stacks == null || isNaN(stacks) || stacks < 0) 
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveID;

                let sph = new MySphere(this.scene, primitiveID, radius, slices, stacks);
                this.primitives[primitiveID] = sph;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'torus')
            {
                let inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (inner == null || isNaN(inner) || inner < 0)
                    return "unable to parse INNER radius of the primitive coordinates for ID = " + primitiveID;

                let outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (outer == null || isNaN(outer) || outer < 0)
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveID;

                let slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (slices == null || isNaN(slices) || slices < 1)
                    return "unable to parse SLICES of the primitive coordinates for ID = " + primitiveID;

                let loops = this.reader.getInteger(grandChildren[0], 'loops');
                if (loops == null || isNaN(loops) || loops < 1)
                    return "unable to parse LOOPS of the primitive coordinates for ID = " + primitiveID;

                let tor = new MyTorus(this.scene, primitiveID, slices, loops, inner, outer);
                this.primitives[primitiveID] = tor;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'cylinder')
            {
                let slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (slices == null || isNaN(slices) || slices < 1)
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveID;

                let stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (stacks == null || isNaN(stacks) || stacks < 1)
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveID;

                let base = this.reader.getFloat(grandChildren[0], 'base');
                if (base == null || isNaN(base) || base <= 0)
                    return "unable to parse base radius of the primitive coordinates for ID = " + primitiveID;

                let top = this.reader.getFloat(grandChildren[0], 'top');
                if (top == null || isNaN(top) || top <= 0)
                    return "unable to parse top radius of the primitive coordinates for ID = " + primitiveID;

                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (height == null || isNaN(height) || height <= 0)
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveID;

                let bothSides = this.reader.getString(grandChildren[0], 'bothSides');
                if (bothSides == "true") bothSides = true;
                else bothSides = false;

                let cyli = new MyCylinder(this.scene, primitiveID, slices, stacks, base, top, height, bothSides);
                this.primitives[primitiveID] = cyli;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'plane')
            {
                let UDivs = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (UDivs == null || isNaN(UDivs) || UDivs < 0)
                    return "unable to parse INNER radius of the primitive coordinates for ID = " + primitiveID;

                let VDivs = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (VDivs == null || isNaN(VDivs) || VDivs < 0)
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveID;

                let plane = new Plane(this.scene, primitiveID, UDivs, VDivs);
                this.primitives[primitiveID] = plane;
            }
            // -----------------------------------------------------------------------------------------
            else if(primitiveType == 'patch')
            {
                let UDivs = this.reader.getInteger(grandChildren[0], 'npartsU');
                if (UDivs == null || isNaN(UDivs) || UDivs < 0)
                    return "unable to parse INNER radius of the primitive coordinates for ID = " + primitiveID;

                let VDivs = this.reader.getInteger(grandChildren[0], 'npartsV');
                if (VDivs == null || isNaN(VDivs) || VDivs < 0)
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveID;

                let nUControl = this.reader.getInteger(grandChildren[0], 'npointsU');
                if (nUControl == null || isNaN(nUControl) || nUControl < 1)
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveID;

                let nVControl = this.reader.getInteger(grandChildren[0], 'npointsV');
                if (nVControl == null || isNaN(nVControl) || nVControl < 1)
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveID;

                //build control array
                var controlxml = grandChildren[0].children;
                var CA = [];

                for(var j=0; j<controlxml.length; j++)
                {
                    var cpx = this.reader.getFloat(controlxml[j], 'xx');
                    var cpy = this.reader.getFloat(controlxml[j], 'yy');
                    var cpz = this.reader.getFloat(controlxml[j], 'zz');
                    CA.push(cpx, cpy, cpz, 1.0);
                }
                
                var c = 0;
                var parsedControl = [], vmatrix = [];
                for(var j=0; j < nUControl; j++)
                {
                    for(var k=0; k < nVControl; k++)
                    {
                        vmatrix.push( [ CA[c], CA[c+1], CA[c+2], CA[c+3] ] );
                        c+=4;
                    }
                    parsedControl.push(vmatrix);
                    vmatrix = [];
                }

                var patch = new Patch(this.scene, primitiveID, nUControl, nVControl, UDivs, VDivs, parsedControl);
                this.primitives[primitiveID] = patch;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'cylinder2') {
                let slices = this.reader.getInteger(grandChildren[0], 'slices');
                if (slices == null || isNaN(slices) || slices < 1)
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveID;

                let stacks = this.reader.getInteger(grandChildren[0], 'stacks');
                if (stacks == null || isNaN(stacks) || stacks < 1)
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveID;

                let base = this.reader.getFloat(grandChildren[0], 'base');
                if (base == null || isNaN(base) || base <= 0)
                    return "unable to parse base radius of the primitive coordinates for ID = " + primitiveID;

                let top = this.reader.getFloat(grandChildren[0], 'top');
                if (top == null || isNaN(top) || top <= 0)
                    return "unable to parse top radius of the primitive coordinates for ID = " + primitiveID;

                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (height == null || isNaN(height) || height <= 0)
                    return "unable to parse height of the primitive coordinates for ID = " + primitiveID;

                let cyli2 = new MyCylinder2(this.scene, primitiveID, slices, stacks, base, top, height);
                this.primitives[primitiveID] = cyli2;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'gameboard') {
                let x = this.reader.getFloat(grandChildren[0], 'x');
                if (x == null || isNaN(x))
                    return "unable to parse x coord for game board | ID = " + primitiveID;

                let y = this.reader.getFloat(grandChildren[0], 'y');
                if (y == null || isNaN(y))
                    return "unable to parse x coord for game board | ID = " + primitiveID;

                let width = this.reader.getFloat(grandChildren[0], 'width');
                if (width == null || isNaN(width) || width <= 0)
                    return "unable to parse width for game board | ID = " + primitiveID;

                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (height == null || isNaN(height))
                    return "unable to parse height for game board | ID = " + primitiveID; 

                let depth = this.reader.getFloat(grandChildren[0], 'depth');
                if (depth == null || isNaN(depth))
                    return "unable to parse depth for game board | ID = " + primitiveID; 

                let board = new GameBoard(this.scene, primitiveID, x, y, width, depth, height);
                this.primitives[primitiveID] = board;
            }
            // -----------------------------------------------------------------------------------------
            else if (primitiveType == 'painting') {
                let x = this.reader.getFloat(grandChildren[0], 'x');
                if (x == null || isNaN(x))
                    return "unable to parse x coord for painting | ID = " + primitiveID;

                let y = this.reader.getFloat(grandChildren[0], 'y');
                if (y == null || isNaN(y))
                    return "unable to parse x coord for painting | ID = " + primitiveID;

                let width = this.reader.getFloat(grandChildren[0], 'width');
                if (width == null || isNaN(width) || width <= 0)
                    return "unable to parse width for painting | ID = " + primitiveID;

                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (height == null || isNaN(height))
                    return "unable to parse height for painting | ID = " + primitiveID;

                let depth = this.reader.getFloat(grandChildren[0], 'depth');
                if (depth == null || isNaN(depth))
                    return "unable to parse depth for painting | ID = " + primitiveID;

                let paint = new Painting(this.scene, primitiveID, x, y, width, depth, height);
                this.primitives[primitiveID] = paint;
            }
            else if(primitiveType == 'plant') {
                let plant = new Plant(this.scene);
                this.primitives[primitiveID] = plant;
            }
            else if(primitiveType == 'drawer') {
                let drawers = new Drawers(this.scene);
                this.primitives[primitiveID] = drawers;
            }

            else console.warn("TO DO: Parse remaining primitives");
        }

        this.log("Parsed primitives");
        return null;
    }
    
    
    
    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) 
    {
        this.components = [];                   //will have all components (MyComponent objects)
        this.allComponentIDs = [];              //will have all component IDs under "<components>"
        var children = componentsNode.children; //children has all components
        var grandChildren = [];
        var grandgrandChildren = [];
        var componentNodeNames = [];            //vector with the node names inside each <component>
        
        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "component") { 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">"); 
                continue; 
            }

            var ID = this.reader.getString(children[i], "id"); // Get id of component[i].
            if (ID == null) return "no ID defined for component ID";
            this.allComponentIDs[i] = ID;
        }


        for (var i = 0; i < children.length; i++)
        {
            var componentID = this.allComponentIDs[i];       // Get current id from previous ids vector
            if (this.components[componentID] != null)   // Checks repeated ids
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;   //grab current component children
            componentNodeNames = [];                //empty component node names array
            for (var j = 0; j < grandChildren.length; j++) componentNodeNames.push(grandChildren[j].nodeName);

            var transformationIndex = componentNodeNames.indexOf("transformation");
            var animationIndex      = componentNodeNames.indexOf("animationref");
            var materialsIndex      = componentNodeNames.indexOf("materials");
            var textureIndex        = componentNodeNames.indexOf("texture");
            var childrenIndex       = componentNodeNames.indexOf("children");



            //TRANSFORMATIONS SECTION
            var transfMatrix = mat4.create(); //build
            grandgrandChildren = grandChildren[transformationIndex].children;

            for (var j = 0; j < grandgrandChildren.length; j++) {
                var transformation = grandgrandChildren[j];
                switch (transformation.nodeName)
                {
                    case 'translate': transfMatrix = this.parseTranslate(transfMatrix, transformation, componentID); break;
                    case 'rotate': transfMatrix = this.parseRotate(transfMatrix, transformation, componentID); break;
                    case 'scale': transfMatrix = this.parseScale(transfMatrix, transformation, componentID); break;

                    case 'transformationref':
                        var transRefID = this.reader.getString(transformation, "id");
                        if (this.transformations[transRefID] == null) this.onXMLMinorError("transformationref '" + transRefID + "' not found");
                        transfMatrix = mat4.multiply(transfMatrix, transfMatrix, this.transformations[transRefID]);
                      break;

                    default: this.onXMLMinorError("unknown transformation <" + transformation.nodeName + ">"); break;
                }
            }

            //ANIMATIONS SECTION
            if(animationIndex != -1) var animationID = this.reader.getString(grandChildren[animationIndex], "id");
            else animationID = null;

            //MATERIALS SECTION
            grandgrandChildren = grandChildren[materialsIndex].children;
            var materialscomp = [];

            for (var j = 0; j < grandgrandChildren.length; j++)
            {
                var material = grandgrandChildren[j];
                if (material.nodeName != "material") {
                    this.onXMLMinorError("unknown material <" + material.nodeName + ">");
                    continue;
                }

                var materialID = this.reader.getString(material, "id");
                if (materialID == null){
                    this.onXMLMinorError("no ID defined for material in component: " + componentID);
                    continue;
                }
                else if (materialID == "inherit") materialscomp.push("inherit");

                else if (!this.materials[materialID]) {
                    this.onXMLMinorError("material w/ ID " + materialID + " in component: " + componentID + " doesn't exist");
                    continue;
                }
                else materialscomp.push(this.materials[materialID]);
            }

            //never var any component not have a material
            if (materialscomp.length == 0){
                this.onXMLError("No material correctly defined for '"+componentID+"' component. Applying default material to this component.");
                materialscomp = this.materials["defaultMAT"];
            } 
            var materials = { current: 0, materials: materialscomp }; //build




            //TEXTURES SECTION
            var textureNode = grandChildren[textureIndex];
            var tex; //tex string
            var ls = null, lt = null;
            
            var texID = this.reader.getString(textureNode, "id");
            if(texID == null) { this.onXMLError("No texture ID in component " + componentID); return null; }
            else if (texID == "inherit"){
                tex = "inherit";
                ls = this.reader.getFloat(textureNode, "length_s");
                lt = this.reader.getFloat(textureNode, "length_t");
            }
            else if(texID == "none") { 
                tex = null;
                ls = this.reader.getFloat(textureNode, "length_s");
                lt = this.reader.getFloat(textureNode, "length_t");
            }
            else if(this.textures[texID] == null){
                this.onXMLError("Texture w/ ID " + texID + " in component: " + componentID + " doesn't exist");
                return null;
            }
            else 
            { 
                tex = this.textures[texID];
                ls = this.reader.getFloat(textureNode, "length_s");
                lt = this.reader.getFloat(textureNode, "length_t");
                
                if (ls == null || ls == undefined) { this.onXMLMinorError("length_s not specified in " + componentID); ls = 1.0; }
                if (lt == null || lt == undefined) { this.onXMLMinorError("length_t not specified in " + componentID); lt = 1.0; }
            }
            //build texture
            var texture = {texture: tex, ls: ls, lt: lt}; 
            
            //CHILDREN SECTION
            var componentChildren = []; //string names of component children
            var primitiveChildren = []; //string names of component children

            grandgrandChildren = grandChildren[childrenIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++) 
            {
                if (grandgrandChildren[j].nodeName == "componentref")
                {
                    var componentref = this.reader.getString(grandgrandChildren[j], 'id');
                    if (componentref == null) return "unable to parse componentref id of component ID " + componentID;
                    if (this.allComponentIDs.indexOf(componentref) == -1)
                        return "no such component with componentref id for component ID " + componentID;
                    componentChildren.push(this.components[componentref]);
                }
                else if (grandgrandChildren[j].nodeName == "primitiveref")
                {

                    var primitiveref = this.reader.getString(grandgrandChildren[j], 'id');
                    if (primitiveref == null) {
                        return "unable to parse primitiveref id of component ID " + componentID;
                    }
                    if (this.primitives[primitiveref] == null) {
                        return "no such primitive with ID " + primitiveref + " for component ID " + componentID;
                    }
                    primitiveChildren.push(this.primitives[primitiveref]);
                }
                else this.onXMLMinorError("component children must be componentref or primitiveref");
            }

            // ============= BUILD COMPONENT AND IT TO COMPONENT LIST =============
            this.components[componentID] = new MyComponent(this.scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, animationID);
            // ====================================================================
        }
        
        // //alert if top root isn't defined or properly read (XML error for example)
        if (this.components[this.idRoot] == null) return "root component ID '" + this.idRoot + "' not defined";
    }



    /**
     * Originally Implemented
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
        return "unable to parse R component of the " + messageError;

        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
        return "unable to parse G component of the " + messageError;
        
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
        return "unable to parse B component of the " + messageError;

        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
        return "unable to parse A component of the " + messageError;
        
        color.push(...[r, g, b, a]);
        return color;
    }

    /**
     * Originally Implemented
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError)
    {
        var position = [];
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x))) return "unable to parse x-coordinate of the " + messageError;

        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y))) return "unable to parse y-coordinate of the " + messageError;
        
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z))) return "unable to parse z-coordinate of the " + messageError;
        
        position.push(...[x, y, z]);
        return position;
    }

    /**
     * Originally Implemented
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) 
    {
        var position = [];
        position = this.parseCoordinates3D(node, messageError); //Get x, y, z

        if (!Array.isArray(position)) return position;
        
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w))) return "unable to parse w-coordinate of the " + messageError;
        
        position.push(w);
        return position;
    }
      
    parseTranslate(matrix, transformation, transformationID) {
        var args = this.parseCoordinates3D(transformation, transformationID); //parse translate arguments
        if (!Array.isArray(args)) {
            this.onXMLError("Error while parsing coords (" + args + ") in: " + transformationID);
            return matrix;
        }

        matrix = mat4.translate(matrix, matrix, args);
        return matrix;
    }

    parseScale(matrix, transformation, transformationID) {
        var args = this.parseCoordinates3D(transformation, transformationID); //parse scale arguments
        if (!Array.isArray(args)) {
            this.onXMLError("Error parsing (" + args + ") in: " + transformationID);
            return matrix;
        }

        matrix = mat4.scale(matrix, matrix, args);
        return matrix;
    }

    parseRotate(matrix, transformation, transformationID) {
        var angle, axis;
        angle = this.reader.getFloat(transformation, "angle");
        axis = this.reader.getString(transformation, "axis");

        switch (axis) {
            case "x": matrix = mat4.rotateX(matrix, matrix, DEGREE_TO_RAD * angle); break;
            case "y": matrix = mat4.rotateY(matrix, matrix, DEGREE_TO_RAD * angle); break;
            case "z": matrix = mat4.rotateZ(matrix, matrix, DEGREE_TO_RAD * angle); break;
            default: this.onXMLError(axis + " invalid for ", transformationID + ". USE 'x', 'y' or 'z'"); break;
        }
        return matrix;
    }
    
    parseAttenuationValues(node, msg){
        var values = [];
        var constant = this.reader.getFloat(node, 'constant');
        if (constant == null || isNaN(constant)) return "unable to parse constant "+msg;
        if (constant > 1) constant = 1.0;

        var linear = this.reader.getFloat(node, 'linear');
        if (linear == null || isNaN(linear)) return "unable to parse linear "+msg;
        if (linear > 1) linear = 1.0;

        var quadratic = this.reader.getFloat(node, 'quadratic');
        if (quadratic == null || isNaN(quadratic)) return "unable to parse quadratic "+msg;
        if (quadratic > 1) quadratic = 1.0;

        values.push(...[constant, linear, quadratic]);
        return values;
    }



    /** Displays the scene, processing each node, starting in the root node. */
    displayScene() { this.traverseGraph(this.components[this.idRoot], this.components[this.idRoot].materials, this.components[this.idRoot].texture); }


    traverseGraph(component, parentMat, parentTex)
    {
        let currentnode = component;
        let children = currentnode.compchildren;
        let leaves = currentnode.leaves;
        let ls, lt, TEX, MATS; //to be passed on
        if (currentnode.texture.texture == "none"){
            TEX = null;
            ls = null;
            lt = null; 
        }

        else if (currentnode.texture.texture == "inherit"){
            TEX = parentTex;
            currentnode.texture.texture = parentTex.texture;
            ls = currentnode.texture.ls; //dont inherit ls (rule)
            lt = currentnode.texture.lt; //dont inherit ls (rule)
        }
        else {
            TEX = currentnode.texture;
            ls = currentnode.texture.ls;
            lt = currentnode.texture.lt;
        }

        if (currentnode.materials.materials != "inherit"){
            MATS = currentnode.materials;
        }
        else{
            currentnode.materials.materials = parentMat.materials;
            MATS = parentMat;
        }

        let currentTexture = currentnode.texture.texture;
        let currentMaterial = currentnode.materials.materials[currentnode.materials.current];

        currentMaterial.setTexture(currentTexture);
        currentMaterial.setTextureWrap('REPEAT', 'REPEAT');
        currentMaterial.apply();
        if(currentTexture != null) currentTexture.bind();
        this.scene.multMatrix(currentnode.transfMatrix);
        if(currentnode.animationID != null) {
            // apply animation matrix if node has animation
            this.animations[currentnode.animationID].apply();
        }

        for (let key in leaves)
        {
            this.scene.pushMatrix();
            leaves[key].display(ls, lt);
            this.scene.popMatrix();
        }
        
        for(let key in children)
        {
            this.scene.pushMatrix();
            this.traverseGraph(children[key], MATS, TEX);
            this.scene.popMatrix();
        }

        if(currentTexture!=null) currentTexture.unbind();
    }


    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) { console.error("❌ XML Loading Error: " + message); this.loadedOk = false; }



    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) { console.warn("⚠️ Warning: " + message); }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) { console.log("✔️ " + message + ""); }
}
// ==================================================================================================
/**
 * @constructor
 */
class MyComponent extends CGFobject
{
    /**
	 * Represents an intermediate node aka component
	 * @param {CGFscene} scene main scene
     * @param componentID node/component ID
     * @param materials materials
     * @param transfMatrix transformation matrix
     * @param texture texture applied to the component
     * @param children component children of the node/component
     * @param leaves primitive children of the node/component (leaves)
     * @param animationID
	 */

    constructor(scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, animationID = null) {
        super(scene);
        this.componentID = componentID;
        this.materials = materials; //has current and materials
        this.transfMatrix = transfMatrix;
        this.texture = texture; //has texture, length_t and length_s
        this.compchildren = componentChildren;
        this.leaves = primitiveChildren;
        this.animationID = animationID;
    }
}
// ==================================================================================================
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
        appearance.setShininess(this.shininess); //one number
        appearance.setEmission(...this.emission);
        appearance.setAmbient(...this.ambient);
        appearance.setDiffuse(...this.diffuse);
        appearance.setSpecular(...this.specular);
    }
}