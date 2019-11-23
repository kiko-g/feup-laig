#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform float timeFactor;
uniform sampler2D uSampler0;

void main()
{
    vec4 color = texture2D(uSampler0, vTextureCoord);
}