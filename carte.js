//CARTE
	var map = L.map('map').setView([48.85, 2.34], 12);
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		minZoom: 12,
		maxZoom: 16,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(map);

//INFOS
	var contlogo = L.control({ position: "topright" });
	contlogo.onAdd = function(map) {
		var div = L.DomUtil.create("div", "contlogo");
		div.innerHTML += '<div class="info"><h1>Dernière évolution</h1><ul id="displayed-list"></ul></div>';
		return div;
	};
	contlogo.addTo(map);
	//Timeline
      function updateList(timeline){
        var displayed = timeline.getLayers();
		displayed.reverse();
        var list = document.getElementById('displayed-list');
        list.innerHTML = "";
        displayed.forEach(function(blu){
          var li = document.createElement('li');
          li.innerHTML = '<center><b>' + blu.feature.properties.start.substring(0, 4) +'</b></br>' + blu.feature.properties.info1 + " de la ligne " + blu.feature.properties.ligne + '</center>';
          list.appendChild(li);
        });
      }
//LIGNES
	//Style
		function getColor(col) {
			return col >= 14 ? '#62259D' :
			col >= 13 ? '#6EC4E8' :
			col >= 12.1  ? '#FF5E4D' :
			col >= 12  ? '#007852' :
			col >= 11   ? '#704B1C' :
			col >= 10 ? '#C9910D' :
			col >= 9  ? '#B6BD00' :
			col >= 8  ? '#E19BDF' :
			col >= 7.1   ? '#6eca97' :
			col >= 7 ? '#FA9ABA' :
			col >= 6  ? '#6ECA97' :
			col >= 5  ? '#FF7E2E' :
			col >= 4   ? '#CF009E' :
			col >= 3.1  ? '#6EC4E8' :
			col >= 3  ? '#837902' :
			col >= 2   ? '#003CA6' :
			'#FFCD00';
		}
		function styyyle(feature) {return {
			color: getColor(feature.properties.col),
			weight: 4,
		};}
	//Chargement données
		function onLoadData(data){
			function surlignage(e) {
				var layer = e.target;
				layer.setStyle({weight: 13});
				if (!L.Browser.ie && !L.Browser.opera) {layer.bringToFront();}
			}
			function remettre(e) {timeline.resetStyle(e.target);}
			var timeline = L.timeline(data, {
				style: styyyle,
				onEachFeature: function (feature, layer) {
					layer.on({mouseover:surlignage, mouseout:remettre});
					//layer.bindPopup('rr', {maxWidth : 450});
				},
				waitToUpdateMap: true
			}).bindTooltip(function (layer) {return String('<center><img src="'+ layer.feature.properties.logo +'" height="40px"/></br>' + layer.feature.properties.info1 + ' de la ligne '+ layer.feature.properties.ligne + ' en ' + layer.feature.properties.start.substring(0, 4) + "</br>" + layer.feature.properties.info2 +"</center>" );});
			var timelineControl = L.timelineSliderControl({
				formatOutput: function(date){return moment(date).format("YYYY");},
				enableKeyboardControls: true,
				duration: 10000
			});
			timelineControl.addTo(map);
			timelineControl.addTimelines(timeline);
			timeline.addTo(map);
			timeline.on('change', function(e){updateList(e.target);});
			updateList(timeline);
		}
//SOURCES
	map.attributionControl.addAttribution('Données <a href="https://opendata.stif.info/explore/dataset/traces-du-reseau-ferre-idf/export/?location=11,48.85419,2.37614&basemap=jawg.streets">Île-de-France Mobilités</a> & <a href="https://dataratp.opendatasoft.com/explore/dataset/pictogrammes-des-lignes-de-metro-rer-tramway-bus-et-noctilien/information/">RATP</a> | © GG');