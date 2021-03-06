(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Currency = function (cell) {
    cell = cell || {};

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    var currencyCnt = Math.floor(cell.value.length / 3);
    var temp = "";
    var startIdx, endIdx = 0;
    var commaCnt = 3;
    var currency = "￦";
    startIdx = cell.value.length - commaCnt;
    endIdx = cell.value.length;

    for (var i = 0; i < currencyCnt; i++) {
      temp = "," + cell.value.substring(startIdx, endIdx) + temp;
      endIdx = startIdx;
      startIdx -= commaCnt;
    }

    if (startIdx + commaCnt >= 0) {
      temp = cell.value.substring(0, endIdx) + temp;
    } else if (currencyCnt === 0) {
      temp = cell.value;
    }

    if (temp.substring(0, 1) === ",") {
      temp = temp.substring(1, temp.length);
    }

    if (options.regional === "en") {
      currency = "$";
    }

    temp = currency + temp;

    return $('<span>')
      .text(temp)
      .wrap('<div style="text-align:right;">').parent()
      .attr('title', temp);
  };

  $.extend(Renderer.prototype, {

  });

}(jQuery, window));
