(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });


  var Renderer = iui.sheet.renderer.ColumnGroupHeader = function (group) {
    group = group || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(group);
    }

    return $("<span>")
      .text(group.label);
  };

  $.extend(Renderer.prototype, {});

}(jQuery, window));
