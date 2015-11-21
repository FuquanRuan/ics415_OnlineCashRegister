userdata = new Meteor.Collection('userData');

if (Meteor.isClient) {
  Template.HomePage.helpers(
      {
        userData: function()
        {
          return userdata.find();
        }
      }
  );

  Template.LoginPage.events(
      {
        'submit .userInput': function(event)
        {
          var username = event.target.username.value;
          var password = event.target.password.value;
          var unknown = userdata.findOne({username: username});

          if(unknown != null)
          {
            if(unknown.username == username && unknown.password == password)
            {
              //need to go to other page
              Router.go('/HomePage');
            }else
            {
              document.getElementById('errorMessage').innerHTML = "Incorrect Username/Password";
            }
          }else
          {
            document.getElementById('errorMessage').innerHTML = "Incorrect Username/Password";
          }

          return false;
        },

        'click .CreateAccount':function()
        {
          Router.go('/CreateAccountPage');
        }
      }
  );

  Template.CreateAccountPage.events(
      {
        'submit .userInput':function(event)
        {
          var ocrcode = event.target.OCRcode.value;
          var password = event.target.password.value;
          var username = event.target.username.value;
          var unknown = userdata.findOne({username:username});
          document.getElementById('createdSuccessfully').innerHTML = "";
          document.getElementById('errorMessage').innerHTML = "";
          if(ocrcode != "ics415")
          {
              document.getElementById('errorMessage').innerHTML = "**OCRcode is incorrect**";
          }else if(unknown != null)
          {
            document.getElementById('errorMessage').innerHTML += "**Username already exists**";
          }else
          {
            userdata.insert(
                {
                  username: username,
                  password: password,
                  createdAt: new Date()
                }
            );
            document.getElementById('createdSuccessfully').innerHTML = "Create Account Successfully";
          }
          event.target.OCRcode.value = "";
          event.target.password.value = "";
          event.target.username.value = "";

          return false;
        },

        'click .SignIn':function()
        {
          Router.go('/');
        }
      }
  );
}

