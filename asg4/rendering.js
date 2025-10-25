function setupWebGL(){
    canvas = document.getElementById('webgl');
  
    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl",{preserveDrawingBuffer: true});//getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }else{
      gl.enable(gl.DEPTH_TEST);
      return {canvas, gl};
    }
  }

function connectVariablesToGLSL(gl, VSHADER_SOURCE, FSHADER_SOURCE){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0){
    console.log("Failed to get storage location of a_Normal");
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectioneMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ProjectioneMatrix');
    return;
  }

  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_NormalMatrix ){
    console.log('Failed to get the storage location of u_NormalMatrix');
    return;
  }

  var identityMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityMatrix.elements);

  u_whichOne = gl.getUniformLocation(gl.program, 'u_whichOne');
  if (!u_whichOne) {
    console.log('Failed to get the storage location of whichOne');
    return;
  }

  u_LightPos = gl.getUniformLocation(gl.program, 'u_LightPos');
  
  u_CameraPos = gl.getUniformLocation(gl.program, 'u_CameraPos');

  u_SpotDir = gl.getUniformLocation(gl.program, 'u_SpotDir');

  u_useSpot = gl.getUniformLocation(gl.program, 'u_useSpot');

  u_useLight = gl.getUniformLocation(gl.program, 'u_useLight');

  u_useTexture = gl.getUniformLocation(gl.program, 'u_useTexture');


  return {a_Position, u_FragColor};
}

function renderAllShapes(){
  g_seconds = performance.now() / 1000.0 - g_startTime;

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var projMatrix = new Matrix4();
  projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100); //wide, aspect, near plane, far plane
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  //var viewMatrix = new Matrix4();
  //viewMatrix.setLookAt(0,0,1, 0,0,-1, 0,1,0); // eye, at, up
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  camera.push_to_GLSL(gl, u_ViewMatrix);
  //console.log(...camera.eye.elements, ...camera.at.elements, ...camera.up.elements);
  
  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  lightRef.matrix.setTranslate(g_LightX, g_LightY, g_LightZ);
  //lightRef.matrix.scale(-2,-2,-2,);
  lightRef.matrix.rotate(g_lightAngle, 0, 1, 0);
  lightRef.normalMatrix.setInverseOf(lightRef.matrix).transpose();

  //lightRef.matrix.render();

  g_SpotX = Math.sin(g_lightAngle * Math.PI/180);
  g_SpotZ =  Math.cos(g_lightAngle * Math.PI/180);
  //console.log("SpotX, Y, Z",  g_SpotX, g_SpotY, g_SpotZ);

  //Light coords pushed to GLSL
  gl.uniform3f(u_LightPos, g_LightX, g_LightY, g_LightZ);
  gl.uniform3f(u_CameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);
  gl.uniform3f(u_SpotDir, g_SpotX, g_SpotY, g_SpotZ);
  gl.uniform1i(u_useSpot, toggleSpot);
  gl.uniform1i(u_useLight, toggleLight);
  gl.uniform1i(u_useTexture, toggleNormal);
  updateAnimationAngles();
}

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
      0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    var n = 3; // The number of vertices
  
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }
    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
  
    return n;
  }
  
function initTextures(gl, n){
  var texture2 = gl.createTexture();
  var texture = gl.createTexture();
  var u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  var image = new Image();
  var image2 = new Image();
  //  image.crossOrigin = 'anonymous';

  image2.onload = function(){ loadTexture2(gl, n, texture2, u_Sampler2, image2, 1);}
  image2.src = "sky.jpeg";
  
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image, 0);};
  image.src = "stone.png";

  if(!image2){
    console.log("Failed to create Image obj");
  }
  return true;
}

function loadTexture(gl, n , texture, u_Sampler, image){
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE0);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);
}
function loadTexture2(gl, n , texture, u_Sampler, image){

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE1);

  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 1);

}

function renderShape(gl, a_Position, u_FragColor, vertexBuffer, vertices, color, size, renderType){
    //gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);
    //let color = shape.color;
    //let vertices = shape.vertices;
    //let size = shape.size;
    //console.log();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);
  gl.drawArrays(renderType, 0, size);

}

function renderTriangle3D(vertexBuffer, verts, color, ){
let n = 3;
var v = new Float32Array(verts); 
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

//gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);

gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
// Enable the assignment to a_Position variable
gl.enableVertexAttribArray(a_Position);
gl.drawArrays(gl.TRIANGLES, 0, n);
}

