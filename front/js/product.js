// RECUPERATION DE L'ID DU PRODUIT

const urlId = window.location.search ;
const urlIdSearch = new URLSearchParams (urlId);
const productId = urlIdSearch.get("id");

// APPEL DE L'API POUR RECUPERE L'ENSEMBLE DES INFOS DU PRODUIT
const getProduct = async function () {
    const fetchApi = await fetch(`http://localhost:3000/api/products/${productId}`)
    const product = await fetchApi.json()
    return product;
}

// recuperation du produit 
const product = await getProduct()

// console.log(productId)

// INTEGRATION DES INFORMATIONS DU PRODUIT
function displayProductInfos (){
    //*H1*
    const titleH1 = document.getElementById('title')
    titleH1.innerHTML = product.name
    
    //*P*
    const descriptionP = document.getElementById('description')
    descriptionP.innerHTML = product.description
   
    //*IMG*
    const imageContainer = document.querySelector('.item__img')
    const image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    imageContainer.appendChild(image)

    // PRICE
    const priceContainer = document.getElementById('price')
    const priceProduct = document.createElement('price')
    priceProduct.innerHTML = product.price
    priceContainer.appendChild(priceProduct)

    //COULEUR 
    product.colors.forEach(color =>{
    const colorOption = document.createElement('option')
    colorOption.value = color
    colorOption.innerHTML = color
    const colorContainer = document.querySelector('select')
    colorContainer.appendChild(colorOption)
    })
}

displayProductInfos()

// Recuperation des inputs (couleur et quantité)
const inputColor = document.getElementById("colors")
const inputQuantity = document.getElementById("quantity")


// Recuperation de l'élément et creation du message d'erreur pour la couleur
const messageErrorColorContainer = document.querySelector('.item__content__settings__color')
const messageErrorColor = document.createElement('div')

// Fonction pour verifier si une couleur a été séléctionée
function verifyColor(productChoice){
   if(productChoice.color != ""){
        messageErrorColor.remove();
        return true
    }else{
        messageErrorColor.textContent = 'veuillez choisir une couleur'
        messageErrorColor.id = "message"
        messageErrorColorContainer.appendChild(messageErrorColor)
        return false
    }
}

// Recuperation de l'élément et creation du message d'erreur pour la quantité
const messageErrorQuantityContainer = document.querySelector('.item__content__settings__quantity')
const messageErrorQuantity = document.createElement('div')

// Fonction pour verifier si un quantité entre 1 et 100 a été séléctionée
function verifyQuantity(productChoice){
    if(productChoice.quantity <= 0 || productChoice.quantity > 100){
        messageErrorQuantity.textContent ='Veuillez choisir une quantité entre 1 et 100'
        messageErrorQuantity.id = "messageQuantity"
        messageErrorQuantityContainer.appendChild(messageErrorQuantity)
        inputQuantity.value = 0
        return false
    }
        messageErrorQuantity.remove()
        return true
}
// fonction de verification avant ajout au panier 

function checkBeforeAddToCart (){
    // Choix de l'utilisateur
    const productChoice = {
        id:productId,
        quantity: parseInt(inputQuantity.value,10),
        color: inputColor.value,
    }
   
     // variable contenant les fonctions de verification de couleur et de quantité
    const resultColor = verifyColor(productChoice)
    const resultQuantity = verifyQuantity(productChoice)
    // Si la verification couleur et quantité est bonne alors on retourne le choix de l'utilisateur
    if(resultColor && resultQuantity){
        console.log(productChoice)
        return productChoice
    }else{
        return 
    }
    
}

// Fonction pour ajouter au panier
function getCart(productChoice){
    // Recuperation du panier dans le localStorage || cree un tableau vide
    let localStorageProduct = JSON.parse(localStorage.getItem("produit")) || []

    // verification de la présence d'un doublon dans le panier
    const productFound = localStorageProduct.find(item => 
    productChoice.id == item.id && 
    productChoice.color == item.color
    )
    
    // Condition si aucun produit trouvé alors push le choix de l'utilisateur
    if(!localStorageProduct.length || !productFound){
        localStorageProduct.push(productChoice)
        localStorage.setItem("produit", JSON.stringify(localStorageProduct))
       
     // sinon incrementé la quantité au produit deja present dans le LS
    }else{
        productFound.quantity += productChoice.quantity
        if(productFound.quantity > 100){
            alert("Quantité limite dépassée")
        }else{

        
        localStorage.setItem("produit", JSON.stringify(localStorageProduct))
        alert("Votre panier à été mis a jour")
        }
    }
}

// // Selection du Bouton dans le html
const bouton = document.querySelector('#addToCart')
// // Ecoute sur le bouton panier
bouton.addEventListener("click",(e) => {
    // variable qui appel la fonction checkBeforeAddToCart
    const userChoice = checkBeforeAddToCart ()
    // Si couleur et quantité correct renvoie true sinon renvoie false
    if(userChoice !== undefined){
        getCart(userChoice)
    }else{
        return false
    }
})
