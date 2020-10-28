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
  cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery') || '';

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
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

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


function createCardRestaurant() {
  const card = `
  <a class="card card-restaurant">
    <img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">Тануки</h3>
        <span class="card-tag tag">60 мин</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          4.5
        </div>
        <div class="price">От 1 200 ₽</div>
        <div class="category">Суши, роллы</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  </a>
<!-- /.card -->
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood() {
  const card = document.createElement('div');
  card.classList.add('card');
  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Везувий</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
          «Халапенье», соус «Тобаско», томаты.
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">545 ₽</strong>
      </div>
    </div>
    <!-- /.card-text -->
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
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

      createCardGood();
      createCardGood();
      createCardGood();
    }
  } else {
    toggleModalAuth();
  }

}

checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide')
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

