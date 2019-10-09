var DEGREE_TO_RAD = Math.PI / 180;
// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
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
        scene.graph = this; // Establish bidirectional references between scene and graph.
        this.nodes = [];
        this.idRoot = null;      // The id of the root element.
        this.loadedOk = null;

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


        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1) return "tag <globals> missing";
        else {
            if (index != AMBIENT_INDEX) this.onXMLMinorError("tag <globals> out of order");
            if ((error = this.parseGlobals(nodes[index])) != null) return error;
            //Parse ambient block
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
     * HELPFUL NUMBER VERICATION FUNCTION
     * USED TO CHECK AND RETURN AN ERROR IF NEED BE
     * REDUCES SIZE OF CODE BELOW
     * @param {Block} node parent node
     * @param {Number} n number
     * @param {String} name var name
     * @param {Bool} haveLim decide if var needs limits or not
     * @param {Number} low lower lim, 0 default
     * @param {Number} high higher limit, 10000 default
     */
    verifNum(node, n, name, haveLim = true, low = 0, high = 10000)
    {
        if ((n == null || isNaN(n)) || (haveLim && !(n >= low && n <= high)))
         return "unable to parse " + name + ", of " + node.nodeName + " block.";
        
        return null;
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
        var error;
        var def = this.reader.getString(viewsNode, 'default', true);
        var numViews = 0;
        var children = viewsNode.children;

        this.views = {};
        this.views.array = [];

        for (let i = 0; i < children.length; ++i)
        {
            var childNode = children[i];
            if (childNode.nodeName != 'ortho' &&
                childNode.nodeName != 'perspective') {
                this.onXMLMinorError('unknown tag <' + childNode.nodeName + '>');
                continue;
            }

            //perspective/ortho children
            var id = this.reader.getString(childNode, 'id', true);
            if (id == '') return 'invalid view id';
            
            var near = this.reader.getFloat(childNode, 'near', true);
            if ((error = this.verifNum(childNode, near, 'near', false)) != null)
                return error;

            var far = this.reader.getFloat(childNode, 'far', true);
            if ((error = this.verifNum(childNode, far, 'far', false)) != null)
                return error;



            // Reads the names of the nodes to an auxiliary buffer.
            let nodeNames = [];
            var grandChildren = childNode.children;

            for (let j = 0; j < grandChildren.length; j++)
                nodeNames.push(grandChildren[j].nodeName);

            var fromIndex = nodeNames.indexOf('from');
            var toIndex = nodeNames.indexOf('to');
            var from = grandChildren[fromIndex];
            var to = grandChildren[toIndex]

            var fromx = this.reader.getFloat(from, 'x', true);
            if ((error = this.verifNum(from, fromx, 'fromx', false)) != null)
                return error;
            var fromy = this.reader.getFloat(from, 'y', true);
            if ((error = this.verifNum(from, fromy, 'fromy', false)) != null)
                return error;
            var fromz = this.reader.getFloat(from, 'z', true);
            if ((error = this.verifNum(from, fromz, 'fromz', false)) != null)
                return error;

            var tox = this.reader.getFloat(to, 'x', true);
            if ((error = this.verifNum(to, tox, 'tox', false)) != null) return error;
            var toy = this.reader.getFloat(to, 'y', true);
            if ((error = this.verifNum(to, toy, 'toy', false)) != null) return error;
            var toz = this.reader.getFloat(to, 'z', true);
            if ((error = this.verifNum(to, toz, 'toz', false)) != null) return error;


            if (childNode.nodeName == 'ortho')
            {
                var left = this.reader.getFloat(childNode, 'left', true);
                if ((error = this.verifNum(to, left, 'left', false)) != null)
                    return error;
                
                    var right = this.reader.getFloat(childNode, 'right', true);
                if ((error = this.verifNum(to, right, 'right', false)) != null)
                    return error;
                
                    var top = this.reader.getFloat(childNode, 'top', true);
                if ((error = this.verifNum(to, top, 'top', false)) != null)
                    return error;
                
                    var bottom = this.reader.getFloat(childNode, 'bottom', true);
                if ((error = this.verifNum(to, bottom, 'bottom', false)) != null)
                    return error;

                this.views.array[id] = {
                    type: 'ortho',
                    near: near,
                    far: far,
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom,
                    from: { x: fromx, y: fromy, z: fromz },
                    to: { x: tox, y: toy, z: toz }
                };
                numViews++;
            } 
            else if (childNode.nodeName == 'perspective') {
                var angle = this.reader.getFloat(childNode, 'angle', false);

                if ((error = this.verifNum(childNode, angle, 'angle', true)) != null)
                    return error;

                this.views.array[id] = {
                    type: 'perspective',
                    near: near,
                    far: far,
                    angle: angle * DEGREE_TO_RAD,
                    from: { x: fromx, y: fromy, z: fromz },
                    to: { x: tox, y: toy, z: toz }
                };
                numViews++;
            }
        }

        //in case reaches end with no valid view
        if(numViews == 0) return 'no valid view defined'
        if (this.views.array[def] == null) return 'no default view defined';

        this.views.default = def;
        this.log('Parsed views');

        return null;
    }





    /**
     * Originally implemented
     * Parses the <ambient> node.
     * @param {ambient block element} ambientsNode
     */
    parseGlobals(ambientsNode) {

        var children = ambientsNode.children;

        this.ambient = [];
        this.background = [];

        let nodeNames = [];

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
        var children = texturesNode.children;
        var numTextures = 0;
        this.textures = [];
        
        // Any number of textures.
        for (let i = 0; i < children.length; i++)
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
            if (emission.length == 0) return "no emission provided for materia with ID: " + materialID;
            else emission = this.parseColor(emission[0], "emission in " + materialID + "has an incorrect format");

            // get ambient for material and check for errors, then parse color into list
            var ambient = children[i].getElementsByTagName("ambient"); //get rgba
            if (ambient.length == 0) return "no ambient provided for materia with ID: " + materialID;
            else ambient = this.parseColor(ambient[0], "ambient in " + materialID + "has an incorrect format");
            
            // get diffuse for material and check for errors, then parse color into list
            var diffuse = children[i].getElementsByTagName("diffuse"); //get rgba
            if (diffuse.length == 0) return "no diffuse provided for materia with ID: " + materialID;
            else diffuse = this.parseColor(diffuse[0], "diffuse in " + materialID + "has an incorrect format");
            
            // get specular for material and check for errors, then parse color into list
            var specular = children[i].getElementsByTagName("specular"); //get rgba
            if (specular.length == 0) return "no specular provided for materia with ID: " + materialID;
            else specular = this.parseColor(specular[0], "specular in " + materialID + "has an incorrect format");


            // build final material with all attributes
            var material = new MyMaterial(shininess, emission, ambient, diffuse, specular);
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
        var children = transformationsNode.children;
        var grandChildren = [];
        this.transformations = [];

        // Any number of transformations.
        for (let i=0; i < children.length; i++)
        {
            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationID = this.reader.getString(children[i], 'id');
            if (transformationID == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationID + ")";

            grandChildren = children[i].children;
            // Specifications for the current transformation.

            var transfMatrix = mat4.create();

            for (let j=0; j < grandChildren.length; j++) 
            {
                switch (grandChildren[j].nodeName)
                {
                    case 'translate':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;
                        
                        transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                       break;

                    case 'scale':
                        var coordinates = this.parseCoordinates3D(grandChildren[j], "translate transformation for ID " + transformationID);
                        if (!Array.isArray(coordinates)) return coordinates;

                        transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                       break;

                    case 'rotate':
                        var axis = this.reader.getString(grandChildren[j], "axis");
                        if(axis == null){
                            this.onXMLMinorError("Axis unspecified");
                            break;
                        }
                        
                        var angle = this.reader.getString(grandChildren[j], "angle");
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

                        var vector = vec3.fromValues(axis[0], axis[1], axis[2]);
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
        var children = primitivesNode.children;
        var grandChildren = [];
        this.primitives = [];

        // Any number of primitives.
        for (let i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current primitive.
            var primitiveId = this.reader.getString(children[i], 'id');
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
            var primitiveType = grandChildren[0].nodeName;
            // console.log("OLA "+grandChildren[0].nodeName);

            // Retrieves the primitive coordinates.
            if (primitiveType == "rectangle")
            {
                // x1
                var x1 = this.reader.getFloat(grandChildren[0], 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 of the primitive coordinates for ID = " + primitiveId;

                // y1
                var y1 = this.reader.getFloat(grandChildren[0], 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 of the primitive coordinates for ID = " + primitiveId;

                // x2
                var x2 = this.reader.getFloat(grandChildren[0], 'x2');
                if (!(x2 != null && !isNaN(x2) && x2 > x1))
                    return "unable to parse x2 of the primitive coordinates for ID = " + primitiveId;

                // y2
                var y2 = this.reader.getFloat(grandChildren[0], 'y2');
                if (!(y2 != null && !isNaN(y2) && y2 > y1))
                    return "unable to parse y2 of the primitive coordinates for ID = " + primitiveId;

                var rect = new MyRectangle(this.scene, primitiveId, x1, x2, y1, y2);

                this.primitives[primitiveId] = rect;
            }


            else if (primitiveType == 'sphere' || primitiveType == 'tinysphere')
            {
                //radius   
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0)) 
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                var sph = new MySphere(this.scene, primitiveId, radius, slices, stacks);

                this.primitives[primitiveId] = sph;
            }


            else if (primitiveType == 'torus')
            {
                //radius   
                var inner = this.reader.getFloat(grandChildren[0], 'inner');
                if (!(inner != null && !isNaN(inner) && inner > 0))
                    return "unable to parse INNER radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                var outer = this.reader.getFloat(grandChildren[0], 'outer');
                if (!(outer != null && !isNaN(outer) && outer > 0))
                    return "unable to parse OUTER radius of the primitive coordinates for ID = " + primitiveId;

                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > -1))
                    return "unable to parse SLICES of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var loops = this.reader.getFloat(grandChildren[0], 'loops');
                if (!(loops != null && !isNaN(loops) && loops > 0))
                    return "unable to parse LOOPS of the primitive coordinates for ID = " + primitiveId;

                var tor = new MyTorus(this.scene, primitiveId, slices, loops, inner, outer);
                this.primitives[primitiveId] = tor;
            }


            else if (primitiveType == 'cylinder')
            {
                //slices
                var slices = this.reader.getFloat(grandChildren[0], 'slices');
                if (!(slices != null && !isNaN(slices) && slices > 0))
                    return "unable to parse slices of the primitive coordinates for ID = " + primitiveId;

                //stacks
                var stacks = this.reader.getFloat(grandChildren[0], 'stacks');
                if (!(stacks != null && !isNaN(stacks) && stacks > 0)) 
                    return "unable to parse stacks of the primitive coordinates for ID = " + primitiveId;

                //radius
                var radius = this.reader.getFloat(grandChildren[0], 'radius');
                if (!(radius != null && !isNaN(radius) && radius > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                //height
                var height = this.reader.getFloat(grandChildren[0], 'height');
                if (!(height != null && !isNaN(height) && height > 0))
                    return "unable to parse radius of the primitive coordinates for ID = " + primitiveId;

                var cyli = new MyCylinder(this.scene, primitiveId, slices, stacks, radius, height);
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
        var children = componentsNode.children;
        var allComponentIDs = [];
        var materials = [];
        var grandChildren = [];
        var grandgrandChildren = [];
        var componentNodeNames = []; //vector with the node names inside <components> tag

        for (var i = 0; i < children.length; i++)
        {
            if (children[i].nodeName != "component") { 
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">"); 
                continue; 
            }

            var ID = this.reader.getString(children[i], "id"); // Get id of component[i].
            if (ID == null) return "no ID defined for component ID";
            allComponentIDs[i] = ID;
            console.log(ID + " :" + i + ":");
        }


        
        for (var i = 0; i < children.length; i++)
        {
            var componentID = allComponentIDs[i];                // Get id from the auxiliar array.
            if (this.components[componentID] != null)   // Checks for repeated IDs.
                return "ID must be unique for each component (conflict: ID = " + componentID + ")";

            grandChildren = children[i].children;
            for (var j = 0; j < grandChildren.length; j++) componentNodeNames.push(grandChildren[j].nodeName);

            var transformationIndex = componentNodeNames.indexOf("transformation");
            var materialsIndex = componentNodeNames.indexOf("materials");
            var textureIndex = componentNodeNames.indexOf("texture");
            var childrenIndex = componentNodeNames.indexOf("children");



            //Transformations section
            var transfMatrix;
            grandgrandChildren = grandChildren[transformationIndex].children;
            if (grandgrandChildren.length == 0) transfMatrix = mat4.create();
            else if (grandgrandChildren[0].nodeName == "transformationref")
            {
                var transRefID = this.reader.getString(grandgrandChildren[0], 'id');
                if (transRefID == null) return "unable to parse transformation id of component ID " + componentID;

                transfMatrix = this.transformations[transRefID];
                if (transfMatrix == null) return "no such transformation with ID " + transRefID + " for component ID: " + componentID;
                if (grandgrandChildren.length > 1) this.onXMLMinorError("Multiple transformations declared for " + componentID);
            }
            //
            else transfMatrix = this.parseHelper(grandgrandChildren, " of component " + componentID);



            //Materials section
            grandgrandChildren = grandChildren[materialsIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++)
                materials.push(this.materials[this.reader.getString(grandgrandChildren[j], 'id')]);



            //Textures section
            let textureNode = grandChildren[textureIndex];
            let tex = "";

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

            var texture = {texture: tex, length_s: length_s, length_t: length_t}; //build texture


            //Children Section
            var componentChildren = [];
            var primitiveChildren = [];

            grandgrandChildren = grandChildren[childrenIndex].children;
            for (var j = 0; j < grandgrandChildren.length; j++)
            {
                if (grandgrandChildren[j].nodeName == "componentref")
                {
                    var compRef = this.reader.getString(grandgrandChildren[j], 'id'); //read componentref ID (string)
                    if (compRef == null) return "unable to parse componentref id of component ID: " + componentID;
                    if (allComponentIDs.indexOf(compRef) == -1) return "no such component with ID " + compRef + " for component ID: " + componentID;
                    componentChildren.push(compRef);
                }

                else if (grandgrandChildren[j].nodeName == "primitiveref")
                {
                    var primRef = this.reader.getString(grandgrandChildren[j], 'id');
                    if (primRef == null) return "unable to parse primitiveref id of component ID " + componentID;
                    if (this.primitives[primRef] == null) return "no such primitive with ID " + primRef + " for component ID " + componentID;
                    primitiveChildren.push(primRef);
                }

                else this.onXMLMinorError("component children must be componentref or primitiveref");
            }

            // ============= BUILD COMPONENT AND IT TO COMPONENT LIST =============
            // ====================================================================
            this.components[componentID] = new MyComponent(this.scene, componentID, transfMatrix, materials, texture, componentChildren, primitiveChildren, length_t, length_s);
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
        var transfMatrix = mat4.create();
        for (let j = 0; j < list.length; j++)
        {
            switch (list[j].nodeName)
            {
                case 'translate':
                    var coordinates = this.parseCoordinates3D(list[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates)) return coordinates;
                    transfMatrix = mat4.translate(transfMatrix, transfMatrix, coordinates);
                   break;
                   
                case 'scale':
                    var coordinates = this.parseCoordinates3D(list[j], "translate transformation for ID " + transformationID);
                    if (!Array.isArray(coordinates)) return coordinates;
                    transfMatrix = mat4.scale(transfMatrix, transfMatrix, coordinates);
                   break;

                case 'rotate':
                    var axis = this.reader.getString(list[j], "axis");
                    if (axis == null) {
                        this.onXMLMinorError("Axis unspecified");
                        break;
                    }

                    var angle = this.reader.getString(list[j], "angle");
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

                    var vector = vec3.fromValues(axis[0], axis[1], axis[2]);
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
    goThroughGraph(component)
    {
        

        //Visit the node desendants, in case of primitive, display them, in case of intermediate nodes call descendants recursively
        for (let i = 0; i < children.length; i++)
        {
            var child = children[i];
            this.scene.pushMatrix();

            if (this.primitives[child] != null) {
                    currentMAT.apply();
                    this.primitives[children[i]].display();
                }
                else {
                this.currentNode.visited = true;
                this.goThroughGraph(children[i], materialsComp, textureID);
            } 

            this.scene.popMatrix();
        }
    }






    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene()
    {
        // this.processNode(this.idRoot);
        // goThroughGraph
        // parentMAT, parentTEX
        
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