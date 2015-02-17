  (function ($, window, undefined) {
    $.extend(true, window, {
      "iui": {
        "sheet": {
          "renderer": {}
        }
      }
    });


    var Renderer = iui.sheet.renderer.Icon = function (cell) {
      cell = cell || {};

      if (!(this instanceof Renderer)) {
        return new Renderer(cell);
      }
      var icon = cell.value;

      return $('<i class="fa fa-fw">') // icon
        .html(icon)
        .css({
          color: cell.color
        })

      // contents
      .wrap('<span>').parent()

      // label
      .append('<span style="display:inline">').find('span').text(icon).end()

      // container
      .wrap('<div>').parent().attr('title', icon);
    };

  }(jQuery, window));
