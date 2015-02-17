(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Number = function (cell) {

    cell = cell || {};
    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    var label = '';
    if (!isNaN(parseFloat(cell.value))) {
      label = cell.value.split(/(?=(?:\d{3})+(?:\.|$))/g)
        .join(',');
    }

    return $('<span>')
      .text(label)
      .wrap('<div>')
      .parent()
      .attr('title', label);
  };


}(jQuery, window));
