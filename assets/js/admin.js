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
const selectionItems = document.querySelectorAll('.selection-item')
const panels = document.querySelectorAll('.panel')

const categoryPanel = document.getElementById('category-panel')
const subCategoryPanel = document.getElementById('sub-category-panel')


txtUsername = document.getElementById('txt-username')
let formData;

const domain = localStorage.getItem('domain')

let categoryList = []

const authToken = localStorage.getItem('auth-token')

class SubCategoryClass{
    constructor(category, sub_category_title, id, category_title){
        this.category = category
        this.sub_category_title = sub_category_title
        this.id = id
        this.category_title = category_title
    }

    deleteSubCategory(){
        transitionModal('loading-modal')
        let itemId = this.id
        let deleteSubCategoryEndpoint = domain + `/api/deletesubcategory/${itemId}`

        fetch(deleteSubCategoryEndpoint, {
            method: 'DELETE'
        })
        .then(response => {
            if(!response.ok){
                alertActionMessage.textContent = 'Error deleting sub category'
                transitionModal('action-msg-alert-modal')
            }
            else{
                alertActionMessage.textContent = `Sub category ${this.sub_category_title} deleted succesfully`
                transitionModal('action-msg-alert-modal')
            }
        })
        .catch(error => {
            alertActionMessage.textContent = 'Error deleting sub category'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error', error)

        })
    }
}

class Catgory{
    constructor(category_title, id){
        this.category_title = category_title
        this.id = id
    }

    /** Deletes a category from the database and from the list */
    deleteCategory(){
        transitionModal('loading-modal')
        let itemId = this.id
        let deleteCategoryEndpoint = domain + `/api/deletecategory/${itemId}`

        fetch(deleteCategoryEndpoint, {
            method: 'DELETE'
        })
        .then(response => {
            if(!response.ok){
                alertActionMessage.textContent = 'Error deleting category'
                transitionModal('action-msg-alert-modal')
            }
            else{
                alertActionMessage.textContent = `Category ${this.category_title} deleted succesfully`
                transitionModal('action-msg-alert-modal')
            }
        })
        .catch(error => {
            alertActionMessage.textContent = 'Error deleting category'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error', error)

        })
       
    }
}

let subCategoryList =[]

class Product{
    constructor(category, price, product_description, product_image, product_title, product_url, sub_category, category_title, sub_category_title, id){
        this.category = category
        this.price= price
        this.product_description = product_description
        this.product_image =product_image
        this.product_title = product_title
        this.product_url =product_url
        this.sub_category = sub_category
        this.category_title = category_title
        this.sub_category_title = sub_category_title
        this.id= id
    }

    deleteProduct(){
        transitionModal('loading-modal')
        let itemId = this.id
        let deleteCategoryEndpoint = domain + `/api/deleteproduct/${itemId}`

        fetch(deleteCategoryEndpoint, {
            method: 'DELETE'
        })
        .then(response => {
            if(!response.ok){
                alertActionMessage.textContent = 'Error deleting product'
                transitionModal('action-msg-alert-modal')
            }
            else{
                alertActionMessage.textContent = `Product ${this.product_title} deleted succesfully`
                transitionModal('action-msg-alert-modal')
            }
        })
        .catch(error => {
            alertActionMessage.textContent = 'Error deleting product'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error', error)

        })
       
    }

}

let productList = []

selectionItems.forEach(function(item){
    item.addEventListener('click', selectSelection)
})

function selectSelection(e){
    selectionItems.forEach(function(item){
        item.classList.remove('active')
    })

    e.target.classList.add('active')
    showPanel(e.target.id)
}


function showPanel(panelId){
    panels.forEach(function(panel){
        panel.classList.remove('visible')
    })
    let targetId = `${panelId}-panel`

    const panelToShow = document.getElementById(targetId)
    panelToShow.classList.add('visible')
}


backToProduct.addEventListener('click', function(){  
    createInputs.style.display = 'block'
    confirmUpload.style.display = 'none'
    backToProduct.style.display = 'none'
})

document.addEventListener('DOMContentLoaded', function(){

    //===FETCH THE CURRENT USER
    const getuserendpoint = domain + '/api/getcurrentuser/'
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
            let categoryItem = new Catgory(item.category_title, item.id)
            
            categoryList.push(categoryItem)
        })

        populateCategoryViews(categoryList)
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
            let subCategory = new SubCategoryClass(dataItem.category, dataItem.sub_category_title, dataItem.id, dataItem.category_title)
            subCategoryList.push(subCategory)
        })
        populateSubCategoryViews(subCategoryList)
    
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
                item.category_title, item.sub_category_title, item.id)

            productList.push(product)
        })

        populateProductCards(productList)
    })
    .catch(error => {
        console.error('Fetch product error: ', error)
    })


  

})

/** Used to populate all the views that needs the category list 
 * this function deletes all children from respective parents and re-populates then using the
 * items from @param OptionList
 */
