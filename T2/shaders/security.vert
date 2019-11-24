#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

void main()
{
	gl_Position = vec4(aVertexPosition.x, aVertexPosition.y, 0.0, 1.0);
	vTextureCoord = aTextureCoord;
}