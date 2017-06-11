<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>source: manhattan2/labeled_marker.js</title>

<link type="text/css" rel="stylesheet" href="/maps/prettify.css" />
<script src="/wp-content/mint/?js" type="text/javascript"></script>
<script src="/maps/prettify.js" type="text/javascript"></script>
<script type="text/javascript">
window.onload = prettyPrint;
</script>
<style type="text/css">
body {
  font-family: Helvetica;
}
pre.prettyprint {
  padding: 5px;
}
h1 {
  font-size: 14px;
}
p {
  font-size: 11px;
  color: #444;
}
p a {
  color: #127;
}
</style>
</head>

<body>
<h1>manhattan2/labeled_marker.js</h1>
<p><em>Unless stated otherwise, code available for viewing through this tool is <a href="http://creativecommons.org/licenses/publicdomain/">dedicated to the public domain</a>. If you have any questions, <a href="http://uwmike.com/contact/">drop me a line</a>.</em></p>
<pre class="prettyprint">/*
* LabeledMarker Class
*
* Copyright 2007 Mike Purvis (http://uwmike.com)
* 
* Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* 
*       http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an &quot;AS IS&quot; BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*
* This class extends the Maps API's standard GMarker class with the ability
* to support markers with textual labels. Please see articles here:
*
*       http://googlemapsbook.com/2007/01/22/extending-gmarker/
*       http://googlemapsbook.com/2007/03/06/clickable-labeledmarker/
*/

/* Constructor */
function LabeledMarker(latlng, options){
    this.latlng = latlng;
    this.labelText = options.labelText || &quot;&quot;;
    this.labelClass = options.labelClass || &quot;markerLabel&quot;;
    this.labelOffset = options.labelOffset || new GSize(0, 0);
    
    this.clickable = options.clickable || true;
    
    if (options.draggable) {
    	// This version of LabeledMarker doesn't support dragging.
    	options.draggable = false;
    }
    
    GMarker.apply(this, arguments);
}


/* It's a limitation of JavaScript inheritance that we can't conveniently
   extend GMarker without having to run its constructor. In order for the
   constructor to run, it requires some dummy GLatLng. */
LabeledMarker.prototype = new GMarker(new GLatLng(0, 0));


// Creates the text div that goes over the marker.
LabeledMarker.prototype.initialize = function(map) {
	// Do the GMarker constructor first.
	GMarker.prototype.initialize.apply(this, arguments);
	
	var div = document.createElement(&quot;div&quot;);
	div.className = this.labelClass;
	div.innerHTML = this.labelText;
	div.style.position = &quot;absolute&quot;;
	map.getPane(G_MAP_MARKER_PANE).appendChild(div);

	if (this.clickable) {
		// Pass through events fired on the text div to the marker.
		var eventPassthrus = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout'];
		for(var i = 0; i &lt; eventPassthrus.length; i++) {
			var name = eventPassthrus[i];
			GEvent.addDomListener(div, name, newEventPassthru(this, name));
		}

		// Mouseover behaviour for the cursor.
		div.style.cursor = &quot;pointer&quot;;
	}
	
	this.map = map;
	this.div = div;
}

function newEventPassthru(obj, event) {
	return function() { 
		GEvent.trigger(obj, event);
	};
}

// Redraw the rectangle based on the current projection and zoom level
LabeledMarker.prototype.redraw = function(force) {
	GMarker.prototype.redraw.apply(this, arguments);
	
	// We only need to do anything if the coordinate system has changed
	if (!force) return;
	
	// Calculate the DIV coordinates of two opposite corners of our bounds to
	// get the size and position of our rectangle
	var p = this.map.fromLatLngToDivPixel(this.latlng);
	var z = GOverlay.getZIndex(this.latlng.lat());
	
	// Now position our DIV based on the DIV coordinates of our bounds
	this.div.style.left = (p.x + this.labelOffset.width) + &quot;px&quot;;
	this.div.style.top = (p.y + this.labelOffset.height) + &quot;px&quot;;
	this.div.style.zIndex = z + 1; // in front of the marker
}

// Remove the main DIV from the map pane, destroy event handlers
LabeledMarker.prototype.remove = function() {
	GEvent.clearInstanceListeners(this.div);
	this.div.parentNode.removeChild(this.div);
	this.div = null;
	GMarker.prototype.remove.apply(this, arguments);
}
</pre>
</body>
</html>