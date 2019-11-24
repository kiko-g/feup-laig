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
	
    //whiter in the center - filter (rectangle with more white to simulate gradient)
    if(vtc.y > 0.0 && vtc.y < 0.5 && vtc.x > 0.0 && vtc.x < 0.5) 
        color = vec4(color.rgb + 0.15, 1.0);

    if (mod(-vtc.y*15.0 + timeFactor, 1.2) > 1.0)   //lines frown bottom to top
        color = vec4(color.rgb + 0.4, 1.0);        //white lines by color addition

    float gradient_offset = 0.4;
    float darken = gradient_offset - sqrt( pow(vtc.x - offset, 2.0) + pow(vtc.y - offset, 2.0) );
	gl_FragColor = vec4(color.rgb * darken, 1.0);
}