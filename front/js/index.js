// Selection du conteneur d'article
const articleContainer = document.getElementById("items");

// Recuperation des produits de l'API
const getProducts = async function () {
    const fetchApi = await fetch("http://localhost:3000/api/products")
    const products = await fetchApi.json()
    return products   
}
getProducts()
// console.log(getProducts)

// Produit de l'API
const products = await getProducts()

// creation des elements a integrer
function creationArticle(product) {
    const createA = document.createElement('a')
    const createArticle = document.createElement('article')
    const createImg = document.createElement('img')
    const createH3 = document.createElement('h3')
    const createP = document.createElement('p')

    // integration des elements dans le html
    document.getElementById('items').appendChild(createA)
    createA.insertAdjacentElement('afterbegin',createArticle)
    createArticle.insertAdjacentElement('afterbegin', createImg)
    createImg.insertAdjacentElement('afterend',createH3)
    createH3.insertAdjacentElement('afterend', createP)
    // console.log(createA)

    // integration des infos dans le html sur les element creer
    createH3.textContent = product.name;
    createP.textContent = product.description;
    createImg.src = product.imageUrl;
    createImg.alt = product.altTxt;
    createA.href =`./product.html?id=${product._id}`
    // console.log(createA)
}

// creation boucle = pour chaque produit , crée un article
products.forEach(product => {
    creationArticle(product) 
});















