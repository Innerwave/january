(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "util": {}
    }
  });

  iui.util.Circuit = function (elements) {
    elements = elements ? $.isArray(elements) ? elements : [elements] : [];

    if (!(this instanceof iui.util.Circuit)) {
      return new iui.util.Circuit(elements);
    }

    this.index = NaN;
    this.elements = elements;
    this.length = this.elements.length;
  };

  $.extend(iui.util.Circuit.prototype, {
    getIndex: function () {
      return this.index = (this.elements.length + this.index) % this.elements.length;
    },

    prev: function () {
      if (isNaN(parseInt(this.index))) {
        this.index = 0;
      } else {
        this.index--;
        this.index = this.getIndex();
      }
      return this.elements[this.index];
    },

    now: function () {
      return this.elements[this.index];
    },

    next: function () {
      if (isNaN(parseInt(this.index))) {
        this.index = 0;
      } else {
        this.index++;
        this.index = this.getIndex();
      }
      return this.elements[this.index];
    },

    append: function (element) {
      this.elements[this.length++] = element;
    },

    remove: function () {
      this.index = this.getIndex();
      this.elements.splice(this.index, 1);
      this.length--;
    }
  });
}(jQuery, window));
