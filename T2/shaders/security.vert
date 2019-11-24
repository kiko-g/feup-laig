#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

void main()
{
    vec3 avp = aVertexPosition;
	gl_Position = vec4(avp.x, avp.y, avp.z, 1.0);
	vTextureCoord = aTextureCoord;
}