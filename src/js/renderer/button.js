(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Button = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    var renderer = $('<input type="button" style="height:100%;width:100%;color:blue;font-weight:bolder">')
      .attr('value', cell.bottonLabel)
      .attr('title', cell.value)
      .button()

    .click(function (event) {
      // 이벤트 번짐(버블링)을 방지.
      event.stopPropagation();
      // 콜백함수 호출.
      cell.click.call(this, cell);
    })

    .wrap('<div style="padding:1px">').parent();

    return renderer;
  };

  $.extend(Renderer.prototype, {});

}(jQuery, window));
