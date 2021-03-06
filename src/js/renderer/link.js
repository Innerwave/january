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

  var Renderer = iui.sheet.renderer.Link = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    var div = $('<div>')
      .attr('title', cell.link);

    var span = $('<a>')
      .text(cell.value)
      .attr('title', cell.link)
      .attr('href', cell.link)
      .wrap('<span>').parent()
      .appendTo(div);

    return div;
  };


}(jQuery, window));
