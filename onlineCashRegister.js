userdata = new Meteor.Collection('userData');
menuItem = new Meteor.Collection('menuitem');
savedOrder = new Meteor.Collection('savedorder');
savedOrderCash = new Meteor.Collection('savedordercash');
currentOrder1 = new Meteor.Collection('currentorder1');
currentOrder2 = new Meteor.Collection('currentorder2');
currentOrder3 = new Meteor.Collection('currentorder3');
var DrinkNumber = 0;
function checkAccount() {
  var url = window.location.href;
  var urlArray = url.split("/");
  urlArray = urlArray[4].split('#');
  var unknown = userdata.findOne({_id: urlArray[0]});
  if(unknown == null)
  {
    Router.go("/");
  }else
  {

  }
  return unknown.username;
}

if(Meteor.isServer)
{
  Meteor.startup(function () {
    return Meteor.methods({
      removeCurrentOrder1: function()
      {
        return currentOrder1.remove({});
      },
      removeCurrentOrder2: function()
      {
        return currentOrder2.remove({});
      },
      removeCurrentOrder3: function()
      {
        return currentOrder3.remove({});
      },
      removeAllDataMethod: function()
      {
        currentOrder1.remove({});
        currentOrder2.remove({});
        currentOrder3.remove({});
        savedOrderCash.remove({});
        return savedOrder.remove({});
      }
    });
  });
}



