(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  // ------------------------------------
  // Private
  // ------------------------------------

  var Renderer = iui.sheet.renderer.String = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    //    var span = $('<span>')
    //      .text(cell.value);

    //    var div = $('<div>')
    //      .attr('title', cell.value)
    //      .append(span);

    //    return div;

    return $('<span>').text(cell.value)
      .wrap('<div>').parent().attr('title', cell.value);

  };


}(jQuery, window));
