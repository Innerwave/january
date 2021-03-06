(function ($) {

  var $fixture;

  var array = ['a', 'b', 'c', 'd', 'e'];

  QUnit.module('iui.util.Entity', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test("Entity", function (assert) {

    var entity = iui.sheet.model.Entity;

    assert.ok(entity, 'Entity 생성');

    entity.addClass(array[0]);
    entity.addClass(array[1]);
    entity.addClass(array[2]);
    entity.addClass(array[3]);
    entity.addClass(array[4]);

    assert.equal(entity.className, "a b c d e", "a b c d e");

    entity.addClass(array[4]);
    assert.equal(entity.className, "a b c d e", "a b c d e : addClass 'e' once again.");

    entity.removeClass(array[3]);
    assert.equal(entity.className, "a b c e", "a b c e : removeClass 'd'");

    entity.toggleClass(array[3]);
    assert.equal(entity.className, "a b c e d", "a b c e d : toggleClass 'd'");
    entity.toggleClass(array[3]);
    assert.equal(entity.className, "a b c e", "a b c e : toggleClass 'd'");


    var strEntity = entity.toString();
    assert.ok(true, strEntity);
  });

}(jQuery));
