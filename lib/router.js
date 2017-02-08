Router.configure({
    layoutTemplate: 'layout',
});

Router.route('/', function () {
    //if(!Meteor.user()) {
    //    this.render('login');
    //}else {
        this.render('game');
    //}
});