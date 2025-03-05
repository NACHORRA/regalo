//uso las func de selectors para agarrar las cosas con esas id. ahora digamos las modifico con el java. Con body hago lo mismo pero conn document
let cart=[];
const body = document.body
const _items = select('#_items')
const _toggle = select('#_toggle')


//activo, desactivo menu
import carta from './data.js'
const toggleMenu= () =>{
    console.log("se ha abierto/cerrado el menu")
    _items.classList.toggle("open")
    _toggle.classList.toggle("close")
}

_toggle.addEventListener('click', toggleMenu)

const content = document.getElementById("list");
const salames = document.getElementById("salames")
const jamones = document.getElementById("jamones")
const quesos = document.getElementById("quesos")
const todos = document.getElementById("todos");


const products =(filteredproducts) =>{
    content.innerHTML=""
    filteredproducts.forEach((producto)=>{
        const productcard=document.createElement ("div");
        productcard.className = "card-products";
        productcard.dataset.id = producto.id;
        productcard.innerHTML= `
        <img src="${producto.cardimg}" alt="${producto.name}">
        <h3>${producto.name}</h3>
        <button class="addCart">Añadir al carrito</button>
      `;
        content.append(productcard) ;
        ;
      });
};

products(carta)

const filtro = (category) => {
  const filteredproducts = carta.filter(product =>product.category ===category)
  products(filteredproducts)

};

let lastCategory = null;

const setupFilter = (button, category) => {
  button.addEventListener('click', () => {
    console.log("se ha activado/ desactivado algun filtro")
    if (lastCategory === category) {
      products(carta);
      lastCategory = null; 
    } 
    else {
      if (category === 'todos') {
          products(carta); 
      } else {
          filtro(category);
      }
      lastCategory = category; 
  }
  });
}


setupFilter(todos, 'todos');
setupFilter(quesos, 'quesos');
setupFilter(salames, 'salames');
setupFilter(jamones, 'jamones');

const btnCart = select('#btn-cart')
const closeBtn = select('.close')
let listProduct = select('.listProduct');

const open =  () => {
  body.classList.toggle('showCart');
  console.log("se ha abierto el cart")
}
const closeCart =() => {
  body.classList.toggle('showCart');
  console.log("se ha cerrado el cart")
}

btnCart.addEventListener('click', open)
closeBtn.addEventListener('click', closeCart)

content.addEventListener('click', (event) => {
  let positionClick = event.target;
  if(positionClick.classList.contains('addCart')){
      let id_product = positionClick.parentElement.dataset.id;
      console.log('Producto añadido con ID:', id_product);
      addToCart(id_product);
  }
});

const addToCart = (product_id) => {
  let position = cart.findIndex((value) => value.product_id == product_id);
  if(cart.length <= 0){
      cart = [{
          product_id: product_id,
          quantity: 1
      }];
  }else if(position < 0){
      cart.push({
          product_id: product_id,
          quantity: 1
      });
  }else{
      cart[position].quantity = cart[position].quantity + 1;
  }
  addCartToHTML();
  addCartToMemory();
}

const addCartToMemory = () => {
  localStorage.setItem('cart', JSON.stringify(cart));
}

const loadCartFromMemory = () => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    addCartToHTML();
  }
}

document.addEventListener('DOMContentLoaded', loadCartFromMemory);

const addCartToHTML = () => {
  listProduct.innerHTML = '';
  let totalQuantity = 0;
  let totalPrice = 0;
  if (cart.length > 0) {
    cart.forEach(item => {
      totalQuantity += item.quantity;
      let newItem = document.createElement('div');
      newItem.classList.add('card'); 
      newItem.dataset.id = item.product_id;
      let positionProduct = carta.findIndex(value => value.id == item.product_id);
      let info = carta[positionProduct];

      if (info) {
        totalPrice += info.precio * item.quantity;
        newItem.innerHTML = `
          <img src="${info.cardimg}" alt="${info.name}">
          <div class="details">
            <h3>${info.name}</h3>
            <div class="quantity">
              <span class="minus"><</span>
              <span>${item.quantity}</span>
              <span class="plus">></span>
            </div>
          </div>
        `;
        listProduct.appendChild(newItem);
        console.log("un producto ha sido añadido al carrito")
      }
    });
    let total = document.createElement('div');
    total.classList.add('total-price');
    
    listProduct.appendChild(total);


    // Detectar clics en los botones de aumentar y reducir cantidad
    document.querySelectorAll('.plus').forEach(button => {
      button.addEventListener('click', (event) => {
        console.log("se han añadido productos")
        let product_id = event.target.parentElement.parentElement.parentElement.dataset.id;
        changeQuantityCart(product_id, 'plus');
      });
    });

    document.querySelectorAll('.minus').forEach(button => {
      button.addEventListener('click', (event) => {
        console.log("se han reducido el numero productos")
        let product_id = event.target.parentElement.parentElement.parentElement.dataset.id;
        changeQuantityCart(product_id, 'minus');
      });
    });
  }
}

const changeQuantityCart = (product_id, type) => {
  let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
  if (positionItemInCart >= 0) {
    let info = cart[positionItemInCart];
    switch (type) {
      case 'plus':
        cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
        break;
      case 'minus':
        let changeQuantity = cart[positionItemInCart].quantity - 1;
        if (changeQuantity > 0) {
          cart[positionItemInCart].quantity = changeQuantity;
        } else {
          console.log("se ha eliminado un producto")
          cart.splice(positionItemInCart, 1); 
        }
        break;
    }
  }
  addCartToHTML(); // Volver a renderizar el carrito después de cambiar la cantidad
  addCartToMemory(); // Actualizar el almacenamiento
}
