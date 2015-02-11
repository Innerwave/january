( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.Title = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    return $( '<div style="text-align:center;color:red;font-weight:bolder">' )
      .text( cell.value )
      .wrap( '<div class="spreadsheet-cell">' ).parent()
      .attr( 'title', cell.value )
      .addClass( cell.className );
  };

  $.extend( Renderer.prototype, {

  } );

}( jQuery, window ) );
