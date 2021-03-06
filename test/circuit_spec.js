(function ($) {

  var $fixture;

  var array = ['a', 'b', 'c', 'd', 'e'];

  QUnit.module('iui.util.Circuit', {
    setup: function () {
      $fixture = $('#qunit-fixture');
    },
    teardown: function () {
      $fixture.empty();
    }
  });

  QUnit.test("Circuit", function (assert) {

    var circuit = new iui.util.Circuit(array);
    assert.ok(circuit, 'Circuit 생성');

    assert.equal(circuit.length, 5, 'length 5');

    assert.equal(circuit.next(), 'a', 'next a ');
    assert.equal(circuit.next(), 'b', 'next b ');
    assert.equal(circuit.next(), 'c', 'next c ');
    assert.equal(circuit.next(), 'd', 'next d ');
    assert.equal(circuit.next(), 'e', 'next e ');
    assert.equal(circuit.next(), 'a', 'next a ');

    assert.equal(circuit.prev(), 'e', 'prev e ');
    assert.equal(circuit.prev(), 'd', 'prev d ');
    assert.equal(circuit.prev(), 'c', 'prev c ');
    assert.equal(circuit.prev(), 'b', 'prev b ');
    assert.equal(circuit.prev(), 'a', 'prev a ');
    assert.equal(circuit.prev(), 'e', 'prev e ');

    circuit.append('f');
    assert.equal(circuit.length, 6, 'length 6');
    assert.equal(circuit.next(), 'f', 'next f ');

  });

}(jQuery));
