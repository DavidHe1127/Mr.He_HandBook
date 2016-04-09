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
```
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
