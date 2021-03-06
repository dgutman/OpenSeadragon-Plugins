/* this is mostly example/warpper code for key function related to aperio and base drawing examples
these may not be needed depending on your application....*/


var poi_win_old;
var point_list;
var overlay;
var overlay_obj;

if( typeof KEEP_LOGS === 'undefined' )
	KEEP_LOGS = true;
if( typeof _log !== 'function' ) {
	_log = function() {
		if( !KEEP_LOGS ) return;
		try { console.log(arguments); } catch(err) {}
	}
}

function aperio_region_to_osdAnnotation(annotation_xml_file,region_id)
	{
	/*This function will concert an aperio XML document/annotation file into the format
	I am now using with annotation.js
	
	Basically I will create a new annotation using the annotation.js methodology and
	copy the properties over from the aperio file....*/

	//assuming xml document... have annotation and then regions each regino is a set of points
	grid1.clearAll(); //clear previous annotations loaded into the grid

	//need to pull the linecolor from aperio xml
	//linecolor = this.getAttribute("LineColor").toString(16);
	//linecolor =(linecolor.length < 6) ? "0" + linecolor : linecolor;								
	
	$('Annotation',aperioxml_annotation).each( function() {
		grid1.addRow(this.getAttribute("Id"),"Annotation " + this.getAttribute("Id"),this.getAttribute("Id"));
			$('Vertices', this).each(function(){
				
				/*need image size to scale the coordinates... points are from 0-1 not in pixel coordinates*/
				dzi_x_pixels = viewer.viewport.contentSize.x;	
	 			dzi_y_pixels = viewer.viewport.contentSize.y  ;
				aspect_ratio = dzi_y_pixels/dzi_x_pixels;
				var point_list = new Array();

			$('Vertex', this).each(function(){
				var row = new OpenSeadragon.Point();
				row.x = (this.getAttribute("X")/( dzi_x_pixels)  );
				row.y = (this.getAttribute("Y")/( dzi_y_pixels) * (aspect_ratio ) );
				point_list.push(row);
							});
					});
						
							});
/* 
			/*var overlay_obj = $.extend({},AnnotationOverlay.prototype.OPTIONS);
			overlay_obj = {type:'freehand', points:point_list};
			overlay = AnnotationOverlay.fromValueObject(overlay_obj);
			overlay.attachTo(viewer);
			annotationState.annotations.push(overlay);
	}

*/


/* this function sets up the toolbar I use in CDSA--- I only kept events related to drawing for this example */
function setup_wsi_toolbar(id) {
	_log('setup_wsi_toolbar', id);
	//make an elseif

	if (id == "grab_snapshot") {
	/* I want to add a feature to grab a PNG/JPG or PDF and save to desktop */
	}
	if (id == "show_annotations") {
		dhxWins.window("poi_win_old").show();
	}
   /* For now annotations generated in my viewer are kept in a separate frame from those generated from aperio xml files */
	if (id == "load_aperio") {
			//			alert('load aperio window...');
	if ( !	dhxWins.isWindow("aperio_xml") ) {   gen_aperio_annotation_box(); }
		else{ dhxWins.window("aperio_xml").show(); }
		xml_file_list = getAperioXML_list();
		}

}


/*this window is generated using dhtmlx and the window function in that framework.. */
function gen_aperio_annotation_box(target_win_id)
	{
	/* This is inherited code from Dan--- this generates the basic grid/layout needed to render an Aperio XML type document */
	aperio_win = dhxWins.createWindow("aperio_xml", 400, 50, 600, 600);
	aperio_win.setText("Aperio Annotations Window");
				
			
	aperio_win.button("close").hide();
	aperio_win.button("minmax1").hide();
	aperio_win.button("park").hide();
	aperio_win.addUserButton("hide", 0, 'Hide', 'hide');
   	aperio_win.button('hide').attachEvent("onClick", function() {  aperio_win.hide() } );				
	/*removing min/max and park buttons in the window--- resizing this window to full screen looks aweful
	and also adding a button to hide it */

	/*layers layout is the object for the 4 separate panels I have within the window I am creating */
	layers_layout = aperio_win.attachLayout('4U' );

	mainlayers_div = layers_layout.cells('a');
	
	/*aperio xml file grid lists all of the XML files I have foudn that are associated with a given slide*/
	aperio_xml_filegrid = mainlayers_div.attachGrid();
	aperio_xml_filegrid.setImagePath("dsa-common-files/codebase/imgs/");
	aperio_xml_filegrid.setHeader("Annotation File,filename");
	aperio_xml_filegrid.setColTypes("ro,ro");
	aperio_xml_filegrid.setColSorting("str,ro");
	/*when debug is done, will actually hide the 2nd column-- doesn't need to be displayed */
	
	aperio_xml_filegrid.init();
	aperio_xml_filegrid.setSkin("dhx_web");
	mainlayers_div.setText('');
	/* need to add an onclick handler to this grid box as well... */

	var XMLResponse ;	
	aperio_xml_filegrid.attachEvent("onRowSelect", function(id,ind){
	/* Event is fired when a user picks an XML annotation file to load
	It loads the appropriate XML and clear the other data... */		
					
	var xml_filename = aperio_xml_filegrid.cellById(id,1).getValue();			
	aperioxml_annotation = getAperioXML_document( xml_filename );
	/*this aperioxml_annotation now contains the entire xml document I needed... 
	I may need a callback function for this */
	/*grid 1 will be renamed.. this currently contains the list of labeled regions... */
	
	
	/*DELETE THIS CODE AND REPLACE WITH FUNCTION ABOVE..... */
	$('Annotation', aperioxml_annotation).each(function(){
		grid1.addRow(this.getAttribute("Id"),"Annotation " + this.getAttribute("Id"),this.getAttribute("Id"));
		linecolor = this.getAttribute("LineColor").toString(16);
		linecolor =(linecolor.length < 6) ? "0" + linecolor : linecolor;
				});	
				});
		
		/*grid1 contains the layers/annotations the user generated--- each layer then consists of regions */
		
		/*consider getting rid of sections_div and just attaching grid 1 directly */
		/*will make the image path a global variable as I reuse it all the time */
		sections_div = layers_layout.cells('b');
		grid1 = sections_div.attachGrid();
		grid1.setImagePath("dsa-common-files/codebase/imgs/");
		grid1.setHeader("Annotations");
		grid1.setColTypes("ro");
		grid1.setColSorting("str");
		grid1.init();
		grid1.setSkin("dhx_web");
				
		grid1.attachEvent("onRowSelect", function(id,ind){			
			grid2.clearAll();
			grid3.clearAll();
					
			XMLResponse = aperioxml_annotation;
			$('Annotation', XMLResponse).each(function(){
				if (this.getAttribute("Id") == id) {
					grid2.addRow(1,["Id:",this.getAttribute("Id")],1);	
					grid2.addRow(2,["Name:",this.getAttribute("Name")],2);
					grid2.addRow(3,["ReadOnly:",this.getAttribute("ReadOnly")],3);
					grid2.addRow(4,["NameReadOnly:",this.getAttribute("NameReadOnly")],4);
					grid2.addRow(5,["LineColorReadOnly:",this.getAttribute("LineColorReadOnly")],5);
					grid2.addRow(6,["Incremental:",this.getAttribute("Incremental")],6);
					grid2.addRow(7,["Type:",this.getAttribute("Type")],7);
					grid2.addRow(8,["LineColor:",this.getAttribute("LineColor")],8);
					grid2.addRow(9,["Visible:",this.getAttribute("Visible")],9);
					grid2.addRow(10,["Selected:",this.getAttribute("Selected")],10);
					grid2.addRow(11,["MarkupImagePath:",this.getAttribute("MarkupImagePath")],11);
					grid2.addRow(12,["MacroName:",this.getAttribute("MacroName")],12);
					// grid2.addRow(2,["LineColor:",this.getAttribute("LineColor")],2);
					linecolor = this.getAttribute("LineColor").toString(16);
					linecolor =(linecolor.length < 6) ? "0" + linecolor : linecolor;												
					XMLResponse2 = this;
					
					var blue_eye = "";
					var eye_style = "style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'";
					var eye_open_url = " 'dsa-common-files/codebase/imgs/openEye.gif' ";
					var red_image = "<img id='redImage' src='dsa-common-files/codebase/imgs/red1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>";
					var blue_image = "<img id='blueImage' src='dsa-common-files/codebase/imgs/blue1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>";
					var green_image= "<img id='greenImage' src='dsa-common-files/codebase/imgs/green1.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>"; 
					/* the blue/green/red boxes can likely be removed or changed--- this was added because I wanted
					to have the ability to recolor an ROI dynamically-- and chose those three colors to start */
					/*also the eyye open/close should allow me to click a set of ROI's on and off... */
				
					/*grid 3 should be region_infogrid */
					$('Region', this).each(function(){
							grid3.addRow(this.getAttribute("Id"),["<img id='eyeImage"+this.getAttribute("Id")+"' src=" + eye_open_url + eye_style + ">", "Layer " + this.getAttribute("Id"),this.getAttribute("Length"),this.getAttribute("Area"),this.getAttribute("Zoom"),red_image,green_image,blue_image],this.getAttribute("Id"));
						//	document.getElementById("txtPlots").value+="y;"+linecolor+"|";
													})
											}
										})
															
				});

				sections_div.setText('');
				data_div = layers_layout.cells('c');
				grid2 = data_div.attachGrid();
				grid2.setImagePath("dsa-common-files/codebase/imgs/");
				grid2.setHeader("Parameter,Value");
				// grid2.setInitWidths("100");
				//grid2.setColAlign("center, center");
				grid2.setColTypes("ro,ro");
				grid2.setColSorting("str,str");				
				grid2.init();
				grid2.setSkin("dhx_web");
				/* grid2.attachEvent("onRowSelect", function(id,ind){
					alert ("Id: " + id + " Index: " + ind);
				}); */

				/*grid3 is the 4th box that contains the ROI info */

				data_div.setText('');
				layers_div = layers_layout.cells('d');
				grid3 = layers_div.attachGrid();
				grid3.setHeader("Visible,Layer,Length,Area,Zoom,Red,Green,Blue");;
				grid3.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro");
				grid3.setColSorting("str,str,str,str,str,str,str,str");	
				grid3.enableKeyboardSupport(false);		/*need to see why this was disabled */
				grid3.init();
				grid3.setSkin("dhx_web");
				grid3.attachEvent("onRowSelect", function(id,ind){

				//CODE IS DEPRECATED  THIS IS USING A CANVAS BASED DRAWING AND ONLY WORKS ON NON ZOOMABLE CANVASES
				//REPLACE WITH AnnotationState calls ... 
				/*
				
				OF NOTE , although the code now is gone... a set of functions was called..
				in the case of ind == 0, this means the visible state of the roi should be toggled
				if ind==5 it means it should recolor it blue, ig ind==6 green ind==7 red...
				*/
					})
				});  //may be an extra
					layers_div.setText('');
		//dhxWins.window("anotation_xml").hide();  nice to hide the object after creation
	}


