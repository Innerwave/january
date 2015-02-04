( function ( $ ) {

  var $fixture;

  QUnit.module( 'iui.util.Collection', {
    setup: function () {
      $fixture = $( '#qunit-fixture' );
    },
    teardown: function () {
      $fixture.empty();
    }
  } );

  QUnit.test( "자체 인스턴스", function ( assert ) {
    var collection = new iui.util.Collection();
    assert.ok( collection, '생성' );

    collection.add( {
      value: 1
    } );
    collection.add( {
      value: 2
    } );
    collection.add( {
      value: 3
    } );

    assert.equal( collection.length, 3, '입력된 아이템의 수는 3이다.' );

    var collection2 = new iui.util.Collection();
    assert.notEqual( collection, collection2, '두개의 컬렉션은 다르다.' );
    assert.notEqual( collection.length, collection2.length, '두개의 컬렉션의 개수는 다르다.' );

    collection2.add( {
      value: 1
    } );
    collection2.add( {
      value: 2
    } );
    collection2.add( {
      value: 3
    } );
    collection2.add( {
      value: 4
    } );
    collection2.add( {
      value: 5
    } );

    assert.equal( collection.length, 3, '첫번째 것은 변함없이 입력된 아이템의 수는 3이다.' );
    assert.equal( collection2.length, 5, '두번째에 새로 입력된 아이템의 수는 5이다.' );

  } );

}( jQuery ) );
