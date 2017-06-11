
/**
 * PlanetEye Search queries.
 * 20090209 - Matt MacGillivray
 */

var map;
var searcher;
var host = "http://www.planeteye.com";
var isDragEnabled = false;
var searchCache = new Array();
var showAdditionalInformation = true;
var latFieldId;
var lngFieldId;
var placeSearchInitializeCount = 0;


function placeSearchInitialize(from) {
		//console.log('placeSearchInitialize from: ' + from + ', count: ' + placeSearchInitializeCount);
		if (placeSearchInitializeCount < 1) {
						placeSearchInitializeCount++;
						return;
		}
		isDragEnabled = true;
		latFieldId = 'locationlat';
		lngFieldId = 'locationlng';
		showAdditionalInformation = true;

		var mapelement = document.getElementById("ssbus_map");
		try {
			if ($.browser.safari) {

			}
			map = new google.maps.Map2(mapelement);
			map.setCenter(new google.maps.LatLng(34,-79), 4);

			// center around users location if we have one..
			if (google.loader.ClientLocation) {
				map.setCenter(new google.maps.LatLng(google.loader.ClientLocation.latitude,google.loader.ClientLocation.longitude), 9);
			} else {
				// default to centre of eastern seaboard..
				map.setCenter(new google.maps.LatLng(34,-79), 4);
			}

			map.addControl(new GSmallZoomControl3D()); // zoom control
			map.addControl(new GMapTypeControl(false)); // types 
	
			searcher = new google.search.LocalSearch();
			searcher.setNoHtmlGeneration();
			searcher.setSearchCompleteCallback(this, placeSearchCallback, [searcher]);
	
			// hide more results initially
			//$("#moreresults").css("display","none");
			$("#moreresults").hide();
			$("#moreresults").click(function(){
				searcher.gotoPage(searcher.cursor.currentPageIndex+1);
				return false;
			});
			//$(".searchresultscontainer").css("display","none");
			$(".searchresultscontainer").hide();
		
			$("#findlink").click(function(){
				doSearch($('#SearchText').val());
				return false;
			});

			$('#SearchText').keypress(function (e) {
				if (e.which == 13) { 
					doSearch($('#SearchText').val());
					return false;
				}
			});
		} catch (e) {
			alert('error: ' + e);
		}
}


function doSearch(query){
    searcher.execute(query);
}


function pageUnload() {
	GUnload();
}



/**
 * Called when the search is complete.
 */
