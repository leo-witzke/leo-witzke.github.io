var features = [["Guardians Volume 3","a"],["The Boys","a"],
		["Top Gun Maverick","a"],
                ["The Rehearsal","a"],
                ["The Batman","a"],
                ["The Righteous Gemstones","r"],
                ["Succession","a"],
                ["Fight Club","a"],
                ["Watchmen","a"],
                ["Scooby-Doo!","a"],
                ["Books and Movies","a"],
                ["Black Widow","a"],
                ["Bored to Death","r"],
                ["Bored to Death S1","r"],
                ["Texas Chainsaw Massacre","a"],
                ["Blade Runner 2049","a"],
                ["Loki","r"]];
var features_loaded = new Array(features.length).fill(false);

function prune_features(features_list=features) {
  console.log(features);
  features = features.filter((feature) => features_list.indexOf(feature[0]) != -1);
  features_loaded = new Array(features.length).fill(false);
  console.log(features);
}

var pointer = 0;
const synopsis_folder_dictionary = {"a":"Features","r":"Features","c":"Collections"}

function push_pointer(types=[]) {
  function check() {
    if (pointer >= features.length) {
      $(".load-more").attr("hidden",true);
      return true;
    }
  }
  if (check()) {
    return;
  }
  while (!types.includes(features[pointer][1]) && (types.length != 0)) {
    pointer += 1;
    console.log(features[pointer]);
    if (check()) {
      return;
    }
  }
}

function load_synopses(number_of_synopses, types=[]) {
  var end_index = pointer+number_of_synopses;
  pointer += number_of_synopses;
  for (let i = end_index-number_of_synopses; i < Math.min(end_index,features.length); i++) {
    if (types.includes(features[i][1]) || (types.length == 0)) {
      $.get("Synopses/"+synopsis_folder_dictionary[features[i][1]]+"/"+features[i][0]+"/Synopsis.html", function(data) {
        var div = document.createElement("div");
        div.setAttribute("id", i);
        div.innerHTML = data;
        let place_before = features_loaded.indexOf(true,i+1);
        if (place_before == -1) {
          document.getElementById("synopses").appendChild(div);
        } else {
          $("#"+place_before).before(div);
        }
        features_loaded[i] = true;
      }).fail(function() {
        load_synopses(1, types);
      });
    } else {
      end_index += 1;
      pointer += 1;
    }
  }
  push_pointer(types);
}

function load_synopsis_wide(types=[]) {
  if (!document.getElementById("wide-synopses").hasChildNodes()) {
    while (!(types.includes(features[pointer][1])) && !(types.length == 0)) {
      pointer += 1;
    }
    var div = document.createElement('div');
    div.setAttribute("style", "margin: 25px 0 15px 0");
    div.setAttribute("id", "wide");
    document.getElementById("wide-synopses").appendChild(div);
    $("#wide").load("Synopses/"+synopsis_folder_dictionary[features[pointer][1]]+"/"+features[pointer][0].replaceAll(" ","%20")+"/Synopsis%20Wide.html");
    pointer += 1;
  }
  push_pointer(types);
}

function load_synopses_compact(number_of_synopses, types=[]) {
  var end_index = pointer+number_of_synopses;
  pointer += number_of_synopses;
  for (let i = end_index-number_of_synopses; i < Math.min(end_index,features.length); i++) {
    if (types.includes(features[i][1]) || (types.length == 0)) {
      $.get("Synopses/"+synopsis_folder_dictionary[features[i][1]]+"/"+features[i][0]+"/Synopsis%20Compact.html", function(data) {
        var div = document.createElement("div");
        div.setAttribute("class", "compact-alignment");
        div.setAttribute("id", i);
        div.innerHTML = data;
        let place_before = features_loaded.indexOf(true,i+1);
        if (place_before == -1) {
          document.getElementById("compact-synopses").appendChild(div);
        } else {
          $("#"+place_before).before(div);
        }
        features_loaded[i] = true;
      }).fail(function() {
        load_synopses_compact(1);
      });
    } else {
      end_index += 1;
      pointer += 1;
    }
  }
  push_pointer(types);
}

function load_more(source) {
  if (source == "index") {
    load_synopsis_wide(["r","a"]);
    load_synopses_compact(9,["r","a"]);
  } else if (source == "reviews") {
    load_synopses(6,["r"]);
  } else if (source == "analyses") {
    load_synopses(6,["a"]);
  } else if (source == "features") {
    load_synopses(6,["r","a"]);
  } else if (source == "collection") {
    load_synopses_compact(6,["r","a"]);
  }
};