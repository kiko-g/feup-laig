#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float timeFactor;

void main()
{
    float offset = 0.25; //focus on center, darker corners (0.5 / 2)
    vec2  vtc = vTextureCoord; //smaller name for vTexture
	vec4  color = texture2D(uSampler, vTextureCoord);
	
    if (mod(-vtc.y*20.0 + timeFactor, 1.2) > 1.0) //lines frown bottom to top
        color = vec4(color.rgb + 1.0, 1.0); //white lines by color addition

    if(vtc.y > 0.2 && vtc.y < 0.3 && vtc.x > 0.2 && vtc.x < 0.3) color = vec4(color.rgb + 0.2, 1.0); //white lines by color addition
    float gradient_offset = 0.3;
    float darken = gradient_offset-sqrt( pow(vtc.x - offset, 2.0) + pow(vtc.y - offset, 2.0));
	gl_FragColor = vec4(color.rgb * darken, 1.0);
}