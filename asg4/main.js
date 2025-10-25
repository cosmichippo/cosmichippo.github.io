// dependancies: "rendering.js, webgl-utils.js cuon-utils.js webgl-debug.js"
// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE = `
attribute vec4 a_Position;
attribute vec2 a_UV;
attribute vec3 a_Normal;
varying vec4 v_VertPos;
varying vec2 v_UV;
varying vec3 v_Normal;
uniform int u_whichOne;

uniform mat4 u_NormalMatrix;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;
uniform mat4 u_GlobalRotateMatrix;
void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
    gl_PointSize = 10.0;
    v_Normal = vec3(normalize(u_NormalMatrix * vec4(a_Normal, 1.0)));
    v_UV = a_UV;
    v_VertPos = u_ModelMatrix * a_Position;
}`;

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform vec3 u_LightPos;
  uniform vec3 u_CameraPos;
  uniform vec4 u_FragColor;
  uniform vec3 u_SpotDir;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichOne;
  uniform int u_useSpot;
  uniform int u_useTexture;
  uniform int u_useLight;

  void main() {
    if (u_whichOne == 0){
      gl_FragColor = u_FragColor;
    }
    else if (u_whichOne == 1){
    gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichOne == 2){
    gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if(u_whichOne == 3){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if (u_whichOne == 4){
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    }

    if(u_useTexture == 1){
      gl_FragColor = vec4((v_Normal + 1.0) / 2.0, 1.0);
    }
    
    vec3 lightVec = u_LightPos - vec3(v_VertPos);
    float r = length(lightVec);

    float spotFactor = 1.0;
    float spotCosCutoff = 0.01;
    
    vec3 L = normalize(lightVec);
    vec3 N = normalize(v_Normal);
    vec3 sD = -normalize(u_SpotDir);

    float nDotL = max(dot(N, L), 0.0);

    //reflection
    vec3 R = reflect(-L, N);
    vec3 SR = reflect(sD, N);

    //eye
    vec3 E = normalize(u_CameraPos - vec3(v_VertPos));

    //spotCosine
    float spotCos = dot(sD, L);

    if (spotCos >= spotCosCutoff){
      spotFactor = pow(spotCos, 10.0);
    }else{
      spotFactor = 0.0;
    }

    float spec = pow(max(dot(E,R), 0.0), 30.0);
     
    vec3 ambient = vec3(gl_FragColor * 0.3);

    vec3 diffuse = vec3(gl_FragColor * nDotL);
    
    float spotSpec =  pow(max(dot(E, SR), 0.0), 30.0);
    
    if (u_useLight == 1){
    if(u_useSpot == 1){

        //here, add diffuse
        if(spotCos >= spotCosCutoff){
        gl_FragColor = vec4(((spotFactor * 0.7) + ambient), 1.0);
        gl_FragColor.a = 1.0;
        }else{
          gl_FragColor = vec4(((spotFactor * 0.7)+ ambient), 1.0);
          gl_FragColor.a = 1.0;
        }
    }else{
      gl_FragColor = vec4((spec + diffuse + ambient), 1.0);
      gl_FragColor.a = 1.0;
    }
    }else{
      gl_FragColor = u_FragColor;
    }

  }`;



let u_ModelMatrix;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;              
let u_GlobalRotateMatrix;
let u_ViewMatrix;
let u_ProjectionMatrix;
let u_NormalMatrix;
let u_LightPos;
let u_CameraPos;
let u_SpotDir;
let v_whichOne;
let a_Normal; 
let u_useSpot;
let u_useLight;
let u_useTexture;

var g_LightX = 0;
var g_LightY = 0;
var g_LightZ = 0;
var g_SpotX = 1;
var g_SpotY = 0;
var g_SpotZ = 0;

let button = false;
let toggleLight = false;
let toggleNormal = false;
let toggleSpot = 0;
let g_globalAngle = 0;
let g_lightAngle = 0;
let leftArmAngle = 0;
let angleSlider2 = 0;
let angleSlider3 = 0;

var g_startTime = performance.now();
var g_seconds = performance.now() / 1000.0 - g_startTime;

var lightRef;

var all_blocks;

var camera = new Camera();

function main() {

  // Retrieve <canvas> element
  setupWebGL();

  connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // Create a buffer object
  
  setupHTMIInputs();
  // Register function (event handler) to be called on a mouse press
  // Specify the color for clearing <canvas>
  initTextures(gl, 0);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  all_blocks = initBlocks();

  requestAnimationFrame(tick);
}

function setupHTMIInputs(){
document.getElementById("angleSlider").addEventListener('mousemove', function(){
  g_globalAngle = this.value;
});

document.getElementById("lightSlider").addEventListener('mousemove', function(){
  g_lightAngle = Number(this.value);
});


document.getElementById("lightX").addEventListener('mousemove', function(){
  g_LightX = Number(this.value);
});
document.getElementById("lightY").addEventListener('mousemove', function(){
  g_LightY = Number(this.value);
});
document.getElementById("lightZ").addEventListener('mousemove', function(){
  g_LightZ = Number(this.value);
});

document.getElementById("the_button").addEventListener('click', function(){
  console.log("testing");
  if (button == true){
    button = false;
  }
  else{
    button = true;
  }
});
document.getElementById("spot").addEventListener('click', function(){
  console.log("testing");
  if (toggleSpot == 1){
    toggleSpot = 0;
  }
  else{
    toggleSpot = 1;
  }
});

document.getElementById("lighting").addEventListener('click', function(){
  console.log("testing");
  if (toggleLight == true){
    toggleLight = false;
  }
  else{
    toggleLight = true;
  }
});

document.getElementById("normal").addEventListener('mousedown', function(){
  console.log("testing");
  if (toggleNormal == true){
    toggleNormal = false;
  }
  else{
    toggleNormal = true;
  }
});


}

function tick(){
  renderAllShapes();
  requestAnimationFrame(tick);
}