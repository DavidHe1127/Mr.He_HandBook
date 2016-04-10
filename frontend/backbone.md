# Tips and Dev notes

* Use `Backbone.history.start({pushState: true})` to tell Backbone to begin routing
* Set `trigger` to fire bound logic to the route.
```Javascript
    var router = new Backbone.Router({
        routes: {
            foo: function() {
                alert('You have navigated to the "foo" route');
            }
        }
    });
```

* Let`s say we have page A, B and C. Browser will navigate back to page A rather than B when clicking browser back button on page C - see code below
```Javascript
    router.navigate('B', {replace: true, trigger: true}); //navigate but not add an entry to history
```
* Code below creates a `404` page
```Javascript
    var SiteRouter = Backbone.Router.extend({
        initialize: function(options) {
            this.route('normalRoute:id', 'normalRoute');
            this.route('*nothingMatched', 'pageNotFoundRoute'); //define it at the bottom of route list
        },
        pageNotFoundRoute: function(failedRoute) {
            alert(failedRoute + ' did not match any routes');
        }
    });
```
* Properties below can either be a primitive value or function

| Models   | Views           | Routers  |
| -------- |:---------------:| --------:|
| defaults, url, urlRoot | attributes, className, events, id | routes |
```Javascript
var variableTagView = Backbone.View.extend({
    tagName: function() {
        if(this.collection) {
            return 'select';
        } else {
            return 'input';   
        }
    }
})
```
* event format - `<EVENT_NAME> <TARGET>`
* Call save on Model will immediately triggers `change` event and set new vales on Model. Set `{wait: true}` to delay update until get a positive response from server.
* Try not to use `{patch: true}` which will in turn send `PATCH` request that our server generally do not handle
* Client issues either a `PUT` (valid model id) or `POST` (no model id) request when trying to save via `model.save()`. However, attrs need to have a valid `id` in order for client to trigger a `PUT` when trying to save via `model.save(attrs, {});`
* Call `fetch` on `Collection` will trigger `add` event for each model unless call it with `{reset: true}`
```Javascript
users.fetch({reset: true});
```
* Call `router.navigate('xxx/xxx/view')` does nothing if you are already on that `PATH`
* `model.get('attr')` and `model.attr` are holding different values - NOT shared reference, so change one will not affect the other
```Javascript
var User = Backbone.Model.extend({
    defaults: {
      id: null,
      orders: []
    },
    load: function() {
      this.orders = [];
    }
});
```
* Make model defaults a function which returns object as below. Call `new Model().defaults` or `new Model().defaults()` to get default values
```Javascript
var Model = Backbone.Model.extend({
    defaults: function() {
        return {
            title: 'Default title'
        }
    }
});
```
* Backbone Model/Collection methods like get, set, toJSON() can be chained - `Javascript model.set('id', 1).get('id').toJSON()`

