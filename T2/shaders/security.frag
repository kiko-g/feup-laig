#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main()
{
    float scale = 0.25;
    vec2  vtc = vTextureCoord;               //smaller name
	vec4  color = texture2D(uSampler, vtc);
    float value = 0.5-sqrt((vtc.x - scale) * (vtc.x - scale) + (vtc.y - scale) * (vtc.y - scale));
	
    if (mod(-vtc.y * 150.0 + timeFactor,  4.0) > 1.0) 
        color = vec4(color.rgb * 2.0, 2.0);

	gl_FragColor = vec4(color.rgb * value, 1.0);
}