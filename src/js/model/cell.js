(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "model": {}
      }
    }
  });

  // private
  var nextId = 0;

  var Cell = iui.sheet.model.Cell = function (info) {

    info = info || {};

    if (!(this instanceof Cell)) {
      return new Cell(info);
    }

    for (var key in info) {
      if (key === 'value') {
        this.value(info.value === undefined ? '' : info.value);
      } else {
        this[key] = info[key];
      }
    }

    this.index = nextId++;
    this.uid = info.id || "cell" + nextId;
    this.id = info.id || this.uid;
    this.formula = info.formula;
    this.className = "spreadsheet-cell " + (info.classname || "");
    this.renderer = info.renderer;
    this.editor = info.editor;

    // 성능상 배열을 사용하는 것이.... 파싱이 넘 느려...
    this.rows = info.rows || [];
    this.columns = info.columns || [];
    //    this.rows = (new iui.util.Collection()).addAll(info.rows || []);
    //    this.columns = (new iui.util.Collection()).addAll(info.columns || []);

    this.ui = null;

  };

  // constants
  Cell.EVENT_CLL_DATA_CHANGED = 'celldatachanged';


  // public methods
  $.extend(Cell.prototype, iui.sheet.model.Entity, {
    /**
     * TODO
     * 아규멘트가 주어지면 셀에 값을 세팅하고 그렇지 않으면 현재 갖고 있는 값을 반환한다.
     * 다시 별도의 함수를 구현하지 않고 프로퍼티로 설정하고 이벤트를 트리거하는 것이 좋겠다.
     */
    value: function (value) {
      if (value === undefined) {
        return this._value;
      }
      this._value = value;
      this.trigger.call(this, Cell.EVENT_CLL_DATA_CHANGED);
    },



    edit: function () {
      (this.getEditor()()).init(this);
    },



    getRenderer: function () {
      return this.renderer ? this.renderer :
        this.columns.length > 0 ? this.columns[0].renderer :
        iui.sheet.renderer.String;
    },



    getEditor: function () {
      return this.editor ? this.editor :
        this.columns.length > 0 ? this.columns[0].editor :
        iui.sheet.editor.String;
    },



    /**
     * 시트에 이벤트를 발생시킨다.
     */
    trigger: function (type) {
      if (this.parent() !== undefined) {
        this.parent()._trigger(type, null, this);
      }
    }
  });


}(jQuery, window));
