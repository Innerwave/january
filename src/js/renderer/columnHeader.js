( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  // ------------------------------------
  // Private Area by Closure
  // ------------------------------------

  var Renderer = iui.sheet.renderer.ColumnHeaderRenderer = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    var div = $( '<div>' ).attr( 'title', cell.value );
    var span = $( '<span>' ).text( cell.value ).appendTo( div );

    return div;
  };


}( jQuery, window ) );
