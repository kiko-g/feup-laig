#ifdef GL_ES
precision highp float;
#endif


varying float verticalOffset;
varying vec2 vTextureCoord;
//sea and beach
uniform sampler2D uSampler;
uniform sampler2D maskSampler;
//height
uniform sampler2D heightSampler;

void main() 
{
	vec4 sea = texture2D(uSampler, vTextureCoord);
    vec4 beach = texture2D(maskSampler, vTextureCoord);

    vec4 color;
    if(beach.r > 0.2) color = beach;
    else color = sea;
    
	gl_FragColor = vec4(color.rgb, 1.0);
}