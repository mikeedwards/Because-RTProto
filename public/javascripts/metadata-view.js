// Generated by CoffeeScript 1.4.0

define(['title-view', 'description-view'], function(TitleView, DescriptionView) {
  var MetadataView;
  return MetadataView = Backbone.View.extend({
    className: 'metadata',
    initialize: function(options) {
      Backbone.View.prototype.initialize.call(this, options);
      return this.dispatcher = options.dispatcher;
    },
    render: function(options) {
      this.titleView = new TitleView({
        model: this.model.get('title'),
        dispatcher: this.dispatcher,
        el: this.$el.find('.title')
      });
      this.descriptionView = new DescriptionView({
        model: this.model.get('desc'),
        dispatcher: this.dispatcher,
        el: this.$el.find('.description')
      });
      this.titleView.render();
      return this.descriptionView.render();
    }
  });
});
