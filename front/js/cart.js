

// recuperation des infos du panier dans le localStorage
let localStorageProduct = JSON.parse(localStorage.getItem("produit"))
let totalQuantity = 0
let totalPrice = 0  
let arrayDelete = []

// Boucle qui affiche les produit tant qu'il y en a dans le LS 

for(let i = 0 ; i < localStorageProduct.length ; i++){
    // console.log(localStorageProduct[i])
    let couleur = localStorageProduct[i].color;
    let quantité = localStorageProduct[i].quantity;
    //console.log(quantité)
    
    // APPEL DE L'API POUR RECUPERE L'ENSEMBLE DES INFOS DES PRODUITS 
    fetch(`http://localhost:3000/api/products/${localStorageProduct[i].id}`)
        .then((result) => result.json())
        .then((data) => {
            
            creationArticleCart(data)
            
        })
        
    function creationArticleCart(data){
        // console.log(data)

        // création de l'article et de ses enfants 
        const createArticleCart = document.createElement("article")
        const cart__item__img = document.createElement("div")
        const imgProductCart = document.createElement("img")
        const cart__item__content = document.createElement("div")
        const cart__item__content__description = document.createElement("div")
        const h2Cart = document.createElement("h2")
        const colorOfProduct = document.createElement("p")
        const priceOfProduct = document.createElement("p")
        const cart__item__content__settings = document.createElement("div")
        const cart__item__content__settings__quantity = document.createElement("div")
        const quantityProduct = document.createElement("p")
        const itemQuantity = document.createElement("input")
        const cart__item__content__settings__delete = document.createElement("div")
        const deleteItem = document.createElement("p")

        // Integration de l'article et de ses enfant dans le html
        document.getElementById("cart__items").appendChild(createArticleCart)
        createArticleCart.insertAdjacentElement("afterbegin",cart__item__img)
        cart__item__img.insertAdjacentElement("afterbegin",imgProductCart)
        cart__item__img.insertAdjacentElement("afterend",cart__item__content)
        cart__item__content.insertAdjacentElement("afterbegin",cart__item__content__description)
        cart__item__content__description.insertAdjacentElement("afterbegin", h2Cart)
        h2Cart.insertAdjacentElement("afterend", colorOfProduct)
        colorOfProduct.insertAdjacentElement("afterend",priceOfProduct)
        cart__item__content__description.insertAdjacentElement("afterend",cart__item__content__settings)
        cart__item__content__settings.insertAdjacentElement("afterbegin",cart__item__content__settings__quantity)
        cart__item__content__settings__quantity.insertAdjacentElement("afterbegin",quantityProduct)
        quantityProduct.insertAdjacentElement("afterend",itemQuantity )
        cart__item__content__settings__quantity.insertAdjacentElement("afterend",cart__item__content__settings__delete)
        cart__item__content__settings__delete.insertAdjacentElement("afterbegin",deleteItem)

        // Integration des information pour chaque element crée

        // Article
        createArticleCart.className = "cart__item"
        createArticleCart.dataset.id = data._id
        createArticleCart.dataset.color = couleur
        // console.log(createArticleCart)
        // Div cart__item__img
        cart__item__img.className = "cart__item__img"

        // Image
        imgProductCart.src = data.imageUrl
        imgProductCart.alt = data.altTxt

        // Div cart__item__content
        cart__item__content.className ="cart__item__content"

        // Div cart__item__content__description
        cart__item__content__description.className = "cart__item__content__description"

        //H2 nom du produit
        h2Cart.textContent = data.name

        // P couleur du produit
        colorOfProduct.textContent = "Couleur: " + couleur

        // P prix du produit
        priceOfProduct.textContent ="Prix: " + data.price * quantité + "€"
        let productPrice = data.price * quantité 
        totalPrice = totalPrice + productPrice
       
        // Div cart__item__content__settings
        cart__item__content__settings.className ="cart__item__content__settings"

        // Div cart__item__content__settings__quantity
        cart__item__content__settings__quantity.className ="cart__item__content__settings__quantity"
                        
        // P de la quantité de produit
        quantityProduct.textContent = "Quantité :"

        // Input ItemQuantity
        itemQuantity.type ="number"
        itemQuantity.className ="itemQuantity"
        itemQuantity.name = "itemQuantity"
        itemQuantity.min = 1
        itemQuantity.max = 100
        itemQuantity.value = quantité
        // itemQuantity.readOnly = true

        itemQuantity.addEventListener('change' , (e) => {
            
            if(localStorageProduct[i].quantity < itemQuantity.value ){
                localStorageProduct[i].quantity ++
                console.log(localStorageProduct[i].quantity)
                localStorage.setItem("produit", JSON.stringify(localStorageProduct))
                location.reload();
            
            }else{
                
                localStorageProduct[i].quantity --
                console.log(localStorageProduct[i].quantity)
                localStorage.setItem("produit", JSON.stringify(localStorageProduct))
                location.reload();
            }

        })
        // console.log(quantité)
        // Div cart__item__content__settings__delete
        cart__item__content__settings__delete.className = "cart__item__content__settings__delete"

        

      // Prix total du panier 
        const priceTotalElement = document.querySelector("#totalPrice")
        priceTotalElement.textContent = totalPrice

        // quantité total de produit dans le panier 
        const quantityTotalElement = document.querySelector("#totalQuantity")
        totalQuantity = totalQuantity + quantité
        quantityTotalElement.textContent = totalQuantity

     
        // Suppression d'un produit depuis la page panier
        deleteItem.className = "deleteItem"
        deleteItem.textContent="Supprimer"
        arrayDelete.push(localStorageProduct[i].quantity)
        // console.log(arrayDelete)

        deleteItem.addEventListener('click', (e) => {
            //recuperation de l'id et la couleur de l'article selectionne et le met dans un tableau
            const arrayProductSuppInfo = []
            const productSuppInfo = createArticleCart.dataset
            arrayProductSuppInfo.push(productSuppInfo.id , productSuppInfo.color)
            
            // recuperation de l'id et la couleur du produit séléctionné dans le LS et le met dans un tableau  
            const arrayProductSelect = []
            const productSelect = localStorageProduct[i]
            arrayProductSelect.push(productSelect.id , productSelect.color)
            
            // Si l'id et la couleur de l'article séléctionné est le meme que celui du LS alors tu supprime se produit
            if(arrayProductSuppInfo && arrayProductSelect){
                const productSupp =  localStorageProduct.filter(el => (el.id + el.color) !== (productSuppInfo.id + productSuppInfo.color))
                localStorage.setItem("produit", JSON.stringify(productSupp))
                location.reload();
                
                console.log(productSupp)
            
            }
        })
    }    
}

