export class Rectangle {
    
    constructor(x, y, h, w, color="black", rot=0){
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.color = color;
        this.rot = rot;
        this.angle = 0
    }

    render(ctx){
        ctx.fillStyle = this.color;
        
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rot)
        ctx.fillRect(-this.w/2,- this.h/2, this.w, this.h)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    rotatation(angle){
        this.rot = (Math.PI/180)*angle
    }

    rotate(angle){
        this.angle += angle
        this.rotatation(this.angle)
    }
}