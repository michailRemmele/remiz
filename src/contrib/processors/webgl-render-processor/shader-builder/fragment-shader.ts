export const fragmentShader = `
precision highp float;

uniform sampler2D u_image;
uniform vec2 u_texAtlasSize;
uniform vec2 u_texSize;
uniform vec2 u_texTranslate;
uniform vec2 u_gameObjectSize;

varying vec2 v_texCoord;

float calculateCoord(float gameObjectSize, float texSize, float texTranslate, float texCoord) {
  if (gameObjectSize > texSize) {
    float repeat = gameObjectSize / texSize;
    return mod(texCoord * repeat, texSize) + texTranslate;
  } else {
    return texCoord + texTranslate;
  }
}

void main() {
  vec2 texCoord = vec2(
    calculateCoord(u_gameObjectSize.x, u_texSize.x, u_texTranslate.x, v_texCoord.x),
    calculateCoord(u_gameObjectSize.y, u_texSize.y, u_texTranslate.y, v_texCoord.y)
  );

  gl_FragColor = texture2D(u_image, texCoord / u_texAtlasSize);
}
`;