const txtGreet = document.getElementById('txt-greet')
const txtEmail = document.getElementById('txt-email')
const adminConf = document.getElementById('admin-conf')
const adminPanelButton = document.getElementById('admin-panel-button')
const actionBtn= document.querySelector('.action-btn')

const modals = document.querySelectorAll('.modal-box')
const alertActionMessage = document.querySelector('.action-message')
const modalContainer = document.querySelector('.modal-container')
const logoutBtn = document.getElementById('logout-btn')


const domain = localStorage.getItem('domain')

document.addEventListener('DOMContentLoaded', function(){
  
    //===FETCH THE CURRENT USER
    const getuserendpoint = domain + '/api/getcurrentuser/'
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
        let greeting = `Hello ${data.user.username}!`
        txtGreet.textContent = greeting
        txtEmail.textContent = data.user.email 

        if(data.user.is_staff){
            adminConf.style.display = 'flex'
            adminPanelButton.style.display = 'block'
        }
        else{
            adminConf.style.display = 'none'
            adminPanelButton.style.display = 'none'
           
        }
    })
    //== END FETCH THE CURRENT USER
})


const editProfileForm = document.getElementById('edit-profile-form')
editProfileForm.addEventListener('submit', function(e){
    e.preventDefault()
    transitionModal('loading-modal')
    const editUserEndpoint = domain + '/api/edituser/'

    let formData = new FormData(this)
    let myToken = localStorage.getItem('auth-token')

    fetch(editUserEndpoint, {
        method: 'POST',
        body: formData,
        headers: {
            Authorization: `Token ${myToken}`
        }
    }).then(response =>{
        if(! response.ok){
            console.log('something went wrong with the response')
        }
        return response.json()

    })
    .then(data =>{
        alertActionMessage.textContent = data.message
        transitionModal('action-msg-alert-modal')
        console.log(data.message)
    })
    .catch(error =>{
        console.error('Fetch error', error)
    })
})

logoutBtn.addEventListener('click', function(e){
    

    transitionModal('logout-modal')
})


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


    function logoutUser(){
        console.log('logging out')
        localStorage.removeItem('auth-token')
        location.reload()
    }