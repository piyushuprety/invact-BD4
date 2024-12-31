const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 3000;

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

const fetchAllRestaurants = async () => {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
};

const fetchRestaurantsByCuisine = async (cuisine) => {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let result = await db.all(query, [cuisine]);
  return { restaurants: result };
};

const fetchRestaurantsByID = async (id) => {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let result = await db.all(query, [id]);
  return { restaurant: result };
};

const fetchRestaurantsByFilters = async (
  isVeg,
  hasOutdoorSeating,
  isLuxury
) => {
  const query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  const result = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  console.log(result);
  return { restaurants: result };
};

const sortRestaurantsbyRating = async () => {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let result = await db.all(query, []);
  return { restaurants: result };
};

const getAllDishes = async () => {
  let query = 'SELECT * FROM dishes';
  let result = await db.all(query, []);
  return { dishes: result };
};

const fetchDishByID = async (id) => {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let result = await db.all(query, [id]);
  return { dish: result };
};

const fetchDishesByFilters = async (isVeg) => {
  const query = 'SELECT * FROM dishes WHERE isVeg = ?';
  const result = await db.all(query, [isVeg]);
  console.log(result);
  return { dishes: result };
};

const sortDishesbyPrice = async () => {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let result = await db.all(query, []);
  return { dishes: result };
};

app.get('/restaurants', async (req, res) => {
  try {
    let results = await fetchAllRestaurants();
    if (results.restaurants.length === 0) {
      res.status(404).send('No restaurants found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching restaurants');
  }
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  try {
    const cuisine = req.params.cuisine;
    let results = await fetchRestaurantsByCuisine(cuisine);
    if (results.restaurants.length === 0) {
      res.status(404).send('No restaurants found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching restaurants');
  }
});

app.get('/restaurants/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await fetchRestaurantsByID(id);
    if (results.restaurant.length === 0) {
      res.status(404).send('No restaurants found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching restaurants');
  }
});

app.get('/restaurants/filter', async (req, res) => {
  try {
    const isVeg = req.query['isVeg'];
    const hasOutdoorSeating = req.query['hasOutdoorSeating'];
    const isLuxury = req.query['isLuxury'];

    let results = await fetchRestaurantsByFilters(
      isVeg,
      hasOutdoorSeating,
      isLuxury
    );
    if (results.restaurants.length === 0) {
      res.status(404).send('No restaurants found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching restaurants');
  }
});

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await sortRestaurantsbyRating();
    if (results.restaurants.length === 0) {
      res.status(404).send('No restaurants found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching restaurants');
  }
});

app.get('/dishes', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await getAllDishes();
    if (results.dishes.length === 0) {
      res.status(404).send('No dishes found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching dishes');
  }
});

app.get('/dishes/details/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await fetchDishByID(id);
    if (results.dish.length === 0) {
      res.status(404).send('No dishes found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching dishes');
  }
});

app.get('/dishes/filter', async (req, res) => {
  try {
    const isVeg = req.query['isVeg'];

    let results = await fetchDishesByFilters(isVeg);
    if (results.dishes.length === 0) {
      res.status(404).send('No dishes found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching dishes');
  }
});

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const id = req.params.id;
    let results = await sortDishesbyPrice();
    if (results.dishes.length === 0) {
      res.status(404).send('No dishes found');
    }
    res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Error fetching dishes');
  }
});

app.listen(PORT, () => console.log('Server is running on port 3000'));
