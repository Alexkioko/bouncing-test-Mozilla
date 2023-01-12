// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const p = document.querySelector('p');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define Ball constructor

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size ) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false,
    writable: true
});
//define the evilCircle constructor
function EvilCircle(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}
EvilCircle.prototype = Object.create(Shape.prototype);
Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false,
    writable: true
});
const evilSize = 10;
let evil = new EvilCircle(
    random(0 + evilSize, width - evilSize),
    random(0 + evilSize, height - evilSize),
    20,
    20,
    true,
    'white',
    evilSize,
);
// define ball draw method
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};
// define ball update method
Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j]) && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

//define evilcircle draw method
EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};
//check if the evilcircle gets to the edges of the circle
EvilCircle.prototype.checkBounds = function() {
    if((this.x + this.size) >= width) {
        this.x = (width - (this.size * 2));
    }
    
    if((this.x - this.size) <= 0) {
       this.x = (0 + (this.size * 2));
    }
    
    if((this.y + this.size) >= height) {
        this.y = (height - (this.size * 2));
    }
    
    if((this.y - this.size) <= 0) {
        this.y = (0 + (this.size * 2));
    }
}
//method to set controls to move the eveil circle
EvilCircle.prototype.setControls = function() {
    let _this = this;
    window.onkeydown = function(e) {
        if (e.key === 'a') {
            _this.x -= _this.velX;
        } else if (e.key === 'd') {
            _this.x += _this.velX;
        } else if (e.key === 'w') {
            _this.y -= _this.velY;
        } else if (e.key === 's') {
            _this.y += _this.velY;
        }
    };
};

//collison detect method for the evil 
EvilCircle.prototype.collisionDetect = function() {
    let count = balls.length;
    for(let i = 0; i < balls.length; i++) {
        if(balls[i].exists) {
            const dx = this.x - balls[i].x;
            const dy = this.y - balls[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < this.size + balls[i].size) {
                balls[i].exists = false;
                balls.splice(i, 1);
                count--;
                return count;
            }
        }
    }
    p.textContent = `Ball Count: ${count}`;
};



// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    true,
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  evil.draw();
  evil.checkBounds();
  evil.setControls();
  evil.collisionDetect();

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();