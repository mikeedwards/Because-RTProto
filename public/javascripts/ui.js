// Generated by CoffeeScript 1.6.1

define(["realtime-client-utils", "marker-view", "note-view"], function(util, MarkerView, NoteView) {
  /*
  This function is called the first time that the Realtime model is created
  for a file. This function should be used to initialize any values of the
  model. In this case, we just create the single string model that will be
  used to control our text box. The string has a starting value of 'Hello
  Realtime World!', and is named 'text'.
  @param model {gapi.drive.realtime.Model} the Realtime root model object.
  */

  var getObjectFromElement, initializeModel, onFileLoaded, realtimeOptions;
  initializeModel = function(model) {
    var context, data, markers, notes;
    notes = model.createList();
    markers = model.createList();
    data = model.createMap({
      image: model.createString("http://developers.mozilla.org/files/2917/fxlogo.png"),
      spreadsheet: model.createString("")
    });
    context = model.createMap({
      notes: notes,
      markers: markers,
      data: data,
      phase: model.createString("1"),
      owner: model.createMap()
    });
    return model.getRoot().set("context", context);
  };
  getObjectFromElement = function(d3el, list) {
    var grandParentElement, id, obj, parentElement, type;
    if (d3el) {
      type = d3el.attr('data-type');
    }
    if (type === 'note-rect' || type === 'marker-circle') {
      parentElement = d3.select(d3el.node().parentNode);
      if (parentElement) {
        id = parentElement.attr('id');
      }
      obj = _.filter(list.asArray(), function(obj) {
        return obj.id === id;
      })[0];
    }
    if (type === 'handle') {
      parentElement = d3.select(d3el.node().parentNode);
      grandParentElement = d3.select(parentElement.node().parentNode);
      if (grandParentElement) {
        id = grandParentElement.attr('id');
      }
      obj = _.filter(list.asArray(), function(obj) {
        return obj.id === id;
      })[0];
    }
    return obj;
  };
  /*
  This function is called when the Realtime file has been loaded. It should
  be used to initialize any user interface components and event handlers
  depending on the Realtime model. In this case, create a text control binder
  and bind it to our string model that we created in initializeModel.
  @param doc {gapi.drive.realtime.Document} the Realtime document.
  */

  onFileLoaded = function(doc) {
    var activeElement, addContextButton, addMarker, addMarkerButton, addNote, addNoteButton, backgroundImage, backgroundImageChanged, collaborators, collaboratorsChanged, context, data, desc, displayContextCreator, displayNoteCreator, getMe, imageUrl, markers, markersAdded, model, notes, notesAdded, notesElement, offsetX, offsetY, root, title, url;
    model = doc.getModel();
    root = model.getRoot();
    context = root.get('context');
    notes = context.get('notes');
    markers = context.get('markers');
    data = context.get('data');
    backgroundImage = data.get('image');
    collaborators = doc.getCollaborators();
    title = $("#title");
    desc = $("#desc");
    url = $("#url");
    imageUrl = $("#image-url");
    addMarkerButton = $("#add-marker");
    addNoteButton = $("#add-note");
    addContextButton = $("#add-context");
    displayNoteCreator = $('#display-note-creator');
    displayContextCreator = $('#display-context-creator');
    notesElement = d3.select('#notes');
    activeElement = null;
    offsetX = 0;
    offsetY = 0;
    notesElement.on('mousedown', function() {
      var lineElement, matrix, obj, parentElement, type, x, y;
      activeElement = d3.select(d3.event.target);
      if (activeElement) {
        type = activeElement.attr('data-type');
        obj = getObjectFromElement(activeElement, type === 'marker-circle' ? markers : notes);
        parentElement = d3.select(activeElement.node().parentNode);
        if (obj) {
          if (type === 'note-rect' || type === 'marker-circle') {
            matrix = parentElement.attr('transform').slice(7, -1).split(' ');
            x = matrix[4] !== 'NaN' ? parseInt(matrix[4], 10) : 0;
            y = matrix[5] !== 'NaN' ? parseInt(matrix[5], 10) : 0;
            offsetX = d3.event.clientX - activeElement.node().offsetLeft - x;
            offsetY = d3.event.clientY - activeElement.node().offsetTop - y;
          }
          if (type === 'handle') {
            lineElement = parentElement.select('line');
            lineElement.attr('opacity', 1.0);
            offsetX = d3.event.clientX - activeElement.node().offsetLeft - activeElement.attr('cx');
            return offsetY = d3.event.clientY - activeElement.node().offsetTop - activeElement.attr('cy');
          }
        } else {
          return activeElement = null;
        }
      }
    });
    notesElement.on('mousemove', function() {
      var lineElement, obj, parentElement, type, x, y, _ref;
      if (activeElement) {
        type = activeElement.attr('data-type');
        obj = getObjectFromElement(activeElement, type === 'marker-circle' ? markers : notes);
        parentElement = d3.select(activeElement.node().parentNode);
        if (obj && ((_ref = obj.get('userId')) != null ? _ref.getText() : void 0) === getMe().userId) {
          if (type === 'note-rect' || type === 'marker-circle') {
            x = d3.event.clientX - activeElement.node().offsetLeft - offsetX;
            y = d3.event.clientY - activeElement.node().offsetTop - offsetY;
            parentElement.attr('transform', "matrix(1 0 0 1 " + x + " " + y + ")");
          }
          if (type === 'handle') {
            lineElement = parentElement.select('line');
            x = d3.event.clientX - activeElement.node().offsetLeft - offsetX;
            y = d3.event.clientY - activeElement.node().offsetTop - offsetY;
            activeElement.attr('cx', x);
            activeElement.attr('cy', y);
            lineElement.attr('x2', x);
            return lineElement.attr('y2', y);
          }
        }
      }
    });
    notesElement.on('mouseup', function() {
      var cx, cy, matrix, obj, parentElement, type, _ref;
      if (activeElement) {
        type = activeElement.attr('data-type');
        obj = getObjectFromElement(activeElement, type === 'marker-circle' ? markers : notes);
        parentElement = d3.select(activeElement.node().parentNode);
        if (obj) {
          if (type === 'note-rect') {
            matrix = parentElement.attr('transform').slice(7, -1).split(' ');
            model.beginCompoundOperation();
            obj.get('x').setText(matrix[4]);
            obj.get('y').setText(matrix[5]);
            obj.get('selected').setText(((_ref = obj.get('selected')) != null ? _ref.getText() : void 0) === 'true' ? 'false' : 'true');
            model.endCompoundOperation();
          }
          if (type === 'marker-circle') {
            matrix = parentElement.attr('transform').slice(7, -1).split(' ');
            model.beginCompoundOperation();
            obj.get('x').setText(matrix[4]);
            obj.get('y').setText(matrix[5]);
            model.endCompoundOperation();
          }
          if (type === 'handle') {
            cx = activeElement.attr('cx');
            cy = activeElement.attr('cy');
            model.beginCompoundOperation();
            obj.get('hx').setText(cx);
            obj.get('hy').setText(cy);
            model.endCompoundOperation();
          }
          offsetX = 0;
          offsetY = 0;
        }
      }
      return activeElement = null;
    });
    addNote = function(note) {
      var noteView;
      noteView = new NoteView({
        model: note,
        svg: d3.select('#notes')
      });
      return noteView.render();
    };
    addMarker = function(marker) {
      var markerView;
      markerView = new MarkerView({
        model: marker,
        svg: d3.select('#notes')
      });
      return markerView.render();
    };
    $.each(notes.asArray(), function(index, note) {
      return addNote(note);
    });
    $.each(markers.asArray(), function(index, marker) {
      return addMarker(marker);
    });
    backgroundImageChanged = function(rtEvent) {
      var contextElement;
      notesElement.select('image').remove();
      contextElement = notesElement.insert("image", ":first-child");
      contextElement.attr('xlink:href', backgroundImage.getText());
      contextElement.attr('x', "0");
      contextElement.attr('y', "0");
      contextElement.attr('height', "100%");
      return contextElement.attr('width', "100%");
    };
    markersAdded = function(rtEvent) {
      return $.each(rtEvent.values, function(index, marker) {
        return addMarker(marker);
      });
    };
    notesAdded = function(rtEvent) {
      return $.each(rtEvent.values, function(index, note) {
        return addNote(note);
      });
    };
    collaboratorsChanged = function(e) {
      var collaboratorsElement;
      collaboratorsElement = $("#collaborators");
      collaboratorsElement.empty();
      collaborators = doc.getCollaborators();
      return $.each(collaborators, function(index, collaborator) {
        var collaboratorElement;
        collaboratorElement = "<span class=\"collaborator\" style=\"background-color: " + collaborator.color + "; background-image: url('" + collaborator.photoUrl + "'); background-size: contain; background-repeat: no-repeat; padding-left: 50px\">" + collaborator.displayName + "</span>";
        return collaboratorsElement.append(collaboratorElement);
      });
    };
    getMe = function() {
      return _.filter(collaborators, function(item) {
        return item.isMe;
      })[0];
    };
    notes.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, notesAdded);
    markers.addEventListener(gapi.drive.realtime.EventType.VALUES_ADDED, markersAdded);
    backgroundImage.addEventListener(gapi.drive.realtime.EventType.TEXT_INSERTED, backgroundImageChanged);
    doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorsChanged);
    doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorsChanged);
    displayNoteCreator.click(function(e) {
      return $("#note-creator").show();
    });
    displayContextCreator.click(function(e) {
      return $("#context-creator").show();
    });
    addNoteButton.click(function(e) {
      var lastY, newNote, _ref;
      $("#context-creator").hide();
      if (notes.length > 0) {
        if (notes.get(notes.length - 1).get('y') && notes.get(notes.length - 1).get('x') === '0') {
          lastY = parseInt(((_ref = notes.get(notes.length - 1).get('y')) != null ? _ref.getText() : void 0) || '0') + 50;
        } else {
          lastY = 0;
        }
      } else {
        lastY = 0;
      }
      newNote = doc.getModel().createMap({
        title: doc.getModel().createString(title.val()),
        desc: doc.getModel().createString(desc.val()),
        url: doc.getModel().createString(url.val()),
        x: doc.getModel().createString('0'),
        y: doc.getModel().createString(lastY !== NaN && lastY !== 'NaN' ? lastY + '' : 0),
        hx: doc.getModel().createString('200'),
        hy: doc.getModel().createString('25'),
        selected: doc.getModel().createString('false'),
        userId: doc.getModel().createString(getMe().userId),
        color: doc.getModel().createString(getMe().color)
      });
      notes.push(newNote);
      e.preventDefault();
      $("#note-creator").hide();
      return false;
    });
    addMarkerButton.click(function(e) {
      var lastY, newMarker, _ref;
      $("#note-creator").hide();
      $("#context-creator").hide();
      if (markers.length > 0) {
        if ((markers.get(markers.length - 1).get('y') != null) && ((_ref = markers.get(markers.length - 1).get('x')) != null ? _ref.getText() : void 0) === '400') {
          lastY = parseInt(markers.get(markers.length - 1).get('y').getText() || '0') + 10;
        } else {
          lastY = 0;
        }
      } else {
        lastY = 0;
      }
      newMarker = doc.getModel().createMap({
        x: doc.getModel().createString('400'),
        y: doc.getModel().createString(lastY + ''),
        userId: doc.getModel().createString(getMe().userId),
        color: doc.getModel().createString(getMe().color)
      });
      markers.push(newMarker);
      e.preventDefault();
      return false;
    });
    addContextButton.click(function(e) {
      $("#note-creator").hide();
      backgroundImage.setText(imageUrl.val());
      return $("#context-creator").hide();
    });
    backgroundImageChanged();
    return collaboratorsChanged();
  };
  realtimeOptions = {
    /*
    Options for the Realtime loader.
    */

    /*
    Client ID from the APIs Console.
    */

    clientId: window.GOOGLE_API_CLIENT_ID,
    /*
    The ID of the button to click to authorize. Must be a DOM element ID.
    */

    authButtonElementId: "authorizeButton",
    /*
    Function to be called when a Realtime model is first created.
    */

    initializeModel: initializeModel,
    /*
    Autocreate files right after auth automatically.
    */

    autoCreate: true,
    /*
    Autocreate files right after auth automatically.
    */

    defaultTitle: "Because Realtime File",
    /*
    Function to be called every time a Realtime file is loaded.
    */

    onFileLoaded: onFileLoaded
  };
  return {
    rtclient: new util.RTClient(window),
    /*
    Start the Realtime loader with the options.
    */

    startRealtime: function(rtclient) {
      var realtimeLoader;
      realtimeLoader = rtclient.getRealtimeLoader(realtimeOptions);
      return realtimeLoader.start();
    }
  };
});
