var Glsl = require("glsl.js");
var glslify = require("glslify");
var shader = glslify({
    vertex: './vertex.glsl',
    fragment: './balls.glsl',
    sourceOnly: true
});

console.log(shader.fragment);

var canv = document.createElement("canvas");
canv.id = "game";
canv.width = 640;
canv.height = 480;
document.body.appendChild(canv);

var fragment = shader.fragment;

  if (!Glsl.supported()) alert("WebGL is not supported.");

  function Vec2 (x, y) {
    this.x = x;
    this.y = y;
  }

  function Ball (center, radius, velocity) {
    this.center = center;
    this.radius = radius;
    this.velocity = velocity;
  }

  Ball.prototype.update = function (time, delta) {
    this.center.x = this.center.x + this.velocity.x * delta;
    this.center.y = this.center.y + this.velocity.y * delta;
    if (this.center.y < 0) {
      this.center.y = 0;
      this.velocity.y *= -1;
    }
    if (this.center.x < 0) {
      this.center.x = 0;
      this.velocity.x *= -1;
    }
    if (this.center.y > 1) {
      this.center.y = 1;
      this.velocity.y *= -1;
    }
    if (this.center.x > 1) {
      this.center.x = 1;
      this.velocity.x *= -1;
    }
  }

  Glsl({
    canvas: document.getElementById("game"),
    fragment: fragment,
    variables: {
      time: 0,
      balls: [],
      ballsLength: 0
    },
  init: function () {
    for (var i = 0; i<this.defines.MAX_BALLS; ++i) {
      this.variables.balls.push(new Ball(new Vec2(Math.random(), Math.random()), 0.01+0.01*Math.random(), new Vec2(0.001*Math.random(), 0.001*Math.random())));
    }
  },
    update: function (time, delta) {
      this.set("time", time);
      this.variables.balls.forEach(function (ball) {
        ball.update(time, delta);
      });
      this.set("ballsLength", this.variables.balls.length);
      this.sync("balls");
    }
  }).start();