/*simple helper function--- for now I have sdifferent colored pins depending on which
color was chosen-- the image just gets appended as a DIV--- should change this to use one
pin and apply some sort of color filter to it */

function get_url_for_poi_image(pin_color) {
	if (pin_color == 'FF0000' || pin_color == 'red') {
		pin_image_src = "dsa-common-files/imgs/Pin1_Red.png";
	} else if (pin_color == '00FF00' || pin_color == 'green') {
		pin_image_src = "dsa-common-files/imgs/Pin1_Green.png";
	} else {
		pin_image_src = "dsa-common-files/imgs/Pin1_Blue.png";
	}
	return (pin_image_src);
}


function drawRect(clr) {
	document.getElementById("clicked_item").value = "rect";
	document.getElementById("line_color").value = clr;
}

function drawCircle(clr) {
	document.getElementById("clicked_item").value = "circ";
	document.getElementById("line_color").value = clr;
}

function drawPoi(clr) {
	document.getElementById("clicked_item").value = "poi";
	document.getElementById("line_color").value = clr;
}


function create_main_annotation_windowbox() {
	/*newly generated annotations using annotationState function calls go in here will go in here */
	/*code needs to be redone...
	
	/*	the annotation state objects go i nhere... */
	
	annotation_win  = dhxWins.createWindow("annotation_view", 400, 50, 600, 600);
	annotation_win.setText("Annotations");
				
			
	annotation_win.button("close").hide();
	annotation_win.button("minmax1").hide();
	annotation_win.button("park").hide();
	annotation_win.addUserButton("hide", 0, 'Hide', 'hide');
    	annotation_win.button('hide').attachEvent("onClick", function() {  annotation_win.hide() } );				
	
	annotater_layout = annotation_win.attachLayout('3U');
		
	sections_div = annotater_layout.cells('b');
	sections_div.setText('');

	formStructure1 = [{
			type: "settings",
			position: "label-top"
		}, {
			type: "button",
			name: "save",
			width: 150,
			offsetTop: 2,
			value: "Save POIs"
		}
	];
	myForm1 = sections_div.attachForm(formStructure1);
	myForm1.attachEvent("onButtonClick", function (id) {
		if (id == "save") //defines addition
		{
			//do something !!!
			alert("I saved the Day-ta-- but not really... ")

			/*$.ajax({
				type: "post",
				data: {
					textData: poisdata
				},
				url: "savedata.php",
				success: function (data) {
					alert(data);
				}
			});
		*/
	});
	layers_div = layers_layout.cells('c');

	dhx_img_path = "dsa-common-files/codebase/imgs/"; //there is a way to set this globally

	roi_list = layers_div.attachGrid();
	roi_list.setImagePath(dhx_img_path);
	roi_list.setHeader("ID,Type,Color,Status");
	roi_list.setColAlign("center,center,center,center");
	roi_list.setColTypes("ro,ro,ro,ro");
	roi_list.setColSorting("str,str,str,str");
	roi_list.init();
	roi_list.setSkin("dhx_web");

	roi_list.attachEvent("onRowSelect", function (id, ind) {
	
	//ind == 3 means I am trying to toggle on/off a given ROI	
	if (ind == 3) {
		/*toggle on/off the selected ROI... */
		/*each eyeball was also given it's own ID.... */
		var valcell = gridPois.cells(id, 0).getValue();
		var b2 = document.getElementById("eye" + valcell).src;

		viewer.drawer.clearOverlays();
		
		/* Simple way to add an ROI to the canvas is done like this:..... */
		
		/*adding a point of interest was first done this way:
		1.  get X,Y of selected point
		
		2.  create a OpenSeadargon Rectangle starting at the point and 0.025x0.0256 width/height...
		3.  Create a new DOM element to hold the DIV that I am creating...
		4.  The new DOM object then gets added to the document body as a child element
			You must remember to give the element an ID or at least assign it to a variable
			so you can manipualte it
		5.  Pick a color for the POI-- in this case I had three to choose from red/green/blue
		6.  The helper function get_url_for_poi basically returns a URL pointing to three different
		push pin images I found
		7.  The rectangle can then be added to the viewer using viewer.drawer.addOverlay;
		    The addOverlay functions requires the object you want to bind, and the rectangle or point
		    where you want to bind it to; I haven't played aroudn with the optimal rectangle size to use
		    for this 
		*/
		if( shape_type  == 'add_poi' )
			{
			/*this needs to be called be an event that grabs the current x and y coords */
			var pointX = selected_x_point;
			var pointY = selected_y_point;
			var osd_rect = new Seadragon.Rect(parseFloat(pointX), parseFloat(pointY), 0.025, 0.025); //(x,y,w,h)
			var poi_image = document.createElement("img");
			poi_image.src = get_url_for_poi_image( color_to_use );
			document.body.appendChild(poi_image);
			viewer.drawer.addOverlay(poi_image, osd_rect);
			}
		else if ( shape_type == 'add_rect' )			
			{
				
				var temprect = data_drw[k].split(";");
				var point1 = temprect[0].split(",");
				var point2 = temprect[1].split(",");
				/* need to modify logic here-- a rectangle can be drawn from top to bottom or bottom to top... 
				need to add a greateR>less than check*/
				var x1 = parseFloat(point1[0]);
				var y1 = parseFloat(point1[1]);
				var x2 = parseFloat(point2[0]);
				var y2 = parseFloat(point2[1]);
				var h = Math.abs(y2-y1);
				var w = Math.abs(x2-x1);

				var cur_div = document.createElement("div");
				cur_div.setAttribute("style", "border: 2px solid "+shape_color);
				document.body.appendChild(cur_div);
				var rect = new Seadragon.Rect(x1,y1,w,h);//(x,y,w,h)
				viewer.drawer.addOverlay(cur_div, rect);
			 }
	
			else if  ( shape_type=="circ") {
				var point1 = temprect[0].split(",");
				var point2 = temprect[1].split(",");
				var x1 = parseFloat(point1[0]);
				var y1 = parseFloat(point1[1]);
				var x2 = parseFloat(point2[0]);
				var y2 = parseFloat(point2[1]);
				/* tihs logic is wrong as well... doesn't make sense in terms of how its drawing the roi */
				var w = Math.abs(x2 - x1);
				var cur_div = document.createElement("div");
				cur_div.setAttribute("style", "border: 2px solid " + shape_color + "; border-radius: 50%;");
				document.body.appendChild(cur_div);
				var rect = new Seadragon.Rect(x1, y1, w, w); //(x,y,w,h)
				viewer.drawer.addOverlay(cur_div, rect);
					}
			
	});



	layers_div.setText('');

	});

	bottomLayers_div.setText('');


}


