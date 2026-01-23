import { BaseScene } from './BaseScene.js';
import { BaseCharacter } from '../characters/BaseCharacter.js';

export class CharacterPreview extends BaseScene {
  constructor() {
    super('CharacterPreview');

    this.characters = [];
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

    // Set up input to move characters

    // control first character with mouse click
    this.goToPointClick(this.characters[0]);

    // make second character move to random point every 2 seconds
    setInterval(() => {
      this.goToRandomPoint(this.characters[1]);
    }, 2000);
  }

  update() {
    this.processCollisions();
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

