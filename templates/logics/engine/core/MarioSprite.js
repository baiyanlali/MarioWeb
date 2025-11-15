export default class MarioSprite{
    type
    initialCode
    x; y; xa; ya;
    width; height; facing
    alive
    world

    constructor(x, y, type){
        this.x = x
        this.y = y
        this.xa = 0
        this.ya = 0
        this.facing = 1
        this.alive = true
        this.world = null
        this.width = 16
        this.height = 16
        this.initialCode = ""
        this.type = type
    }

    clone(){
        return new MarioSprite();
    }

    added(){}
    removed(){}
    getMapX(){return Math.floor(this.x / 16)}
    getMapY(){return Math.floor(this.y / 16)}

    render(og){}
    update(){}
    collideCheck(){}
    bumpCheck(xTile, yTile){}
    shellCollideCheck(shell){return false}
    release(mario){}
    fireballCollideCheck(fireball){return false}
}