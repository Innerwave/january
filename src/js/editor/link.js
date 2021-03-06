(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  });

  var instance;

  var Editor = iui.sheet.editor.Link = function () {

    if (this instanceof Editor) {
      // 싱글톤(singletone): 시트에 생성된 것 하나를 모든 셀에서 공유하여 사용하도록 한다.
      if (instance) {
        return instance;
      }
    } else {
      // 언제나 new를 사용하여 객체를 생성하도록 강제
      return new Editor();
    }

    instance = this;

    this.ui = $('<div>').html('<form name="linkEditorForm"><fieldset >' +
      '<p><label style="display:inline-block;width:50px">이름:</label> <input name="value" type="text" style="width:300px"></p>' +
      '<p><label style="display:inline-block;width:50px">URL:</label> <input name="link" type="text" style="width:300px"></p>' +
      '</fieldset></form>');

    // 복합 에디터를 다이얼로그로 감싸둔다.
    this.popup = this.ui.dialog({
      title: 'Site Link',
      width: 430,
      height: 275,
      // 자동으로 팝업이 열리지 않도록 한다.
      autoOpen: false,
      // 팝업을 닫기 전에는 다른 것을 건드릴 수 없도록 한다.
      modal: true,
      // 컨트롤 버튼들
      buttons: {
        "Confirm": function () {
          instance.submit();
        },
        "Cancel": function () {
          instance.ui.dialog('close');
        }
      }
    });

    return instance;
  };





  $.extend(Editor.prototype, {

    /**
     * 팝업 에디터 초기화 위치 및 현재 셀의 데이터 등을 세팅
     */
    init: function (cell) {
      this.cell = cell;

      this.popup
        .find('input[name=value]').val(cell.value).focus().end()
        .find('input[name=link]').val(cell.link).end()
        .dialog('open');
      return this;
    },



    /**
     * 팝업 에디터 숨김
     */
    hide: function () {
      this.popup.dialog('close');
      return this;
    },



    /**
     * 팝업 에디터에서 변경된 데이터를 셀 모델에 반영
     * cell의 데이터 변경에 따른 이벤트를 위젯(january.js)에서 처리 후 에디터(팝업)을 닫는다.
     */
    submit: function () {
      this.cell.link = instance.popup.find('input[name=link]').val();
      this.cell.value = instance.popup.find('input[name=value]').val();
      this.cell.trigger(iui.sheet.model.Cell.EVENT_CLL_DATA_CHANGED);
    }

  });

}(jQuery, window));
