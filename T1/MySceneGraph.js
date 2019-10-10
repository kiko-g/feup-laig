var DEGREE_TO_RAD = Math.PI / 180;
// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var GLOBALS_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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
        scene.graph = this;     // Establish bidirectional references between scene and graph.
        this.nodes = [];        // unused
        this.idRoot = null;     // The id of the root element.

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
        this.scene.onGraphLoaded();
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
        var nodes = rootElement.children;
        var nodeNames = [];
        for (let i = 0; i < nodes.length; i++)
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

        this.log("=== All blocks parsed ===");
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
        let defaultViewID = viewsNode.getAttribute("default");
        if (defaultViewID == null) this.onXMLMinorError("No default view defined.");
        
        this.views = [];
        let defaultViewDefined = false;
        let children = viewsNode.children;

        for (let i = 0; i < children.length; ++i)
        {
            let childNode = children[i];
            let viewtype = childNode.nodeName;
            if (viewtype != 'ortho' && viewtype != 'perspective') {
                this.onXMLMinorError('unknown tag <' + viewtype + '>');
                continue;
            }

            //perspective/ortho children
            let id = childNode.getAttribute("id");
            if (id == null) this.onXMLMinorError("ID for " + viewtype + " view not specified");
            if (id == defaultViewID) defaultViewDefined = true;
            
            let near = childNode.getAttribute("near");
            if (near == null) this.onXMLMinorError("Near attribute for " + viewtype + " view not specified");
            let far = childNode.getAttribute("far");
            if (far == null) this.onXMLMinorError("Far attribute for " + viewtype + " view not specified");



            // Reads the names of the nodes to an auxiliary buffer.
            let nodeNames = [];
            let grandChildren = childNode.children;
            for (let j = 0; j < grandChildren.length; j++) nodeNames.push(grandChildren[j].nodeName);

            let from, to;
            let fromx, fromy, fromz;
            let tox, toy, toz;
            
            from = childNode.getElementsByTagName("from");
            if(from.length == 0) this.onXMLMinorError("FROM element for " + viewtype + " view");
            else if (from.length > 1) this.onXMLMinorError("More than 1 FROM element for " + viewtype + " view");
            else {
                fromx = from[0].getAttribute("x");
                fromy = from[0].getAttribute("y");
                fromz = from[0].getAttribute("z");
            }


            to = childNode.getElementsByTagName("to");
            if(to.length == 0) this.onXMLMinorError("FROM element for " + viewtype + " view");
            if(to.length > 1) this.onXMLMinorError("More than 1 FROM element for " + viewtype + " view");
            else {
                tox = to[0].getAttribute("x");
                toy = to[0].getAttribute("y");
                toz = to[0].getAttribute("z");
            }


            //create object with currentView to add to our views array
            let currentView = { 
                id: id, 
                near: near,
                far: far,
                from: { x: fromx, y: fromy, z: fromz },
                to: { x: tox, y: toy, z: toz }
            }


            if (viewtype == "perspective") {
                let angle = childNode.getAttribute("angle");
                if (angle == null) this.onXMLMinorError("no angle attribute for " + viewtype);
                currentView.type = "perspective";
                currentView.angle = angle;
            }
            else if (viewtype == "ortho") {
                let viewTop = childNode.getAttribute("top");
                let viewBottom = childNode.getAttribute("bottom");
                let viewLeft = childNode.getAttribute("left");
                let viewRight = childNode.getAttribute("right");

                let up = childNode.child.getElementsByTagName("up");
                let upX = up[0].getAttribute("x");
                let upY = up[0].getAttribute("y");
                let upZ = up[0].getAttribute("z");

                currentView.type = "ortho";
                currentView.angle = angle;
                currentView.top = viewTop;
                currentView.bottom = viewBottom;
                currentView.left = viewLeft;
                currentView.right = viewRight;
                currentView.up = { x: upX, y: upY, z: upZ };
            }
            this.views.push(currentView);
        }
        if (this.views.length == 0) this.onXMLError("No views loaded from XML");
        if (defaultViewDefined == false) this.onXMLMinorError("Default View not defined");

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
        let children = ambientsNode.children;
        let nodeNames = [];

        this.ambient = [];
        this.background = [];

        for (let i = 0; i < children.length; i++)
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
        let nodeNames = [];

        // Any number of lights.
        for (let i = 0; i < children.length; i++)
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
                attributeNames.push(...["location", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getBoolean(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == true || aux == false)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");

            enableLight = aux || 1;

            //Add enabled boolean and type name to light info
            global.push(enableLight);
            global.push(children[i].nodeName);

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (let j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            for (let j = 0; j < attributeNames.length; j++)
            {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "position") 
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else 
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j]+" illumination for ID"+lightId);

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

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }



    /**
     * Probably done.
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode)
    {
        //For each texture in textures block, check ID and file URL
        let children = texturesNode.children;
        let numTextures = 0;
        this.textures = [];
        
        // Any number of textures.
        for (let i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "texture") continue;

            // Gets the texture id
            let textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) return "No ID";
            if (this.textures[textureID] != null) return "ID's must be unique";

            // Checking for a valid file
            let file = this.reader.getString(children[i], 'file');
            if(file == null) return "No file defined for " + textureID;

            // Checking if file exists
            let reader = new File([""], file);
            if(reader.fileSize == undefined && reader.size == undefined)
                return "File doesnt exist for " + textureID;

            // Checking extension 
            let png = file.match(/\.png$/i);
            let jpg = file.match(/\.jpg$/i);
            if(jpg == null && png == null) 
                return "Invalid file extension for " + textureID;

            let texture = new CGFtexture(this.scene, file);
            this.textures[textureID] = texture;

            numTextures++;
        }

        if(numTextures == 0) return "No textures were defined.";
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
            if (shininess == null) return "no shininess defined for material with ID: " + materialID;

            // get emission for material and check for errors, then parse color into list
            var emission = children[i].getElementsByTagName("emission"); //get rgba
            if (emission.length == 0) return "no emission specified for materia with ID: " + materialID;
            else emission = this.parseColor(emission[0], "emission in " + materialID + "has an incorrect format");

            // get ambient for material and check for errors, then parse color into list
            var ambient = children[i].getElementsByTagName("ambient"); //get rgba
            if (ambient.length == 0) return "no ambient specified for materia with ID: " + materialID;
            else ambient = this.parseColor(ambient[0], "ambient in " + materialID + "has an incorrect format");
            
            // get diffuse for material and check for errors, then parse color into list
            var diffuse = children[i].getElementsByTagName("diffuse"); //get rgba
            if (diffuse.length == 0) return "no diffuse specified for materia with ID: " + materialID;
            else diffuse = this.parseColor(diffuse[0], "diffuse in " + materialID + "has an incorrect format");
            
            // get specular for material and check for errors, then parse color into list
            var specular = children[i].getElementsByTagName("specular"); //get rgba
            if (specular.length == 0) return "no specular specified for materia with ID: " + materialID;
            else specular = this.parseColor(specular[0], "specular in " + materialID + "has an incorrect format");


            // build final material with all attributes
            var material = new MyMaterial(shininess, emission, ambient, diffuse, specular);
            // console.log("MATS: "+ material.emission);
            this.materials[materialID] = material;
        }

        this.log("Parsed materials");
        return null;
    }



    /**
     * Done.
     * Parses the <transformations> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode)
    {
        let children = transformationsNode.children;
        let grandChildren = [];
        this.transformations = [];

        // Any number of transformations.
        for (let i=0; i < children.length; i++)
        {
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            let transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            let transfMatrix = mat4.create();

            for (let j=0; j < grandChildren.length; j++) 
            {
                switch (grandChildren[j].nodeName)
                {
                    case 'translate':
                        let coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;
                        
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                       break;

                    case 'scale':
                        let coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                       break;

                    case 'rotate':
                        let axis = this.reader.getString(grandChildren[j], "axis");
                        if(axis == null){
                            this.onXMLMinorError("Axis unspecified");
                            break;
                        }
                        
                        let angle = this.reader.getString(grandChildren[j], "angle");
                        if(angle == null){
                            this.onXMLMinorError("Angle unspecified");
                            break;
                        }

                        else if(isNaN(angle)) this.onXMLMinorError("Angle NaN");

                        switch(axis){
                            case 'x': axis = [1,0,0]; break;
                            case 'y': axis = [0,1,0]; break;
                            case 'z': axis = [0,0,1]; break;
                        }

                        let vector = vec3.fromValues(axis[0], axis[1], axis[2]);
                        transfMatrix = mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * angle, vector);
                       break;
                }
            }
            this.transformations[transformationID] = transfMatrix;
        }

        this.log("Parsed transformations");
        return null;
    }


    /**
     * Done. (update cylinder tho)
     * Parses the <primitives> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode)
    {
        let children = primitivesNode.children;
        let grandChildren = [];
        this.primitives = [];

        // Any number of primitives.
        for (let i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            let primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            // Validate the primitive type
            if (grandChildren.length != 1 || (grandChildren[0].nodeName != 'rectangle' && grandChildren[0].nodeName != 'triangle' && grandChildren[0].nodeName != 'cylinder' && grandChildren[0].nodeName != 'sphere' && grandChildren[0].nodeName != 'torus'))
                return "There must be exactly 1 primitive type (rectangle, triangle, cylinder, sphere or torus)"
    

            // Specifications for the current primitive.
            let primitiveType = grandChildren[0].nodeName;
            // console.log("OLA "+grandChildren[0].nodeName);

            // Retrieves the primitive coordinates.
            if (primitiveType == "rectangle")
            {
                // x1
                let x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                let y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                let x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                let y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                let rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }


            else if (primitiveType == 'sphere' || primitiveType == 'tinysphere')
            {
                //radius   
                let radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                let slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                let stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0)) 
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                let sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sph;
            }


            else if (primitiveType == 'torus')
            {
                //radius   
                let inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner > 0))
                    return "unable to parse INNER radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                let outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer > 0))
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                let slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > -1))
                    return "unable to parse SLICES of the primitive coordinates for ID = " + primitiveId;

                //stacks
                let loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 0))
                    return "unable to parse LOOPS of the primitive coordinates for ID = " + primitiveId;

                let tor = new MyTorus(this.scene, primitiveId, slices, loops, inner, outer);
                this.primitives[primitiveId] = tor;
            }


            else if (primitiveType == 'cylinder')
            {
                //slices
                let slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                let stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0)) 
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                //base radius
                let radius = this.reader.getFloat(grandChildren[0], 'base');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                //height
                let height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                let cyli = new MyCylinder(this.scene, primitiveId, slices, stacks, radius, height);
                this.primitives[primitiveId] = cyli;
            }


            //---------------------------------
            //---------------------------------
            else console.warn("To do: Parse other primitives.");
        }

        this.log("Parsed primitives");
        return null;
    }
    //--------------



    
    
    //------------------
    /**
     * Parses the <components> block.
     * @param {components block element} componentsNode
     */
    parseComponents(componentsNode) 
    {
        this.components = [];
        let children = componentsNode.children;
        let allComponentIDs = [];
        let grandChildren = [];
        let grandgrandChildren = [];
        let componentNodeNames = []; //vector with the node names inside <components> tag

        for (let i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "component") { 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">"); 
                continue; 
            }

            let ID = this.reader.getString(children[i], "id"); // Get id of component[i].
            if (ID == null) return "no ID defined for component ID";
            allComponentIDs[i] = ID;
        }


        
        for (let i = 0; i < children.length; i++)
        {
            let componentID = allComponentIDs[i];                // Get id from the auxiliar array.
            if (this.components[componentID] != null)   // Checks for repeated IDs.
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;
            for (let j = 0; j < grandChildren.length; j++) componentNodeNames.push(grandChildren[j].nodeName);

            let transformationIndex = componentNodeNames.indexOf("transformation");
            let materialsIndex = componentNodeNames.indexOf("materials");
            let textureIndex = componentNodeNames.indexOf("texture");
            let childrenIndex = componentNodeNames.indexOf("children");



            //Transformations section
            let transfMatrix; //build
            grandgrandChildren = grandChildren[transformationIndex].children;
            if (grandgrandChildren.length == 0) transfMatrix = mat4.create();
            else if (grandgrandChildren[0].nodeName == "transformationref")
            {
                let transRefID = this.reader.getString(grandgrandChildren[0], 'id');
                if (transRefID == null) return "unable to parse transformation id of component ID " + componentID;

                transfMatrix = this.transformations[transRefID];
                if (transfMatrix == null) return "no such transformation with ID " + transRefID + " for component ID: " + componentID;
                if (grandgrandChildren.length > 1) this.onXMLMinorError("Multiple transformations declared for " + componentID);
            }
            //
            else transfMatrix = this.parseHelper(grandgrandChildren, " of component " + componentID);



            //Materials section
            grandgrandChildren = grandChildren[materialsIndex].children;
            let materialscomp = [];

            for (let j = 0; j < grandgrandChildren.length; j++)
            {
                let material = grandgrandChildren[j];
                if (material.nodeName != "material") {
                    this.onXMLMinorError("unknown material <" + material.nodeName + ">");
                    continue;
                }

                let matID = this.reader.getString(material, "id");
                if (matID == null){
                    this.onXMLMinorError("no ID defined for material in component: " + componentID);
                    continue;
                }
                else if (matID == "inherit") { materialscomp.push(new MyMaterialInherit()); }
                else if (!this.materials[matID]) {
                    this.onXMLMinorError("material with ID " + matID + " in component: " + componentID + " doesn't exist");
                    continue;
                }
                else materialscomp.push(this.materials[matID]);
            }

            if (materialscomp.length == 0) this.onXMLError("No material in component " + componentID);
            for(let m=0; m<materialscomp.length; m++) this.log(materialscomp[m]);
            let materials = { current: 0, materials: materialscomp }; //build




            //Textures section
            let textureNode = grandChildren[textureIndex];
            let tex = ""; //tex string

            let texID = this.reader.getString(textureNode, "id");
            if(texID == null) { this.onXMLError("No texture ID in component " + componentID); return null; }
            else if(texID == "inherit") { tex = "inherit"; }
            else if(texID == "none") { tex = null; }
            else if(this.textures[texID] == null) 
            {
                this.onXMLError("Texture with ID " + texID + " in component: " + componentID + " doesn't exist");
                return null;
            }
            else { tex = this.textures[texID]; }

            let length_s = this.reader.getFloat(textureNode, "length_s");
            let length_t = this.reader.getFloat(textureNode, "length_t");
            if (length_s == null) { this.onXMLMinorError("length_s not specified in texture of component " + componentID); length_s = 1.0; }
            if (length_t == null) { this.onXMLMinorError("length_t not specified in texture of component " + componentID); length_t = 1.0; }

            let texture = {texture: tex, length_s: length_s, length_t: length_t}; //build texture


            //Children Section
            let componentChildren = [];
            let primitiveChildren = [];

            grandgrandChildren = grandChildren[childrenIndex].children;
            for (let j = 0; j < grandgrandChildren.length; j++)
            {
                if (grandgrandChildren[j].nodeName == "componentref")
                {
                    let compRef = this.reader.getString(grandgrandChildren[j], 'id'); //read componentref ID (string)
                    if (compRef == null) return "unable to parse componentref id of component ID: " + componentID;
                    if (allComponentIDs.indexOf(compRef) == -1) return "no such component with ID " + compRef + " for component ID: " + componentID;
                    componentChildren.push(compRef);
                }

                else if (grandgrandChildren[j].nodeName == "primitiveref")
                {
                    let primRef = this.reader.getString(grandgrandChildren[j], 'id');
                    if (primRef == null) return "unable to parse primitiveref id of component ID " + componentID;
                    if (this.primitives[primRef] == null) return "no such primitive with ID " + primRef + " for component ID " + componentID;
                    primitiveChildren.push(primRef);
                }

                else this.onXMLMinorError("component children must be componentref or primitiveref");
            }

            // ============= BUILD COMPONENT AND IT TO COMPONENT LIST =============
            // ====================================================================
            this.components[componentID] = new MyComponent(this.scene, componentID, materials, transfMatrix, texture, componentChildren, primitiveChildren, true);
            // ====================================================================
        }

        // for(let m=0; m < materials.length; m++) console.log("<"+m+"> " + materials[m].emission);
        //alert if top root isn't defined or properly read (XML error for example)
        if (this.components[this.idRoot] == null) return "root component ID " + this.idRoot + " not defined";
}


    /**
     * Helps parse the <components> block.
     * @param {} list
     * @param {} transformationsID
     */
    parseHelper(list, transformationID)
    {
        let transfMatrix = mat4.create();
        for (let j = 0; j < list.length; j++)
        {
            switch (list[j].nodeName)
            {
                case 'translate':
                    let coordinates = this.parseCoordinates3D(list[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates)) return coordinates;
                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                   break;
                   
                case 'scale':
                    let coordinates = this.parseCoordinates3D(list[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates)) return coordinates;
                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                   break;

                case 'rotate':
                    let axis = this.reader.getString(list[j], "axis");
                    if (axis == null) {
                        this.onXMLMinorError("Axis unspecified");
                        break;
                    }

                    let angle = this.reader.getString(list[j], "angle");
                    if (angle == null) {
                        this.onXMLMinorError("Angle unspecified");
                        break;
                    }
                    else if (isNaN(angle)) this.onXMLMinorError("Angle NaN");

                    switch (axis) {
                        case 'x': axis = [1, 0, 0]; break;
                        case 'y': axis = [0, 1, 0]; break; 
                        case 'z': axis = [0, 0, 1]; break; 
                    }

                    let vector = vec3.fromValues(axis[0], axis[1], axis[2]);
                    transfMatrix = mat4.rotate(transfMatrix, transfMatrix, DEGREE_TO_RAD * angle, vector);
                  break;
            }
        }
        return transfMatrix;
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
    

    
    /**
     * Originally Implemented
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError)
    {
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
    
    
    

    
    
    // ==================================================================================================================================
    goThroughGraph(componentID, mat, tex)
    {
        let currentnode = this.components[componentID];
        let ch = currentnode.children; //----------------------------
        for (let m = 0; m < 1; m++) console.log("<" + m + "> " + ch.length);

        if (currentnode.texture.texture != "inherit") let TEX = currentnode.texture.texture;
        else let TEX = tex.texture;
        if (currentnode.materials.materials != "inherit") MATS = currentnode.materials;
        else let MATS = mat.materials;

        //scene transformations
        this.scene.multMatrix(currentnode.transfMatrix);

        
        var currentTexture = currentnode.texture.texture;
        // var currentMaterial = currentnode.materials.materials[currentnode.materials.current];
        // this.log(currentTexture);
        // this.log(currentMaterial);
        
        for(var i = 0; i < ch.length; i++)
        {
            if(currentnode.leaves[ch[i]] != null){
                // currentMaterial.apply();
                currentTexture.bind();
                this.scene.pushMatrix();
                currentnode.leaves[ch[i]].display();
                this.scene.popMatrix();
            }
            else {
                this.scene.pushMatrix();
                this.goThroughGraph(ch[i], MATS, TEX); 
                this.scene.popMatrix();
            }
        }
    }




    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene()
    {
        this.scene.pushMatrix();
        this.primitives['sphere'].display()
        this.scene.multMatrix(this.transformations['torus1_setup']);;
        this.primitives['torus'].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations['torus2_setup']);;
        this.primitives['torus'].display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.multMatrix(this.transformations['torus3_setup']);;
        this.primitives['torus'].display();
        this.scene.popMatrix();
    }




    /**
     * =================================================
     * ========= DEALING WITH ERRORS FUNCTIONS =========
     * =================================================
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) { console.error("XML Loading Error: " + message); this.loadedOk = false; }



    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) { console.warn("Warning: " + message); }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) { console.log("   " + message); }
}