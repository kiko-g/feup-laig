#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler0; 

void main()
{
	gl_FragColor = texture2D(uSampler0, vTextureCoord);
}