// recuperation du formulaire 
const form = document.querySelector('.cart__order__form')

const ButtonCommand = document.querySelector("#order")
ButtonCommand.addEventListener('click', (e) => {
    e.preventDefault()
// creation regexp pour n'avoir que des lettres au niveau de l'input prénom 
    function firstNameCheck(){
    // recuperation de l'element qui affichera le commentaire si la saisie est correct ou non , puis creation de la Regexp
    const firstNameMsg = document.querySelector('#firstNameErrorMsg')
    const firstNameRegExp = new RegExp(
        /^[A-Za-zéèàùûêâôë-]+[a-zéèàùûêâôë-]$/
    )
    // recuperation de la valeur saisie par l'utilisateur sur l'input firstName
    const testRegFirstName = firstNameRegExp.test(firstName.value)
    // console.log(testRegFirstName)
    // si valeur retourne est vrai afficher que la saisie est correct sinon indique une mauvaise saisie 
    if(testRegFirstName){
        firstNameMsg.textContent = 'Saisie Correct'
        firstName.style.backgroundColor = "green"
        return true
    }else{
        firstNameMsg.textContent = 'Mauvaise Saisie'
        firstName.style.backgroundColor = "red"
        return false
    }
    
}
    firstNameCheck();
// ecoute au changement de l'input prenom avec l'appel de la fonction firstNameInput

// console.log(firstName)

// creation regexp pour n'avoir que des lettres dans l'input LastName
    function lastNameCheck(){
        const lastNameMsg = document.querySelector('#lastNameErrorMsg')
        const lastNameRegExp = new RegExp(
            /^[A-Za-zéèàùûêâôë-]+[a-zéèàùûêâôë-]$/
        )
        // recuperation de la valeur saisie par l'utilisateur 
        const testRegLastName = lastNameRegExp.test(lastName.value)
        // console.log(testRegLastName)
        // si valeur retourne est vrai afficher que la saisie est correct sinon indique une mauvaise saisie 
        if(testRegLastName){
            lastNameMsg.textContent = 'Saisie Correct'
            lastName.style.backgroundColor = "green"
            return true
        }else{
            lastNameMsg.textContent = 'Mauvaise Saisie'
            lastName.style.backgroundColor = "red"
            return false
        }
    
    }
    lastNameCheck()
    // creation regexp pour L'adresse
    function addressCheck(){
        const addressMsg = document.querySelector('#addressErrorMsg')
        const addressRegExp = new RegExp(
            /^[\d]+([A-Za-z]|[\s]+[A-Za-z])+[A-Za-zéèàùûêâôë]/
        )
        const testRegAddress = addressRegExp.test(address.value)
        // console.log(testRegAddress)
    
        if(testRegAddress){
            addressMsg.textContent = 'Saisie Correct'
            address.style.backgroundColor = "green"
            return true
        }else{
            addressMsg.textContent = 'Mauvaise Saisie'
            address.style.backgroundColor = "red"
            return false
        }
    }
    addressCheck()
    // creation Regexp pour l'input ville 
    function cityCheck(){
        const cityMsg = document.querySelector('#cityErrorMsg')
        const cityRegExp = new RegExp(
            /^[A-Za-zéèàùûêâôë]+[a-zéèàùûêâôë]/
        )
        const testRegcity = cityRegExp.test(city.value)
        // console.log(testRegcity)

        if(testRegcity){
            cityMsg.textContent = 'Saisie Correct'
            city.style.backgroundColor = "green"
        return true
        }else{
            cityMsg.textContent = 'Mauvaise Saisie'
            city.style.backgroundColor = "red"
            return false
        }
    
    }
    cityCheck()

    // creation de regExp pour l'input Email
    function emailCheck(){
        const emailMsg = document.querySelector('#emailErrorMsg')
        const emailRegExp = new RegExp(
            /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        )
        const testRegEmail = emailRegExp.test(email.value)
        // console.log(testRegEmail)
        
        if(testRegEmail){
            emailMsg.textContent = 'Saisie Correct'
            email.style.backgroundColor = "green"
            return true
        }else{
            emailMsg.textContent = 'Mauvaise Saisie'
            email.style.backgroundColor = "red"
            return false
        }
        
    }
    emailCheck()
    
    // information saisie par l'utilisateur
    const infoUser = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    }
    // console.log(infoUser)

    let arrayProducts = []
    for(let i = 0; i < localStorageProduct.length ; i++){
        arrayProducts.push(localStorageProduct[i].id)
        
    }
    console.log(arrayProducts)
    
    // variable qui regroupe les informations utilisateur et les produits du LS 
    const infoGlobal = {
    products: arrayProducts,
    contact:infoUser,
    };
   
    console.log(infoGlobal)
    
if(firstNameCheck() && lastNameCheck() && addressCheck() && cityCheck() && emailCheck()){
   
    fetch(`http://localhost:3000/api/products/order`,
    {
        
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(infoGlobal)
    })
    .then((result) => result.json())
    .then((data) =>{
        window.location.href = `confirmation.html?id=${data.orderId}`
        console.log(data)
    })
}
    
})




















