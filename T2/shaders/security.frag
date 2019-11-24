#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main()
{
    float focus = 0.25;                      //
    vec2  vtc = vTextureCoord;               //smaller name
	vec4  color = texture2D(uSampler, vtc);
    float value = 0.5-sqrt(pow(vtc.x - focus, 2.0) + pow(vtc.y - focus, 2.0));
	
    if (mod(-vtc.y * 100.0 + timeFactor,  5.0) > 1.0) 
        color = vec4(color.rgb * 2.0, 2.0);

	gl_FragColor = vec4(color.rgb * value, 1.0);
}