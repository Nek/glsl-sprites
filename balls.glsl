precision mediump float;

uniform vec2 uScreenSize;
uniform float uTime;

#define MAX_BALLS 10

struct Ball {
  vec2 center;
  float radius;
};

uniform Ball balls[MAX_BALLS];
uniform int ballsLength;

bool inCircle (vec2 p, vec2 center, float radius) {
  vec2 ratio = uScreenSize.xy / uScreenSize.x;
  return distance(p*ratio, center*ratio) < radius;
}

bool inBall(vec2 p, Ball b) {
  return inCircle(p, b.center, b.radius);
}

void main () {

  vec2 position = (gl_FragCoord.xy / uScreenSize.xy);

  float z = 0.5+0.5*smoothstep(-1.0, 1.0, cos(uTime * 0.005));
  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);

  for (int i=0; i<MAX_BALLS; ++i) { if (i>=ballsLength) break;
    if (inBall(position, balls[i])) {
      gl_FragColor = vec4(position.x, position.y, z, 1.0);
    }
  }
}
