const signupForm = document.getElementById('signup-form')
const loginform = document.getElementById('login-form')
const alertActionMessage = document.querySelector('.action-message')

const domain = localStorage.getItem('domain')
let readyToLogin = false
let returnData

if(signupForm !== null){
    signupForm.addEventListener('submit', function(e){
        e.preventDefault()
    
        
        transitionModal('loading-modal')
        const endpoint = domain +'/api/signup/'
    
        let formData = new FormData(this)
        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(response =>{
            if(!response.ok){
                console.log('error signing up user')
                alertActionMessage.textContent = 'error' + response.status
                transitionModal('action-msg-alert-modal')
                
            }
            else{
                readyToLogin = true
            }
            return response.json()
        })
        .then(data =>{
            alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data.message)
        })
        .catch(error =>{
            alertActionMessage.textContent = 'Something went wrong please try again'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error: ', error)
            
        })
    
        
    })
    
}


if(loginform !== null){
    loginform.addEventListener('submit', function(e){
        e.preventDefault()
    
        
        transitionModal('loading-modal')
        const endpoint = domain +'/api/login/'
    
        let formData = new FormData(this)
        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(response =>{
            if(!response.ok){
                console.log('error signing up user')
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
    if(returnData.is_staff){
        window.location.href = '/profile.html'
    }
    else{
        window.location.href = '/index.html'
    }
    console.log(returnData)
}