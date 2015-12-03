/**
 * Created by jorda on 11/20/2015.
 */
Router.configure({layoutTemplate: 'main'});
Router.map(
    function()
    {
        this.route('LoginPage', {path:'/LoginPage'});
        this.route('CreateAccountPage', {path:'/CreateAccountPage'});
    }
);

Router.route('/', {
        name: 'GuessHomePage',
        template: 'GuessHomePage'
    }
);

Router.route('/GuessCalculator',
    {
       name: 'GuessCalculator',
        template: 'GuessCalculator'
    });

Router.route('/GuessAboutTech',
    {
        name: 'GuessAboutTech',
        template: 'GuessAboutTech'
    }
);

Router.route('/AboutTech/:_id', function()
    {
        this.render('AboutTech');
    },
    {
        name: 'AboutTech'
    });


Router.route('/HomePage/:_id', function()
    {
        this.render('HomePage');
    },
    {
        name: 'HomePage'
    });

Router.route('/OrderPage/:_id', function()
    {
        this.render('OrderPage');
    },
    {
        name: 'OrderPage'
    });

Router.route('/CurrentOrder/:_id', function()
{
    this.render('CurrentOrder');
},
    {
        name: 'CurrentOrder'
    }
);

Router.route('/PastOrder/:_id', function()
{
   this.render('PastOrder');
},
    {
        name: 'PastOrder'
    }
);