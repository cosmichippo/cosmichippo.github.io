

class Sphere{
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
        this.textureNum = 4;
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
    
    let uFragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    gl.uniform1i(u_whichOne, this.textureNum);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

    let rgb = this.color;

    gl.uniform4f(uFragColor, rgb[0], rgb[1], rgb[2], rgb[3]);


    let dd = Math.PI / 10;
    let d  = Math.PI / 10;

    for (let i = 0; i < Math.PI; i += d){
        for(let j = 0; j < (Math.PI * 2); j+= d){
            let p1 = [Math.sin(i) * Math.cos(j), Math.sin(i) * Math.sin(j), Math.cos(i)];
            let p2 = [Math.sin(i + dd) * Math.cos(j), Math.sin(i +dd)* Math.sin(j), Math.cos(i+dd)];
            let p3 = [Math.sin(i)*Math.cos(j+dd), Math.sin(i)* Math.sin(j+dd), Math.cos(i)];
            let p4 = [Math.sin(i+dd)*Math.cos(j+dd), Math.sin(i+dd)*Math.sin(j+dd), Math.cos(i+dd)];
            
            let v = [];
            let uv = [];

            v = v.concat(p1);
            v = v.concat(p2);
            v = v.concat(p4);
            uv = [0,0,0,0,0,0];

            gl.uniform4f(uFragColor, rgb[0], rgb[1], rgb[2], rgb[3]);

            renderTrinagle3DUVNormal(v, uv, v, this.buffer, this.uvBuffer, this.normalBuffer);

            v = []; uv = [];
            v = v.concat(p1).concat(p4).concat(p3);
            uv = [0,0,0,0,0,0];

            gl.uniform4f(uFragColor, rgb[0], rgb[1], rgb[2], rgb[3]);

            renderTrinagle3DUVNormal(v, uv, v, this.buffer, this.uvBuffer, this.normalBuffer);

        }
    }

    }
}