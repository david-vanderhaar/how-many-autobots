import { BaseScene } from './BaseScene.js';
import { BaseCharacter } from '../characters/BaseCharacter.js';

export class CharacterPreview extends BaseScene {
  constructor() {
    super('CharacterPreview');

    this.characters = [];
    this.projectiles = null;
  }

  create() {
    super.create();

    const optimus = BaseCharacter(this, {
      name: 'optimus',
      spritesheetName: 'optimus',
      x: 800,
      y: 470,
    });

    optimus.initializeAnimations();
    optimus.startAnimationPreview();
    optimus.initializePhysics();
    this.characters.push(optimus);
    
    const decepticon = BaseCharacter(this, {
      name: 'decepticon',
      spritesheetName: 'decepticon',
      x: 200,
      y: 470,
    });

    decepticon.initializeAnimations();
    decepticon.startAnimationPreview();
    decepticon.initializePhysics();
    this.characters.push(decepticon);

    this.projectiles = this.physics.add.group();
    this.physics.add.overlap(
      this.projectiles,
      this.characters[0].sprite,
      (obj1, obj2) => {
        const projectile = this.projectiles.contains(obj1) ? obj1 : obj2;
        projectile.destroy();
        this.flashWhenHit(this.characters[0]);
      }
    );

    this.time.addEvent({
      delay: 500,
      callback: this.maybeShootAtPlayer,
      callbackScope: this,
      loop: true,
    });

    // Set up input to move characters

    // control first character with mouse click
    this.goToPointClick(this.characters[0]);
    this.punchOnSpace(this.characters[0]);
    this.cardinalMovementWASD(this.characters[0]);

    // make second character move to random point every 2 seconds
    setInterval(() => {
      this.goToRandomPoint(this.characters[1]);
    }, 2000);
  }

  update() {
    // this.processCollisions();
    // ensure character flashes when overlapped and punched
    this.characters.forEach((character) => {
      this.processFlashWhenCollideAndHit(character);
    });

    if (this.projectiles) {
      this.projectiles.getChildren().forEach((projectile) => {
        if (!projectile) {
          return;
        }

        if (
          projectile.x < 0 ||
          projectile.x > this.scale.width ||
          projectile.y < 0 ||
          projectile.y > this.scale.height
        ) {
          projectile.destroy();
        }
      });
    }
  }

  maybeShootAtPlayer() {
    if (this.characters.length < 2) {
      return;
    }

    const shooter = this.characters[1];
    const target = this.characters[0];
    const shootChance = 50; // percent chance each interval

    if (Phaser.Math.Between(1, 100) <= shootChance) {
      this.shootProjectileAtPlayer(shooter, target);
    }
  }

  shootProjectileAtPlayer(shooter, target) {
    const projectile = this.add.rectangle(shooter.sprite.x, shooter.sprite.y, 32, 32, 0x673ab7);
    this.physics.add.existing(projectile);
    projectile.body.setAllowGravity(false);
    projectile.body.setCollideWorldBounds(true);
    projectile.body.setBounce(0, 0);
    projectile.body.setVelocity(0, 0);

    this.projectiles.add(projectile);
    this.physics.moveToObject(projectile, target.sprite, 500);

    this.time.delayedCall(3000, () => {
      if (projectile && projectile.active) {
        projectile.destroy();
      }
    });
  }

  flashWhenHit(character) {
    character.sprite.setTint(0xff0000);
    setTimeout(() => {
      character.sprite.clearTint();
    }, 200);
  }

  processFlashWhenCollideAndHit(character) {
    this.characters.forEach((other) => {
      if (other !== character) {
        const distance = Phaser.Math.Distance.Between(
          character.sprite.x,
          character.sprite.y,
          other.sprite.x,
          other.sprite.y
        );

        if (distance < 300) {
          console.log(character.sprite.anims.currentAnim.key);
          
          if (character.sprite.anims.currentAnim.key === character.spritesheetName + '-punch') {
            this.flashWhenHit(other);
          }
        }
      }
    });
  }

  punchOnSpace(character) {
    this.input.keyboard.on('keydown-SPACE', () => {
      console.log('punch');
      
      character.play('punch');

      setTimeout(() => {
        character.play('idle');
      }, 500);
    });
  }

  cardinalMovementWASD(character) {
    this.input.keyboard.on('keydown', (event) => {
      switch (event.code) {
        case 'KeyW':
          character.sprite.body.setVelocityY(-character.speed * 100);
          character.play('walk');
          break;
        case 'KeyS':
          character.sprite.body.setVelocityY(character.speed * 100);
          character.play('walk');
          break;
        case 'KeyA':
          character.sprite.body.setVelocityX(-character.speed * 100);
          character.play('walk');
          character.sprite.setFlipX(true);
          break;
        case 'KeyD':
          character.sprite.body.setVelocityX(character.speed * 100);
          character.play('walk');
          character.sprite.setFlipX(false);
          break;
      }
    });

    this.input.keyboard.on('keyup', (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'KeyS':
        case 'KeyA':
        case 'KeyD':
          character.sprite.body.setVelocity(0);
          character.play('idle');
      }
    });
  }

  processCollisions() {
    // punchIfClose
    this.characters.forEach((charA) => {
      this.characters.forEach((charB) => {
        if (charA !== charB) {
          const distance = Phaser.Math.Distance.Between(
            charA.sprite.x,
            charA.sprite.y,
            charB.sprite.x,
            charB.sprite.y
          );

          if (distance < 100) {
            console.log('punch');
            
            charA.play('punch');
          }
        }
      });
    });
  }

  goToPointClick(character) {
    this.input.on('pointerdown', (pointer) => {
      console.log(pointer.x, pointer.y);
      
      this.physics.moveTo(character.sprite, pointer.x, pointer.y, character.speed * 100);
      character.play('walk');

      const distance = Phaser.Math.Distance.Between(
        character.sprite.x,
        character.sprite.y,
        pointer.x,
        pointer.y
      );

      this.time.delayedCall((distance / (character.speed * 100)) * 1000, () => {
        character.sprite.body.setVelocity(0);
        character.play('idle');
      });
    });
  }

  goToRandomPoint(character) {
    const randomX = Phaser.Math.Between(100, this.scale.width - 100);
    const randomY = Phaser.Math.Between(100, this.scale.height - 100);

    this.physics.moveTo(character.sprite, randomX, randomY, character.speed * 100);
    character.play('walk');

    const distance = Phaser.Math.Distance.Between(
      character.sprite.x,
      character.sprite.y,
      randomX,
      randomY
    );

    this.time.delayedCall((distance / (character.speed * 100)) * 1000, () => {
      character.sprite.body.setVelocity(0);
      character.play('idle');
    });
  }

  setRandomLateralMovement(character) {
    const directions = ['left', 'right', 'idle'];
    const choice = directions[Math.floor(Math.random() * directions.length)];

    switch (choice) {
      case 'left':
        character.sprite.body.setVelocityX(-character.speed * 100);
        character.play('walk');
        character.sprite.setFlipX(true);
        break;
      case 'right':
        character.sprite.body.setVelocityX(character.speed * 100);
        character.play('walk');
        character.sprite.setFlipX(false);
        break;
      case 'idle':
        character.sprite.body.setVelocityX(0);
        character.play('idle');
        break;
    }
  }
}

