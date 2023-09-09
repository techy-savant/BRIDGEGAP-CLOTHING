

/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navItem = document.querySelectorAll('.nav-item');
const dropbarItem = document.querySelectorAll('.dropdown-content a');

const productSectionContainer = document.querySelector('.catalog-section-container')

const domain = localStorage.getItem('domain')

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

document.addEventListener('DOMContentLoaded', function(e){
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

function populateProductCards (productList){
    productList.forEach(function(product){
        const categoryContainer = document.getElementById(product.category_title)
        if(categoryContainer){
            //this means an element with an id of the product category title already exists
            const gridContainer= document.querySelector(`.${product.category_title}-pc`)
            let card = ` <div class="catl-card">
            <div class="top-card-content">
                <div class="price-con">
                    <p>${product.price}</p>
                </div>
                <img src="${product.product_image}" alt="">
                <div class="overlay"></div>

            </div>
            <div class="bottom-card-content">
                <h3>${product.product_title}</h3>

                <p class="card-description">${product.product_description} </p>
            </div>
        </div>`
        gridContainer.innerHTML += card

        }
        else{
            const catalogContainer = document.createElement('div')
            catalogContainer.className = 'catalog-container'
            catalogContainer.id = product.category_title

            let divElement = ` <h2 class="catalog-header">${product.category_title}</h2>
            <div class="catalog-content grid ${product.category_title}-pc">
                <div class="catl-card">
                    <div class="top-card-content">
                        <div class="price-con">
                            <p>${product.price}</p>
                        </div>
                        <img src="${product.product_image}" alt="">
                        <div class="overlay"></div>

                    </div>
                    <div class="bottom-card-content">
                        <h3>${product.product_title}</h3>

                        <p class="card-description">${product.product_description}</p>
                    </div>
                </div>
               
                <a href="/men.html" class="button button--flex">
                    More <svg class="button-icon" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path></svg>
                </a>
            </div>`

            catalogContainer.innerHTML += divElement
            productSectionContainer.appendChild(catalogContainer)
        }

    
    })
}


function linkAction(){
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav-link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
function dropcontentAction(){
    const navMenu = document.getElementById('nav-menu');
    // When we click on each nav-link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navItem.forEach(n => n.addEventListener('click', linkAction))
dropbarItem.forEach((item) =>{
    item.addEventListener('click', dropcontentAction)
})

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 80 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 80) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== questions ACCORDION ===============*/
const accordionItems = document.querySelectorAll('.questions-item')

accordionItems.forEach((item) =>{
    const accordionHeader = item.querySelector('.questions-header')

    accordionHeader.addEventListener('click', () =>{
        const openItem = document.querySelector('.accordion-open')

        toggleItem(item)

        if(openItem && openItem!== item){
            toggleItem(openItem)
        }
    })
})

const toggleItem = (item) =>{
    const accordionContent = item.querySelector('.questions-content')

    if(item.classList.contains('accordion-open')){
        accordionContent.removeAttribute('style')
        item.classList.remove('accordion-open')
    }else{
        accordionContent.style.height = accordionContent.scrollHeight + 'px'
        item.classList.add('accordion-open')
    }

}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 400 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 400) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const userIcon = document.getElementById('user-icon')
const userLink = document.getElementById('user-link')

const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})


userIcon.addEventListener('click', ()=>{
    userLink.click()
})

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home-data`)
sr.reveal(`.home-img`, {delay: 500})
sr.reveal(`.home-social`, {delay: 600})
sr.reveal(`.about-img, .contact-box`,{origin: 'left'})
sr.reveal(`.about-data, .contact-form`,{origin: 'right'})
sr.reveal(`.guide-card, .catalog-card, .questions-group, .footer`,{interval: 100})