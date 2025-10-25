class Cube{
    constructor(){
        this.type = 'cube';
        //this.vertices = 
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        //this.segments = 10;
        this.buffer = null;
        this.uvBuffer = null;
        this.normalBuffer = null;
        this.offset = 0;
        this.textureNum = 2;
    }
    
    render(){

    if (this.buffer === null){
      this.buffer = gl.createBuffer();
      if (!this.buffer) {
      console.log('Failed toi create the buffer object');
      return -1; 
    }
    }
    if (this.uvBuffer === null){
      this.uvBuffer = gl.createBuffer();
     if (!this.uvBuffer) {
      console.log('Failed toi create the UVBUFFER object');
      return -1; 
    }
    }
    if (this.normalBuffer === null){
      this.normalBuffer = gl.createBuffer();
      if(!this.normalBuffer){
        console.error("Failed to create the NORMALBUFFER object");
        return -1;
      }
    }

    gl.uniform1i(u_whichOne, this.textureNum);
    //gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    const uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!uFragColor){
        console.log("Failed to get color");
    }
    var rgb = this.color;

    gl.uniform4f(uFragColor, rgb[0], rgb[1], rgb[2], rgb[3]);


    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
    //front
    //renderTriangle3DUV(this.uvBuffer, [0,0, 1, 1, 1, 0]);
    //renderTriangle3D(this.buffer, [0,0,0, 1,1,0, 1,0,0], this.color);
    renderTrinagle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1, 1, 1, 0], [0,0,-1, 0,0,-1, 0,0,-1], this.buffer, this.uvBuffer, this.normalBuffer);
    //renderTriangle3DUV(this.uvBuffer, [0,0, 0, 1, 1, 1]);
    //renderTriangle3D(this.buffer, [0,0,0, 0,1,0, 1,1,0], this.color);
    renderTrinagle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0, 1, 1, 1], [0,0,-1, 0,0,-1, 0,0,-1], this.buffer, this.uvBuffer, this.normalBuffer);

    //back
    //gl.uniform4f(uFragColor, rgb[0]*0.4,rgb[1]*0.4 ,rgb[2]*0.4, rgb[3]*0.4);

    //renderTriangle3DUV(this.uvBuffer, [1,0, 0, 1, 0, 0]);
    //renderTriangle3D(this.buffer, [0,0,1, 1,1,1, 1,0,1], this.color);

    renderTrinagle3DUVNormal([0,0,1, 1,1,1, 1,0,1],[1,0, 0, 1, 0, 0], [0,0,1, 0,0,1, 0,0,1], this.buffer, this.uvBuffer, this.normalBuffer);

    //renderTriangle3DUV(this.uvBuffer, [1,0, 1, 1, 0, 1]);
    //renderTriangle3D(this.buffer, [0,0,1, 0,1,1, 1,1,1], this.color);
    renderTrinagle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [1,0, 1, 1, 0, 1], [0,0,1, 0,0,1, 0,0,1], this.buffer, this.uvBuffer, this.normalBuffer);


    //gl.uniform4f(uFragColor, rgb[0]*0.9,rgb[1]*0.9 ,rgb[2]*0.9, rgb[3]*0.9);
    //top
    //renderTriangle3DUV(this.uvBuffer, [0,1, 1, 1, 1, 0]);
    //renderTriangle3D(this.buffer, [0,1,0, 0,1,1, 1,1,1], this.color);
    renderTrinagle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,1, 1, 1, 1, 0], [0,1,0, 0,1,0, 0,1,0], this.buffer, this.uvBuffer, this.normalBuffer);

    //renderTriangle3DUV(this.uvBuffer, [0,1, 1, 0, 0, 0]);
    //renderTriangle3D(this.buffer, [0,1,0, 1,1,1, 1,1,0], this.color);    
    renderTrinagle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,1, 1, 0, 0, 0], [0,1,0, 0,1,0,0,1,0],this.buffer, this.uvBuffer, this.normalBuffer);

    
    //gl.uniform4f(uFragColor, rgb[0]*0.8,rgb[1]*0.8 ,rgb[2]*0.8, rgb[3]*0.9);
    //right side
    //renderTriangle3DUV(this.uvBuffer, [0, 0, 0, 1, 1, 1]);
    //renderTriangle3D(this.buffer, [1,0,0, 1,1,0, 1,1,1], this.color);
    renderTrinagle3DUVNormal([1,0,0, 1,1,0, 1,1,1], [0, 0, 0, 1, 1, 1], [1,0,0,1,0,0,1,0,0], this.buffer, this.uvBuffer, this.normalBuffer);

    //renderTriangle3DUV(this.uvBuffer, [0, 0, 1, 1, 1, 0]);
    //renderTriangle3D(this.buffer, [1,0,0, 1,1,1, 1,0,1], this.color);    
    renderTrinagle3DUVNormal([1,0,0, 1,1,1, 1,0,1], [0, 0, 1, 1, 1, 0], [1,0,0, 1,0,0, 1,0,0], this.buffer, this.uvBuffer, this.normalBuffer);

    //bottom
    //gl.uniform4f(uFragColor, rgb[0],rgb[1]*0.4 ,rgb[2]*0.8, rgb[3]*0.9);
    //renderTriangle3DUV(this.uvBuffer, [0,0, 1, 1, 1, 0]);
    //renderTriangle3D(this.buffer, [0,0,0, 1,0,1, 0,0,1], this.color);
    renderTrinagle3DUVNormal([0,0,0, 1,0,1, 0,0,1], [0,0, 1, 1, 1, 0], [0,-1,0,0,-1,0,0,-1,0], this.buffer, this.uvBuffer, this.normalBuffer);

    //renderTriangle3DUV(this.uvBuffer, [0,0, 0, 1, 1, 1]);
    //renderTriangle3D(this.buffer, [0,0,0, 1,0,0, 1,0,1], this.color);
    renderTrinagle3DUVNormal([0,0,0, 1,0,0, 1,0,1], [0,0, 0, 1, 1, 1], [0,-1,0,0,-1,0,0,-1,0], this.buffer, this.uvBuffer, this.normalBuffer);


    //gl.uniform4f(uFragColor, rgb[0]*0.4,rgb[1] ,rgb[2]*0.8, rgb[3]*0.9);
    //left
    //renderTriangle3DUV(this.uvBuffer, [1,0, 1, 1, 0, 1]);
    //renderTriangle3D(this.buffer, [0,0,0, 0,1,0, 0,1,1], this.color);
    renderTrinagle3DUVNormal([0,0,0, 0,1,0, 0,1,1], [1,0, 1, 1, 0, 1], [-1,0,0,-1,0,0,-1,0,0], this.buffer, this.uvBuffer, this.normalBuffer);

    //renderTriangle3DUV(this.uvBuffer, [1,0, 0, 1, 0, 0]);
    //renderTriangle3D(this.buffer, [0,0,0, 0,1,1, 0,0,1], this.color);
    renderTrinagle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [1,0, 0, 1, 0, 0], [-1,0,0,-1,0,0,-1,0,0], this.buffer, this.uvBuffer, this.normalBuffer);

    return 1;

}
    moveYBySin(time){
        this.matrix.translate(0.0, Math.sin(time += this.offset), 0.0);
    }
    static createTriangleCoords(x, y, scale = 1){
      return [ (0.5/scale) + x, (Math.sqrt(3)/scale) + y, 0 + x,0 + y, (1/scale) + x, 0+ y]
    }
  
}
  