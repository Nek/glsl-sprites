var Glsl = require("glsl.js");
var glslify = require("glslify");
var toy = require("gl-toy");

var shader = glslify({
    vertex: './vertex.glsl',
    fragment: './balls.glsl'
});

  function Vec2 (x, y) {
    this.x = x;
    this.y = y;
  }

  function Ball (center, radius, velocity) {
    this.center = center;
    this.radius = radius;
    this.velocity = velocity;
  }

  Ball.prototype.update = function (delta) {
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


var balls = [];                                                                                                                                                      
for (var i = 0; i<10; ++i) {                                                                                                                
  balls.push(new Ball(new Vec2(Math.random(), Math.random()), 0.01+0.01*Math.random(), new Vec2(0.001*Math.random(), 0.001*Math.random()))); 
}                                                                                                                                                   

var start = Date.now();
var last = start;

toy(shader, function render(gl, sh) {

  sh.uniforms.uScreenSize = [gl.drawingBufferWidth, gl.drawingBufferHeight];  

  var now = Date.now();
  var delta = now - last;

  balls.forEach(function (ball) {        
    ball.update(delta);                           
  }); 

  sh.uniforms.ballsLength = 10;
  sh.uniforms.balls = balls.map(
    function(ball){
      return {center:[ball.center.x, ball.center.y], radius: ball.radius}
    });
  
  sh.uniforms.uTime =  now - start;
  last = now;
});
