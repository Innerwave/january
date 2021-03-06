(function ($, window, undefined) {
  $.extend(true, window, {
    "iui": {
      "sheet": {
        "editor": {}
      }
    }
  });

  var instance;

  var Editor = iui.sheet.editor.String = function () {

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

    this.editor = $('<input type="text" style="width:100%;height:100%">')
      .change(function (event) {
        instance.submit(this.value);
      })
      .blur(function (event) {
        instance.hide();
      });

    this.ui = this.editor
      .wrap('<span>').parent()
      .wrap('<div id="editorString">').parent();

    return instance;
  };





  $.extend(Editor.prototype, {

    /**
     * 에디터 초기화
     * 하나의 에디터를 공유하여 사용하므로 매번 불려질 때마다 초기화 한다.
     */
    init: function (cell) {
      this.cell = cell;

      // 팝업의 위치 지정
      this.ui
        .css({
          position: 'absolute',
          width: cell.ui.width(),
          height: cell.ui.height() - 2,
          top: parseInt(cell.ui.css('top')) - 2,
          left: parseInt(cell.ui.css('left')) - 2
        })
        .show()
        .appendTo(cell.ui.parent());

      this.editor.val(cell.value).focus();
      return this;
    },



    /**
     * 에디터 숨김
     */
    hide: function () {
      //    * input에서 블러 이벤트를 처리하는 것과 같이 서브밋이 발생함에 따라 이중 호출이 있다.
      //    * 두번째 호출될 때를 거를 만한 방법을 찾지 못하였다.
      // TODO try catch 구문을 사용하지 않을 수 있는 방법이 없을까?
      try {
        this.ui.detach();
      } catch (error) {}
      return this;
    },



    /**
     * cell의 데이터 변경에 따른 이벤트를 위젯(january.js)에서 처리 후 에디터(팝업)을 닫는다.
     */
    submit: function (value) {
      this.cell.value = value;
      this.cell.trigger(iui.sheet.model.Cell.EVENT_CLL_DATA_CHANGED);
    }

  });


}(jQuery, window));
