attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;
varying float verticalOffset;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform sampler2D uSampler;
uniform sampler2D heightSampler;
uniform sampler2D maskSampler;

varying vec2 vTextureCoord;

void main() 
{
	vTextureCoord = aTextureCoord;
    vec3 offset = vec3(0.0, texture2D(heightSampler, vTextureCoord).b*0.2, 0.0);
    vec4 sea = texture2D(uSampler, aTextureCoord);
    vec4 beach = texture2D(maskSampler, aTextureCoord);

    if(beach.r > 0.2) gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    else gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
    // vTextureCoord = aTextureCoord + vec2(1.0, 1.0);
}

