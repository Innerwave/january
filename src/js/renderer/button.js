( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.Button = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    return $( '<input type="button">' )
      .attr( 'value', cell.bottonLabel )
      .on( 'click', cell.value )
      .wrap( '<div class="spreadsheet-cell" style="text-align:center;color:blue;font-weight:bolder">' )
      .parent()
      .attr( 'title', cell.value )
      .addClass( cell.className );
  };

  $.extend( Renderer.prototype, {

  } );

}( jQuery, window ) );