if (Meteor.isClient) {

  Template.AboutTech.onCreated(function()
  {
    this.subscribe("loading");

  });

  Template.AboutTech.helpers(
      {
        getUser: function()
        {
          return checkAccount();
        },
        getAccount: function()
        {
          var url = window.location.href;
          var urlArray = url.split("/");
          return urlArray[4];
        }
      }
  );

  Template.AboutTech.events(
      {
        'click .signout': function()
        {
          Router.go('/LoginPage');
        }
      }
  );
  Template.GuessAboutTech.events(
      {
        'click .signIn': function()
        {
          Router.go('/LoginPage');
        }
      }
  );

  Template.GuessCalculator.helpers(
      {
        getMenu: function()
        {
          return menuItem.find();
        }
      }
  );

  Template.GuessCalculator.events(
      {
        'submit .registerForm': function(event)
        {
          var total = document.getElementById('totalPrice').innerHTML;
          var cash = event.target.cash.value;
          var change = total - cash;
          document.getElementById('changes').innerHTML = change.toFixed(2) * -1;
          return false;
        },
        'click .signIn': function()
        {
          Router.go('/LoginPage');
        }
      }
  );

  Template.GuessHomePage.helpers(
      {
        GuessShowItems: function()
        {
          return menuItem.find();
        }
      }
  );

  Template.GuessHomePage.events(
      {
        'click .signIn': function()
        {
          Router.go('/LoginPage');
        }
      }
  );

  Template.PastOrder.onCreated(function()
  {
    this.subscribe("loading");

  });

  Template.PastOrder.helpers(
      {
        getUser: function()
        {
          return checkAccount();
        },
        getAccount: function()
        {
          var url = window.location.href;
          var urlArray = url.split("/");
          return urlArray[4];
        }
      }
  );

  Template.PastOrder.events(
      {
        'click .loadData': function()
        {
          //loading drinks of the order
          var allData = savedOrder.find();
          var appendDiv = document.getElementById('currentOrderId');
          appendDiv.innerHTML = "";
          var countOrder = 0;

          if(allData != null) {
            allData.forEach(function (order) {
              if (countOrder != order.orderNumber) {
                countOrder++;
                if(countOrder != 1)
                {
                  var orderCash = savedOrderCash.findOne({orderNumber: countOrder-1});
                  appendDiv.appendChild(document.createTextNode("Subtotal: " + orderCash.subtotal));
                  appendDiv.innerHTML += "<br>";
                  appendDiv.appendChild(document.createTextNode("Tax: " + orderCash.tax));
                  appendDiv.innerHTML += "<br>";
                  appendDiv.appendChild(document.createTextNode("Total: " + orderCash.total));
                  appendDiv.innerHTML += "<br>";
                }
                var orderHeader = document.createElement("H1");
                orderHeader.appendChild(document.createTextNode("Order# " + countOrder));
                appendDiv.appendChild(orderHeader);
              }
              appendDiv.appendChild(document.createTextNode(order.drink));
              appendDiv.innerHTML += "<br>";
            });
            var orderCash = savedOrderCash.findOne({orderNumber: countOrder});
            appendDiv.appendChild(document.createTextNode("Subtotal: " + orderCash.subtotal));
            appendDiv.innerHTML += "<br>";
            appendDiv.appendChild(document.createTextNode("Tax: " + orderCash.tax));
            appendDiv.innerHTML += "<br>";
            appendDiv.appendChild(document.createTextNode("Total: " + orderCash.total));
            appendDiv.innerHTML += "<br>";
          }
        },
        'click .signout': function()
        {
          Router.go('/');
        },
        'click .removeAllData': function()
        {
          if(confirm("Are you sure to clear the history"))
          {
            Meteor.call('removeAllDataMethod');
          }
        }

      }
  );


  Template.CurrentOrder.onCreated(function()
  {
    this.subscribe("loading");

  });

  Template.CurrentOrder.events(
      {
        'click .signout': function()
        {
          Router.go('/');
        }
      }
  );

  Template.CurrentOrder.helpers(
      {
        getUser: function()
        {
          return checkAccount();
        },
        getAccount: function()
        {
          var url = window.location.href;
          var urlArray = url.split("/");
          return urlArray[4];
        },
        getOrder1: function()
        {
          return currentOrder1.find();
        },
        getOrder2: function()
        {
          return currentOrder2.find();
        },
        getOrder3: function()
        {
          return currentOrder3.find();
        }
      }
  );

  Template.menuItems.events(
      {
        'click .onMenuItem': function(event)
        {
          DrinkNumber++;
          var deleteBtn = document.createElement("Button");
          deleteBtn.className = "btn btn-danger btn-sm removeDrinkBtn";
          deleteBtn.appendChild(document.createTextNode("Remove"));
          deleteBtn.id = 'removeButton_' + DrinkNumber;
          var itemName = document.createElement("DIV");
          var temp = event.target.innerHTML;
          temp = temp.split("<br>");
          var drinkText = document.createElement("DIV");
          var priceText = document.createElement("DIV");
          drinkText.appendChild(document.createTextNode(temp[0]));
          drinkText.id = 'drinkNumber' + DrinkNumber;
          itemName.id = 'itemOrder_' + DrinkNumber;
          priceText.id = 'priceOrder_' + DrinkNumber;
          priceText.innerHTML = temp[1];
          priceText.className = 'receiptPrice';
          itemName.appendChild(deleteBtn);
          itemName.appendChild(drinkText);
          itemName.appendChild(priceText);
          itemName.innerHTML += "<br>";
          document.getElementById('receipt').appendChild(itemName);

          var drinkPrice = temp[1].replace("$","");
          var subtotal = document.getElementById('subtotal').innerHTML;
          subtotal = parseFloat(subtotal) + parseFloat(drinkPrice);
          document.getElementById('subtotal').innerHTML = subtotal.toFixed(2);

          var tax = subtotal * 0.045;
          document.getElementById('tax').innerHTML = tax.toFixed(2);

          var total = subtotal + tax;
          document.getElementById('totalPrice').innerHTML = total.toFixed(2);
        }

      }
  );

  Template.OrderPage.onCreated(function()
  {
    this.subscribe('loading');
  });

  Template.OrderPage.helpers(
      {
        getUser: function()
        {
          return checkAccount();
        },
        getAccount: function()
        {
          var url = window.location.href;
          var urlArray = url.split("/");
          return urlArray[4];
        },
        getMenu: function()
        {
          return menuItem.find();
        }
      }
  );

  Template.OrderPage.events(
      {
        'click .removeDrinkBtn': function (event) {

          var idString = event.target.id;
          idString = idString.split("_");
          var selectedDrink = document.getElementById("itemOrder_" + idString[1]);

          var selectedPrice = document.getElementById('priceOrder_' + idString[1]);
          selectedPrice = selectedPrice.innerHTML.replace("$","");
          var subtotal = document.getElementById('subtotal');
          subtotal.innerHTML = (parseFloat(subtotal.innerHTML) - parseFloat(selectedPrice)).toFixed(2);
          subtotal = parseFloat(subtotal.innerHTML);
          document.getElementById('tax').innerHTML = parseFloat(subtotal * 0.045).toFixed(2);
          var tax = parseFloat(document.getElementById('tax').innerHTML);
          document.getElementById('totalPrice').innerHTML = parseFloat(subtotal + tax).toFixed(2);

          selectedDrink.parentNode.removeChild(selectedDrink);


        },
        'submit .submitData': function()
        {
          var drink = document.getElementById('drinkNumber' + 1);
          if(drink != null)
          {

          }
          var orderNum = savedOrder.findOne({orderNumber: 1});
          if(orderNum == null)
          {
            orderNum = 1;
          }else
          {
            var countOrder = 1;
            while(orderNum != null)
            {
              countOrder ++;
              orderNum = savedOrder.findOne({orderNumber: countOrder});
            }

            orderNum = countOrder;
          }

          var i = 1;
          if(drink != null)
          {
            while(drink != null)
            {
              savedOrder.insert(
                  {
                    orderNumber: orderNum,
                    drink: drink.innerHTML,
                    createAt: new Date()
                  }
              );
              i++;
              drink = document.getElementById('drinkNumber' + i);
            }
            savedOrderCash.insert(
                {
                  orderNumber: orderNum,
                  subtotal: document.getElementById('subtotal').innerHTML,
                  tax: document.getElementById('tax').innerHTML,
                  total: document.getElementById('totalPrice').innerHTML
                }
            );
            var currentOrderNum1 = currentOrder1.findOne();
            var currentOrderNum2 = currentOrder2.findOne();
            var currentOrderNum3 = currentOrder3.findOne();
            if(currentOrderNum1 == null)
            {
              console.log("Inserting 1");
              drink = document.getElementById('drinkNumber' + 1);
              i = 1;
              while(drink != null)
              {
                currentOrder1.insert(
                    {
                      drink: drink.innerHTML,
                      createAt: new Date()
                    }
                );
                i++;
                drink = document.getElementById('drinkNumber' + i);
              }
            }else if(currentOrderNum2 == null)
            {
              console.log("Inserting 2");
              drink = document.getElementById('drinkNumber' + 1);
              i = 1;
              while(drink != null)
              {
                currentOrder2.insert(
                    {
                      drink: drink.innerHTML,
                      createAt: new Date()
                    }
                );
                i++;
                drink = document.getElementById('drinkNumber' + i);
              }
            }else if(currentOrderNum3 == null)
            {
              console.log("Inserting 3");
              drink = document.getElementById('drinkNumber' + 1);
              i = 1;
              while(drink != null)
              {
                currentOrder3.insert(
                    {
                      drink: drink.innerHTML,
                      createAt: new Date()
                    }
                );
                i++;
                drink = document.getElementById('drinkNumber' + i);
              }
            }else
            {
              console.log("Inserting 4");
              Meteor.call('removeCurrentOrder1');
              currentOrder2.find().forEach(function(doc)
              {
                currentOrder1.insert(doc);
              });
              Meteor.call('removeCurrentOrder2');
              currentOrder3.find().forEach(function(doc)
              {
                currentOrder2.insert(doc);
              });

              Meteor.call('removeCurrentOrder3');

              drink = document.getElementById('drinkNumber' + 1);
              i = 1;
              while(drink != null)
              {
                currentOrder3.insert(
                    {
                      drink: drink.innerHTML,
                      createAt: new Date()
                    }
                );
                i++;
                drink = document.getElementById('drinkNumber' + i);
              }
            }

          }


        },
        'submit .registerForm': function(event)
        {
          var total = document.getElementById('totalPrice').innerHTML;
          var cash = event.target.cash.value;
          var change = total - cash;
          document.getElementById('changes').innerHTML = change.toFixed(2) * -1;
          return false;
        },
        'click .signout': function()
        {
          Router.go('/');
        },
        'click .addDrink': function()
        {
          var form = document.createElement("FORM");
          var name = document.createElement("INPUT");
          var price = document.createElement("INPUT");
          var submitB = document.createElement("INPUT");
          var cancelB = document.createElement("INPUT");

          name.type = 'text';
          price.type = 'number';
          submitB.type = 'submit';
          cancelB.type = 'button';

          form.name = 'addDrinkForm';
          name.name = 'drink';
          price.name = 'price';
          submitB.name = 'submitB';
          cancelB.name = 'cancelB';

          submitB.value = 'Submit';
          cancelB.value = 'Cancel';

          name.placeholder = 'Drink';
          price.placeholder = '00.00';

          name.style.height = '150%';
          price.style.height = '150%';

          form.className = 'newDrinkClass';
          submitB.className = 'btn btn-success';
          cancelB.className = 'btn btn-danger cancelB';

          price.step = '0.01';
          price.min = '1';

          form.method = 'post';
          form.action = '';

          form.appendChild(name);
          form.appendChild(price);
          form.appendChild(submitB);
          form.appendChild(cancelB);
          document.getElementById('orderDesk').appendChild(form);
        },
        'click .removeDrink':function()
        {
          var form = document.createElement("FORM");
          var name = document.createElement("INPUT");
          var price = document.createElement("INPUT");
          var submitB = document.createElement("INPUT");
          var cancelB = document.createElement("INPUT");

          name.type = 'text';
          price.type = 'number';
          submitB.type = 'submit';
          cancelB.type = 'button';

          form.name = 'removeDrinkForm';
          name.name = 'drink';
          price.name = 'price';
          submitB.name = 'submitB';
          cancelB.name = 'cancelB';

          submitB.value = 'Submit';
          cancelB.value = 'Cancel';

          name.placeholder = 'Drink';
          price.placeholder = '00.00';

          name.style.height = '150%';
          price.style.height = '150%';

          form.className = 'removeDrinkClass';
          submitB.className = 'btn btn-success';
          cancelB.className = 'btn btn-danger cancelB';

          price.step = '0.01';
          price.min = '0';

          form.method = 'post';
          form.action = '';

          form.appendChild(name);
          form.appendChild(price);
          form.appendChild(submitB);
          form.appendChild(cancelB);
          document.getElementById('orderDesk').appendChild(form);
        },
        'click .cancelB': function () {
          location.reload();
        },
        'submit .newDrinkClass': function (event)
        {
          var drink = event.target.drink.value;
          var price = event.target.price.value;
          console.log(price);
          if(price == "")
          {
            price = 0;
          }
          menuItem.insert(
              {
                drink: drink,
                price: parseFloat(price).toFixed(2),
                createdAt: new Date()
              }
          );
          return true;
        },
        'submit .removeDrinkClass': function (event) {
          var drink = event.target.drink.value;
          var price = event.target.price.value;
          var itemId = menuItem.findOne(
              {
                drink: drink,
                price: parseFloat(price).toFixed(2)
              }
          )._id;
          menuItem.remove({_id:itemId});
          return true;
        }
      }
  );


  Template.HomePage.onCreated(function()
  {
    this.subscribe('loading');
  });

  Template.HomePage.helpers(
      {
        userData: function()
        {
          return userdata.find();
        },
        getUser: function()
        {
          return checkAccount();
        },
        getAccount: function()
        {
          var url = window.location.href;
          var urlArray = url.split("/");
          return urlArray[4];
        },
        showItems: function()
        {
          return menuItem.find();
        }

      }
  );

  Template.HomePage.events(
      {
        'click .signout': function()
        {
          Router.go('/');
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
              Router.go('HomePage', {_id: unknown._id});
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
        },
        'click .guessBtn': function()
        {
          Router.go('/');
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
          Router.go('/LoginPage');
        },
        'click .guessBtn': function()
        {
          Router.go('/');
        }
      }
  );
}

