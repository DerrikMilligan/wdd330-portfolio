import { Color } from '../models/Color.js';

export class ColorPicker {

  static colorWheelEl      = null;
  static colorWheel        = null;
  static activeColorPicker = null;

  /**
   * Create the color wheel elements and picker and attach it to the page
   */
  static createColorWheel() {
    // Create the color wheel container element
    ColorPicker.colorWheelEl = document.createElement('div');
    ColorPicker.colorWheelEl.classList.add('color-wheel');

    // Create the actual colorWheel with the iro.ColorPicker
    ColorPicker.colorWheel = new iro.ColorPicker(ColorPicker.colorWheelEl, {
      width: 250,
      color: '#000000',
      borderWidth: 1,
      borderColor: 'rgb(75 85 99)',
      layout: [
        { component: iro.ui.Box },
        {
          component: iro.ui.Slider,
          options: {
            id: 'hue-slider',
            sliderType: 'hue',
          },
        },
      ],
    });

    // Create the colorWheel controls
    const controlContainer = document.createElement('div');
    controlContainer.classList.add('m-2', 'flex', 'items-center', 'justify-center', 'gap-3');

    // Create a button that will reset the color to transparent or not selected
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear Color';
    clearButton.classList.add('btn');
    clearButton.addEventListener('click', () => {
      if (ColorPicker.activeColorPicker !== null) {
        ColorPicker.colorWheel.color.set('#000000');
        ColorPicker.activeColorPicker.matchColorWheel();
        ColorPicker.activeColorPicker.color.a = 0;
        ColorPicker.activeColorPicker.setBoxColor();
      }
    });

    // Create an input that will display the hex code of the color
    const hexValue = document.createElement('input');
    hexValue.type = 'text';
    hexValue.classList.add('w-24');
    hexValue.classList.add('input');

    // When the user input into the hex color field try and extract a color and update
    // the colorWheel and activeColorPicker with the color
    hexValue.addEventListener('input', () => {
      const color = hexValue.value.toString().match(/[a-f0-9]{6}/i);
      if (color === null) {
        return console.error("That's not a valid color");
      }
      ColorPicker.colorWheel.color.set(`#${color}`);
      ColorPicker.activeColorPicker.matchColorWheel();
    });

    // Add those to the container that will hold them
    controlContainer.appendChild(clearButton);
    controlContainer.appendChild(hexValue);

    // Add the controls after we create the color wheel
    ColorPicker.colorWheelEl.appendChild(controlContainer);

    // Any time the color changes whether user based or not update the hex box
    ColorPicker.colorWheel.on('color:change', (newColor) => {
      hexValue.value = newColor.hexString;
    });

    // Update the activeColorPicker state when the user changes the color
    ColorPicker.colorWheel.on('input:change', (newColor) => {
      if (ColorPicker.activeColorPicker !== null) {
        ColorPicker.activeColorPicker.pickerChangeColor(newColor);
      }
    });

    // Attach the colorWheelEl to the body
    document.body.appendChild(ColorPicker.colorWheelEl);
  }

  /**
   * Initialize the ColorPicker by adding the colorWheel element to the page
   * Also adds the global click event listener to hide the color wheel
   */
  static init() {
    // To make sure this is only ever ran once check our static variable and just bounce
    if (ColorPicker.colorWheelEl !== null) {
      return;
    }

    // Make the color wheel element and attach it to the page
    ColorPicker.createColorWheel();

    // Attach our global event listener to close the pickers if you
    // click on any other element on the page
    document.addEventListener('click', (e) => {
      if (
        // Check to see that the element we clicked is NOT another color-picker
        // and make sure that it is NOT a readonly one as those should close it when clicked
        Boolean(e.target.closest('.color-picker:not([readonly])')) === false &&

        // Also make sure that the element we clicked is NOT a part of the color wheel itself
        ColorPicker.colorWheelEl.contains(e.target) === false
      ) {
        // Then we're good to hide it
        ColorPicker.colorWheelEl.removeAttribute('data-show');

        // Also remove the activeColorPicker
        ColorPicker.activeColorPicker = null;
      }
    });
  }

  /**
   * Creates a new color picker and renders it
   *
   * @param {Element} el The element we're going to mount to
   * @param {Color} color The starting color
   * @param {} pickerSettings And Picker settings see: https://vanilla-picker.js.org/gen/Picker.html#setOptions
   */
  constructor(el, color = null, pickerSettings = { alpha: false, popup: 'bottom' }) {
    this.color          = color || new Color(0, 0, 0, 0);
    this.el             = el;
    this.pickerSettings = pickerSettings;

    this.colorBox = null;
    this.popper   = null;

    this.interactive = el.hasAttribute('readonly') === false;

    this.render();
  }

  /**
   * Remove the elements we created, cleans up the Picker
   */
  reset() {
    if (this.colorBox) {
      this.colorBox.remove();
      this.colorBox = null;
    }

    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }

    this.el.innerHTML = '';
  }

  /**
   * Clear out the element, render a color box and the picker if we're
   * in interactive mode
   */
  render() {
    this.reset();

    // Create our div, add the color-box class and set it's background color
    this.colorBox = document.createElement('div');
    this.colorBox.classList.add('color-box');
    this.colorBox.classList.add('drop-shadow');
    this.setBoxColor();

    // For interactive color pickers create the popper with the colorWheel
    if (this.interactive) {
      // Attach the colorWheel to the colorBox
      this.popper = Popper.createPopper(this.colorBox, ColorPicker.colorWheelEl);

      // Add events for clicking the colorBox to toggle the popper
      this.colorBox.addEventListener('click', () => {

        // If we are the active color picker when clicking the box, hide
        // the colorWheel and set the activeColorPicker back to null
        if (ColorPicker.activeColorPicker === this) {
          ColorPicker.colorWheelEl.removeAttribute('data-show');
          ColorPicker.activeColorPicker = null;
          return;
        }

        // Otherwise we want to display the colorWheel and set the activeColorPicker
        // to the one that was clicked. This will also work when you click on a colorBox
        // that was not the active one as we still want the color wheel displayed then
        ColorPicker.colorWheelEl.setAttribute('data-show', '');
        ColorPicker.activeColorPicker = this;

        // Now load the current color into the colorWheel
        ColorPicker.colorWheel.color.set(this.color.toHex());

        // And update the popper's location
        this.popper.update();
      });
    }

    // Attach our color box to the parent element
    this.el.append(this.colorBox);
  }

  loadColor(color = null) {
    if (color instanceof Color === false) {
      throw new Error('Not a color we can load');
    }

    this.color = color;

    if (ColorPicker.colorWheel !== null) {
      ColorPicker.colorWheel.color.set(this.color.toHex());
    }

    this.setBoxColor();
  }

  matchColorWheel() {
    if (ColorPicker.colorWheel !== null) {
      this.pickerChangeColor(ColorPicker.colorWheel.color);
    }
  }

  /**
   * This is a callback for the Picker where we'll update our box color
   * @param {{ red: Number, green: Number, blue: Number }} color
   * @link https://iro.js.org/color_api.html#properties
   */
  pickerChangeColor(color) {
    this.color.r = color.red;
    this.color.g = color.green;
    this.color.b = color.blue;

    // When we choose a color, remove the transparency
    this.color.a = 255;

    this.setBoxColor();
  }

  /**
   * Set the backgroundColor and borderColor for the colorBox
   */
   setBoxColor() {
    if (this.colorBox) {
      this.colorBox.style.backgroundColor = this.color.toHex();
    }
  }

}
