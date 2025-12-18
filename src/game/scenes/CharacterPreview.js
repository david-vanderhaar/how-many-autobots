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

    setInterval(() => {
      this.characters.forEach((character) => {
        this.setRandomMovement(character);
      });
    }, 1000);
  }

  // update() {
  //   this.characters.forEach((character) => {
  //     this.setRandomMovement(character);
  //   });
  // }

  setRandomMovement(character) {
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

