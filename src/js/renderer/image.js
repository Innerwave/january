( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );

  var Renderer = iui.sheet.renderer.Image = function ( cell ) {
    cell = cell || {};

    if ( !( this instanceof Renderer ) ) {
      return new Renderer( cell );
    }

    //console.log( "++++++++++++++++++++++++++++++++++++++++" );
    //console.log( this );

    var div = $( '<div class="spreadsheet-cell">' )
      .attr( 'title', cell.value )
      .addClass( cell.className );
    if ( cell.valie != null ) {
      var img = $( '<img src="/src/img/' + cell.value + '.jpg" />' )
        .attr( 'alt', cell.value )
        .appendTo( div )
        .on( 'load', function ( event ) {
          // console.log( 'image loaded....' );
          // console.log( this );
          // console.log( cell );
          cell.rows.get( 0 ).setHeight( this.height );
          cell.columns.get( 0 ).setWidth( this.width );
        } );
    }
    return div;
  };

}( jQuery, window ) );