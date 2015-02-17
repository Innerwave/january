(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  });

  var Renderer = iui.sheet.renderer.Date = function (cell) {
    cell = cell || {};
    var dateRenderer = "";
    var format = "yyyy-MM-dd";
    var dateTemp = "";

    if (!(this instanceof Renderer)) {
      return new Renderer(cell);
    }

    if (options.regional === "en") {
      format = "dd/MM/yyyy";
    }

    var currentDate = new Date(parseFloat(cell.value));

    dateTemp = format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function (rFormat) {
      switch (rFormat) {
      case "yyyy":
        return currentDate.getFullYear();
      case "MM":
        return (currentDate.getMonth() + 1) < 10 ? "0" + (currentDate.getMonth() + 1) : (currentDate.getMonth() + 1);
      case "yy":
        return (currentDate.getFullYear() % 1000);
      case "dd":
        return currentDate.getDate() < 10 ? "0" + (currentDate.getDate()) : (currentDate.getDate());
      case "HH":
        return currentDate.getHours() < 10 ? "0" + (currentDate.getHours()) : (currentDate.getHours());
      case "hh":
        return ((h = currentDate.getHours() % 12) ? h : 12) < 10 ? "0" + h : h;
      case "mm":
        return currentDate.getMinutes() < 10 ? "0" + (currentDate.getMinutes()) : (currentDate.getMinutes());
      case "ss":
        return currentDate.getSeconds() < 10 ? "0" + (currentDate.getSeconds()) : (currentDate.getSeconds());
        /*
	   case "a/p": return cell.value.getHours() < 12 ? "오전" : "오후";
	   case "E": return weekName[cell.value.getDay()];
	   */
      default:
        return rFormat;
      }
    });

    return $('<span>').text(dateTemp)
      .wrap('<div>').parent()
      .attr('title', dateTemp);
  };

  $.extend(Renderer.prototype, {

  });

}(jQuery, window));