function placeSearchCallback(){
	// clear the map
 	map.clearOverlays();

	// hide the 'additional information' widget
	if (showAdditionalInformation === true) {
		//$(".additionalinfo").css("display","none");
		$(".additionalinfo").hide();
	}
        
 	// clear error message
	$(".ssbus #searcherror").html("");
	// check if there are more results
	var nextPage = searcher.cursor!=null &&searcher.cursor.currentPageIndex < 7 ? true : false;

	// hide instructions
	//$(".instructions").css("display","none");
	$(".instructions").hide();
	//$(".searchresultscontainer").css("display","block");
	$(".searchresultscontainer").show();

	// show more results
	if(nextPage){
		//$("#moreresults").css("display","block");
		$("#moreresults").show();
	}

	// clear search results if there are any
	searchResults = $("#searchresults");
	searchResults.html("");
	if (!searcher.results || searcher.results.length == 0) {
		var query = $("#SearchText").val();
		$("#searcherror").html('Sorry, we were unable to find "' + query + '".  <br/><br/><b>Hints:</b><br/>1.  Try the name of the place followed by the location to make it more specific to a region or area - "Berns Steakhouse" becomes "Berns Steakhouse, Tampa".  <br/>2.  Try variations on the name - "Andrews Airforce Base, Maryland" might also be "Andrews AFB, Maryland".');
	} else {
		var bb = null;

		// bounds to set the new map to.
		var bounds = new GLatLngBounds();

		// for each result..
		for (var i=0; i < searcher.results.length; i++) {
			bounds.extend(new GLatLng(searcher.results[i].lat,searcher.results[i].lng));
			point = new GLatLng(searcher.results[i].lat, searcher.results[i].lng);

			// make sure the marker has a letter on it
			var letter = String.fromCharCode("A".charCodeAt(0) + i);
                       
			// first runthrough - display all the A,B,C,D markers on the map
			var markerIcon = null;
			markerIcon = new GIcon(G_DEFAULT_ICON, "img/pin"+letter+".png");
			markerIcon.iconSize = new GSize(20,20);
			markerIcon.iconAnchor = new GPoint(10,10);
			markerIcon.shadowSize = new GSize(20,20);
			markerOptions = { icon:markerIcon };

			// add the point to the map
			marker = new GMarker(point, markerOptions);
			map.addOverlay(marker);
			map.labelText = i.toString();
                        
			// calculate the bounding box
			if (bb == null) { bb = new GLatLngBounds(point, point); }
			else { bb.extend(point); }

			// if this is the default selected item, add the black star pin overtop of it
			if (letter === 'A') {
				//addStarMarker(map, point, searcher.results[i]);
				bb.extend(point);
			}
                   
			var placeName = searcher.results[i].titleNoFormatting; //getPlaceName(place);
			var placeAddress = searcher.results[i].addressLines.join(",");
                       
			var results = $(document.createElement("div"));
			results.addClass("k");
                        
			var k1 = $(document.createElement("span"));
			k1.addClass("k1");
			var radiobtn;
			if (letter == "A") {
				try {
					radiobtn = $(document.createElement("<input id='result"+i.toString()+"select' type='radio' name='radiogr' value='"+letter+"' checked='true'>"));
				} catch(ex) {
					// lets do this the normal way. I hate IE
					radiobtn = $(document.createElement("input"));
					radiobtn.attr("type","radio");
					radiobtn.attr("name","radiogr");
					radiobtn.attr("id","result"+i.toString()+"select");
					radiobtn.val(letter);
					radiobtn.checked = true;
				}
			} else {
				try {
					radiobtn = $(document.createElement("<input id='result"+i.toString()+"select' type='radio' name='radiogr' value='"+letter+"' >"));
				} catch (ex) {
					radiobtn = $(document.createElement("input"));
					radiobtn.attr("type","radio");
					radiobtn.attr("name","radiogr");
					radiobtn.attr("id","result"+i.toString()+"select");
					radiobtn.val(letter);
					radiobtn.checked = false;
				}
			}
                        
			k1.append(radiobtn);
			results.append(k1);
			results.append("<span class='k2'>"+letter+") </span>");
			results.append("<span class='k3'>"+placeName+"</span>");
			results.append("<span class='k4'>"+placeAddress+"</span>");
                    
			// add the result to the searchCache. We need it later if this item is selected;
			searchCache[letter] = searcher.results[i];
			searchResults.append(results);

			// when a user selects this result...
			radiobtn.click(function(){
				$(".additionalinfo").find("input").each(function(){
					$(this).val("");
				});
				if (showAdditionalInformation === true) {
					//$(".additionalinfo").css("display","block");
					$(".additionalinfo").show();
				}

				// fill out the other fields in additional info section
				var dataItem = searchCache[$(this).val()];
				updateLatLng(dataItem.lat, dataItem.lng);
				$("#locationname").val(dataItem.titleNoFormatting);
				$("#locationdescription").val("");
				$("#locationaddress").val(dataItem.addressLines[0]+", "+dataItem.addressLines[1]);
				$("#locationaddressLabel").html(dataItem.addressLines[0]+", "+dataItem.addressLines[1]);
				$("#locationphone").val((dataItem.phoneNumbers!=null && dataItem.phoneNumbers.length > 0) ? dataItem.phoneNumbers[0].number : "");
				$("#locationwebsite").val("");
                        
				//redraw the map
				redrawMap();
			});
                     
			// set the first object as the selected one
			$(".additionalinfo").find("input").each(function(){
				$(this).val("");
			});

			// hide the first cancel button
			//$(".ssbus #closemap").css("display","none");
			$(".ssbus #closemap").hide();
			var dataItem = searchCache["A"];
			$("#locationname").val(dataItem.titleNoFormatting);
			$("#locationdescription").val("");
			$("#locationaddress").val(dataItem.addressLines[0]+", "+dataItem.addressLines[1]);
			$("#locationphone").val((dataItem.phoneNumbers!=null && dataItem.phoneNumbers.length > 0) ? dataItem.phoneNumbers[0].number : "");
			$("#locationwebsite").val("");
			var sObject = searcher.results[i];

		} // for loop
                
		// bump out the default zoom by 1 for space...
		map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds) - 1);

	} // else
}




/**
 * Update the lat/lng fields on the bottom of the map if they exist
 */
function updateLatLng(lat, lng) {
    var latf = $('#' + latFieldId);
    var lngf = $('#' + lngFieldId);
    if (latf && lngf) {
        latf.html(lat);
        lngf.html(lng);
    }
}


