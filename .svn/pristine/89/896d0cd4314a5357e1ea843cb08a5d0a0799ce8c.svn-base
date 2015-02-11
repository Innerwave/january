( function ( $, window, undefined ) {
  $.extend( true, window, {
    "iui": {
      "sheet": {
        "renderer": {}
      }
    }
  } );


  var ColumnGroupHeader = iui.sheet.renderer.ColumnGroupHeader = function ( group ) {
    var renderer = $( "<li class='spreadsheet-column spreadsheet-column-group ui-state-default'><span>" + group.label + "<span></li>" )
      .button()
      .removeClass( "ui-corner-all" )
      .resizable( {
        handles: "e",
        minWidth: 2,
        stop: function ( e, ui ) {
          // var group = $(this).data("group");
          // 그룹의 너비를 컬럼의 수로 나눈다.
          var groupWidth = ui.size.width - ui.originalSize.width;
          var columnWidth = Math.floor( groupWidth / group.columns.length );
          var totalWidth = 0;
          group.columns.each( function ( i ) {
            var width = group.columns.length === i + 1 ? groupWidth - totalWidth : columnWidth;
            this.width = this.ui.width() + width;
            this.ui.width( this.width );
            totalWidth += width;
          } );
          group.parent._renderColumns( group.parent.boundary.firstColumn );
        }
      } );
    return renderer;
  };

  $.extend( ColumnGroupHeader.prototype, {} );

}( jQuery, window ) );
