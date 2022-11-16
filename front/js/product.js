// RECUPERATION DE L'ID DU PRODUIT

const urlId = window.location.search ;

const urlIdSearch = new URLSearchParams (urlId);

const id = urlIdSearch.get("id");
// console.log(id)


// APPEL DE L'API POUR RECUPERE L'ENSEMBLE DES INFOS DU PRODUIT
const getProduct = async function () {
    const fetchApi = await fetch(`http://localhost:3000/api/products/${id}`)
    const product = await fetchApi.json()
    return product;
}

// recuperation du produit 
const product = await getProduct()
console.log(product)


// =============================================================================
// =============================================================================
// INTEGRATION DES INFORMATIONS DU PRODUIT


function displayProductInfos (){
    
    //*H1*
    const titleH1 = document.getElementById('title')
    titleH1.innerHTML = product.name
    // console.log(titleH1)

    //*P*
    const descriptionP = document.getElementById('description')
    descriptionP.innerHTML = product.description
    // console.log(descriptionP)

    //*IMG*
    const imageContainer = document.querySelector('.item__img')
    const image = document.createElement('img')
    image.src = product.imageUrl
    image.alt = product.altTxt
    imageContainer.appendChild(image)

    // console.log(image)

    // PRICE
    const priceContainer = document.getElementById('price')
    const priceProduct = document.createElement('price')
    priceProduct.innerHTML = product.price
    priceContainer.appendChild(priceProduct)

    product.colors.forEach(color =>{
        const colorOption = document.createElement('option')
        colorOption.value = color
        colorOption.innerHTML = color
        const colorContainer = document.querySelector('select')
        colorContainer.appendChild(colorOption)
    })
}

displayProductInfos()

