(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Title = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    return $('<span style="text-align:center;font-weight:bolder">')
      .text(cell.value)

    .wrap('<div >').parent()
      .attr('title', cell.value);
  };

  $.extend(Renderer.prototype, {

  });

}(jQuery, window));
