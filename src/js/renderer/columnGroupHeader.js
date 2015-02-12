( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );


  var ColumnGroupHeader = iui.sheet.renderer.ColumnGroupHeader = function ( group ) {
    var renderer = $( "<span>" ).text( group.label );

    return renderer;
  };

  $.extend( ColumnGroupHeader.prototype, {} );

}( jQuery, window ) );
