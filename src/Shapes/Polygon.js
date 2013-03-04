OpenSeajax.Shapes.Polygon = function(points) {
   // Get polygon bounding box
   var minX = points[0].x;
   var maxX = minX;
   var minY = points[0].y;
   var maxY = minY;

   var fudge_factor = 1;  //fudge factor for zoom

   for (var i=1, len = points.length; i<len; ++i) {
      if (points[i].x < minX)
         minX = points[i].x;

      if (points[i].x > maxX)
         maxX = points[i].x;

      if (points[i].y < minY)
         minY = points[i].y;

      if (points[i].y > maxY)
         maxY = points[i].y;
   }

   this.origin = new Seadragon.Point(minX, minY);

   // Bounding box width and height at maximum zoom
   this.width = maxX - minX;
   this.height = maxY - minY;



   // Bounding box width and height at zoom level 1
   var maxZoom = viewer.viewport.getMaxZoom();
   this.normWidth = fudge_factor * this.width / maxZoom;
   this.normHeight = fudge_factor * this.height / maxZoom;

   // Create Polygon
   this.div = document.createElement("div");
   this.paper = Raphael(this.div);

   // NOTE! There seems to be a factor of 2 required. Might be because of the way
   // Zoom levels are defined in OpenSeajax. But frankly I don't know -> investigate!!
   var firstPoint = fudge_factor * (points[0].x - minX) / maxZoom + " " + fudge_factor * (points[0].y - minY) / maxZoom;

   var svgFormattedPath = "M" + firstPoint;
   for (var i=1, len = points.length; i<len; ++i) {
      svgFormattedPath += "L" + fudge_factor * (points[i].x - minX ) / maxZoom + " " + fudge_factor * (points[i].y - minY) / maxZoom;
   }
   svgFormattedPath += "L" + firstPoint;

   this.path = this.paper.path(svgFormattedPath);
   this.paper.setSize(this.normWidth, this.normHeight);
}

OpenSeajax.Shapes.Polygon.prototype.attachTo = function(viewer) {
   var anchor = OpenSeajax.toWorldCoordinates(viewer, this.origin.x, this.origin.y);
   viewer.drawer.addOverlay(this.div, new Seadragon.Rect(anchor.x, anchor.y, 0, 0)); 


	//So I am not taking into account the scaling factor which I think is causing it to not scale properly

   var canvas = this.paper;
   var p = this.path;
   var w = this.normWidth;
   var h = this.normHeight;
   viewer.addHandler("onanimation", function() { 
      var zoom = viewer.viewport.getZoom(true);
      canvas.setSize(w * zoom, h * zoom);
      p.scale(zoom, zoom, 0, 0);
   });
}

OpenSeajax.Shapes.Polygon.prototype.getElement = function() {
   return this.path;
}

OpenSeajax.Shapes.Polygon.prototype.redraw = function(viewer) {
   var zoom = viewer.viewport.getZoom(true);
   this.paper.setSize(this.normWidth * zoom, this.normHeight * zoom);
   this.path.scale(zoom, zoom, 0, 0); 
} 

OpenSeajax.Shapes.Polygon.prototype.addEventListener = function(evt, listener) {
   Seadragon.Utils.addEvent(this.div, evt, Seadragon.Utils.stopEvent);
   this.div.addEventListener(evt, listener, false);
}