function addStarMarker(map, point, searchresult) {
    markerIcon = new GIcon(G_DEFAULT_ICON, "http://www.planeteye.com/i/jsmap/pins/none-pin.png");
    markerIcon.iconSize = new GSize(24,32);
    markerIcon.iconAnchor = new GPoint(12,32);
    markerOptions = { icon:markerIcon, draggable:isDragEnabled };
    marker = new GMarker(point, markerOptions);
    updateLatLng(point.lat().toFixed(6), point.lng().toFixed(6)); 
    attachDragHooks(marker, searchresult);
    map.addOverlay(marker);
}


/**
 * Allow dragging of the marker
 */
function attachDragHooks(marker, searchresult) {
    if (isDragEnabled === true) {
        (function(marker, searchresult) {
            GEvent.addListener(marker, "dragstart", function() { });
            
            GEvent.addListener(marker, "dragend", function(latlong) {
                updateLatLng(latlong.lat().toFixed(6), latlong.lng().toFixed(6)); 
            });
        }) (marker, searchresult);
        
    }
}


function redrawMap(){
    var letter = $("#searchresults .k .k1 input:radio:checked").val();
    var numresults = $("#searchresults input:radio").size();
    // clear the map
    map.clearOverlays();
    
    
    for(var x = 0;x<numresults;x++){
        
        var arrayindexletter = String.fromCharCode("A".charCodeAt(0) + x);
      
        var item = searchCache[arrayindexletter];
        var point = new GLatLng(item.lat, item.lng);
        var markerIcon = null;
        markerIcon = new GIcon(G_DEFAULT_ICON, "img/pin"+arrayindexletter+".png");
        markerIcon.iconSize = new GSize(20,20);
        markerIcon.iconAnchor = new GPoint(10,10);
        markerIcon.shadowSize = new GSize(20,20);
        markerOptions = { icon:markerIcon };

        // add the point to the map
        marker = new GMarker(point, markerOptions);
        map.addOverlay(marker);
        
        if (letter == arrayindexletter) {
            addStarMarker(map, point, item);
        }
        
    }
    
    
}




