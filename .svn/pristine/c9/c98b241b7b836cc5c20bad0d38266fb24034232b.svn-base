( function ( $ ) {

  QUnit.module( 'iui.util.laptime', {} );

  QUnit.test( "laptime", function ( assert ) {

    var time1 = iui.util.laptime();
    assert.ok( true, time1 + " 첫번째 랩타임" );

    // 비동기 테스트를 이용하여 시간차를 유발한다.
    var done = assert.async();
    setTimeout( function () {
      var time2 = iui.util.laptime();
      assert.ok( true, time2 + " 두번째 랩타임" );
      assert.ok( time1 < time2, time1 + " < " + time2 + " 랩타임 비교" );

      done();
    }, 1 );

  } );

}( jQuery ) );
