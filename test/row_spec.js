(function ($) {

  var $fixture;

  var array = ['a', 'b', 'c', 'd', 'e'];

  QUnit.module('iui.sheet.model.Row', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test("Row", function (assert) {
    var row = new iui.sheet.model.Row();
    assert.ok(row, 'Row 생성');

    row.addClass(array[0]);
    row.addClass(array[1]);
    row.addClass(array[2]);
    row.addClass(array[3]);
    row.addClass(array[4]);

    assert.equal(row.className, "ui-state-default spreadsheet-row a b c d e", "ui-state-default spreadsheet-row a b c d e");

    row.addClass(array[4]);
    assert.equal(row.className, "ui-state-default spreadsheet-row a b c d e", "ui-state-default spreadsheet-row a b c d e : addClass 'e' once again.");

    row.removeClass(array[3]);
    assert.equal(row.className, "ui-state-default spreadsheet-row a b c e", "ui-state-default spreadsheet-row a b c e : removeClass 'd'");

    row.toggleClass(array[3]);
    assert.equal(row.className, "ui-state-default spreadsheet-row a b c e d", "ui-state-default spreadsheet-row a b c e d : toggleClass 'd'");

    row.toggleClass(array[3]);
    assert.equal(row.className, "ui-state-default spreadsheet-row a b c e", "ui-state-default spreadsheet-row a b c e : toggleClass 'd'");


    row.cells.add({
      value: 1
    });
    row.cells.add({
      value: 2
    });
    row.cells.add({
      value: 3
    });

    assert.equal(row.cells.length, 3, '첫번째 로우에 입력된 Cell 수는 3이다.');

    var row2 = new iui.sheet.model.Row();
    assert.equal(row2.cells.length, 0, '두번째 Row에 입력된 Cell 수는 0이다.');

    row.cells.add({
      value: 4
    });
    row.cells.add({
      value: 5
    });
    assert.equal(row.cells.length, 5, '첫번째 로우에 입력된 Cell 수는 5이다.');

    row2.cells.add({
      value: 0
    });
    assert.equal(row2.cells.length, 1, '두번째 로우에 입력된 Cell 수는 1이다.');

  });

}(jQuery));
