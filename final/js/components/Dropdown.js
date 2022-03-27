
export class Dropdown {

  static activeDropdown = null;

  static init() {
    // Attach our global event listener to close a dropdown if you
    // click on any other element on the page
    document.addEventListener('click', (e) => {
      if (
        Dropdown.activeDropdown !== null &&
        Dropdown.activeDropdown.trigger.contains(e.target) === false &&
        (
          Dropdown.activeDropdown.clickingMenuClosesDropdown ||
          Dropdown.activeDropdown.dropdown.contains(e.target) === false
        )
      ) {
        Dropdown.activeDropdown.dropdown.removeAttribute('data-show');
        Dropdown.activeDropdown = null;
      }
    });
  }

  /**
   *
   * @param {HTMLElement} trigger
   * @param {HTMLElement} dropdown
   */
  constructor(trigger, dropdown) {
    this.trigger  = trigger;
    this.dropdown = dropdown;

    // Check for the keep open attribute
    this.clickingMenuClosesDropdown = this.dropdown.hasAttribute('keep-open') === false;

    this.popper = null;

    this.render();
  }

  render() {
    // Add our event listener to show/hide the dropdown menu
    this.trigger.addEventListener('click', () => {
      if (Dropdown.activeDropdown === this) {
        this.dropdown.removeAttribute('data-show');
        Dropdown.activeDropdown = null;
        return;
      }

      this.dropdown.setAttribute('data-show', '');
      Dropdown.activeDropdown = this;
      this.popper.update();
    });

    // Create our popper instance for the menu
    this.popper = Popper.createPopper(this.trigger, this.dropdown, { placement: 'bottom-start' });
  }

}