// // creation regexp pour n'avoir que des lettres au niveau de l'input prénom 
// function firstNameCheck(){
//     // recuperation de l'element qui affichera le commentaire si la saisie est correct ou non , puis creation de la Regexp
//     const firstNameMsg = document.querySelector('#firstNameErrorMsg')
//     const firstNameRegExp = new RegExp(
//         /^[A-Za-zéèàùûêâôë-]+[a-zéèàùûêâôë-]$/
//     )
//     // recuperation de la valeur saisie par l'utilisateur sur l'input firstName
//     const testRegFirstName = firstNameRegExp.test(firstName.value)
//     // console.log(testRegFirstName)
//     // si valeur retourne est vrai afficher que la saisie est correct sinon indique une mauvaise saisie 
//     if(testRegFirstName){
//         firstNameMsg.textContent = 'Saisie Correct'
//         firstName.style.backgroundColor = "green"
//         return true
//     }else{
//         firstNameMsg.textContent = 'Mauvaise Saisie'
//         firstName.style.backgroundColor = "red"
//         return false
//     }
    
// }
// // ecoute au changement de l'input prenom avec l'appel de la fonction firstNameInput
// const firstName = form.firstName
// firstName.addEventListener('change', (e) => {
//    firstNameCheck()
  
// })
// // console.log(firstName)


// // creation regexp pour n'avoir que des lettres dans l'input LastName
// function lastNameCheck(){
//     const lastNameMsg = document.querySelector('#lastNameErrorMsg')
//     const lastNameRegExp = new RegExp(
//         /^[A-Za-zéèàùûêâôë-]+[a-zéèàùûêâôë-]$/
//     )
//     // recuperation de la valeur saisie par l'utilisateur 
//     const testRegLastName = lastNameRegExp.test(lastName.value)
//     console.log(testRegLastName)
//     // si valeur retourne est vrai afficher que la saisie est correct sinon indique une mauvaise saisie 
//     if(testRegLastName){
//         lastNameMsg.textContent = 'Saisie Correct'
//         lastName.style.backgroundColor = "green"
//         return true
//     }else{
//         lastNameMsg.textContent = 'Mauvaise Saisie'
//         lastName.style.backgroundColor = "red"
//         return false
//     }
   
