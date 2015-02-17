(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Image = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    var div = $('<div>')
      .attr('title', cell.value)
      .addClass(cell.className);

    if (cell.value != null) {
      var img = $('<img style="margin:1px;">')
        .attr('src', cell.value)
        .attr('alt', cell.value)
        .on('load', function (event) {
          cell.rows[0].setHeight(this.height);
          cell.columns[0].setWidth(this.width);
        })
        .appendTo(div);
    }

    return div;
  };

}(jQuery, window));
