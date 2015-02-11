( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  // ------------------------------------
  // Private
  // ------------------------------------    

  var Renderer = iui.sheet.renderer.Link = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }
    var title = cell.title || cell.value;
    var div = $( '<div>' ).attr( 'title', cell.value );
    var span = $( '<a>' ).text( title )
      .attr( 'title', title ) 
      .attr( 'href', cell.value )
      .wrap( '<span>' ).parent()
      .appendTo( div );

    return div;
  };


}( jQuery, window ) );
