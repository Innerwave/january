(function ($) {

  var $fixture;



  QUnit.module('iui.util.Iterator', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test("generate unique id", function (assert) {
    var id1 = iui.util.uniqueId('uid');
    var id2 = iui.util.uniqueId('uid');

    assert.ok(id1, 'id1의 생성');
    assert.ok(id2, 'id2의 생성');
    assert.notDeepEqual(id1, id2, 'id1과 id2는 다르다');
  });

}(jQuery));
