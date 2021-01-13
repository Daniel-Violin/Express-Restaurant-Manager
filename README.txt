name: Daniel Violin
student number: 101173598

1. Navigate to location of assignment3 inside terminal
2. Run 'npm install' at this location
3. Run 'node a3-server.js'
4. Navigate to http://localhost:3000/ to access home page
   Navigate to http://localhost:3000/restaurants to access restaurants page
   Navigate to http://localhost:3000/addrestaurant to access add restaurant page
   Navigate to http://localhost:3000/restaurants/restID to access the data of that specific restaurant

Design Choices:

- Firstly, I decided not to use routers in this assignment, instead I opted to handle it through a single, bigger
  client.js and a larger server.js (the routes in the server were relatively small so for convenience I did not make
  new files for each route). I still included routes to handle the request but I didnt put them into different js files like
  we've observed in lecture and tutorials. Instead all my routes are in the same place (a3-server.js).

- Secondly, I chose to use a pug template engine to display my html pages (except for the form.html because I had trouble
  getting forms to work in pug)
