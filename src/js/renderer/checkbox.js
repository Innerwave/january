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
      .attr('title', cell.value)
      .prop('checked', !!cell.value)
      .change(function () {
        $(this).attr('title', this.checked);
        cell.value = this.checked;
        cell.trigger(iui.sheet.model.Cell.EVENT_CLL_DATA_CHANGED);
      })
      .wrap('<span>').parent()
      .wrap('<div>').parent();
  };

  $.extend(Renderer.prototype, {});

}(jQuery, window));