function populateCategoryViews(optionList){
    while (categorySelect.firstChild) {
        categorySelect.removeChild(categorySelect.firstChild)
    }
    while(prodCategorySelect.firstChild){
        prodCategorySelect.removeChild(prodCategorySelect.firstChild)
    }

    while(categoryPanel.firstChild){
        categoryPanel.removeChild(categoryPanel.firstChild)
    }


    optionList.forEach(function(optionItem){
        let optionElement = document.createElement('option')
        optionElement.text = optionItem.category_title
        optionElement.value = optionItem.category_title
        categorySelect.appendChild(optionElement)

        let prodCategoryOptionElement = document.createElement('option')
        prodCategoryOptionElement.text = optionItem.category_title
        prodCategoryOptionElement.value = optionItem.category_title
        prodCategorySelect.appendChild(prodCategoryOptionElement)

        
        let categoryItem = ` <div class="category-item">
        <p id="category-title">${optionItem.category_title}</p>
        <button class="delete-btn delete-category" id="${optionItem.id}"><i class="ri-delete-bin-line"></i></button>       
    </div>`
   
    categoryPanel.innerHTML += categoryItem

    })

    const deleteItems = document.querySelectorAll('.delete-category')
    deleteItems.forEach(function(deleteBtn){
        deleteBtn.addEventListener('click', function(e){
            let itemId = deleteBtn.id
            item = optionList.find(value=> value.id == itemId)
            let message =  `Sure to delete ${item.category_title}? all products and sub categories related to this category will also be deleted!`
            setUpConfirmationModal(message, function(e){
                item.deleteCategory()
            })
        })
        
       
    })

    
}

/** Used to populate all the views that needs the sub category list 
 * this function deletes all children from respective parents and re-populates then using the
 * items from @param OptionList
 */
function populateSubCategoryViews(optionList){
    
    while(prodSubCategorySelect.firstChild){
        prodSubCategorySelect.removeChild(prodSubCategorySelect.firstChild)
    }

    while(subCategoryPanel.firstChild){
        subCategoryPanel.removeChild(subCategoryPanel.firstChild)
    }

    optionList.forEach(function(optionItem){
        let opl = document.createElement('option')
        opl.text = optionItem.sub_category_title
        opl.value = optionItem.sub_category_title
        prodSubCategorySelect.appendChild(opl)
        
        
        bodyItem = ` <div class="sub-category-item">
        <div class="item-info">
            <p id="sub-category-title"><b>${optionItem.sub_category_title}</b></p>
            <p id="category-title">${optionItem.category_title}</p>
        </div>
        <button class="delete-btn delete-sub-category" id="${optionItem.id}"><i class="ri-delete-bin-line"></i></button>       
    </div> `

    subCategoryPanel.innerHTML += bodyItem
        
    })


    const deleteItems = document.querySelectorAll('.delete-sub-category')
    deleteItems.forEach(function(deleteBtn){
        deleteBtn.addEventListener('click', function(e){
            let itemId = deleteBtn.id
            item = optionList.find(value=> value.id == itemId)
            let message =  `Sure to delete ${item.category_title}? all products related to this sub category will also be lost!`
            setUpConfirmationModal(message, function(e){
                item.deleteSubCategory()
            })
        })
        
       
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
                                <h3 class="product-title">${product.product_title}</h3>
                                <p class="product-description">${product.product_description} </p>
                                <p class="product-price"><b>Price: </b> ${product.price}</p>
                                <p><b>Category: </b >${product.category_title}</p>
                                <p><b>Sub category: </b>${product.sub_category_title}</p>
                      
                                <div class="action-btns">
                                    <button class="edit-btn"><i class="ri-edit-line"></i></button>
                                    <button class="delete-btn delete-product" id="${product.id}"><i class="ri-delete-bin-line"></i></button>
                                </div>
                            </div>
                        </div>`

    productContainer.innerHTML += card

   
    })


    const deleteItems = document.querySelectorAll('.delete-product')
    deleteItems.forEach(function(deleteBtn){
        deleteBtn.addEventListener('click', function(e){
            let itemId = deleteBtn.id
            item = productList.find(value=> value.id == itemId)
            let message =  `Sure to delete ${item.product_title}?`
            setUpConfirmationModal(message, function(e){
                item.deleteProduct()
            })
        })
        
       
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


//when the create category form is submitted
createCategoryForm.addEventListener('submit', function(e){
    e.preventDefault()
    transitionModal('loading-modal')
    let formData = new FormData(this)
    let endpoint = domain + '/api/create-category/'
    fetch(endpoint, {
        method : 'POST',
        body: formData,
        headers: {
            Authorization: `Token ${authToken}`
        }
    })
    .then(response =>{
        if(!response.ok){
            console.log('something went wrong with the request')
        }
        return response.json()
    })
    .then(data =>{
        alertActionMessage.textContent = data.message
        transitionModal('action-msg-alert-modal')
        categoryList.push(data.content)

        
        populateCategoryViews( categoryList)
    })
    .catch(error =>{
        console.error('Fetch error: ',error)
    })
})


createSubCatForm.addEventListener('submit', function(e){
    e.preventDefault()
    transitionModal('loading-modal')
    let formData = new FormData(this)

    // formData.forEach(function(value, key) {
    //     console.log( key + ': ' + value);
    // });

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

        let subCategory = new SubCategoryClass(data.content.category, data.content.sub_category_title, data.content.id)
        subCategoryList.push(subCategory)
        populateSubCategoryViews(subCategoryList)
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

/** This function shows the confirmation modal using the parameters passed to customize it 
 * @param message the confimation message
 * @param clickFunction A function with will be executed when the continue button of the modal is clicked
 */
function setUpConfirmationModal(message, clickFunction){
    const confirmationModal = document.getElementById('confirmation-modal')
    const messageElemnt = confirmationModal.querySelector('.alert-message')
    const continueButton = confirmationModal.querySelector('.continue-btn')

    continueButton.onclick = clickFunction

    messageElemnt.textContent = message

    //showing the confirmation modal
    transitionModal('confirmation-modal')
}


/** uploads a product to the database
 * @param formData The formdata used to fetch the details of the product to be uploaded
 */
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
        })
        .catch(error =>{
            console.error('Create product error: ', error)
        })
    }
}