// ================== Class =====================

class Rendable {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.isRendable = true
    }

    render(ctx){
        if (this.isRendable && 0 < this.x < canvas.width || 0 < this.y < canvas.height){
            ctx.translate(this.x, this.y)
            this.onRender(ctx)
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
            this.isRendable = false
        }
        
    }

    onRender(){
        //TODO
    }

    onIteract(){
        // TODO
    }

    interact(other){

    }

    getRadius(){
        return 0
    }

    stopRender(){
        removeElementFromList(drawables, this)
    }
}
class Rectangle extends Rendable {
    
    constructor(x, y, h, w, color="black", rot=0, offsetX=0, offsetY=0){
        super(x,y)
        this.h = h;
        this.w = w;
        this.color = color;
        this.rot = rot;
        this.angle = 0
        this.offsetX = offsetX
        this.offsetY = offsetY
    }

    onRender(ctx){
        ctx.fillStyle = this.color;
        ctx.rotate(this.rot)
        ctx.translate(this.offsetX, this.offsetY)
        ctx.fillRect(-this.w/2,- this.h/2, this.w, this.h)
    }

    rotatation(angle){
        this.rot = (Math.PI/180)*angle
    }

    rotate(angle){
        this.angle += angle
        this.rotatation(this.angle)
    }
}

class Text extends Rendable{
    constructor(x, y){
        super(x, y)
    }

    onRender(ctx){
        ctx.font = '30px serif';
        ctx.fillStyle = "back"
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        ctx.fillText("score"+score.toString(), this.x, this.y)
    }
}
class Circle extends Rendable{
    constructor(x, y, radius, color="black",){
        super(x, y)
        this.radius = radius;
        this.color = color;
    }

    onRender(ctx){
        ctx.beginPath()
        ctx.fillStyle = this.color;
        ctx.arc(0,0, this.radius, 0, 2*Math.PI)
        ctx.fill()
        ctx.closePath()
    }

    getRadius(){
        return this.radius
    }
}

class Canon extends Rendable {
    constructor(x, y){
        super(x, y)
        this.rect = new Rectangle(x, y, 20, 40, "Black", 0, -30, 0);
        this.circle = new Circle(x, y, 30, "RED")
        this.fireTic = 0
        this.fireRate = 30
        this.rotSpeed = 2
        this.fire = false
    }

    render(ctx){
        this.rect.render(ctx)
        this.circle.render(ctx)
        
        this.onUpdate()
    }

    onUpdate(){
        if (this.fire){
            this.fireTic+=1
            if (this.fireTic> this.fireRate){
                this.fireTic = 0
                this.fire = false
            }
        }
        this.circle.color = "rgb("+255*(this.fireTic/this.fireRate)+", "+255*(1-this.fireTic/this.fireRate)+", 0)"
        if (keys["a"]) {
            this.rect.rotate(this.rotSpeed)
        } 
        if (keys["e"]){
            this.rect.rotate(-this.rotSpeed)
        }
        if (keys["z"] && !this.fire){
            drawables.unshift(new Ball(this.x, this.y, 6, 4, Math.PI+this.rect.rot))
            this.fire = true
            
        }
    }

}

class Ball extends Rendable{
    constructor(x, y, radius, speed, angle){
        super(x, y)
        this.speed = speed
        this.angle = angle
        this.circle = new Circle(this.x, this.y, radius)
        this.radius = this.circle.radius
    }

    render(ctx){
        this.circle.render(ctx)
        this.circle.x+=this.speed*Math.cos(this.angle)
        this.circle.y+=this.speed*Math.sin(this.angle)
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        interactElements.forEach(elem => elem.interact(this))
    }

    getRadius(){
        return this.circle.radius
    }

    getX(){
        return this.circle.x
    }

    getY(){
        return this.circle.y
    }
}

class Target extends Rendable{
    constructor(radius, color="Blue",){
        super(0,0)
        this.circle = new Circle(this.x, this.y, radius, color)
        this.move()
    }

    move(){
        this.x = Math.random()*canvas.width
        this.y = Math.random()*canvas.height
        this.circle.x = this.x
        this.circle.y = this.y
    }

    render(ctx){
        this.circle.render(ctx)
    }

    interact(other){
        var gradius = this.circle.radius
        if (Math.abs(this.x-other.getX())<gradius &&  Math.abs(this.y-other.getY())<gradius){
            console.log("Touch")
            this.move()
            score += 1
            other.stopRender()
        }
    }
}
// ==================== globals ====================
var score = 0
var canvas = document.getElementById("canvas");
var canon = new Canon(canvas.width/2,5)

var target = new Target(10)
keys = {}
isRun = true
var drawables = [canon, target, new Text(30,0)]
var interactElements = [target]

// ==================== Function ==================


function keyDownHandler(e){
    keys[e.key] = true
}
function keyUpHandler(e){
    keys[e.key] = false
}

function removeElementFromList(list, element){
    var index = list.indexOf(element)
    if (index != -1){
        list.splice(index, 1)
    }
}

function draw() {
    // Recuperation de l'element Canvas
    if (!isRun) return 
    if (canvas.getContext) {
        // Recuperation du contexte du canvas
        var ctx = canvas.getContext("2d");
        // Clear le canvas
        ctx.clearRect(0,0,canvas.width, canvas.height)
        // Affichage de tout les elements du canvas
        drawables.forEach(d => d.render(ctx))
    }
}

// ===================== EntryPoint =======================
console.log("Hello world")
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
setInterval(draw, 1000/60)