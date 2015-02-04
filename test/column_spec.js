( function ( $ ) {

  var $fixture;

  var array = [ 'a', 'b', 'c', 'd', 'e' ];

  QUnit.module( 'iui.sheet.model.Column', {
    setup: function () {
      $fixture = $( '#qunit-fixture' );
    },
    teardown: function () {
      $fixture.empty();
    }
  } );

  QUnit.test( "Column", function ( assert ) {

    var column = new iui.sheet.model.Column();

    assert.ok( column, 'Column 생성' );

    var label = iui.sheet.model.Column.getColumnLabel;

    assert.ok( true, ( 0 ).toString( 26 ) + " = " + label( 0 ) );
    assert.ok( true, ( 1 ).toString( 26 ) + " = " + label( 1 ) );
    assert.ok( true, ( 25 ).toString( 26 ) + " = " + label( 25 ) );
    assert.ok( true, ( 26 ).toString( 26 ) + " = " + label( 26 ) );
    assert.ok( true, ( 52 ).toString( 26 ) + " = " + label( 52 ) );
    assert.ok( true, ( 675 ).toString( 26 ) + " = " + label( 675 ) );
    assert.ok( true, ( 676 ).toString( 26 ) + " = " + label( 676 ) );

    assert.ok( true, typeof iui.sheet.model.Column );
    assert.ok( true, typeof column );
    assert.ok( true, Object.prototype.toString.call( iui.sheet.model.Column ) );
    assert.ok( true, Object.prototype.toString.call( column ) );
    assert.ok( column instanceof iui.sheet.model.Column, "" );

  } );

}( jQuery ) );
