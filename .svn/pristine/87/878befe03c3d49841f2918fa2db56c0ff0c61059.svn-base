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


    return $( '<div style="text-align:center;color:blue;font-weight:bolder">' )
      .text( cell.value )
      .wrap( '<div class="spreadsheet-cell"><input type="button">' ).parent()
      .attr( 'title', cell.value )
      .attr( 'value', cell.value )
      .attr( 'onClick', cell.value )
      .addClass( cell.className );
  };

  $.extend( Renderer.prototype, {

  } );

}( jQuery, window ) );