function toString(point, useParens) {
	var x = point.x;
	var y = point.y;
	var PRECISION = 3;
	if (x % 1 || y % 1) { // if not an integer,
		x = x.toFixed(PRECISION); // then restrict number of
		y = y.toFixed(PRECISION); // decimal places
	}

	if (useParens) {
		return x + "," + y;
	} else {
		return x + " x " + y;
	}
}


/*function showClix(event) {
	try {
	var pixel = Seadragon.Utils.getMousePosition(event).minus(Seadragon.Utils.getElementPosition(viewer.element));
	var point = viewer.viewport.pointFromPixel(pixel);
	element_line_color = document.getElementById("line_color").value;
*/



/*
function legacy_ajax_draw_roi_and_pos()
	{
	
	$.ajax({ type :"POST", 
		url : "local_php/get_dsa_annotation_data.php",
		data : { experiment: document.getElementById("current_experiment").value },
		success: function(data){ 
		if(data!="")
		{
		var tdata=data.split("|");
		for(var i in tdata)
		{
		var tvar=tdata[i].split(";");
		defn[glbCounter]=tvar[0]+";"+tvar[1]+";"+"1";
		
		data_drw[glbCounter]=tdata[i].replace(tvar[0]+";"+tvar[1]+";",""); 
		var clrGlb = defn[glbCounter].split(";");
		if (tvar[0]=="poi") {
									gridPois.addRow(glbCounter, [glbCounter, clrGlb[0], clrGlb[1], "<img id='eye" + glbCounter + "' src='imgs/openEye.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>"], glbCounter);
								}
								if (tvar[0]=="rect") {
									gridShapes.addRow(glbCounter, [glbCounter, clrGlb[0], clrGlb[1], "<img id='eye" + glbCounter + "' src='imgs/openEye.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>"], glbCounter);								
								}
								if (tvar[0]=="circ") {
									gridShapes.addRow(glbCounter, [glbCounter, clrGlb[0], clrGlb[1], "<img id='eye" + glbCounter + "' src='imgs/openEye.gif' style='border: #707070 1px solid; width: 16px; height: 16px; cursor: pointer;'>"], glbCounter);								
								}

								glbCounter+=1;
							}
		*/
