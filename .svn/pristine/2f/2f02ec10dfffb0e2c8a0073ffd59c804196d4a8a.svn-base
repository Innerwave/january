(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Checkbox = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    return $('<input type="checkbox">')
      .attr('value', cell.bottonLabel)
      .attr('title', cell.value())
      .prop('checked', !!cell.value())
      .change(function () {
        cell.value(this.checked);
        $(this).attr('title', cell.value());
      })
      .wrap('<span>').parent()
      .wrap('<div>').parent();
  };

  $.extend(Renderer.prototype, {});

}(jQuery, window));
