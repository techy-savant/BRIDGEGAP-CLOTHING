const modals = document.querySelectorAll('.modal-box')
const modalContainer = document.querySelector('.modal-container')
const productInfoForm = document.getElementById('product-info-form')

const backToProduct = document.getElementById('back-to-product')
const createInputs = document.querySelector('.create-inputs')
const confirmUpload = document.querySelector('.bottom-content')

const previewImage = document.querySelector('.preview-image')
const previewPrice = document.querySelector('.preview-price')
const previewCategory = document.querySelector('.preview-category')
const previewSubCategory = document.querySelector('.preview-sub-category')
const previewTitle = document.querySelector('.preview-title')
const previewDescription = document.querySelector('.preview-description')

const createCategoryForm = document.getElementById('create-category-form')
const createSubCatForm = document.getElementById('create-sub-cat-form')

const alertActionMessage = document.querySelector('.action-message')

const categorySelect = document.getElementById('category-select')
const prodCategorySelect = document.getElementById('prod-category-select')

const prodSubCategorySelect=  document.getElementById('prod-sub-category-select')

const uploadProductBtn = document.getElementById('upload-product-btn')

const productContainer = document.getElementById('product-container')

txtUsername = document.getElementById('txt-username')
let formData;

const domain = 'http://localhost:8000/'

let categoryList = []

const authToken = localStorage.getItem('auth-token')

class SubCategoryClass{
    constructor(category, sub_category_title){
        this.category = category
        this.sub_category_title = sub_category_title
    }
}

let subCategoryList =[]

class Product{
    constructor(category, price, product_description, product_image, product_title, product_url, sub_category, category_title, sub_category_title){
        this.category = category
        this.price= price
        this.product_description = product_description
        this.product_image =product_image
        this.product_title = product_title
        this.product_url =product_url
        this.sub_category = sub_category
        this.category_title = category_title
        this.sub_category_title = sub_category_title
    }
}

let productList = []


backToProduct.addEventListener('click', function(){  
    createInputs.style.display = 'block'
    confirmUpload.style.display = 'none'
    backToProduct.style.display = 'none'
})

document.addEventListener('DOMContentLoaded', function(){
    console.log('content loaded')
    
    //===FETCH THE CURRENT USER
    const getuserendpoint = domain + 'api/getcurrentuser/'
    let user;
    let myToken = localStorage.getItem('auth-token')
    fetch(getuserendpoint, {
        method: 'POST',
        headers: {
            Authorization: `Token ${myToken}`
        }
    })
    .then(response =>{
        if(!response.ok){
            console.log('error getting current user')
        }
        return response.json()
    })
    .then(data =>{
       txtUsername.textContent = data.user.username
    })
    //== END FETCH THE CURRENT USER


    //==== populating the category list
    let endpoint = domain + '/api/list-categories/'
    fetch(endpoint, {
        method: 'GET',

    })
    .then(response => {
        if(!response.ok){
            console.log('error loading categories')
        }
        return response.json()
    })
    .then(data => {
        data.forEach(function(item){
            categoryList.push(item.category_title)

            // const optionElement = document.createElement('option')
            // optionElement.value = item.category_title
        })

        populateCategorySelect(categoryList)
    })
    .catch(error => {
        console.error('Fetch error: ', error)
    })
    //end populating cateogory list


    //populating sub category list
    subCategoryEndpoint = domain+ '/api/list-sub-categories/'
    fetch(subCategoryEndpoint, {
        method: 'GET'
    })
    .then(response =>{
        if(!response.ok){
            console.log('error fetching sub categories')
        }
        return response.json()
    }).then(data =>{
        data.forEach(function(dataItem){
            let subCategory = new SubCategoryClass(dataItem.category, dataItem.sub_category_title)
            subCategoryList.push(subCategory)
        })
        populateSubCategorySelect(subCategoryList)
    
    }).catch(error =>{
        console.error('Fetch error: ', error)
    })
    //end populating sub category list

    //populating product list
    productListEndpoint = domain + '/api/list-products/'
    fetch(productListEndpoint, {
        method: 'GET'
    })
    .then(response =>{
        if(!response.ok){
            console.log('error fetching products')
        }
        return response.json()
    })
    .then(data => {
        data.forEach(function(item){
            let product = new Product(item.category, item.price,
                item.product_description, item.product_image, item.product_title, item.product_url, item.sub_category,
                item.category_title, item.sub_category_title)
            productList.push(product)
        })

        populateProductCards(productList)
    })
    .catch(error => {
        console.error('Fetch product error: ', error)
    })


  

})

function populateCategorySelect(optionList){
    while (categorySelect.firstChild) {
        categorySelect.removeChild(categorySelect.firstChild)
    }
    while(prodCategorySelect.firstChild){
        prodCategorySelect.removeChild(prodCategorySelect.firstChild)
    }
    
    
    optionList.forEach(function(optionItem){
        let optionElement = document.createElement('option')
        optionElement.text = optionItem
        optionElement.value = optionItem
        categorySelect.appendChild(optionElement)

        let prodCategoryOptionElement = document.createElement('option')
        prodCategoryOptionElement.text = optionItem
        prodCategoryOptionElement.value = optionItem
        prodCategorySelect.appendChild(prodCategoryOptionElement)

    })

}

