<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head profile="http://gmpg.org/xfn/11">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

<title>source: manhattan2/map_functions.js</title>

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
<h1>manhattan2/map_functions.js</h1>
<p><em>Unless stated otherwise, code available for viewing through this tool is <a href="http://creativecommons.org/licenses/publicdomain/">dedicated to the public domain</a>. If you have any questions, <a href="http://uwmike.com/contact/">drop me a line</a>.</em></p>
<pre class="prettyprint">var map, manager;
var centerLatitude = 40.736462, centerLongitude = -73.98777, startZoom = 12;


function createMarkerClickHandler(marker, text, link) {
	return function() {
		marker.openInfoWindowHtml(
			'&lt;h3&gt;' + text + '&lt;/h3&gt;' +
			'&lt;p&gt;&lt;a href=&quot;' + link + '&quot;&gt;Wikipedia &amp;raquo;&lt;/a&gt;&lt;/p&gt;'
		);
		return false;
	};
}


function createMarker(pointData) {
	var latlng = new GLatLng(pointData.latitude, pointData.longitude);
	var icon = new GIcon();
	icon.image = 'http://uwmike.com/maps/manhattan/img/red-marker.png';
	icon.iconSize = new GSize(32, 32);
	icon.iconAnchor = new GPoint(16, 16);
	icon.infoWindowAnchor = new GPoint(25, 7);

	opts = {
		&quot;icon&quot;: icon,
		&quot;clickable&quot;: true,
		&quot;labelText&quot;: pointData.abbr,
		&quot;labelOffset&quot;: new GSize(-16, -16)
	};
	var marker = new LabeledMarker(latlng, opts);
	var handler = createMarkerClickHandler(marker, pointData.name, pointData.wp);
	
	GEvent.addListener(marker, &quot;click&quot;, handler);

	var listItem = document.createElement('li');
	listItem.innerHTML = '&lt;div class=&quot;label&quot;&gt;'+pointData.abbr+'&lt;/div&gt;&lt;a href=&quot;' + pointData.wp + '&quot;&gt;' + pointData.name + '&lt;/a&gt;';
	listItem.getElementsByTagName('a')[0].onclick = handler;

	document.getElementById('sidebar-list').appendChild(listItem);

	return marker;
}

function windowHeight() {
	// Standard browsers (Mozilla, Safari, etc.)
	if (self.innerHeight)
		return self.innerHeight;
	// IE 6
	if (document.documentElement &amp;&amp; document.documentElement.clientHeight)
		return document.documentElement.clientHeight;
	// IE 5
	if (document.body)
		return document.body.clientHeight;
	// Just in case. 
	return 0;
}

function handleResize() {
	var height = windowHeight() - document.getElementById('toolbar').offsetHeight - 30;
	document.getElementById('map').style.height = height + 'px';
	document.getElementById('sidebar').style.height = height + 'px';
}

function init() {
	handleResize();
	
	map = new GMap(document.getElementById(&quot;map&quot;));
	map.addControl(new GSmallMapControl());
	map.setCenter(new GLatLng(centerLatitude, centerLongitude), startZoom);
	map.addControl(new GMapTypeControl());

	manager = new GMarkerManager(map);
	
	// This is a sorting trick, don't worry too much about it.
	markers.sort(function(a, b) { return (a.abbr &gt; b.abbr) ? +1 : -1; }); 
	
	batch = [];
	for(id in markers) {
		batch.push(createMarker(markers[id]));
	}
	manager.addMarkers(batch, 11);
	manager.refresh();
}

window.onresize = handleResize;
window.onload = init;
window.onunload = GUnload;
</pre>
</body>
</html>