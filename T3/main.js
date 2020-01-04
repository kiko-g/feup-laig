//From https://github.com/EvanHahn/ScriptInclude
include=function(){function f(){var a=this.readyState;(!a||/ded|te/.test(a))&&(c--,!c&&e&&d())}var a=arguments,b=document,c=a.length,d=a[c-1],e=d.call;e&&c--;for(var g,h=0;c>h;h++)g=b.createElement("script"),g.src=arguments[h],g.async=!0,g.onload=g.onerror=g.onreadystatechange=f,(b.head||b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude=function(a){var b=console,c=serialInclude.l;if(a.length>0)c.splice(0,0,a);if(c.length>0){if(c[0].length>1){var d=c[0].splice(0,1);include(d,function(){serialInclude([]);});}else{var e=c[0][0];c.splice(0,1);e.call();};}else b.log("Finished.");};serialInclude.l=new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
    function(m,key,value) {
      vars[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return vars;
}	 
//Include additional files here
serialInclude(['../lib/CGF.js', 
               'Server.js',
               'XMLscene.js',
               'MyMaterial.js',
               'MyComponent.js',
               'MyInterface.js',
               'MySceneGraph.js',

               'primitives/Patch.js',
               'primitives/Plane.js',
               'primitives/MyTorus.js',
               'primitives/MySphere.js',
               'primitives/MyTriangle.js',
               'primitives/MyCylinder.js',
               'primitives/MyCylinder2.js',
               'primitives/MyRectangle.js',
               'primitives/MySecurityCamera.js',
               'primitives/Plant.js',
               'primitives/Timer.js',
               'primitives/Painting.js',
	           'primitives/obj/CGFOBJModel.js',
               'primitives/obj/CGFResourceReader.js',

               'animations/Animation.js',
               'animations/MyKeyframe.js',
               'animations/KeyframeAnimation.js',
               'animations/Animator.js',
               'animations/PieceAnim.js',
               
               'game/Tile.js',
               'game/Piece.js',
               'game/Game.js',
               'game/GameBoard.js',
               
main=function()
{
	// Standard application, scene and interface setup
    var app = new CGFapplication(document.body);
    var interface = new MyInterface();
    var scene = new XMLscene(interface);

    app.init();
    app.setScene(scene);
    app.setInterface(interface);

    interface.setActiveCamera(scene.camera);

	// get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
	// or use "anim.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
	
    var file1=getUrlVars()['file'] || "room.xml";
    var file2=getUrlVars()['file'] || "original.xml";

	// create and load graph, and associate it to scene. 
    // Check console for loading errors
    var scenegraph1 = new MySceneGraph("room.xml", scene);
    var scenegraph2 = new MySceneGraph("original.xml", scene);
	
	// start
    app.run();
}

]);