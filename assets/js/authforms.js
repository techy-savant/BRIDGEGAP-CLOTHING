const signupForm = document.getElementById('signup-form')
const loginform = document.getElementById('login-form')
const alertActionMessage = document.querySelector('.action-message')

const domain = localStorage.getItem('domain')
let readyToLogin = false
let returnData
let redirect = false

if(signupForm !== null){
    signupForm.addEventListener('submit', function(e){
        e.preventDefault()
     
        
        transitionModal('loading-modal')
        const endpoint = domain +'/api/signup/'
    
        let formData = new FormData(this)
        fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          
        })
        .then(response =>{
            if(!response.ok){
                console.log('signup error')
                alertActionMessage.textContent = 'error' + response.status
                transitionModal('action-msg-alert-modal')
                
            }
            else{
                readyToLogin = true
            }
            return response.json()
        })
        .then(data =>{
            data.message == undefined? alertActionMessage.textContent = 'Fatal: an error occured': alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data)
        })
        .catch(error =>{
            alertActionMessage.textContent = 'Something went wrong please try again'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error: ', error)
            
        })
    
        
    })
    
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

if(loginform !== null){
    loginform.addEventListener('submit', function(e){
        e.preventDefault()
    
        
        transitionModal('loading-modal')
        const endpoint = domain +'/api/login/'
        
        let formData = new FormData(this)
        fetch(endpoint, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(response =>{
            if(!response.ok){
                console.log('error loggin in  user')
                redirect = false
            }
            else{
                redirect = true
            }

            return response.json()
        })
        .then(data =>{
            localStorage.setItem('auth-token', data.token)
            alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            returnData = data
            
        })
    
        
    })
}



function transitionModal(className){
    const modals = document.querySelectorAll('.modal-box')
    const modalContainer = document.querySelector('.modal-container')

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

function goToLogin(){
    if(readyToLogin){
        window.location.href = '/login.html'
    }
}

function redirectFromLogin(){
    if(redirect){
        if(returnData.is_staff){
            window.location.href = '/admin.html'
        }
        else{
            window.location.href = '/index.html'
        }
    }
 
    
}