function populateSubCategorySelect(optionList){
    
    while(prodSubCategorySelect.firstChild){
        prodSubCategorySelect.removeChild(prodSubCategorySelect.firstChild)
    }

    optionList.forEach(function(optionItem){
        let opl = document.createElement('option')
        opl.text = optionItem.sub_category_title
        opl.value = optionItem.sub_category_title
        prodSubCategorySelect.appendChild(opl)
        
    })
}

function populateProductCards (productList){
    productList.forEach(function(product){
      let card =   `<div class="catl-card">
      <div class="top-card-content">
          <img src="${product.product_image}" alt="">
          <div class="overlay"></div>
      </div>
      <div class="bottom-card-content">
          <h3>${product.product_title}</h3>
          <p class="product-description">${product.product_description} </p>
          <p class="product-price"><b>Price: </b> ${product.price}</p>
          <p><b>Category: </b >${product.category_title}</p>
          <p><b>Sub category: </b>${product.sub_category_title}</p>

          <div class="action-btns">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
          </div>
      </div>
  </div>`

    productContainer.innerHTML += card
    })
}

uploadProductBtn.addEventListener('click', function(e){
    uploadProduct(formData)
})

//when the productinfo form is submitted
productInfoForm.addEventListener('submit', function(e){
    e.preventDefault()
    //the form data contains inpus form the productInfoForm, this input will be sent the database
    formData = new FormData(this)

    createInputs.style.display = 'none'
    confirmUpload.style.display = 'flex'
    backToProduct.style.display = 'block'

    previewPrice.textContent = formData.get('price')
    previewTitle.textContent = formData.get('product_title')
    previewDescription.textContent = formData.get('product_description')
    previewCategory.textContent = formData.get('category_title')
    previewSubCategory.textContent = formData.get('sub_category_title')

    let image = document.getElementById('file-input').files[0]
    let reader= new FileReader()
    
  
    reader.onload = function(e){
        previewImage.src = e.target.result
    }
  
    reader.readAsDataURL(image)

   

})

function uploadProduct(formData){
    if(formData !== null){
        productEndPoint = domain +'/api/create-product/'

        fetch(productEndPoint, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Token ${authToken}`
            }
        })
        .then(response =>{
            if(!response.ok){
                console.log('error creating products')
            }
            return response.json()
        })
        .then(data =>{
            alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data.message)
        })
        .catch(error =>{
            console.error('Create product error: ', error)
        })
    }
}

//when the create category form is submitted
createCategoryForm.addEventListener('submit', function(e){
    e.preventDefault()
    transitionModal('loading-modal')
    let formData = new FormData(this)
    let endpoint = domain + 'api/create-category/'
    console.log(authToken)
    fetch(endpoint, {
        method : 'POST',
        body: formData,
        headers: {
            Authorization: `Token ${authToken}`
        }
    })
    .then(response =>{
        if(!response.ok){
            console.log('there was an issue with the response')
        }
        return response.json()
    })
    .then(data =>{
        alertActionMessage.textContent = data.message
        transitionModal('action-msg-alert-modal')
        categoryList.push(data.content.category_title)

        // const optionElement = document.createElement('option')
        // optionElement.text = data.content.category_title
        // optionElement.value = data.content.category_title
        // categorySelect.appendChild(optionElement)
        
        populateCategorySelect( categoryList)
    })
    .catch(error =>{
        console.error('Fetch error: ',error)
    })
})


createSubCatForm.addEventListener('submit', function(e){
    e.preventDefault()
    transitionModal('loading-modal')
    let formData = new FormData(this)

    formData.forEach(function(value, key) {
        console.log( key + ': ' + value);
    });

    let endpoint = domain + '/api/create-sub-category/'
    fetch(endpoint, {
       method: 'POST',
       body: formData ,
       headers: {
        Authorization: `Token ${authToken}`
       }
    })
    .then(response =>{
        if(!response.ok){
            console.log('error creating sub categories')
            alertActionMessage.textContent = 'error creating sub categories'
            transitionModal('action-msg-alert-modal')
        }
        return response.json()
    }).then(data =>{
        alertActionMessage.textContent = data.message
        transitionModal('action-msg-alert-modal')

        let subCategory = new SubCategoryClass(data.content.category, data.content.sub_category_title)
        subCategoryList.push(subCategory)
        populateSubCategorySelect(subCategoryList)
    })
    .catch(error =>{
        console.error('Fetch error: ' , error)
    })
    

})


//=====================FUNCTIONS=====================================

/**
 * used to move from one modalbox to another
    if the entire modal container is to be removed, pass in none as the class name 

 * @param className the class name of the modal to be opened
 */
function transitionModal(className){
    modals.forEach(function(modalBox){
        modalBox.classList.remove('visible')
    })

    if(className == 'none'){
        modalContainer.classList.remove('visible')
    }
    else{
        
        let displayModal = document.querySelector(`.${className}`)

        if(displayModal != null){
            if(!modalContainer.classList.contains('visible')){
                modalContainer.classList.add('visible')
            }

            displayModal.classList.add('visible')
        }
        else{
            modalContainer.classList.remove('visible')
        }
    }

    
}