function renderTriangle3DUV(uvBuffer, uv){
  let n = 2;
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  
  //gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_UV);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  }

function renderTrinagle3DUVNormal(v, uv, normals, vertexBuffer, uvBuffer, normalBuffer){
  //VERTICES
  let n = v.length / 3;



  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
// Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  //UVs
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  // Enable the assignment to a_UV variable
  gl.enableVertexAttribArray(a_UV);
  
  //NORMALS
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  //assing a_Normal to variable
  gl.enableVertexAttribArray(a_Normal);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}





function initBlocks(){
  var blocks = [];

  var leftArm;
  var right;
  const x = 0.5;
  const y = 0.5;
  const z = 0.5;
  var skybox = new Cube();
  skybox.matrix = new Matrix4();
  skybox.matrix.translate(10, 19, 10);
  skybox.matrix.scale(-20, -20, -20);

  skybox.color = [0.0, 0.0, 1.0, 1.0];
  skybox.textureNum = 3;

  //console.log("test");
  leftArm = new Cube();
  leftArm.matrix = new Matrix4();
  leftArm.matrix.translate(5, 0, 5);
  leftArm.color = [1.0, 1.0, 0.0, 1.0];
  leftArm.matrix.rotate(angleSlider2, 0, 0, 1);
  leftArm.matrix.scale(x, y, z);
  leftArm.textureNum = 4;


  var ground = new Cube();
  ground.matrix = new Matrix4();
  ground.color = [0.4, 0.5, 0.3, 1.0];
  ground.textureNum = 0;
  ground.matrix.translate(-10, -1, -10);
  ground.matrix.scale(20, 0.2, 20);
  //ground.normalMatrix.setInverseOf(ground.matrix).transpose();

  right = new Cube();
  right.matrix = new Matrix4();

  right.matrix.translate(4,0,0);
  right.color = [1.0, 1.0, 0.0, 1.0];
  //right.textureNum = 3;
  right.matrix.rotate(angleSlider2, 0, 0, 1);
  right.matrix.scale(x,y,z);
  //right.normalMatrix.setInverseOf(right.matrix).transpose();
  

  var test = new Sphere();
  test.matrix = new Matrix4();
  test.matrix.scale(2,2,2);
  blocks.push(test);
  blocks.push(skybox);
  blocks.push(right);
  blocks.push(leftArm);
  blocks.push(ground);

  lightRef = new Cube();
  lightRef.matrix.translate(1, 1, 1);
  lightRef.matrix.scale(-2,-2,-2);
  lightRef.normalMatrix.setInverseOf(lightRef.matrix).transpose();
  lightRef.type = "light";

  let walls = [[3,3,3,3,3,3,3,3],
  [3,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,3],
  [3,0,0,0,0,0,0,3],
  [3,3,3,3,3,3,3,3]
];
  blocks.push(lightRef);
  blocks.push(...dispense_tiles(walls));
  //blocks.push(...dispense_tiles(test));
  console.log(blocks);
  return blocks;
}


function updateAnimationAngles(){
  for(let i = 0; i < all_blocks.length; i++){
    if(all_blocks[i].type === "light"){
      //console.log(g_lightAngle);
      //console.log(lightRef.matrix.elements);
    }
    //all_blocks[i].normalMatrix.setInverseOf(all_blocks[i].matrix).transpose();
    all_blocks[i].render();
  }
  //var test = new Cube();
  //test.matrix = new Matrix4();
  //test.matrix.rotate(g_lightAngle, 0,1,0);
  //test.normalMatrix.setInverseOf(test.matrix).transpose();
  //test.matrix.translate(0,5,0);

  //console.log(test.render());

  //console.log(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  //lightRef.matrix.translate(g_LightX, g_LightY, g_LightZ);
  //console.log(g_LightX, g_LightY, g_LightZ);
}

function translate_to(cube1, cube2, offset){
  let v = new Vector3([0,0.75,0]);
  if (offset){
    v.add(offset);
  }
  let y_vector = cube1.matrix.multiplyVector3(v);
  cube2.matrix.translate(y_vector.elements[0], y_vector.elements[1], y_vector.elements[2]);
}

function dispense_tiles(arr){
  returnable = [];
  for (let x = 0; x < arr.length; x++){
    for(let z = 0; z < arr[x].length; z++){
      if (arr[x][z] != 0){
        for (let j = 1; j <= arr[x][z]; j++ ){
          var pee = new Cube();
          pee.matrix = new Matrix4();
          pee.matrix.translate(x, j, z);
          console.log(pee.matrix.elements);
          returnable.push(pee);
        }
      }
    }
  }
  return returnable;

}