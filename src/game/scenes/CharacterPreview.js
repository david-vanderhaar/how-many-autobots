import { BaseScene } from './BaseScene.js';
import { BaseCharacter } from '../characters/BaseCharacter.js';

export class CharacterPreview extends BaseScene {
  constructor() {
    super('CharacterPreview');

    this.characters = [];
  }

  create() {
    super.create();

    const steve = BaseCharacter(this, {
      name: 'Steve',
      spritesheetName: 'steve',
      x: 800,
      y: 470,
    });

    steve.initializeAnimations();
    steve.startAnimationPreview();
    steve.initializePhysics();
    this.characters.push(steve);

    this.input.gamepad.once('connected', function (pad) {
      console.log('Gamepad connected:', pad.id);
    }, this);
  }

  update() {
    processInputs(this, this.characters);
  }
}

function processInputs(scene, characters) {
  const pads = scene.input.gamepad.gamepads;

  characters.forEach((character, index) => {
    processCharacterGamepadInputs(scene, character, pads[index]);
  });
}

function processCharacterGamepadInputs(scene, character, gamepad) {
  if (!gamepad) {
    return;
  }

  const sprite = character.sprite;

  if (gamepad.left) {
    sprite.x -= 4;
    sprite.flipX = false;
    character.play('walk');
  } else if (gamepad.right) {
    sprite.x += 4;
    sprite.flipX = true;
    character.play('walk');
  } else if (gamepad.up) {
    if (sprite.body.onFloor()) {
      sprite.body.setVelocityY(-600);
      character.play('jump');
    }
  } else if (gamepad.down) {
    // sprite.y += 4;
  } else if (gamepad.A) {
    character.play('punch');
  } else if (gamepad.B) {
    character.play('kick');
  } else if (gamepad.X) {
    if (sprite.body.onFloor()) {
      character.play('win');
    }
  } else if (gamepad.Y) {
    character.play('die');
  } 
  else {
    if (sprite.body.onFloor()) {
      // character.play('idle');
      // if characis walking, reset to idle
      // if (sprite.anims.currentAnim.key === character.spritesheetName + '-walk') {
      //   character.play('idle');
      // }
    }
  }
}
