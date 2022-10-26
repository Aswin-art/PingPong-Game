const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

canvas.width = 800
canvas.height = 500

const menu = document.getElementById('menu')
const pause = document.getElementById('pause')
const gameover = document.getElementById('gameover')

function isCrashPlayer(first, second){
    return first.position.x + first.radius > second.position.x &&
        first.position.x < second.position.x + second.width &&
        first.position.y + first.radius < second.position.y + second.height &&
        first.position.y > second.position.y
}

function isCrashEnemy(first, second){
    return first.position.x + first.radius > second.position.x + second.width &&
        first.position.x < second.position.x + second.width &&
        first.position.y + first.radius < second.position.y + second.height &&
        first.position.y > second.position.y
}

function isPass(ball){
    return ball.position.x + ball.radius < 0 ||
        ball.position.x + ball.radius > canvas.width
}

class Ball{
    constructor(position){
        this.radius = 15
        this.position = {
            x: position.x - this.radius - 10,
            y: position.y + (position.y / 2) - 30
        }
        this.color = 'red'
        this.speed = 5
        this.maxSpeedX = 0
        this.maxSpeedY = 0
    }

    move(){
        this.maxSpeedX = -this.speed
        this.maxSpeedY = this.speed - 4.5
    }

    draw(ctx){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
    }

    update(){
        this.position.x += this.maxSpeedX
        this.position.y += this.maxSpeedY
    }
}

class Enemy{
    constructor(){
        this.width = 15
        this.height = 130
        this.position = {
            x: 0,
            y: canvas.height / 2 - this.height / 2
        }
        this.color = 'white'
        this.speed = 10
        this.maxSpeed = 0
    }

    moveUp(){
        this.maxSpeed = -this.speed
    }

    moveDown(){
        this.maxSpeed = this.speed
    }

    stop(){
        this.maxSpeed = 0
    }

    draw(ctx){
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        if(this.position.y + this.height > canvas.height){
            this.position.y = canvas.height - this.height
        }

        if(this.position.y < 0){
            this.position.y = 0
        }
        this.position.y += this.maxSpeed
    }
}

class Player{
    constructor(){
        this.width = 15
        this.height = 130
        this.position = {
            x: canvas.width - this.width,
            y: canvas.height / 2 - this.height / 2
        }
        this.color = 'white'
        this.speed = 10
        this.maxSpeed = 0
    }

    moveUp(){
        this.maxSpeed = -this.speed
    }

    moveDown(){
        this.maxSpeed = this.speed
    }

    stop(){
        this.maxSpeed = 0
    }

    draw(ctx){
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        if(this.position.y + this.height > canvas.height){
            this.position.y = canvas.height - this.height
        }

        if(this.position.y < 0){
            this.position.y = 0
        }

        this.position.y += this.maxSpeed
    }
}

class InputHandler{
    constructor(game){
        // if(!game.play){
        //     return
        // }

        document.addEventListener('keydown', (e) => {
            switch(e.key){
                case 'w':
                    game.enemy.moveUp()
                    break;
                case 's':
                    game.enemy.moveDown()
                    break;
                case 'ArrowUp':
                    game.player.moveUp()
                    break;
                case 'ArrowDown':
                    game.player.moveDown()
                    break;
                case ' ':
                    if(game.play){
                        return
                    }else{
                        game.play = true
                        game.ball.move()
                    }
                    break;
            }
        })

        document.addEventListener('keyup', (e) => {
            switch(e.key){
                case 'w':
                    game.enemy.stop()
                    break;
                case 's':
                    game.enemy.stop()
                    break;
                case 'ArrowUp':
                    game.player.stop()
                    break;
                case 'ArrowDown':
                    game.player.stop()
                    break;
            }
        })
    }
}

class Game{
    constructor(){
        this.setup()
    }

    setup(){
        this.play = false
        this.enemy = new Enemy()
        this.player = new Player()
        this.ball = new Ball(this.player.position)
        new InputHandler(this)
    }

    draw(ctx){
        [this.enemy, this.player, this.ball].forEach(item => item.draw(ctx))
    }

    update(){
        [this.enemy, this.player, this.ball].forEach(item => item.update())

        if(isCrashPlayer(this.ball, this.player)){
            this.ball.maxSpeedX = -this.ball.maxSpeedX
            this.ball.maxSpeedY *= -1
            // this.ball.position.y = this.player.position.y - this.ball.radius;
        }

        if(isCrashEnemy(this.ball, this.enemy)){
            this.ball.maxSpeedX = -this.ball.maxSpeedX
            this.ball.maxSpeedY *= -1
            // this.ball.position.y = this.enemy.position.y - this.ball.radius;
        }

        if(isPass(this.ball)){
            gameover = true
        }
    }
}

const game = new Game()

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    game.update()
    game.draw(ctx)
    requestAnimationFrame(animate)
}

animate()