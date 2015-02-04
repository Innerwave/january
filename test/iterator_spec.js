( function ( $ ) {

  var $fixture;



  QUnit.module( 'iui.util.Iterator', {
    setup: function () {
      $fixture = $( '#qunit-fixture' );
    },
    teardown: function () {
      $fixture.empty();
    }
  } );

  QUnit.test( "자체 인스턴스 생성", function ( assert ) {
    var array = [ 'a', 'b', 'c', 'd' ];

    var iterator = new iui.util.Iterator( array );
    assert.ok( iterator, "기본 생성 완료." );

    assert.equal( iterator.next(), array[ 0 ], "next() 첫번째는 'a'" );
    iterator.remove();
    assert.equal( iterator.next(), array[ 1 ], "next() 두번째는 'c' : b는 지워버림" );
    assert.equal( iterator.next(), array[ 2 ], "next() 세번째는 'd'" );

    assert.equal( iterator.next(), undefined, "next() 네번째는 undefined" );
    assert.strictEqual( iterator.hasNext(), false, "hasNext() : false" );
  } );

  QUnit.test( "다중 인스턴스 생성", function ( assert ) {
    var array = [ 'a', 'b', 'c', 'd' ];
    var array2 = array.slice( 0 );

    var iter = new iui.util.Iterator( array );
    var iter2 = new iui.util.Iterator( array2 );

    iter.remove();
    assert.equal( iter.next(), 'b', '첫번째 이터레이터에서는 첫번재 아이템을 삭제하였다.' );
    assert.equal( iter2.next(), 'a', '두번째 이터레이터는 a 부터 정상 출력된다' );
    assert.equal( iter2.next(), 'b', '2 b' );
    assert.equal( iter.next(), 'c', 'c' );
    assert.equal( iter2.next(), 'c', '2 c' );
    assert.equal( iter2.next(), 'd', '2 d' );
    assert.equal( iter.next(), 'd', 'd' );
  } );

}( jQuery ) );
