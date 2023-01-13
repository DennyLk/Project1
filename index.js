const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
	constructor() {
		
		
		this.velocity = {
			x: 0,
			y: 0
		}
		
		
		const image = new Image()
		image.src = './img/spaceship.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
			x: canvas.width / 2 - this.width /2,
			y: canvas.height - this.height - 20
		}
			}
		
		
	}
	draw() {
		
		
		
		c.drawImage(
		this.image,
		this.position.x, 
		this.position.y, 
		this.width, 
		this.height
		)
		
	}
	update() {
		if(this.image) {
		this.draw()
		this.position.x += this.velocity.x
		}
	}
}
class Invader {
	constructor({position}) {
		
		
		this.velocity = {
			x: 0,
			y: 0
		}
		
		
		const image = new Image()
		image.src = './img/invaderr.png'
		image.onload = () => {
			const scale = 0.15
			this.image = image
			this.width = image.width * scale
			this.height = image.height * scale
			this.position = {
			x: position.x,
			y: position.y
		}
			}		
}
	draw() {
		
		c.drawImage(
		this.image,
		this.position.x, 
		this.position.y, 
		this.width, 
		this.height
		)
		
	}
	update() {
		if(this.image) {
		this.draw()
		this.position.x += this.velocity.x
		this.position.x += this.velocity.y
		}
	}
}
class Grid {
	constructor(){
		this.position = {
			x: 0,
			y: 0
		}
		
		this.velocity = {
			x: 0,
			y: 0
		}
		
		this.invaders = []
		for (let i = 0; i < 10; i++){
			this.invaders.push(
			new Invader({
				position: {
					x: i * 80,
					y: 0
				}
			}))
		}
	}
	update() {
		
	}
}

class Projectile {
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity
		
		this.radius = 3
	}
	draw() {
		c.beginPath()
		c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
		c.fillStyle = 'red'
		c.fill()
		c.closePath()
	}
	
	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}
}


const player = new Player()
const projectiles = []
const grids = [new Grid]
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}


function animate() {
	requestAnimationFrame(animate)
	c.fillStyle = 'black' 
	c.fillRect(0, 0, canvas.width, canvas.height)
	
	player.update()
	projectiles.forEach((projectile, index) => {
		if(projectile.position.y + projectile.radius <= 0){
		setTimeout(()=>{
			projectiles.splice(index, 1)
		}, 0)
		projectiles.splice(index, 1)	
		} else{
			projectile.update()
		}
		
	})
	
	grids.forEach((grid) => {
		grid.update()
		grid.invaders.forEach((invader, i) => {
			invader.update()
			
			projectiles.forEach((projectile, j) => {
				if(
				projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
				projectile.position.x + projectile.radius >= invader.position.x &&
				projectile.position.x - projectile.radius <= invader.position.x
				){
					setTimeout(() => {
						grid.invaders.splice(i, 1)
						projectiles.splice(j, 1)
					}, 0)
				}
			})
		})
	})
	
	if(keys.a.pressed && player.position.x >= 0){
		player.velocity.x = -7
		
	} else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
		player.velocity.x = 7
	}		else {
		player.velocity.x = 0
	}
}
animate()

addEventListener('keydown', ({ key }) => {
switch (key) {
case 'a':
keys.a.pressed = true
break
case 'd':
keys.d.pressed = true
break
case ' ':
projectiles.push(new Projectile({
	position: {
		x: player.position.x + player.width / 2,
		y: player.position.y
	},
	velocity: {
		x: 0,
		y: -10
	}
}))

break
}	
})

addEventListener('keyup', ({ key }) => {
switch (key) {
case 'a':

keys.a.pressed = false
break
case 'd':

keys.d.pressed = false

break
case ' ':

break
}	
})