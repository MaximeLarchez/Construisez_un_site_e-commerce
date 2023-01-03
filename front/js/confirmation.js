// recuperation du OrderId dans l'url
const queryString_url_orderId = window.location.search;
// console.log(queryString_url_orderId)

// Extraire l'OrderId
const orderIdSearch = new URLSearchParams(queryString_url_orderId);
// console.log(orderIdSearch)
const orderId = orderIdSearch.get("orderid")
// console.log(orderId)

// Affichage du numéro de commande 
const orderIdSelector = document.querySelector('#orderId')
orderIdSelector.textContent = orderId
alert('Nous vous remercions de votre commande')







