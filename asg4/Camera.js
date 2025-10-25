class Camera{

    constructor(){
        this.type = 'camera';
        this.rotate_constant = 0.175; // Pi / 18;
        this.rotate_neg_constant = -0.175;
        this.at_scalar = 100;
        this.at = new Vector3([10,0, 0]).normalize();
        this.eye = new Vector3([0, 10, 0]);
        this.up = new Vector3([0,1,0]);
        this.matrix = new Matrix4();
        this.mouseMove = true;

        document.addEventListener('keydown', (ev)=>{
            if (ev.key === 'w'){
                console.log("test");
                this.move_back();
                //console.log(this.eye);
            }
            if (ev.key === 's'){
                this.move_forwards();
            }
            if (ev.key === 'a'){
                this.move_left();
            }
            if(ev.key === 'd'){
                this.move_right();
            }
            if(ev.key===' ' && ev.target == document.body) {
                ev.preventDefault();
                this.move_up();
            }
            if(ev.key==='Shift') {
                this.move_down();
            }

            if(ev.key === 'j'){
                this.rotate_x(this.rotate_neg_constant);
                //this.at.elements[1] += this.rotate_constant;
            }
            if(ev.key === 'l'){
                //this.at.elements[1] -= this.rotate_constant;
                this.rotate_x(this.rotate_constant);
            }

            if (ev.key === 'i'){
                this.rotate_y(this.rotate_constant);
            }
            if(ev.key === 'k'){
                //this.at.elements[1] -= this.rotate_constant;
                this.rotate_y(this.rotate_neg_constant);
            }

            if (ev.key === 'p') {
                if (this.mouseMove){
                    this.mouseMove = false;
                } else {
                    this.mouseMove = true;
                } 
            }
            if(ev.key === 'm'){
                //this.rotate_y(this.rotate_constant);
                //this.at.elements[1] += this.rotate_constant;
                //this.updateMatrix();
                let test = new Cube();
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);
                test.matrix = new Matrix4();
                test.matrix.rotate(-g_globalAngle,0,1,0);
                test.matrix.translate(...norm.elements);
                //console.log(test.matrix);
                console.log(norm.elements);
                all_blocks.push(test);
            }

            if (ev.key == 'n'){
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);

                let n = new Cube();
                n.matrix = new Matrix4();
                n.matrix.setTranslate(...norm.elements);

                //all_blocks.push(n);

                for (let i = 0; i < all_blocks.length; i++){
                    let block = all_blocks[i];
                    if (Camera.looking(block, norm)){
                        console.log("Yes!!!");
                        all_blocks.splice(i, 1);
                    }else{
                        console.log("no");
                    }
                } 
            }

        });

        document.getElementById("webgl").addEventListener('mousemove',(ev) =>{
            //console.log(ev.movementX);
            let xPos = ev.movementX * Math.PI / 180;
            let yPos = ev.movementY * Math.PI / -180;
            if (this.mouseMove){
                this.rotate(xPos, yPos);
                //this.rotate_y(yPos);
                this.updateMatrix();
            }
        });
        document.getElementById("webgl").addEventListener('mousedown', (ev) =>{
            if (ev.button === 2){
            let test = new Cube();
            let norm = this.get_norm();
            norm.mul(-1);
            norm.add(this.eye);
            test.matrix = new Matrix4();
            test.matrix.rotate(-g_globalAngle,0,1,0);
            test.normalMatrix.setInverseOf(test.matrix).transpose();

            test.matrix.translate(...norm.elements);
            all_blocks.push(test);
            }
            else if (ev.button === 0){
                let norm = this.get_norm();
                norm.mul(-1);
                norm.add(this.eye);

                let n = new Cube();
                n.matrix = new Matrix4();
                n.matrix.setTranslate(...norm.elements);

                //all_blocks.push(n);

                for (let i = 0; i < all_blocks.length; i++){
                    let block = all_blocks[i];
                    if (Camera.looking(block, norm)){
                        console.log("Yes!!!");
                        all_blocks.splice(i, 1);
                    }else{
                        console.log("no");
                    }
                }
            }
        });

        document.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });


    }

    move_forwards(){
        let f = new Vector3(this.eye.elements);
        //console.log(f);
        f.sub(this.at);
        f.normalize();
        this.eye.add(f);
        this.at.add(f);
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }
    move_back(){
        let f = new Vector3(this.eye.elements);
        let zero = new Vector3([0,0,0]);
        f.sub(this.at);
        f.normalize();
        f.mul(-1.5);
        f.add(zero);
        this.eye.add(f);
        this.at.add(f);
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }

    move_left(){
        let dir = new Vector3(this.eye.elements).sub(this.at).normalize();
        let left = Vector3.cross(dir, this.up);
        let zero = new Vector3([0,0,0]);
        left.add(zero);
        this.eye.add(left);
        this.at.add(left);

        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }
    move_right(){
        let dir = new Vector3(this.eye.elements).sub(this.at).normalize();
        let right = Vector3.cross(dir, this.up);
        let zero = new Vector3([0,0,0]);
        right.add(zero);
        this.eye.sub(right);
        this.at.sub(right);
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }
    move_up(){
        let up = new Vector3([0,1,0]);
        this.eye.add(up);
        this.at.add(up);
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }
    move_down(){
        let down = new Vector3([0,-1,0]);
        this.eye.add(down);
        this.at.add(down);
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
        this.updateMatrix();
    }
    rotate_z(rads){

        let dir = new Vector3(this.at.elements);
        let newVec;

        dir.sub(this.eye).normalize();

        let [x, y, z] = dir.elements;
        console.log("XYZ: ", x, y, z);
        let theta = Math.atan2(z, x);
        let mag = Math.sqrt(z*z + y*y + x*x);
        console.log("mag:", mag);

        theta += rads;

        let newZ, newX;
        newZ = Math.sin(theta);
        newX = Math.cos(theta);

        newVec = new Vector3([newX, 0, newZ]);
        newVec.mul(mag);
        newVec.add(this.eye);
        //console.log("mag:", mag);
        
        this.at.elements[0] = newVec.elements[0];
        this.at.elements[2] = newVec.elements[2]; 
        this.updateMatrix();
        console.log("at", this.at.elements[0], this.at.elements[1], this.at.elements[2]);
        console.log("eye", this.eye.elements[0], this.eye.elements[1], this.eye.elements[2]);
    }

    rotate(rads, asimuth){
        let dir = new Vector3(this.at.elements);
        let newX, newY, newZ;
        dir.sub(this.eye);

        // one issue - i think x, y, z is actually mapped to x, z, -y
        let [x, z, y] = dir.elements;
        y = y * -1;

        console.log("XYZ: ", x, y, z, "rads: ", rads);

        let mag   =  Math.sqrt(z*z + x*x + y*y);
        let theta =  Math.acos(z/mag);
        let phi   =  Math.atan2(y, x)
        
        phi -= rads; 
        theta -= asimuth;
        newX = Math.cos(phi) * Math.sin(theta) * mag;

        newY = Math.sin(phi) * Math.sin(theta) * mag;

        newZ = Math.cos(theta) * mag;
        
        this.at.elements[0] = newX;
        this.at.elements[1] = newZ;
        this.at.elements[2] = newY * -1;
        // issue 2: did i ever manage like, 
        // proper mapping of values from global
        this.updateMatrix();

    }

    rotate_y(rads){
        let dir = new Vector3(this.at.elements);
        let newX, newY, newZ;
        dir.sub(this.eye);

        // one issue - i think x, y, z is actually mapped to x, z, -y
        let [x, z, y] = dir.elements;
        y = y * -1;

        console.log("XYZ: ", x, y, z, "rads: ", rads);

        let mag   =  Math.sqrt(z*z + x*x + y*y);
        let theta =  Math.acos(z/mag);
        let phi   =  Math.atan2(y, x)
        
        theta -= rads;

        newX = Math.cos(phi) * Math.sin(theta) * mag;

        newY = Math.sin(phi) * Math.sin(theta) * mag;

        newZ = Math.cos(theta) * mag;
        
        this.at.elements[0] = newX;
        this.at.elements[1] = newZ;
        this.at.elements[2] = newY * -1;
        // issue 2: did i ever manage like, 
        // proper mapping of values from global
        this.updateMatrix();

    }

    static looking(cube, point){
        //if the camera is looking at the cube, return true; 
        let [px, py, pz] = point.elements;

        let a = cube.matrix.multiplyVector3(new Vector3([1,1,1]));
        let [ax, ay, az] = a.elements;

        let d = new Vector3(a.elements).add_arr([1,1,1]); //horrible
        let [dx, dy, dz] = d.elements;

        //compare x, z, y
        if (Math.abs(ax - px) <= Math.abs(ax-dx)){

            if (Math.abs(az - pz) <= Math.abs(az - dz)){

                if(Math.abs(ay - py) <= Math.abs(ay - dy)){
                    return true;
                }
            }
            
        }
        return false;

    }

    get_norm(){
        return new Vector3(this.eye.elements).sub(this.at).normalize();
    }

    push_to_GLSL(gl, matrixName){
        gl.uniformMatrix4fv(matrixName, false, this.matrix.elements);
    }
    
    updateMatrix(){
        let test = [...this.eye.elements, ...this.at.elements, ...this.up.elements];
        this.matrix.setLookAt(...test);
    }

}