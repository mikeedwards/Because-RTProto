// Generated by CoffeeScript 1.3.3

define(["realtime-client-utils", "workspace-view", "control-view"], function(util, WorkspaceView, ControlView) {
  /*
    This function is called the first time that the Realtime model is created
    for a file. This function should be used to initialize any values of the
    model. In this case, we just create the single string model that will be
    used to control our text box. The string has a starting value of 'Hello
    Realtime World!', and is named 'text'.
    @param model {gapi.drive.realtime.Model} the Realtime root model object.
  */

  var initializeModel, onFileLoaded, realtimeOptions;
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
  /*
    This function is called when the Realtime file has been loaded. It should
    be used to initialize any user interface components and event handlers
    depending on the Realtime model. In this case, create a text control binder
    and bind it to our string model that we created in initializeModel.
    @param doc {gapi.drive.realtime.Document} the Realtime document.
  */

  onFileLoaded = function(doc) {
    var addContextButton, addMarkerButton, addNoteButton, backgroundImage, closeModalButton, collaborators, collaboratorsChanged, context, controlView, data, deleteTool, desc, dispatcher, displayContextCreator, displayNoteCreator, getMe, imageUrl, markers, model, moveTool, notes, notesElement, root, title, url, workspaceView;
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
    moveTool = $("#move-tool");
    deleteTool = $("#delete-tool");
    addMarkerButton = $("#add-marker");
    addNoteButton = $("#add-note");
    addContextButton = $("#add-context");
    displayNoteCreator = $('#display-note-creator');
    displayContextCreator = $('#display-context-creator');
    closeModalButton = $('.hide-modal');
    notesElement = d3.select('#notes');
    dispatcher = _.clone(Backbone.Events);
    workspaceView = new WorkspaceView({
      model: context,
      dispatcher: dispatcher
    });
    controlView = new ControlView({
      model: context,
      el: $('.control'),
      dispatcher: dispatcher
    });
    workspaceView.render();
    $('.workspace-container').append(workspaceView.$el);
    collaboratorsChanged = function(e) {
      var collaboratorsElement;
      collaboratorsElement = $("#collaborators");
      collaboratorsElement.empty();
      collaborators = doc.getCollaborators();
      return $.each(collaborators, function(index, collaborator) {
        var collaboratorElement;
        collaboratorElement = "<span class=\"collaborator\" style=\"background-color: " + collaborator.color + "; background-image: url('" + collaborator.photoUrl + "');\">" + collaborator.displayName + "</span>";
        return collaboratorsElement.append(collaboratorElement);
      });
    };
    getMe = function() {
      return _.filter(collaborators, function(item) {
        return item.isMe;
      })[0];
    };
    doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_JOINED, collaboratorsChanged);
    doc.addEventListener(gapi.drive.realtime.EventType.COLLABORATOR_LEFT, collaboratorsChanged);
    moveTool.click(function(e) {
      return workspaceView.dispatcher.trigger('tool:set', 'move');
    });
    deleteTool.click(function(e) {
      return workspaceView.dispatcher.trigger('tool:set', 'delete');
    });
    displayNoteCreator.click(function(e) {
      return $("#note-creator").toggle();
    });
    displayContextCreator.click(function(e) {
      return $("#context-creator").toggle();
    });
    closeModalButton.click(function(e) {
      return $(this).parent().hide();
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
