module.exports = function inputControlsSetup() {
  let allControls = [];
  let $inputControl = $('.input-control');

  console.log($inputControl.length);

  if($inputControl.length) {
    for(let i = 0, l = $inputControl.length; i < l; i++) {
      allControls.push(new InputConstructor(i, $($inputControl[i])));
    }
  }
  return allControls;
}

// constructor
function InputConstructor(index, $element) {
  let that       = this;
  this.$control  = $element;
  this.$clearBtn = this.$control.children('.form-control--clear');
  this.$input    = this.$control.children('.input-control--field');
  this.$message  = this.$control.children('.form-control--message');
  this.checkInput()
  this.$input.on('change', this.checkInput.bind(this));
  this.$input.on('keyup', this.checkInput.bind(this));
  this.$input.on('focus', this.activate.bind(this));
  this.$clearBtn.on('click', function() {
    that.$input.val('');
    that.checkInput();
    that.validate('This is my message') // delete me
  });
  this.$input.on('blur', function() {
    setTimeout(function() {
      that.checkInput();
      that.deactivate();
      that.validate('This is my message'); // delete me
    }, 60);
  });
}
// methods
InputConstructor.prototype.classNameControlFilled = 'filled';
InputConstructor.prototype.classNameControlActive = 'active';
InputConstructor.prototype.validate = function validate(message) {
  if(this.$input.val().toLowerCase() === 'error') {
    this.$control.addClass('has-error');
    this.$control.removeClass('has-warning');
  } else if(this.$input.val().toLowerCase() === 'warning') {
    this.$control.addClass('has-warning');
    this.$control.removeClass('has-error');
  } else {
    this.$control.removeClass('has-warning').removeClass('has-error');
  }
  this.$message.text(message);
}
InputConstructor.prototype.checkInput = function checkInput() {
  if( this.$input.val() ) {
    this.$control.addClass(this.classNameControlFilled);
  } else {
    this.$control.removeClass(this.classNameControlFilled);
  }
}
InputConstructor.prototype.activate = function activate() {
  this.$control.addClass(this.classNameControlActive);
}
InputConstructor.prototype.deactivate = function deactivate() {
  this.$control.removeClass(this.classNameControlActive);
}
