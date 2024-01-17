const DirectionBoar = {
    UP: 0,
    DOWN: 2,
    LEFT: 1,
    RIGHT: 3,
};
class Boar {
    constructor(game, x, y, path) {
        Object.assign(this, { game, x, y, path });
        this.x = x;
        this.y = y;
        this.speed = 0.5;

        this.height = 64;
        this.width = 64; 
        this.radius = 60;
        this.faceleft = false;
        this.healthbar= new HealthBar(this);
        this.hitpoints = 100;
        this.maxhitpoints = 100;

        this.visualRadius = 150;
        this.initialPoint = {};
        this.initialPoint.x = x;
        this.initialPoint.y = y;

        this.spritesheetWalking = ASSET_MANAGER.getAsset("./sprites/enemy/boarWalk.png");
        this.spritesheetAttack = ASSET_MANAGER.getAsset("./sprites/enemy/boarThrust.png");
        this.spritesheetIdle = ASSET_MANAGER.getAsset("./sprites/enemy/boarIdle.png");
        this.targetID = 0;
        if (this.path && this.path[this.targetID]) this.target = this.path[this.targetID];

        var dist = distance(this, this.target);
        this.maxSpeed = 70; // pixels per second
        //speed invovle in x, y this case since there are different direciton
        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
        this.state = 0; // 0 walking, 1 attacking, 2 dead

        this.facing = 0; // 0 = up, clockwise

        this.elapsedTime = 0;
        this.animations = [];
        this.loadAnimations();

        this.directionFace = 0;
        
        this.attackTarget = null;
    };

    loadAnimations(){
        for (var i = 0; i < 3; i++) { // 0 = idle, 1 = walking, 2 = attack
            this.animations.push([]);
            for (var j = 0; j < 4; j++) {  // 4 directions
                this.animations[i].push([]);
            }
        }

        //walking
        this.animations[0][DirectionBoar.DOWN]= new Animator(this.spritesheetWalking, 0, 64*2, 64, 64, 9, 0.2, 0, false, true);
        this.animations[0][DirectionBoar.LEFT]= new Animator(this.spritesheetWalking, 0, 64*1, 64, 64, 9, 0.2, 0, false, true);
        this.animations[0][DirectionBoar.RIGHT]= new Animator(this.spritesheetWalking, 0, 64*3, 64, 64, 9, 0.2, 0, false, true);
        this.animations[0][DirectionBoar.UP]= new Animator(this.spritesheetWalking, 0, 0, 64, 64, 9, 0.2, 0, false, true);

        this.animations[1][DirectionBoar.DOWN]= new Animator(this.spritesheetAttack, 0, 64*2, 64, 64, 8, 0.2, 0, false, true);
        this.animations[1][DirectionBoar.LEFT]= new Animator(this.spritesheetAttack, 0, 64*1, 64, 64, 8, 0.2, 0, false, true);
        this.animations[1][DirectionBoar.RIGHT]= new Animator(this.spritesheetAttack, 0, 64*3, 64, 64, 8, 0.2, 0, false, true);
        this.animations[1][DirectionBoar.UP]= new Animator(this.spritesheetAttack, 0, 0, 64, 64, 8, 0.2, 0, false, true);

        this.animations[2][DirectionBoar.DOWN]= new Animator(this.spritesheetIdle, 0, 64*2, 64, 64, 7, 0.2, 0, false, true);
        this.animations[2][DirectionBoar.LEFT]= new Animator(this.spritesheetIdle, 0, 64*1, 64, 64, 7, 0.2, 0, false, true);
        this.animations[2][DirectionBoar.RIGHT]= new Animator(this.spritesheetIdle, 0, 64*3, 64, 64, 7, 0.2, 0, false, true);
        this.animations[2][DirectionBoar.UP]= new Animator(this.spritesheetIdle, 0, 0, 64, 64, 7, 0.2, 0, false, true);

       
    }



    // };s
    update() {
       // this.updateBB();
    
        this.elapsedTime += this.game.clockTick;



        var dist = distance(this, this.target);
        var dist = distance(this, this.target);
        if (dist < 5) {
            if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
                this.targetID++;
            }
            this.target = this.path[this.targetID];
        }
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];

            if (ent instanceof Dog || ent instanceof MainCharacter && canSee(this, ent)) {
                this.target = ent;
                this.attackTarget = ent;

            }
            //size of FarmLandBigTree: 99,127
            if (ent instanceof Dog || ent instanceof MainCharacter  && collide(this,  ent)) {
                if (this.state === 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                 //   console.log("Fighting");

                 } 
            //    if (this.elapsedTime > 0.8) {
            //        var damage = 7 + randomInt(4);
            //        ent.hitpoints -= damage;
            //          this.game.addEntity(new Score(this.game, ent.x, ent.y, damage));
            //          this.elapsedTime = 0;
            //          if( ent.hitpoints<=0){
            //             ent.removeFromWorld = true
            //          }
            //      }
            }
           
        }
        if (this.state !== 1 ) {
            console.log(this.target.x + "," + this.target.y);
            console.log(this.x  + "," + this.y);

            if(this.targetID == this.path.length - 1 && Math.abs(this.x - this.target.x)  < 1 &&Math.abs( this.y - this.target.y) < 1){
                console.log("ger");
                this.state = 2;
            } else {
                dist = distance(this, this.target);
                this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
                this.x += this.velocity.x * this.game.clockTick;
                this.y += this.velocity.y * this.game.clockTick;
            }
            // console.log("ger");
            // dist = distance(this, this.target);
            // this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
            // this.x += this.velocity.x * this.game.clockTick;
            // this.y += this.velocity.y * this.game.clockTick;
            
        }
        this.facing = this.getFacingForBoarOnly(this.velocity);
        if(this.attackTarget){
            if( !collide(this, this.attackTarget)) this.state = 0;
            if( !canSee(this,this.attackTarget )) {
                
        
                this.target = this.path[this.targetID];
              
            };
        }

        
       
        if(Math.abs(this.x - this.target.x)  < 1 &&Math.abs( this.y - this.target.y) < 1){
            console.log("ger");
            this.state = 2;
        }


    
    };

    draw(ctx) {
       
        
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick,ctx,this.x - this.game.camera.x - (this.width),this.y - this.game.camera.y - (this.height) ,2*PARAMS.SCALE);

      




        if (PARAMS.DEBUG) {
            ctx.stroke();

          

            ctx.strokeStyle = "Red";
            ctx.beginPath();
            ctx.arc(this.x - this.game.camera.x , this.y - this.game.camera.y  , this.radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();


            ctx.setLineDash([5, 15]);
            ctx.beginPath();
            ctx.arc(this.x - this.game.camera.x , this.y - this.game.camera.y , this.visualRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();

            ctx.setLineDash([]);
        }

        this.healthbar.draw(ctx);
    };
    getFacingForBoarOnly(velocity) {
        if (velocity.x === 0 && velocity.y === 0) return 4;
        let angle = Math.atan2(velocity.y, velocity.x) / Math.PI;
    
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
    
        // Determine the direction based on angle
         // Determine the direction based on angle
        if (angle >= 0 && angle < 1/4) {
            return DirectionBoar.RIGHT;
        } else if (angle >= 1/4 && angle < 1/2) {
            return DirectionBoar.DOWN;
        } else if (angle >= 1/2 && angle < 3/4) {
            return DirectionBoar.LEFT;
        } else {
            return DirectionBoar.UP;
        }
    };
};