function escapeSingleQuotes(value) {
	if (value != null && value != '') {
		value = value.replace(/'/g,"\\'");
	}
	return value;
}


// link directly to this url, which is supposed to be a planeteye url.
function linkToUrlInField(id) {
	var field = document.getElementById(id);
	var url = field.value;
	var placeId = 0;
	
	if (url != null && url != '' 
			&& url.toLowerCase().match('planeteye.com') != null 
			&& url.toLowerCase().match('/place/') != null) {
		pieces = url.split(new RegExp("[\+/\.]"));
		if (pieces != null && pieces.length > 2) {
			placeId = pieces[pieces.length-2];

		var temp = showWaitingText();

		// TODO make call to planeteye to retrieve this information
		$.ajax({
			type: "GET",
				url: host + "/services/JsonApi.ashx/PlaceGet",
				data: "{ placeId: '" + placeId + "' } ",
				dataType: "jsonp",
				success: function(xhr, status) {
						if (xhr != null && (xhr.href != null || xhr.href != '')) {
							insertLink(xhr.href, xhr.title, xhr.desc, xhr.lat, xhr.lng);
						} else {
							// if no link was found, insert a link to the search page.
							insertLink(host + "/Search.aspx?refcon=expertblog&q=" + name + "," + address, title, "", lat, lng);
						}
				},
	
			error: function(xhr, status, error) {
				resultsdiv.innerHTML = resultsHTML;
				alert('There was a problem processing your link, please try again');
				hideWaitingText(temp);
			},

			complete: function(xhr, status) {
				// do nothing..
			}
		});
		} else {
			alert('Url is invalid, please enter a PlanetEye place link like this: "www.planeteye.com/Place/CN_Tower+Toronto+682750.aspx"');
			hideWaitingText(temp);
		}
	} else {
		alert('Url is invalid, please enter a PlanetEye place link like this: "www.planeteye.com/Place/CN_Tower+Toronto+682750.aspx"');
		hideWaitingText(temp);
	}
}

function showWaitingText() {
		//var resultsdiv = document.getElementById('wpp_results');
		var resultsdiv = $('.ssbus_give');
		var resultsHTML = resultsdiv.html();
		resultsdiv.html("<div class='loading' style='width:100%; margin-left:auto; margin-right:auto;'><p><b>Processing the link with PlanetEye</b></p><img src='img/ajax-loader.gif' /><br/><br/><p><i>Please wait...</i></p><p><i>This might take up to 30 seconds.</i></p></div>");
		return resultsHTML;
}
function hideWaitingText(resultsHTML) {
		//var resultsdiv = document.getElementById('wpp_results');
		var resultsdiv = $('.ssbus_give');
		resultsdiv.html(resultsHTML);
}

// make call to planeteye via ajax to find a matching place
// for this information
function linkToPlace(customerid, blogurl) {
	   // return the details in the 'additional information' box...
		// make sure we include lat/lng..

		// url encode name/address/etc - specifically '&' characters
		//var name = escapeSingleQuotes($('#locationname').val());
		var name = escape(escapeSingleQuotes($('#locationname').val()));
		var address = escape(escapeSingleQuotes($('#locationaddress').val()));
		var phone = escape(escapeSingleQuotes($('#locationphone').val()));
		var url = escape($('#locationwebsite').val());
		var lat = $('#locationlat').html();
		var lng = $('#locationlng').html();

		var resultsHTML = showWaitingText();

		$.ajax({
			type: "GET",
				url: host + "/services/jsonapiopen.ashx/placeFind",
				data: "{ title: '" + name + "', latitude: '" + lat + "', longitude: '" + lng + "', normalizedAddress: '" + address + "', addressLine: '', postalCode: '', city: '', country: '', phone: '" + phone + "', url: '" + url + "', customerId: '" + customerid + "', blogUrl: '" + blogurl + "' } ",
				dataType: "jsonp",
				success: function(obj, status) {
						if (obj != null && obj.result != null && (obj.result.url != null || obj.result.url != '')) {
							insertLink(obj.result.url, obj.result.title, obj.result.description, obj.result.latitude, obj.result.longitude, obj.result.address);
						} else {
							// if no link was found, insert a link to the search page.
							insertLink(host + "/Search.aspx?refcon=expertblog&q=" + name + "," + address, title, "", lat, lng, address);
						}
				},
	
			error: function(xhr, status, error) {
				hideWaitingText(resultsHTML);
				alert('There was a problem processing your link, please try again');
			},

			complete: function(xhr, status) {
				// do nothing..
			}
		});

	return false;
}



// TODO - must change name
function insertLink(link, title, desc, lat, lng, address) {

	var inst = tinyMCEPopup.editor;
	var elm, elementArray, i;
	var encodeLink = !link ? null : encodeURI(link);
	var encodeTitle = !title ? null : escape(title);
	elm = inst.selection.getNode();
// forms[0].href is the link..
//	checkPrefix(document.forms[0].href);

	elm = inst.dom.getParent(elm, "A");

	// Remove element if there is no href
	//if (!document.forms[0].href.value) {
	if (!encodeLink) {
		tinyMCEPopup.execCommand("mceBeginUndoLevel");
		i = inst.selection.getBookmark();
		inst.dom.remove(elm, 1);
		inst.selection.moveToBookmark(i);
		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
	} else {

		tinyMCEPopup.execCommand("mceBeginUndoLevel");

		// Create new anchor elements
		if (elm == null) {
			tinyMCEPopup.execCommand("CreateLink", false, "#mce_temp_url#", {skip_undo : 1});

			elementArray = tinymce.grep(inst.dom.select("a"), function(n) {return inst.dom.getAttrib(n, 'href') == '#mce_temp_url#';});
			for (i=0; i<elementArray.length; i++) {
				setAllAttribs(elm = elementArray[i], encodeLink, encodeTitle, desc, lat, lng, address);
			}
		} else {
			setAllAttribs(elm, encodeLink, encodeTitle, desc, lat, lng, address);
		}	

		// Don't move caret if selection was image
		if (elm != null && (elm.childNodes.length != 1 || elm.firstChild.nodeName != 'IMG')) {
			inst.focus();
			inst.selection.select(elm);
			inst.selection.collapse(0);
			tinyMCEPopup.storeSelection();
		}

		tinyMCEPopup.execCommand("mceEndUndoLevel");
		tinyMCEPopup.close();
	}
}
function setAllAttribs(elm, href, title, desc, lat, lng, address) {
//        var formObj = document.forms[0];
//        var href = formObj.href.value;
        //var target = getSelectValue(formObj, 'targetlist');
        var target = '_blank';

	if (title) { title = title.replace("'","\'"); }

        setAttrib(elm, 'href', href);
        setAttrib(elm, 'title', "___name___" + title + "___desc___" + desc + "___lat___" + lat + "___lng___" + lng + "___address___" + address);
        setAttrib(elm, 'target', target == '_self' ? '' : target);
        setAttrib(elm, 'id');
        setAttrib(elm, 'style');
//        setAttrib(elm, 'class', getSelectValue(formObj, 'classlist'));
        setAttrib(elm, 'rel');
        setAttrib(elm, 'rev');
        setAttrib(elm, 'charset');
        setAttrib(elm, 'hreflang');
        setAttrib(elm, 'dir');
        setAttrib(elm, 'lang');
        setAttrib(elm, 'tabindex');
        setAttrib(elm, 'accesskey');
        setAttrib(elm, 'type');
        setAttrib(elm, 'onfocus');
        setAttrib(elm, 'onblur');
        setAttrib(elm, 'onclick');
        setAttrib(elm, 'ondblclick');
        setAttrib(elm, 'onmousedown');
        setAttrib(elm, 'onmouseup');
        setAttrib(elm, 'onmouseover');
        setAttrib(elm, 'onmousemove');
        setAttrib(elm, 'onmouseout');
        setAttrib(elm, 'onkeypress');
        setAttrib(elm, 'onkeydown');
        setAttrib(elm, 'onkeyup');

        // Refresh in old MSIE
        if (tinyMCE.isMSIE5)
                elm.outerHTML = elm.outerHTML;
}

function setAttrib(elm, attrib, value) {
        var formObj = document.forms[0];
        var valueElm = formObj.elements[attrib.toLowerCase()];
        var dom = tinyMCEPopup.editor.dom;

        if (typeof(value) == "undefined" || value == null) {
                value = "";

                if (valueElm)
                        value = valueElm.value;
        }

        // Clean up the style
        if (attrib == 'style')
                value = dom.serializeStyle(dom.parseStyle(value));

        dom.setAttrib(elm, attrib, value);
}



function getSelectValue(form_obj, field_name) {
        var elm = form_obj.elements[field_name];

        if (!elm || elm.options == null || elm.selectedIndex == -1)
                return "";

        return elm.options[elm.selectedIndex].value;
}


// add EDIT IN PLACE code
function setClickable() {
	// attach clickable events
	$('.editinplace').click(function() {
		var textfield = '<div><input id="' + $(this).attr('id') + '" type="text" size="30" maxlength="50" value="' + $(this).html() + '"/>';
		var button = '<div><input type="button" value="SAVE" class="e saveButton" /> OR <input type="button" value="CANCEL" class="e cancelButton"/></div></div>';
		var revert = $(this).html();
		$(this).after(textfield+button).remove();

		// define save/cancel events
		$('.saveButton').click(function(){saveChanges(this, false);});
		$('.cancelButton').click(function(){saveChanges(this, revert);});
	}).mouseover(function() {
		$(this).addClass("editable");
	}).mouseout(function() {
		$(this).removeClass("editable");
	});
}

// EDIT IN PLACE: Deal with save/cancel buttons
function saveChanges(obj, cancel) {
	var htmltoreplace;
	var id = $(obj).parent().siblings(0).attr('id');
	var cssclass = $(obj).parent().siblings(0).attr('class');
	if (!cancel) {
		htmltoreplace = $(obj).parent().siblings(0).val();
	} else {
		htmltoreplace = cancel;
	}
	$(obj).parent().parent().after('<div id="' + id + '" class="' + cssclass + '">'+htmltoreplace+'</div>').remove() ;
	setClickable();
}


function getPlaceName(place) {
/**
	alert('1' + uneval(place.AddressDetails));
	alert('2' + uneval(place.AddressDetails.Country));
	alert('3' + uneval(place.AddressDetails.Country.AdministrativeArea));
	alert('4' + uneval(place.AddressDetails.Country.AdministrativeArea.Locality));
	alert('5' + uneval(place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode));
	alert('6' + uneval(place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode.AddressLine));
**/
	// place name is held in different places sometimes.. not sure why... so this is where we add
	// that code..
	try {
		name = place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode.AddressLine[0];
	} catch (ex1) { 
		try {
			name = place.AddressDetails.Country.AdministrativeArea.Locality.AddressLine[0];
		} catch (ex2) { name=''; }
	}
	
	// safari 3 related fix.
	if (name || (name.match('<!--framePath') == '<!--framePath'))
	{
		name = null;
	}

	return name;
}

function getCountry(place) {
	try {
		value = place.AddressDetails.Country.CountryName;
	} catch (ex1) { value = ''; }
	return value;
}
function getAddressLine(place) {
	try {
		value = place.AddressDetails.Country.AdministrativeArea.Locality.Thoroughfare.ThoroughfareName;
	} catch (ex1) { value=''; }
	return value;
}
function getPostalCode(place) {
	try {
		value = place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;
	} catch (ex1) { value=''; }
	return value;
}
function getCity(place) {
	try {
		value = place.AddressDetails.Country.AdministrativeArea.Locality.LocalityName;
	} catch (ex1) { value=''; }
	return value;
}

