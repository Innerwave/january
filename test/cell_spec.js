(function ($) {

  var $fixture;

  var array = ['a', 'b', 'c', 'd', 'e'];

  QUnit.module('iui.sheet.model.Cell', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test("Cell", function (assert) {

    var cell = iui.sheet.model.Cell();

    assert.ok(cell, 'Cell 생성');

    var cell2 = iui.sheet.model.Cell();
    assert.notEqual(cell, cell2, '생성된 두개의 셀은 다른 객체이어야 한다.');

    assert.notEqual(cell.uid, cell2.uid, '생성된 두개의 셀은 다른 uid를 가져야 한다.' + cell.uid + "  " + cell2.uid);


  });

  QUnit.test("Check Cell Memory ", function (assert) {
    var cells = [];
    var length = 10000;
    var l = length;
    while (l--) {
      cells[cells.length] = iui.sheet.model.Cell();
    }
    assert.equal(cells.length, length, length + "개의 Cell 생성");
  });


  QUnit.test("test generate a hash", function (assert) {
    var cell = iui.sheet.model.Cell();
    assert.ok(true, iui.util.hash(cell.toString()));
    assert.ok(true, cell.uid);

    var cell1 = iui.sheet.model.Cell();
    assert.ok(true, iui.util.hash(cell1.toString()));
    assert.ok(true, cell1.uid);

    var cell2 = iui.sheet.model.Cell();
    assert.ok(true, iui.util.hash(cell2.toString()));
    assert.ok(true, cell2.uid);
  });

}(jQuery));