// }
// // Selection de l'input
// const lastName = form.lastName
// // au changement de valeur de l'input LastName,  appel de la fonction lastNameInput
// lastName.addEventListener('change', (e) => {
//     lastNameCheck()
//     // const valueLastName = lastName.value
   
// })


// // creation de regExp pour l'input adresse
// function addressCheck(){
//     const addressMsg = document.querySelector('#addressErrorMsg')
//     const addressRegExp = new RegExp(
//         /^[\d]+([A-Za-z]|[\s]+[A-Za-z])+[A-Za-zéèàùûêâôë]/
//     )
//     const testRegAddress = addressRegExp.test(address.value)
//     // console.log(testRegAddress)

//     if(testRegAddress){
//         addressMsg.textContent = 'Saisie Correct'
//         address.style.backgroundColor = "green"
//         return true
//     }else{
//         addressMsg.textContent = 'Mauvaise Saisie'
//         address.style.backgroundColor = "red"
//         return false
//     }
// }
// // ecoute au changement de l'input adresse
// const address = form.address
// address.addEventListener('change' , (e) => {
//     addressCheck()
// })


// // creation Regexp pour l'input ville 
// function cityCheck(){
//     const cityMsg = document.querySelector('#cityErrorMsg')
//     const cityRegExp = new RegExp(
//         /^[A-Za-zéèàùûêâôë]+[a-zéèàùûêâôë]/
//     )
//     const testRegcity = cityRegExp.test(city.value)
//     // console.log(testRegcity)

//     if(testRegcity){
//         cityMsg.textContent = 'Saisie Correct'
//         city.style.backgroundColor = "green"
//        return true
//     }else{
//         cityMsg.textContent = 'Mauvaise Saisie'
//         city.style.backgroundColor = "red"
//         return false
//     }
   
// }
// // ecoute au changement de l'input city
// const city = form.city
// city.addEventListener('change' , (e) => {
//     cityCheck()
// })

// // creation de regExp pour l'input Email
// function emailCheck(){
//     const emailMsg = document.querySelector('#emailErrorMsg')
//     const emailRegExp = new RegExp(
//         /^([A-Za-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
//     )
//     const testRegEmail = emailRegExp.test(email.value)
//     console.log(testRegEmail)
    
//     if(testRegEmail){
//         emailMsg.textContent = 'Saisie Correct'
//         email.style.backgroundColor = "green"
//         return true
//     }else{
//         emailMsg.textContent = 'Mauvaise Saisie'
//         email.style.backgroundColor = "red"
//         return false
//     }
    
// }
// // ecoute au changement de l'input email
// const email = form.email
// email.addEventListener('change' , (e) => {
//     emailCheck()
    
// })


// // recuperation de l'élément bouton pour commander 
// const ButtonCommand = document.querySelector("#order")
// ButtonCommand.addEventListener('click', (e) => {
//     // e.preventDefault();
//     // information saisie par l'utilisateur
//     const contact = {
//         firstName: firstName.value,
//         lastName: lastName.value,
//         address: address.value,
//         city: city.value,
//         email: email.value,
//     }
//     console.log(contact)
//     // if(firstNameCheck() && lastNameCheck() && addressCheck() && cityCheck() && emailCheck()){
//     // form.submit()
//     // }
//     // creation d'un tableau où on push dedans les produits présent dans le LS
//     const products = []
//     for(let i = 0; i < localStorageProduct.length ; i++){
//         products.push(localStorageProduct[i])
//     }
//     console.log(arrayProduct)
    
//     // variable qui regroupe les informations utilisateur et les produits du LS 
//     const infoGlobal = {
//     arrayProduct , contact
//     }
   
//     console.log(infoGlobal)

// // fetch("http://localhost:3000/api/products/order",
// // {
    
// //     headers: {
// //       Accept: 'application/json',
// //       'Content-Type': 'application/json'
// //     },
// //     method: "POST",
// //     body: JSON.stringify(infoGlobal)
// // })
// // .then((result) => result.json())
// // .then((data) =>{
// //     window.location.href = `confirmation.html?=${data.orderId}`
// // console.log(data)
// // })

// fetch("http://localhost:3000/api/products/order",{
//     method: "POST",
//     body: JSON.stringify(infoGlobal),
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
   
// })
// .then((result) => result.json())
// // .then((data) =>{
// //     window.location.href = `confirmation.html?=${data.orderId}`
// // console.log(data)
// // })
// })
