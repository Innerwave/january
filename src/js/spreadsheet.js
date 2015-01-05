/* 
 * Innerwave Spreadsheet - v0.2.414-SNAPSHOT - 2014-12-30
 * Copyright (c) 2014 innerwave.co.kr; Licensed
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'jquery',
      './core',
      './widget',
      './draggable',
      './sortable',
      './mouse',
      './slide',
      // './button',
      // './position', 
      './resizable'
    ], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function ($) {
  'use strict';

  var laptime = (function () {
    var startTime = (new Date()).getTime();
    var lastTime;
    return function (label) {
      lastTime = (new Date()).getTime();
      console.log((label || '') + ' : ' + (lastTime - startTime));
    };
  }());
  laptime('시작');

  var NOOP = function () {};

  /**
   * 주어진 문자열의 32비트 해시를 계산한다.
   * Found hear: https://gist.github.com/vaiorabbit/5657561
   *
   * 32 bit FNV-1a hash
   * Ref.: http://isthe.com/chongo/tech/comp/fnv/
   *
   * @param {string} str 해시 값을 구할 문자열
   * @return {integer}
   */
  function fnv32a(str) {
    var FNV1_32A_INIT = 0x811c9dc5,
      hval = FNV1_32A_INIT,
      i;
    for (i = 0; i < str.length; ++i) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    return hval >>> 0;
  }

  var uniqueId = (function () {
    // 가끔 키가 중복된다는 느낌이다. (데이터의 키가 중복되어 - 감ㅜㅜ;) 사라지는 증상이 있다.
    // 클로저를 이용하여 시리얼한 유니크 아이디를 생성한다.
    //      return (prefix + Math.random());
    var uid = 0;
    return function (prefix) {
      return (prefix + uid++);
    };
  }());

  function offsetRight(element) {
    return Math.round(element.offsetLeft + element.offsetWidth) - parseInt($(element).css('border-right-width').replace('px', '') || 1); // FF IE 등에서 '' 으로 측정되어 NaN이 된다. 1로 주는 것은 현재 CSS가 그렇게 설정되어 있기 때문이다.
  }

  function offsetBottom(element) {
    return Math.round(element.offsetTop + element.offsetHeight) - parseInt($(element).css('border-bottom-width').replace('px', '') || 1); // FF IE 등에서 '' 으로 측정되어 NaN이 된다.
  }

  /**
   * 엑셀 스타일의 컬럼 이름(타이틀)을 생성한다.
   * TODO 676이상의 컬럼이 지정되면 타이틀을 잘못 계산하는 것을 수정해야 한다.
   * A ~ YZ 까지의 676(26^2)개만 정상적으로 생성되며,
   * ZA ~ ZZ 는 생성되지 못하고 AAA로 넘어간다.
   */
  function getColumnHeaderText(index) {
    return $.map((index)
        .toString(26)
        .split(''),
        function (e, i) {
          e = parseInt(e, 26);
          if (index > 25 && i === 0) {
            e -= 1;
          }
          return String.fromCharCode(e + 65);
        })
      .join('');
  }

  function Collection() {
    // 속성들은 상속하는 객체에서 오버라이딩한다.
    // this.name = '';
    // this.length = 0;
    // this.elements = [];
    // this.elementByIds = {};

    this.find = function (uuid) {
      return this.indexOf(this.elementByIds[uuid]);
    };

    this.has = function (element) {
      return !!this.elementByIds[element.uuid];
    };

    this.get = function (index) {
      return this.elements[index];
    };

    this.getById = function (uuid) {
      var element = this.elementByIds[uuid];
      if (!element) {
        element = $.map(this.elements, function (element) {
          return element.id === uuid ? element : null;
        })[0];
      }
      return element;
    };

    this.indexOf = function (element) {
      return $.inArray(element, this.elements, 0);
    };

    this.addAll = function (elements) {
      for (var i = 0, l = elements.length; i < l; i++) {
        this.add(elements[i]);
      }
    };

    this.add = function (element) {
      element.uuid = element.uuid || uniqueId('el');
      if (!this.has(element)) {
        this.elements.push(element);
        this.elementByIds[element.uuid] = element;
        this.length++;
      }
      return this;
    };

    this.insert = function (element, index) {
      element.uuid = element.uuid || uniqueId('el');
      if (!this.has(element)) {
        this.elementByIds[element.uuid] = element;
        if (index < 0) {
          this.elements.unshift(element);
        } else if (index >= this.elements.length) {
          this.elements.push(element);
        } else {
          this.elements.splice(index, 0, element);
        }
        this.length++;
      }
      return this;
    };

    this.insertBefore = function (element, index) {
      return this.insert(element, --index);
    };

    this.insertAfter = function (element, index) {
      return this.insert(element, ++index);
    };

    this.empty = function () {
      this.length = 0;
      this.elements.length = 0;
      this.elements = [];
    };

    this.remove = function (element) {
      var idx = this.indexOf(element);
      if (idx >= 0) {
        this.elements.splice(idx, 1);
        this.length--;
      }
      this.elementByIds[element.uuid] = null;
      delete this.elementByIds[element.uuid];
      return this;
    };

    this.move = function (element, cnt) {
      element = 'string' === typeof element ? this.elementByIds[element] : element;
      var from = this.indexOf(element);
      var to = from + cnt;

      if (from >= 0) {
        this.elements.splice(from, 1);
      } else {
        throw 'can not find element';
      }
      if (to < 0) {
        this.elements.unshift(element);
      } else if (to >= this.elements.length) {
        this.elements.push(element);
      } else {
        this.elements.splice(to, 0, element);
      }
      return this;
    };

    this.each = function (callback, args) {
      var i = 0;
      if (typeof callback === 'string') {
        for (; i < this.length; i++) {
          this.elements[i][callback].apply(this.elements[i], args);
        }
      } else if (callback instanceof Function) {
        for (; i < this.length; i++) {
          callback.apply(this.elements[i], args);
        }
      }
    };

    this.eventFrefix = 'collection';

    this._trigger = function (type, event, data) {
      var callback = this.events[type];
      event = $.Event(event);
      event.type = (type === this.eventPrefix ?
        type :
        this.eventPrefix + type).toLowerCase();
      event.target = this;
      data = data || {};

      return !($.isFunction(callback) &&
        callback.apply(this, [event].concat(data)) === false ||
        event.isDefaultPrevented());
    };

    // exports
    this.toArray = function () {
      return this.elements;
    };
    this.toJSON = function () {
      return JSON.stringify(tis.elements);
    };
    this.toXML = function () {
      var xmldoc = $.parseXML('<collection></collection>');
      for (var i = 0, l = this.elements.length; i < l; i++) {
        xmldoc.appendChild(this.elements[i].toXML());
      }
      return xmldoc;
    };
    this.toXMLString = function () {
      return (new XMLSerializer()).serializeToString(this.toXML());
    };
  }

  function RowCollection() {
    this.length = 0;
    this.elements = [];
    this.elementByIds = {};
  }
  RowCollection.prototype = new Collection();

  function ColumnGroupCollection() {
    this.length = 0;
    this.elements = [];
    this.elementByIds = {};
  }
  ColumnGroupCollection.prototype = new Collection();

  function ColumnCollection() {
    this.length = 0;
    this.elements = [];
    this.elementByIds = {};
  }
  ColumnCollection.prototype = new Collection();

  function CellCollection() {
    this.length = 0;
    this.elements = [];
    this.elementByIds = {};
  }
  CellCollection.prototype = new Collection();

  function DataProvider() {
    this.length = 0;
    this.elements = [];
    this.elementByIds = {};
  }
  DataProvider.prototype = new Collection();

  /**
   * Sheet
   *
   */
  function Sheet() {
    this.id = uniqueId('sheet');
    this.className = 'spreadsheet';

    this.rows = new RowCollection();
    this.columnGroups = new ColumnGroupCollection();
    this.columns = new ColumnCollection();
    this.cells = new CellCollection();

    this.addColumn = function (columnInfo) {
      var newColumn = new Column(columnInfo);
      this.columns.add(newColumn);

      var group = this.columnGroups.getById(fnv32a(columnInfo.group || newColumn.id));
      if (!group) {
        group = new ColumnGroup({
          id: fnv32a(columnInfo.group || newColumn.id),
          label: columnInfo.group || ''
        });
        group.parent = this;
        this.columnGroups.add(group);
      }
      group.columns.add(newColumn);

      return newColumn;
    };

    this.addColumns = function (columnInfos) {
      var newColumns = [];
      for (var i = 0, l = columnInfos.length; i < l; i++) {
        newColumns.push(this.addColumn(columnInfos[i]));
      }
      return newColumns;
    };

    this.addRow = function (rowInfo) {
      var newRow = new Row(rowInfo);
      this.rows.add(newRow);
      return newRow;
    };

    this.addRows = function (rowInfos) {
      var newRows = [];
      for (var i = 0, l = rowInfos.length; i < l; i++) {
        newRows.push(this.addRow(rowInfos[i]));
      }
      return newRows;
    };

    this.addCell = function (cellInfo) {
      var newCell = new Cell(cellInfo);
      this.cells.add(newCell);
      return newCell;
    };

    this.addCells = function (cellInfos) {
      var newCells = [];
      for (var i = 0, l = cellInfos.length; i < l; i++) {
        newCells.push(this.addCell(cellInfos[i]));
      }
      return newCells;
    };
  }

  // Row, Column, Cell 등의 객체에서 사용하는 기본
  function Entity() {
    var temp = [];
    return {
      hasClass: function (classname) {
        if (!classname) {
          return -1;
        }
        temp = this.className ? this.className.split(/\s+/) : [];
        return $.inArray(classname, temp, 0);
      },
      addClass: function (classname) {
        if (!!classname && this.hasClass(classname) < 0) {
          temp.push(classname);
          this.className = temp.join(' ');
          if (this.ui) {
            this.ui.addClass(classname);
          }
        }
      },
      removeClass: function (classname) {
        if (!classname) {
          return;
        }
        var index = this.hasClass(classname);
        if (index >= 0) {
          temp.splice(index, 1);
          this.className = temp.join(' ');
          if (this.ui) {
            this.ui.removeClass(classname);
          }
        }
      },
      toggleClass: function (classname) {
        if (!classname) {
          return false;
        }
        if (this.hasClass(classname) < 0) {
          this.addClass(classname);
        } else {
          this.removeClass(classname);
        }
      }
    };
  }

  function ColumnGroup(info) {
    this.id = info.id;
    this.uuid = info.id;
    this.parent = info.parent;
    this.label = info.label;
    this.columns = new ColumnCollection();
    this._ui = info.ui || $('<li class="spreadsheet-column spreadsheet-column-group ui-state-default"><span></span></li>');
    this.width = function () {
      var w = 0,
        brw = 0,
        numberOfVisibleColumn = 0,
        $uiColumns = this.parent ? $.map(this.parent.columns.toArray(), function (column, index) {
          if (!column.ui) {
            return null;
          }
          var parent = column.ui.parent();
          if (!parent) {
            return null;
          }
          return parent.children().index(column.ui) >= 0 ? column : null;
        }) : [];

      $.each(this.columns.toArray(), function (i) {
        if ($.inArray(this, $uiColumns) >= 0) {
          w += this.offset.width;
          brw = parseInt(this.ui.css('border-right-width'));
          numberOfVisibleColumn++;
        }
      });
      //      return w - brw;
      return w + brw * (numberOfVisibleColumn - 1);
    };

    this.ui = function (ui) {
      if (ui) {
        this._ui = ui;
      }
      return this._ui.width(this.width()).find('span').text(this.label).end();
    };
  }
  ColumnGroup.prototype = new Entity();

  function Column(columnInfo) {
    columnInfo = columnInfo || {};
    this.uuid = uniqueId('column');
    this.id = columnInfo.id || this.uuid;
    this.label = columnInfo.label;
    this.width = columnInfo.width || 80;
    this.height = columnInfo.height || 26;
    this.className = 'spreadsheet-column ui-state-default ' + (columnInfo.className || '');
    this.group = columnInfo.group;
    this.renderer = null;
    this.editor = null;
    this.buttons = null;
    this.offset = {
      left: 0,
      width: this.width,
      outerWidth: 0,
      innerWidth: 0
    };
    this.cells = new CellCollection();
  }
  Column.prototype = new Entity();

  Column.prototype.toJSON = function () {
    var obj = {};
    obj.uuid = this.uuid;
    obj.id = this.id;
    obj.label = this.label;
    obj.width = this.width;
    obj.height = this.height;
    obj.className = this.className;
    obj.cells = [];
    // TODO 공통으로 사용할 수 있을까?
    for (var i = 0, l = this.cells.length; i < l; i++) {
      obj.cells.push(this.cells.get(i).uuid);
    }
    return JSON.stringify(obj);
  };

  Column.prototype.toXML = function () {
    var xml = [];
    xml.push('<column>');
    xml.push('<uuid>');
    xml.push(this.uuid);
    xml.push('</uuid>');
    xml.push('<id>');
    xml.push(this.id);
    xml.push('</id>');
    xml.push('<label>');
    xml.push(this.label);
    xml.push('</label>');
    xml.push('<width>');
    xml.push(this.width);
    xml.push('</width>');
    xml.push('<height>');
    xml.push(this.height);
    xml.push('</height>');
    xml.push('<className>');
    xml.push(this.className);
    xml.push('</className>');
    // TODO cells에 대한 처리를 추가하자. 공통으로 할 수 있을까?
    xml.push('</column>');
    return xml.join('');
  };

  function Row(rowInfo) {
    rowInfo = rowInfo || {};
    this.uuid = uniqueId('row');
    this.id = rowInfo.id || this.uuid;
    this.height = rowInfo.height || 26;
    this.label = rowInfo.label;
    this.width = rowInfo.width || 80;
    this.renderer = null;
    this.buttons = null;
    this.editor = null;
    this.className = 'ui-state-default spreadsheet-row ' + (rowInfo.className || '');
    this.offset = {
      top: 0,
      height: this.height,
      outerHeight: 0,
      innerHeight: 0
    };
    this.cells = new CellCollection();
  }
  Row.prototype = new Entity();

  Row.prototype.toJSON = function () {
    var obj = {};
    obj.uuid = this.uuid;
    obj.id = this.id;
    obj.height = this.height;
    obj.width = this.height;
    obj.label = this.label;
    obj.className = this.className;
    obj.cells = this.cells;
    return JSON.stringify(obj);
  };

  Row.prototype.toXML = function () {
    var xml = [];
    xml.push('<row>');
    // TODO
    xml.push('NOT IMPLEMENTED YET!!!');
    xml.push('</row>');
    return xml.join('');
  };

  function Cell(cellInfo) {
    cellInfo = cellInfo || {};
    this.uuid = uniqueId('cell');
    this.id = cellInfo.id || this.uuid;
    this.value = cellInfo.value;
    this.formula = cellInfo.formula;
    this.renderer = null;
    this.editor = null;
    this.className = 'spreadsheet-cell ' + (cellInfo.classname || '');
    // 컬렉션은 성능 저하가 심하다.
    // TODO 저장된 컬럼 및 로우의 정보를 되살린다.
    this.rows = cellInfo.rows || [];
    this.columns = cellInfo.columns || [];
  }
  Cell.prototype = new Entity();

  Cell.prototype.toJSON = function () {
    var obj = {};
    obj.uuid = this.uuid;
    obj.id = this.id;
    obj.value = this.value;
    obj.formula = this.formula;
    obj.className = this.className;

    obj.rows = this.rows;
    obj.columns = this.columns;

    return JSON.stringify(obj);
  };

  Cell.prototype.toXML = function () {
    var xml = [];
    xml.push('<cell>');
    // XXX
    xml.push('NOT IMPLEMENTED YET!!!');
    xml.push('</cell>');
    return xml.join('');
  };

  /*
  function DefaultCellRenderer() {
    this.ui = $('<div class="spreadsheet-cell-renderer"></div>');
    this.label = $('<span></span>').appendTo(this.ui);
  }

  function DefaultCellEditor() {
    return $('<input type="text" class="spreadsheet-cell-editor"></input>');
  }

  function ColumnIndicator() {
    return $('<div class="spreadsheet-column-indicator"></div>');
  }

  function RowIndicator() {
    return $('<div class="spreadsheet-row-indicator"></div>');
  }

  function CellIndicator() {
    return $('<div class="spreadsheet-cell-indicator"></div>');
  }

  function CellSelector() {
      return $('<div class="spreadsheet-cell-selector"></div>');
  }
  */

  return $.widget('innerwave.spreadsheet', {
    version: '0.2.414-SNAPSHOT',
    options: {
      // buttons: [],
      // spreadsheetClass: '',
      height: 'auto',
      width: 'auto',
      maxHeight: null,
      maxWidth: null,
      minHeight: 150,
      minWidth: 150,
      // resizable: false,
      title: null,

      columns: [],
      data: [],

      dataParseUnit: 10,

      // numberOfColumns: 10,
      // numberOfRows: 10,

      defaultColumnWidth: 50,
      defaultRowHeight: 24,

      showTitle: true, // sheet's title
      //      showGutter: true, // line numbers
      showColumnGroups: false, // column group headers
      showColumnHeaders: false, // column headers
      showRowHeaders: false, // row headers, line numbers
      showValueWindow: false, // input editor for selected cell's data
      showDefaultGrid: true, // grid lines
      defaultGridLineColor: "#CCC",

      // 갯수는 sheet.columns의 인덱스 순서에 의한 갯수를 의미한다.
      numberOfFixedRows: 0, // 고정행 갯 수
      numberOfFixedColumns: 0, // 고정 열 갯 수

      // callbacks
      ready: NOOP,
      //      focus: NOOP,
      //      resize: NOOP,
      //      resizeStart: NOOP,
      //      resizeEnd: NOOP,

      update: NOOP
    },

    // sizeRelatedOptions: {
    //   buttons: true,
    //   height: true,
    //   maxHeight: true,
    //   maxWidth: true,
    //   minHeight: true,
    //   minWidth: true,
    //   width: true
    // },

    // resizableRelatedOptions: {
    //   maxHeight: true,
    //   maxWidth: true,
    //   minHeight: true,
    //   minWidth: true
    // },

    //    boundary: {
    //      firstRow: 0, //
    //      numberOfRows: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 row의 수에 따라 동적으로 설정 해야 한다..
    //      firstColumn: 0,
    //      numberOfColumns: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 column의 수에 따라 동적으로 설정해야 한다.
    //    },

    /**
     *  데이터를 파싱한 컬렉션
     */
    //    dataProvider: new DataProvider(),

    /**
     * 데이터 구문분석 중지 플래그
     * 파싱중 true로 설정하면 다음번 이터레이션에서 파싱을 중지한다.
     */
    //    cancleParseData: false,

    /**
     * 스크롤 되는 중인지 체크하기 위한 변수
     * 참이면 마우스 오버 등의 이벤트를 발생하지 않도록 하는데에 사용한다.
     */
    //    _scrolling: false,

    //-------------------------------------------------------------------
    // PUBLIC Methods
    columns: function (columns) {
      if (columns === undefined) {
        return this.sheet.columns;
      }
      // this.options.columns = columns;
      this.sheet.columns.empty();
      this.sheet.addColumns(columns);
      this._trigger('columnChanged');
    },

    rows: function (rows) {
      if (rows === undefined) {
        return this.sheet.rows;
      }
      this.sheet.rows.empty();
      this.sheet.addRows(rows);
      this._trigger('rowChanged');
    },

    data: function (data) {
      this.dataProvider = this.dataProvider || new DataProvider();
      if (data === undefined) {
        return this.dataProvider;
      }
      laptime(this.uuid + '.< set data into dataprovider');
      this.dataProvider.empty();
      this.dataProvider.addAll(data);

      this.cancleParseData = false;

      // 기본 렌더링이 되었으면 데이터 렌더링을 위한 트리거를 발생한다.
      if (this.initialized) {
        this._trigger('dataChanged');
      }
      laptime(this.uuid + '.set data into dataprovider >');
    },


    //-------------------------------------------------------------------
    // PRIVATE Methods
    _create: function () {
      this.uuid = uniqueId('sheet');

      laptime(this.uuid + '.<_create');

      // XXX destroy시에 기존의 엘리먼트를 복구해 놓기 위해 백업해 둔다. ?
      this.original = {
        css: {
          display: this.element[0].style.display,
          width: this.element[0].style.width,
          minWidth: this.element[0].style.minWidth,
          maxWidth: this.element[0].style.maxWidth,
          minHeight: this.element[0].style.minHeight,
          maxHeight: this.element[0].style.maxHeight,
          height: this.element[0].style.height
        },
        contents: this.element[0].innerHTML
      };

      this.originalTitle = this.element.attr('title');
      this.options.title = this.options.title || this.originalTitle;
      this.element.attr('title', '');

      this.boundary = {
        firstRow: 0, //
        numberOfRows: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 row의 수에 따라 동적으로 설정 해야 한다..
        firstColumn: 0,
        numberOfColumns: 50, // TODO 디스플레이되는 뷰포트에 볼 수 있는 column의 수에 따라 동적으로 설정해야 한다.
      };

      this._scrolling = false;
      this.cancleParseData = false;
      this.dataProvider = new DataProvider();

      //------------------
      // 시트의 형상 정보는 이곳에 만든다. 컬럼, 로우, 셀을 관리한다.
      // 데이터는 구문분석하여 셀로 변환된다.
      this.sheet = new Sheet();

      // 초기 데이터를 파싱한다.
      this.sheet.addColumns(this.options.columns);

      // FIXME 현재 옵션으로 제공되는 데이터는 모든 데이터를 파싱하고 렌더링을 한다.
      // 기본 렌더링 후 데이터를 파싱할 수 있도록 수정이 필요할까?
      this.data(this.options.data);

      // 데이터 변환 후 메모리를 비워준다.
      this.options.columns = null;
      this.options.data = null;

      this._render();
      laptime(this.uuid + '._create>');
    },

    _setOption: function (key, value) {
      if (key === 'columns') {
        this.columns(value);
      } else if (key === 'data') {
        this.data(value);
      }
      this._super(key, value);
      return this;
    },

    _parseEachData: function (data, row) {
      // TODO 조회한 셀정보 데이터를 되살린다. 
      // 그래야 컬럼 및 로우 머지를 할 수 있다. cellspan, rowspan...
      var
        column,
        cell,
        cellInfo = {},
        that = this;
      $.each(data, function (key) {
        if (key === 'id' || key === 'uuid' || key === 'height') {
          row.key = this;
          return;
        }

        cellInfo = {
          value: this
        };

        cell = that.sheet.addCell(cellInfo);

        row.cells.add(cell);
        column = that.sheet.columns.getById(key);
        column.cells.add(cell);

        cell.rows.push(row);
        cell.columns.push(column);
      });
    },

    //TODO HTML5 WebWorker를 사용하도록 기능을 추가하자
    // webworker를 지원하는 브라우저인지는 Modernizr 를 사용하자.
    // 테스트는 !!window.Worker; 로 간단하지만 다른 기능을 검사하는 것 canvas, svg, video, ...
    //    tests['webworkers'] = function() {
    //        return !!window.Worker;
    //    };
    // 암튼 현재 사용하고 있는 것은 반복 프로세스를 끊어서 프로그레스를 표시하는 방식이다.
    // IE 10 부터 webworker를 지원한다고 하니 작성하여 봄직하다.
    _parseData: function () {
      if (!this.initialized) {
        return;
      }
      if (this.cancleParseData) {
        return;
      }
      laptime(this.uuid + '.< _parseData');

      var that = this,
        i = 0,
        l = this.dataProvider.length,
        row, data, key, value;

      this.sheet.rows.empty();
      this.sheet.cells.empty();
      var dp = this.dataProvider.toArray(),
        chunks = [],
        size = this.options.dataParseUnit,
        progress = 0,
        noc = 0;

      for (i = 0, l = dp.length; i < l; i += size) {
        chunks.push(dp.slice(i, Math.min(i + size, l)));
      }

      var parse = function (chunk) {
        for (i = 0, l = chunk.length; i < l; i++) {
          data = chunk[i];
          row = this.sheet.addRow(data);
          // TODO 기존의 셀 정보를 복구하기 위해서는 데이터(VALUE)뿐 아니라 
          // 셀 포맷 정보까지도 복구 되어야 한다.
          this._parseEachData(data, row);
        }
        progress += i;
        if (this.$uiProgressBar.progressbar('instance') !== undefined) {
          this.$uiProgressBar.progressbar('value', parseInt(progress / dp.length * 100));
        }
        // XXX 파싱 데이터 실시간 렌더링 파싱 자체에 결려 있는 타임아웃과 조율이 필요하다.
        this._delay(function () {
          this._trigger('rowChanged');
        }, 50);

        if (noc >= chunks.length - 1) {
          laptime(this.uuid + '._parseData >');
        } else {
          if (this.cancleParseData) {
            laptime(this.uuid + '._parseData CANCELED >');
            return;
          }
          //          laptime(this.uuid + '._parseData ...');
          this._delay(function () {
            parse.call(this, chunks[++noc]);
          }, 5);
        }
      };

      if (chunks.length > 0) {
        parse.call(this, chunks[noc]);
      }
    },

    /**
     * @public stopParseData
     * 진행 중인 데이터 변환 작업을 중단하고 프로그레스바를 숨긴다.
     * 현재까지 파싱한 데이터는 유지되고, 파싱된 데이터에 대한 모든 기능은 정상 작동한다.
     */
    stopParseData: function () {
      laptime(this.uuid + '.stopParseData >');
      this.cancleParseData = true;
      this._hideProgressBar('slow');
      // XXX 추가 작업이 필요할까?
    },

    //---------------------------------------------------------------------------
    _render: function () {
      laptime(this.uuid + '.< _render');
      var that = this;

      this.element.show();
      if (this.options.width === 'auto' || this.options.width === '100%') {
        this.element.width(Math.max(this.original.css.minWidth, this.original.css.width || this.element.attr('width')));
      } else {
        this.element.width(this.options.width);
      }
      if (this.options.height === 'auto' || this.options.height === '100%') {
        this.element.height(Math.max(this.original.css.minHeight, this.original.css.height || this.element.attr('height')));
      } else {
        this.element.height(this.options.height);
      }

      this.element.addClass('spreadsheet ui-widget ui-state-default');
      // 로더는 가장 먼저 생성하고 z-index로 최상위에 보인다.
      // 데이터 파싱 전에 약간의 시간을 두지만(setTimeout), 렌더링이 안되는 것이 있다.
      // 따라서 가능한 항상 보이기 위해서는 가장 먼저 생성한다.
      this._showProgressBar();

      this.$uiContainer = $('<div class="spreadsheet-container">').width(this.element.width()).height(this.element.height()).appendTo(this.element);
      this.$uiHeader = $('<div class="spreadsheet-header ui-state-default">').appendTo(this.$uiContainer);
      this.$uiViewport = $('<div class="spreadsheet-viewport ui-widget-content">').appendTo(this.$uiContainer);
      this.$defaultGrid = $('<canvas class="spreadsheet-gridlines">').appendTo(this.$uiViewport);
      this.$uiColumnViewport = $('<div class="spreadsheet-viewport-column ui-state-default">').appendTo(this.$uiContainer);
      this.$uiColumns = $('<ul class="spreadsheet-column-list">')
        .sortable({
          zIndex: 9999,
          placeholder: "ui-state-highlight spreadsheet-placeholder-column",
          start: function (event, ui) {
            var $uiColumns = that.$uiColumns.children();
            var uiIndex = $uiColumns.index(ui.item[0]);
            $(ui.item[0]).data('originalIndex', uiIndex);
          },
          stop: function (event, ui) {
            var originalIndex = $(ui.item[0]).data('originalIndex');
            var $uiColumns = that.$uiColumns.children();
            var uiIndex = $uiColumns.index(ui.item[0]);
            that.sheet.columns.move(ui.item[0].id, uiIndex - originalIndex);
            that._trigger('columnChanged');
          }
        })
        .disableSelection()
        .appendTo(this.$uiColumnViewport);
      this.$uiRowViewport = $('<div class="spreadsheet-viewport-row ui-state-default">').appendTo(this.$uiContainer);
      this.$uiRows = $('<ul class="spreadsheet-row-list">')
        .sortable({
          placeholder: "ui-state-highlight spreadsheet-placeholder-row",
          start: function (event, ui) {
            var $uiRows = that.$uiRows.children();
            var uiIndex = $uiRows.index(ui.item[0]);
            $(ui.item[0]).data('originalIndex', uiIndex);
          },
          stop: function (event, ui) {
            var originalIndex = $(ui.item[0]).data('originalIndex');
            var $uiRows = that.$uiRows.children();
            var uiIndex = $uiRows.index(ui.item[0]);
            that.sheet.rows.move(ui.item[0].id, uiIndex - originalIndex);
            that._trigger('rowChanged');
          }
        })
        .disableSelection()
        .appendTo(this.$uiRowViewport);

      this.$uiColumnViewport.css('margin-left', this.$uiRowViewport.outerWidth() + 'px');

      this._renderTitleBar();
      this._renderColumns();
      this._renderRows();
      this._createValueWindow();
      this.$uiViewport
        .width(this.$uiContainer.width() - this.$uiRowViewport.outerWidth())
        .height(this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight());

      this.$uiFooter = $('<div class="spreadsheet-footer ui-state-default">').appendTo(this.$uiContainer);
      this.$uiVerticalScrollArea = $('<div class="spreadsheet-scrollbar scroll-area-vertical">').appendTo(this.$uiContainer);
      this.$uiHorizontalScrollArea = $('<div class="spreadsheet-scrollbar scroll-area-horizontal">').appendTo(this.$uiFooter);

      // Regist some Event handlers..
      this._setupEvents();

      laptime(this.uuid + '. _render >');
      this._trigger('initialized');
    },

    _hideProgressBar: function (speed) {
      if (this.$uiProgressBar) {
        this.$uiProgressBar.hide(speed);
      }
    },

    _showProgressBar: function () {
      var that = this;
      if (this.$uiProgressBar) {
        this.$uiProgressBar.show();
      } else if (this.options.progressBar) { // plugin
        this.$uiProgressBar = this.options.progressBar.appendTo(this.element).show();
      } else { //fallback
        this.$uiProgressLabel = $('<div class="spreadsheet-progress-label">').text('Loading......');
        this.$uiProgressBar = $('<div class="spreadsheet-progress">')
          .progressbar({
            value: false,
            change: function () {
              that.$uiProgressLabel.text(that.$uiProgressBar.progressbar("value") + "% ")
                .css('left', (that.$uiProgressBar.width() - that.$uiProgressLabel.outerWidth()) / 2 + 'px');
            },
            complete: function () {
              that.$uiProgressLabel.text("100%");
              that.$uiProgressLabel.css('left', (that.$uiProgressBar.width() - that.$uiProgressLabel.outerWidth()) / 2 + 'px');
              that.$uiProgressBar.hide('slow');
            }
          })
          .append(this.$uiProgressLabel)
          .appendTo(this.element);
      }
      this.$uiProgressBar.attr('title', 'STOP! Click to stop the data is parsed.')
        .off('click')
        .click(function (e) {
          console.log(that.uuid + ' . $uiProgressBar.onClick()');
          that.stopParseData();
        })
        .css({
          top: (this.element.height() - this.$uiProgressBar.outerHeight()) / 2 + 'px',
          left: (this.element.width() - this.$uiProgressBar.outerWidth()) / 2 + 'px'
        });
    },

    _renderTitleBar: function () {
      if (this.options.showTitle === true) {
        this.$uiTitle = $('<span class="spreadsheet-title">')
          .text(this.options.title).appendTo(this.$uiHeader);
      } else {
        this.$uiHeader.remove();
      }
    },

    _createValueWindow: function () {
      if (this.options.showValueWindow === true) {
        // FIXME 위겟을 선언해야 할지 생각해 보자.
        this.$uiValueWindow = $('<div class="spreadsheet-value-window ui-widget">')
          .append('<span class="value-editor-label">Value: </span>')
          .append('<input type="text" class="ui-widget ui-widget-content"/>')
          .appendTo(this.$uiColumnViewport);
      }
    },

    _createUiColumn: function (i, column) {
      var that = this;
      return column.ui = $('<li>')
        .attr('id', column.uuid)
        .addClass(column.className)
        .width(column.offset.width)
        .append($('<span>').text(column.label !== undefined ? column.label : getColumnHeaderText(i)))
        .append('<div class="indicator">')
        .data('column', column)
        .button().removeClass('ui-corner-all')
        .resizable({
          handles: 'e',
          minWidth: 2,
          stop: function (e, ui) {
            var $uiColumn = $(ui.element);
            column.width = ui.size.width;
            column.offset.width = ui.size.width;
            column.offset.outerWidth = $uiColumn.outerWidth();
            column.offset.innerWidth = $uiColumn.innerWidth();
            that._renderColumns(that.boundary.firstColumn);
          }
        })
        .on('click', function (event) {
          // XXX 별 효력이 없어ㅜㅜ;
          // 데이터 처리와 렌더링에는 차이가 있는 것 같다.ㅜㅜ;
          //          if (that.startColumnHighlighting === true) {return false;}
          //          laptime(this.uuid + '.<column header click...' + this.outerText);
          //          that.startColumnHighlighting = true;
          if (event.ctrlKey === false) {
            that.sheet.cells.each('removeClass', ['ui-state-highlight']);
            that.sheet.columns.each('removeClass', ['ui-state-highlight']);
            that.sheet.rows.each('removeClass', ['ui-state-highlight']);
          }
          column.addClass('ui-state-highlight');
          column.cells.each('addClass', ['ui-state-highlight']);
          //          laptime(this.uuid + '.column header click...>');
          //          that.startColumnHighlighting = false;
        })
        .mousedown(function (event) {
          // XXX .data()를 사용하여  연산 회수를 줄이자.
          var uis = [];
          var column = $(this).data('column'); //that.sheet.columns.getById(this.id);
          if (column.group) {
            // TODO column에 group을 아이디가 아닌 객체 참조를 걸어보자.
            // 즉 단방향(group->column)이 아닌 양방향(group<->column)으로 해 보자.
            var group = that.sheet.columnGroups.getById(fnv32a(column.group));
            uis = $.map(group.columns.toArray(), function (column, index) {
              return column.ui;
            });
          } else {
            uis = that.$uiColumns.children().map(function () {
              column = that.sheet.columns.getById(this.id);
              return column.group ? null : this;
            });
          }
          that.$uiColumns.sortable('option', 'items', uis);
        });
    },

    __renderColumns: function (newFirstColumn) {
      laptime(this.uuid + '.<__renderColumns');

      var
        that = this,
        i = 0,
        l = 0,
        column, $uiColumn,
        group, groups = [],
        columnsWidth = 0;

      function render() {
        /*jshint validthis:true */
        for (; i < l && columnsWidth < this.$uiViewport.width(); i++) {
          column = this.sheet.columns.get(i);
          column.removeClass('ui-state-hover');
          $uiColumn = (this.ui || this._createUiColumn(i, column)).appendTo(this.$uiColumns);
          $uiColumn.removeClass().addClass(column.className);
          column.offset = {
            left: column.ui[0].offsetLeft,
            width: $uiColumn.width(),
            outerWidth: $uiColumn.outerWidth(),
            innerWidth: $uiColumn.innerWidth()
          };
          columnsWidth += column.offset.outerWidth;

          // TODO 그룹을 찾는 방법 개선
          group = this.sheet.columnGroups.getById(fnv32a(column.group || column.id));
          if (!group) {
            group = new ColumnGroup({
              id: fnv32a(column.group || column.id),
              label: column.group
            });
            group.parent = this;
            group.columns.add(column);
            that.sheet.columnGroups.add(group);
          }
          groups.push(group);
        }
      }

      this.$uiColumns.children().detach();

      // Fixed Columns
      if (this.options.numberOfFixedColumns > 0) {
        i = 0;
        l = this.options.numberOfFixedColumns;
        render.call(this);
      }

      // Floated Columns
      newFirstColumn = Math.max(Math.min(Math.max(this.options.numberOfFixedColumns, newFirstColumn || 0), this.sheet.columns.length - 1 /* this.boundary.numberOfColumns*/ ), 0);
      this.boundary.firstColumn = newFirstColumn;
      i = newFirstColumn;
      l = Math.min(newFirstColumn + this.boundary.numberOfColumns, this.sheet.columns.length);
      render.call(this);

      //column group
      if (this.options.showColumnGroups === false) {
        if (this.$uiColumnGroups) {
          this.$uiColumnGroups.hide();
        }
      } else {
        this.$uiColumnGroups = this.$uiColumnGroups || $('<ul class="spreadsheet-column-group-list">').insertBefore(this.$uiColumns);
        this.$uiColumnGroups.children().each(function (i) {
          $(this).detach();
        });
        for (i = 0, l = groups.length; i < l; i++) {
          group = groups[i];
          group.ui().appendTo(this.$uiColumnGroups);
        }
      }

      if (this.options.showColumnHeaders === false) {
        if (this.$uiColumnGroups) {
          this.$uiColumnGroups.hide();
        }
        this.$uiColumns.addClass('hidden');
      } else {
        if (this.$uiColumnGroups) {
          this.$uiColumnGroups.show();
        }
        this.$uiColumns.removeClass('hidden');
      }

      this.$uiViewport
        .width(this.$uiContainer.width() - this.$uiRowViewport.outerWidth())
        .height(this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight());

      laptime(this.uuid + '.__renderColumns>');
      this._renderData();
    },

    _renderColumns: (function () {
      var timeoutIds = {};
      return function (newFirstColumn) {
        laptime(this.uuid + '.' + timeoutIds[this.uuid] + '.<_renderColumns');
        clearTimeout(timeoutIds[this.uuid]);
        timeoutIds[this.uuid] = this._delay(function () {
          this.__renderColumns(newFirstColumn);
        }, 30);
        laptime(this.uuid + '.' + timeoutIds[this.uuid] + '._renderColumns>');
      };
    })(),

    _onRowResize: function (ui, row) {
      var $uiRow = $(ui.element);
      row.height = ui.size.height;
      row.offset.height = ui.size.height;
      row.offset.outerHeight = $uiRow.outerHeight();
      row.offset.innerHeight = $uiRow.innerHeight();
      this._renderRows(this.sheet.rows.indexOf(this.sheet.rows.getById(this.$uiRows.children().filter('li:first').attr('id'))));
    },

    _createUiRow: function (i, row) {
      var that = this;
      return row.ui = $('<li>')
        .attr('id', row.uuid)
        .addClass(row.className)
        .height(row.height)
        .append($('<span>').text(row.label || i + 1))
        .append('<div class="indicator">')
        .button()
        .removeClass('ui-corner-all')
        .resizable({
          handles: 's',
          minHeight: 2,
          stop: function (e, ui) {
            that._onRowResize(ui, row);
          }
        })
        .on('click', function (event) {
          if (event.ctrlKey === false) {
            that.sheet.cells.each('removeClass', ['ui-state-highlight']);
            that.sheet.columns.each('removeClass', ['ui-state-highlight']);
            that.sheet.rows.each('removeClass', ['ui-state-highlight']);
          }
          row.addClass('ui-state-highlight');
          row.cells.each('addClass', ['ui-state-highlight']);
        });
    },

    __renderRows: function (newFirstRow) {
      var
        that = this,
        i = 0,
        l = 0,
        rowsHeight = 0,
        viewportHeight = this.$uiViewport.height();

      function render() {
        var row, $uiRow;
        /*jshint validthis:true */
        for (; i < l && rowsHeight < viewportHeight; i++) {
          row = this.sheet.rows.get(i);
          row.removeClass('ui-state-hover');
          $uiRow = (row.ui || this._createUiRow(i, row)).appendTo(this.$uiRows);
          $uiRow.removeClass().addClass(row.className);
          row.offset = {
            top: row.ui[0].offsetTop,
            height: $uiRow.height(), //row.ui[0].offsetHeight,
            outerHeight: $uiRow.outerHeight(),
            innerHeight: $uiRow.innerHeight()
          };
          rowsHeight += row.offset.outerHeight; //$uiRow.outerHeight();
        }
      }

      this.$uiRows.children().detach();

      // Fixed Rows
      if (this.options.numberOfFixedRows > 0) {
        i = 0;
        l = this.options.numberOfFixedRows;
        render.call(this);
      }

      // Floated Rows
      newFirstRow = Math.max(Math.min(Math.max(this.options.numberOfFixedRows, newFirstRow || 0), this.sheet.rows.length - 1 /* this.boundary.numberOfRows*/ ), 0);
      this.boundary.firstRow = newFirstRow;
      i = newFirstRow;
      l = Math.min(newFirstRow + this.boundary.numberOfRows, this.sheet.rows.length);
      render.call(this);

      if (this.options.showRowHeaders === false) {
        this.$uiRowViewport.addClass('hidden');
        this.$uiColumnViewport.css('margin-left', this.$uiRowViewport.outerWidth() + 'px');
      } else {
        this.$uiRowViewport.removeClass('hidden');
      }

      this.$uiViewport
        .width(this.$uiContainer.width() - this.$uiRowViewport.outerWidth())
        .height(this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight());

      this._renderData();
    },

    _renderRows: (function () {
      var timeoutIds = {};
      return function (newFirstRow) {
        clearTimeout(timeoutIds[this.uuid]);
        timeoutIds[this.uuid] = this._delay(function () {
          this.__renderRows(newFirstRow);
        }, 10);
      };
    })(),

    _offsetOfCell: function (cell) {
      var left = Number.MAX_VALUE,
        top = Number.MAX_VALUE,
        width = 0,
        height = 0,
        i, l, item;

      for (i = 0, l = cell.columns.length; i < l; i++) {
        item = cell.columns[i];
        left = Math.min(left, item.offset.left);
        width += item.offset.innerWidth;
      }

      for (i = 0, l = cell.rows.length; i < l; i++) {
        item = cell.rows[i];
        top = Math.min(top, item.offset.top);
        height += item.offset.innerHeight;
      }

      return {
        left: left,
        top: top,
        width: width,
        height: height
      };
    },

    _createUiCell: function (cell) {
      // TODO cell에 지정된 formular가 있을 경우 이를 처리
      var that = this,
        ui = $('<span>')
        .text(cell.value)
        .wrap('<div class="spreadsheet-cell">').parent()
        .attr('title', cell.value)
        .addClass(cell.className)
        .hover(function () {
          if (that._scrolling) {
            return;
          }
          ui.addClass('ui-state-hover');
          $.each(cell.columns, function (i) {
            this.addClass('ui-state-hover');
          });
          $.each(cell.rows, function (i) {
            this.addClass('ui-state-hover');
          });
        }, function () {
          ui.removeClass('ui-state-hover');
          $.each(cell.columns, function (i) {
            this.removeClass('ui-state-hover');
          });
          $.each(cell.rows, function (i) {
            this.removeClass('ui-state-hover');
          });
        })
        .on('click', function (event) {
          this.currentCell = cell;
          this.currentCells = this.currentCells || [];
          if (event.ctrlKey === false) {
            this.currentCells = [];
            that.sheet.cells.each('removeClass', ['ui-state-highlight']);
            that.sheet.columns.each('removeClass', ['ui-state-highlight']);
            that.sheet.rows.each('removeClass', ['ui-state-highlight']);
          }
          this.currentCells.push(cell);

          cell.addClass('ui-state-highlight');
          $.each(cell.columns, function (i) {
            this.addClass('ui-state-highlight');
          });
          $.each(cell.rows, function (i) {
            this.addClass('ui-state-highlight');
          });

          if (that.options.showValueWindow === true) {
            that.$uiValueWindow.find('input:text').val(cell.value);
          }
        })
        .disableSelection();
      cell.ui = ui;
      return ui;
    },

    // 데이터 렌더링
    // 딜레이를 주어 빈번한 렌더링에 따른 부하를 줄인다.
    // 메소드 만의 static private 변수 timeoutId를 사용하기 위한 방법으로 클로저를 사용하여 변수의 오염을 방지한다.
    _renderData: (function () {
      var timeoutIds = {};
      return function () {

        clearTimeout(timeoutIds[this.uuid]);
        this._createScrollbars();
        this._drawDefaultGrid();

        timeoutIds[this.uuid] = this._delay(function () {
          var
            ci = this.boundary.firstColumn,
            ri = this.boundary.firstRow,
            noc = this.$uiColumns.children() /*.filter('li')*/ .length,
            nor = this.$uiRows.children() /*.filter('li')*/ .length,
            nofr = this.options.numberOfFixedRows,
            nofc = this.options.numberOfFixedColumns,
            _rows = this.sheet.rows.toArray(),
            _columns = this.sheet.columns.toArray(),
            rows = _rows.slice(ri, ri + nor - nofr).concat(_rows.slice(0, nofr)),
            columns = _columns.slice(ci, ci + noc - nofc).concat(_columns.slice(0, nofc)),
            // 새롭게 보일 셀 추출
            cells = $.map(rows, function (row) {
              return $.map(row.cells.toArray(), function (cell) {
                return $.map(cell.columns, function (column) {
                  return $.inArray(column, columns) >= 0 ? true : null;
                }).length > 0 ? cell : null;
              });
            }),
            i, l, cell;
          // 기존 셀 숨김
          this.$uiViewport.find('div.spreadsheet-cell').detach();
          // 새로운 셀 보임
          for (i = 0, l = cells.length; i < l; i++) {
            cell = cells[i];
            (cell.ui || this._createUiCell(cell))
            .removeClass().addClass(cell.className)
              .css(this._offsetOfCell(cell))
              .appendTo(this.$uiViewport);
          }
        }, 30);
      };
    })(),

    _createScrollbars: function () {
      // TODO 필요할 때만  스크롤바를 노출 할 수 있도록 처리
      var that = this,
        minRows = Math.max(this.options.numberOfFixedRows, 0),
        maxRows = this.sheet.rows.length - 1,
        minColumns = Math.max(this.options.numberOfFixedColumns, 0),
        maxColumns = this.sheet.columns.length - 1;

      // 좀 간편하게 할 수 있는 방법이 없을까?
      this.$uiVerticalScrollArea.height(this.$uiContainer.height() - this.$uiHeader.outerHeight() - this.$uiColumnViewport.outerHeight() - parseInt(this.$uiVerticalScrollArea.css('border-top').replace('px', '') || 1) - parseInt(this.$uiVerticalScrollArea.css('bottom').replace('px', '') || 0));
      this.$uiHorizontalScrollArea.width(this.$uiContainer.width() - this.$uiRowViewport.outerWidth() - parseInt(this.$uiHorizontalScrollArea.css('border-left').replace('px', '') || 1) - parseInt(this.$uiHorizontalScrollArea.css('border-right').replace('px', '') || 1) - parseInt(this.$uiHorizontalScrollArea.css('right').replace('px', '') || 0));

      if (!this.$uiVerticalScrollbar) {
        this.$uiVerticalScrollbar = $('<div class="spreadsheet-scrollbar spreadsheet-scrollbar-vertical">')
          .scroller({
            orientation: "vertical",
            value: minRows,
            min: minRows,
            max: maxRows,
            step: 1,
            start: function (event, ui) {
              that._scrolling = true;
            },
            stop: function (event, ui) {
              that._scrolling = false;
            },
            slide: function (event, ui) {
              that._renderRows(ui.value);
            }
          })
          .appendTo(this.$uiVerticalScrollArea);
      } else {
        // XXX 데이터 파싱이 되는 대로 스크롤바의 최대 값을 조정한다.
        // 이렇게 할 때, 파싱되지 않고 남은 데이터의 처리 방안을 생각해 보자.
        this.$uiVerticalScrollbar
          .scroller('option', 'min', minRows)
          .scroller('option', 'max', maxRows);
      }

      if (!this.$uiHorizontalScrollbar) {
        this.$uiHorizontalScrollbar = $('<div class="spreadsheet-scrollbar spreadsheet-scrollbar-horizontal">')
          .scroller({
            value: minColumns,
            min: minColumns,
            max: maxColumns,
            step: 1,
            start: function (event, ui) {
              that._scrolling = true;
            },
            stop: function (event, ui) {
              that._scrolling = false;
            },
            slide: function (event, ui) {
              that._renderColumns(ui.value);
            }
          })
          .appendTo(this.$uiHorizontalScrollArea);
      } else {
        this.$uiHorizontalScrollbar
          .scroller('option', 'min', minColumns)
          .scroller('option', 'max', maxColumns);
      }
    },

    _drawDefaultGrid: function () {
      this.$uiViewport.css({
        top: this.$uiRows.offset().top - this.$uiContainer.offset().top,
        left: this.$uiColumns.offset().left - this.$uiContainer.offset().left,
      });
      if (Modernizr.canvas && this.options.showDefaultGrid) {
        var width = 0,
          height = 0;

        // 그리드 라인을 셀 영역에만 그린다.
        this.$uiColumns.children().each(function (i) {
          width += $(this).outerWidth();
        });

        this.$uiRows.children().each(function (i) {
          height += $(this).outerHeight();
        });

        this.$defaultGrid.attr({
          width: width,
          height: height
        });

        var ctx = this.$defaultGrid[0].getContext('2d');
        ctx.fillStyle = this.options.defaultGridLineColor;

        //vertical lines per columns in viewport
        this.$uiColumns.children().each(function (i) {
          ctx.fillRect(offsetRight(this), 0, 1, height);
        });

        // horizontal lines per rows in viewport
        this.$uiRows.children().each(function (i) {
          ctx.fillRect(0, offsetBottom(this), width, 1);
        });
      }
    },


    _setupEvents: function () {
      var that = this;
      this._on({
        'spreadsheetcolumnchanged': function (event) {
          if (this.$uiHorizontalScrollbar) {
            this.$uiHorizontalScrollbar.scroller('option', 'max', this.sheet.columns.length);
            this._renderColumns(this.$uiHorizontalScrollbar.scroller('value'));
          } else {
            this._renderColumns();
          }
        },
        'spreadsheetrowchanged': function (event) {
          if (this.$uiVerticalScrollbar) {
            this.$uiVerticalScrollbar.scroller('option', 'max', this.sheet.rows.length);
            this._renderRows(this.$uiVerticalScrollbar.scroller('value'));
          } else {
            this._renderRows();
          }
        },
        'spreadsheetdatachanged': function (event) {
          this._parseData();
        },
        'spreadsheetinitialized': function (event) {
          this.initialized = true;
          if (this.dataProvider.length > 0) {
            // 파싱전에 화면에 시트 기본 UI를 디스플레이하기 위해 딜레이를 준다.
            this._delay(this._parseData, 500);
          }
        }
      });

      // this._off(this.handles);

      $.each([
          this.$uiColumnViewport,
          this.$uiHorizontalScrollArea
        ],
        function (i) {
          this.mousewheel(function (event) {
            event.preventDefault();
            that._onHorizontalWheel.call(that, event.deltaY || event.deltaX);
          });
        });

      $.each([
          this.$uiRowViewport,
          this.$uiVerticalScrollArea
        ],
        function (i) {
          this.mousewheel(function (event) {
            event.preventDefault();
            that._onVerticalWheel.call(that, event.deltaY || event.deltaX);
          });
        });

      this.$uiViewport.mousewheel(function (event) {
        event.preventDefault();
        if (event.shiftKey === true) {
          that._onHorizontalWheel.call(that, event.deltaX || event.deltaY);
        } else {
          that._onVerticalWheel.call(that, event.deltaY);
        }
      });
    },

    //-------------------------------------------------------------------
    // EVENT Handler
    _onVerticalWheel: function (value) {
      this.verticalScrollBy(value);
    },

    _onHorizontalWheel: function (value) {
      this.horizontalScrollBy(value);
    },

    /**
     * @private
     *
     * 스크롤할 값만 정수로 준다.
     * 기준값은 스크롤러의 값이다.
     */
    verticalScrollBy: function (value) {
      var newVal = this.$uiVerticalScrollbar.scroller('value') - value;
      this._renderRows(newVal);
      this.$uiVerticalScrollbar.scroller('value', newVal);
    },

    /**
     * @private
     * 스크롤할 값만 정수로 준다.
     * 기준값은 스크롤러의 값이다.
     */
    horizontalScrollBy: function (value) {
      var newVal = this.$uiHorizontalScrollbar.scroller('value') - value;
      this._renderColumns(newVal);
      this.$uiHorizontalScrollbar.scroller('value', newVal);
    },

    _startKeyNavigation: function (event, cursor) {
      // 시작 가능여부를 반환
      // 시작시 필요한 것 처리..
      switch (event.keyCode) {
      case $.ui.keyCode.HOME:
        cursor.column = 0;
        cursor.row = 0;
        return false;
      case $.ui.keyCode.END:
        cursor.column = sheet.columns.length - 1;
        cursor.row = sheet.rows.length - 1;
        return false;
      case $.ui.keyCode.PAGE_UP:
      case $.ui.keyCode.PAGE_DOWN:
      case $.ui.keyCode.UP:
      case $.ui.keyCode.RIGHT:
      case $.ui.keyCode.DOWN:
      case $.ui.keyCode.LEFT:
      }
      return true;
    },

    _handleEvents: {
      keydown: function (event) {
        var allowed, curVal, newVal, step,
          // 이동 할 셀 포인트( {columlIndex, rowIndex}
          cursor = $(event.target).data("ui-sheet-cell-cursor") || {
            column: 0,
            row: 0
          };

        switch (event.keyCode) {
        case $.ui.keyCode.HOME:
        case $.ui.keyCode.END:
        case $.ui.keyCode.PAGE_UP:
        case $.ui.keyCode.PAGE_DOWN:
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          event.preventDefault();
          if (!this._keyNavigating) {
            this._keyNavigating = true;
            // 커서 셀을 엑티브 상태로
            cell.addClass('ui-state-active');
            allowed = this._startKeyNavigation(event, cursor);
            if (allowed === false) {
              return;
            }
          }
          break;
        }

        switch (event.keyCode) {
        case $.ui.keyCode.HOME:
          newVal = this._valueMin();
          break;
        case $.ui.keyCode.END:
          newVal = this._valueMax();
          break;
        case $.ui.keyCode.PAGE_UP:
          newVal = this._trimAlignValue(
            curVal + ((this._valueMax() - this._valueMin()) / this.numPages)
          );
          break;
        case $.ui.keyCode.PAGE_DOWN:
          newVal = this._trimAlignValue(
            curVal - ((this._valueMax() - this._valueMin()) / this.numPages));
          break;
        case $.ui.keyCode.UP:
        case $.ui.keyCode.RIGHT:
          if (curVal === this._valueMax()) {
            return;
          }
          newVal = this._trimAlignValue(curVal + step);
          break;
        case $.ui.keyCode.DOWN:
        case $.ui.keyCode.LEFT:
          if (curVal === this._valueMin()) {
            return;
          }
          newVal = this._trimAlignValue(curVal - step);
          break;
        }
      },
      keyup: function (event) {
        var index = $(event.target).data("ui-slider-handle-index");

        if (this._keySliding) {
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          $(event.target).removeClass("ui-state-active");
        }
      }
    },


    // last of properties
    'last': true
  });

}));
