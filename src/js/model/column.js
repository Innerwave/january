(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  });

  var nextId = 0;

  iui.sheet.model.Column = function (info) {
    info = info || {};

    if (!(this instanceof iui.sheet.model.Column)) {
      return new iui.sheet.model.Column(info);
    }

    for (var key in info) {
      this[key] = info[key];
    }

    this.index = nextId++;
    this.uid = info.id || "column" + nextId;
    this.id = info.id || this.uid;
    this.visualId = info.visualId;
    this.label = info.label;
    this.width = info.width || 80;
    this.height = info.height || 26;
    this.className = "spreadsheet-column ui-state-default " + (info.className || "");
    this.group = info.group;
    this.ui = null;
    this._offset = {
      left: 0,
      width: this.width,
      outerWidth: 0,
      innerWidth: 0
    };
    this.cells = new iui.util.Collection();

    this.headerRenderer = info.headerRenderer || iui.sheet.renderer.ColumnHeader;
    this.resizable = !!info.resizable;

    this.renderer = info.renderer || iui.sheet.renderer.String;
    this.editor = info.editor || iui.sheet.editor.String;

    this.buttons = null;
  };

  $.extend(iui.sheet.model.Column.prototype, iui.sheet.model.Entity, {

    setWidth: function (width) {
      this.width = width;
      if (this.ui) {
        this.ui.width(width);
      }
      this._parent._trigger("columnChanged");
    },

    offset: function () {
      if (this.ui) {
        this._offset = {
          left: this.ui[0].offsetLeft,
          width: this.ui.width(),
          outerWidth: this.ui.outerWidth(),
          innerWidth: this.ui.innerWidth()
        };
      }
      return this._offset;
    }
  });

  //-------------------------------------------------------------------------
  // static class methods
  /**
   * 엑셀 스타일의 컬럼 이름 생성
   * TODO 676이상의 컬럼이 지정되면 타이틀을 잘못 계산하는 것을 수정해야 한다.
   * A ~ YZ 까지의 676(26^2)개만 정상적으로 생성되며,
   * ZA ~ ZZ 는 생성되지 못하고 AAA로 넘어간다.
   */
  iui.sheet.model.Column.getColumnLabel = function (index) {
    return $.map((index)
        .toString(26)
        .split(""),
        function (e, i) {
          e = parseInt(e, 26);
          if (index > 25 && i === 0) {
            e--;
          }
          return String.fromCharCode(e + 65);
        })
      .join("");
  };

}(jQuery, window));
