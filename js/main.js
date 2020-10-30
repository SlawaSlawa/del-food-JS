'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js';
// Элементы
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.getElementById('logInForm'),
  loginInput = document.getElementById('login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  inputAlert = document.querySelector('.input-alert'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  inputSearsh = document.querySelector('.input-search'),
  modalBody = document.querySelector('.modal-body'),
  modalPrice = document.querySelector('.modal-pricetag'),
  buttonClearCart = document.querySelector('.clear-cart');

const cart = [];

let login = localStorage.getItem('gloDelivery') || '';
// Запрос к базе данных
const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу: ${url}, статус ошибки: ${response.status}`);
  } else {
    return await response.json();
  }
};

function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

// Авторизация
function toggleModal() {
  modal.classList.toggle("is-open");
}

// Открытие закрытие модального окна авторизации
function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");

  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }

  logInForm.reset();
  inputAlert.style.display = '';
}

function autorized() {

  function logOut() {
    login = '';
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
}

function notAutorized() {

  function logIn(event) {
    event.preventDefault();

    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      inputAlert.style.display = '';
      checkAuth();
    } else {
      inputAlert.style.display = 'block';
      loginInput.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

function createCardRestaurant(restaurant) {

  const { image, kitchen, name, price, stars, products, time_of_delivery: timeOfDelivery } = restaurant;

  const card = `
  <a class="card card-restaurant" data-products="${products}" data-rest-name="${name}">
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery} мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
         ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
<!-- /.card -->
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGood(products) {
  const { id, name, description, price, image } = products;
  const card = document.createElement('div');
  card.classList.add('card');
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="${name}" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">
          ${description}
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button id="${id}" class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
    <!-- /.card-text -->
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function createDescRest(data) {
  const restaurantTitle = document.querySelector('.section-heading .restaurant-title');
  const ratingEl = document.querySelector('.section-heading .rating');
  const priceEl = document.querySelector('.section-heading .price');
  const categoryEl = document.querySelector('.section-heading .category');

  restaurantTitle.textContent = data.name;
  ratingEl.textContent = data.stars;
  if (!data.price == '') {
    priceEl.textContent = 'от ' + data.price + ' ₽';
  } else {
    priceEl.textContent = '';
  }
  categoryEl.textContent = data.kitchen;
}

function openGoods(event) {
  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {

      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      getData(`./db/${restaurant.dataset.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
      getData(`./db/partners.json`).then(function (data) {
        data.forEach((item) => {
          if (item.name == restaurant.dataset.restName)
            createDescRest(item);
        });
      });

    }
  } else {
    toggleModalAuth();
  }

}

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id: id,
        title: title,
        cost: cost,
        count: 1
      });
    }

    console.log(cart);
  }
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function ({ id, title, cost, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost}</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id="${id}">-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id="${id}">+</button>
      </div>
    </div>
  <!-- /.foods-row -->
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';

}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-minus')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id
    });
    food.count--;

    if (food.count === 0) {
      cart.splice(cart.indexOf(food), 1);
    }

    renderCart();
  }

  if (target.classList.contains('counter-plus')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id
    });

    food.count++;
    renderCart();
  }

}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });

  checkAuth();

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
  });

  modalBody.addEventListener('click', changeCount);

  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide')
  });

  inputSearsh.addEventListener('keypress', function (event) {


    if (event.charCode === 13) {
      const value = event.target.value.trim();

      if (!value) {
        event.target.value = '';
        event.target.style.backgroundColor = 'tomato';
        setTimeout(function () {
          event.target.style.backgroundColor = '';
        }, 1500);
        return;
      }

      getData('./db/partners.json')
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = '';
          linksProduct.forEach(function (link) {
            getData(`./db/${link}`)
              .then(function (data) {

                const resultSearch = data.filter(function (item) {
                  const name = item.name.toLowerCase();
                  return name.includes(value.toLowerCase());
                });

                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');
                createDescRest({
                  name: 'Результаты поиска',
                  price: ''
                });

                resultSearch.forEach(createCardGood);
              });
          });

        });
    }

  });

  // SLIDER
  new Swiper('.swiper-container', {
    slidesPerView: 1,
    loop: true,
    autoplay: true,
    grabCursor: true,
    effect: 'cube',
    cubeEffect: {
      shadow: false
    }
  });
}

init();



