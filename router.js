/**
 * Created by jorda on 11/20/2015.
 */
Router.configure({layoutTemplate: 'main'});
Router.map(
    function()
    {
        this.route('LoginPage', {path:'/'});
        this.route('HomePage', {path:'/HomePage'});
        this.route('CreateAccountPage', {path:'/CreateAccountPage'});
    }
);
