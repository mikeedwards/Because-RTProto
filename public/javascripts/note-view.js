// Generated by CoffeeScript 1.6.1

define(["d3view"], function(D3View) {
  var NoteView;
  return NoteView = D3View.extend({
    tagName: 'g',
    initialize: function(options) {
      this.constructor.__super__.initialize.call(this, options);
      return this.model.addEventListener(gapi.drive.realtime.EventType.OBJECT_CHANGED, _.bind(this.onObjectChanged, this));
    },
    onObjectChanged: function() {
      return this.render();
    },
    render: function() {
      var _ref, _ref1;
      this.d3el.attr({
        'id': this.model.id,
        'x': 0,
        'y': 0,
        'data-type': 'note',
        'transform': "matrix(1 0 0 1 " + (this.model.get('x').getText()) + " " + (this.model.get('y').getText()) + ")"
      });
      if (!this.noteRectElement) {
        this.noteRectElement = this.d3el.append('rect');
      }
      this.noteRectElement.attr({
        'width': 100,
        'height': 50,
        'data-type': 'note-rect',
        'fill': this.model.get('selected').getText() === 'true' ? 'white' : 'lightsteelblue',
        'stroke': ((_ref = this.model.get('color')) != null ? _ref.getText() : void 0) || 'gray'
      });
      if (!this.titleElement) {
        this.titleElement = this.d3el.append('text').text(this.model.get('title').getText());
      }
      this.titleElement.attr({
        'style': 'fill:black;stroke:none',
        'x': 5,
        'y': 15,
        'font-size': 12
      });
      if (!this.descElement) {
        this.descElement = this.d3el.append('text').text(this.model.get('desc').getText());
      }
      this.descElement.attr({
        'style': 'fill:blue;stroke:none',
        'x': 5,
        'y': 30,
        'width': 50,
        'height': 'auto',
        'font-size': 8
      });
      if (!this.lineGroupElement) {
        this.lineGroupElement = this.d3el.append('g');
      }
      if (!this.lineElement) {
        this.lineElement = this.lineGroupElement.append('line');
      }
      this.lineElement.attr({
        'x1': 100,
        'y1': 25,
        'x2': this.model.get('hx').getText() || 200,
        'y2': this.model.get('hy').getText() || 25,
        'stroke': 'black',
        'strokeWidth': 2,
        'opacity': this.model.get('selected').getText() === 'true' ? 0.0 : 1.0
      });
      if (!this.handleElement) {
        this.handleElement = this.lineGroupElement.append('circle');
      }
      return this.handleElement.attr({
        'r': 5,
        'cx': this.model.get('hx').getText() || 200,
        'cy': this.model.get('hy').getText() || 25,
        'fill': ((_ref1 = this.model.get('color')) != null ? _ref1.getText() : void 0) || 'gray',
        'stroke': this.model.get('selected').getText() === 'true' ? 'black' : 'darkslateblue',
        'strokeWidth': 10,
        'data-type': 'handle'
      });
    }
  });
});
