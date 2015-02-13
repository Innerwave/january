( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  function onClick( cell ) {
    console.log( cell.value );
  }

  var Renderer = iui.sheet.renderer.Button = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    return $( '<input type="button" style="width:100%;height:100%;text-align:center;color:blue;font-weight:bolder">' )
      .attr( 'value', cell.bottonLabel )
      .on( 'click', function ( event ) {
        onClick( this ); // cell.clickCallback ...
      } )
      .wrap( '<div class="spreadsheet-cell">' )
      .parent()
      .attr( 'title', cell.value )
      .addClass( cell.className );
  };

  $.extend( Renderer.prototype, {

  } );

}( jQuery, window ) );
