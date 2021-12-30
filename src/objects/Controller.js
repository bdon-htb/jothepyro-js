/**
 * A uniform interface for polling and receiving input.
*/
export default class Controller
{
  constructor(game)
  {
    this.game = game;
    // Reference to current scene; set in init().
    this.scene;

    // Complete list of all commands.
    this.commands = [
      'MOVE_UP',
      'MOVE_DOWN',
      'MOVE_LEFT',
      'MOVE_RIGHT',
      'AIM_UP',
      'AIM_DOWN',
      'AIM_LEFT',
      'AIM_RIGHT',
    ]
    // A stack of active commands in order of press.
    this._commandStack = [];
  }

  init(scene)
  {
    // Remove all listeners from previous scene if they exist.
    this._removeListeners();
    // Clear command stack.
    this._commandStack = [];

    this.scene = scene;
    this._setListeners();

  }

  // Get the list of currently active commands.
  poll()
  {
    return this._commandStack;
  }

  isOnDesktop()
  {
    return this.game.device.os.desktop;
  }

  // Add command to top of command stack.
  // If it already exists, move it to top.
  _addCommand(command)
  {
    this._removeCommand(command);
    this._commandStack.push(command); // Adds command to end of list.
  }

  // Remove command from command stack if it exists.
  _removeCommand(command)
  {
    let index = this._commandStack.indexOf(command);
    if (index > -1)
    {
      this._commandStack.splice(index, 1);
    }
  }

  _setListeners()
  {
    if(this.isOnDesktop())
    {
      this._setKeyboardListeners();
    }
  }

  _setKeyboardListeners()
  {
    let keys = {
      'W': 'MOVE_UP',
      'S': 'MOVE_DOWN',
      'A': 'MOVE_LEFT',
      'D': 'MOVE_RIGHT',
      'UP': 'AIM_UP',
      'DOWN': 'AIM_DOWN',
      'LEFT': 'AIM_LEFT',
      'RIGHT': 'AIM_RIGHT',
    }

    for(const [key, value] of Object.entries(keys))
    {
      this.scene.input.keyboard.on(`keydown-${key}`, () => this._addCommand(value));
      this.scene.input.keyboard.on(`keyup-${key}`, () => this._removeCommand(value));
    }
  }

  _removeListeners()
  {
    if(this.scene == null) return;
    else if(this.isOnDesktop())
    {
      this.scene.input.removeAllListeners();
    }
  }
}
