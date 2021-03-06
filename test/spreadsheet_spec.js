(function ($) {

  var $fixture;

  var createColumns = (function () {
    var uuid = 0;
    return function (columnlength) {
      var columns = [],
        i = 0,
        j = 0;
      for (i = 0; i < columnlength; i++) {
        columns.push({
          id: 'col' + i,
          label: 'Column ' + (i + 1),
          width: '50',
          className: 'sheet-column-text',
          visible: true,
          uuid: uuid++
        });
      }
      return columns;
    };
  }());

  var createData = (function () {
    var uuid = 0;
    return function (columns, datalength, flag) {
      var data = [],
        row;
      for (i = 0; i < datalength; i++) {
        row = {};
        for (j = 0, l = columns; j < l; j++) {
          row['col' + i] = {
            value: j + ',' + i,
            uuid: uuid++
          };
        }
        data.push(row);
      }
      return data;
    };
  }());



  QUnit.module('innerwave.spreadsheet', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test('생성', function (assert) {
    var columns = [];
    var data = [];
    var $uiSheet = $('<div id="test-sheet" title="INNERWAVE SPREADSHEET"></div>')
      .spreadsheet({
        columns: columns,
        data: data
      })
      .appendTo($fixture);
    assert.ok($uiSheet, '기본 생성 완료.');

    assert.equal($uiSheet.spreadsheet('rows')
      .length, 0, '기본 생성한 Row의 수는 0이다');
    assert.equal($uiSheet.spreadsheet('columns')
      .length, 0, '기본 생성된 Column의 수는 0이다');
    assert.equal($uiSheet.spreadsheet('data')
      .length, 0, '기본 생성한 Data의 수는 0이다');

    var columnSize = 50;
    columns = createColumns(columnSize);

    $uiSheet.spreadsheet('columns', columns);
    assert.equal($uiSheet.spreadsheet('columns')
      .length, columnSize, '주입한 Column의 수는 50이다');

    var dataParseUnit = $uiSheet.spreadsheet('option', 'dataParseUnit');
    data = createData(columnSize, dataParseUnit);
    $uiSheet.spreadsheet('data', data);
    assert.equal($uiSheet.spreadsheet('data')
      .length, dataParseUnit, '주입한 Data의 수는 ' + dataParseUnit + '이다');
    // 100 개만 반환된다. setTimeout 사용에 따른 문제인것 같다.
    assert.equal($uiSheet.spreadsheet('rows')
      .length, dataParseUnit, 'Data 주입으로 인해 생성한 Row의 수는 ' + dataParseUnit + '이다');

    // $uiSheet.spreadsheet('data', data);
  });



  // Multi instance test
  QUnit.test('다중 인스턴스 생성 및 비교', function (assert) {
    var columns = createColumns(10);
    var data = createData(10, 10, 'data1');

    var sheet = $('<div id="test-sheet" title="INNERWAVE SPREADSHEET 1"></div>')
      .spreadsheet({
        columns: columns,
        data: data
      })
      .appendTo($fixture);
    assert.ok(sheet, '1 번째 인스턴스');

    var columns2 = createColumns(10);
    var data2 = createData(10, 10, 'data2');
    var sheet2 = $('<div id="test-sheet2" title="INNERWAVE SPREADSHEET 2"></div>')
      .spreadsheet({
        columns: columns,
        data: data2
      })
      .appendTo($fixture);
    assert.ok(sheet2, '2 번째 인스턴스');

    assert.notDeepEqual(data, data2, '두 시트에 추가할 데이터들은 동일하지 않다.');

    var cols1 = sheet.spreadsheet('columns');
    var cols2 = sheet2.spreadsheet('columns');
    // notDeepEqual을 써도 다르다.
    assert.notEqual(cols1, cols2, '두 시트에 생성된 컬럼들은 동일하지 않다.');
    data = sheet.spreadsheet('data');
    data2 = sheet2.spreadsheet('data');
    // notDeepEqual을 쓰면 같다...
    assert.notEqual(data, data2, '두 시트에 추가된 데이터들은 동일하지 않다.');
    assert.notDeepEqual(sheet.data(), sheet2.data(), '두 데이터는 같지 않다.');





  });
}(jQuery));
