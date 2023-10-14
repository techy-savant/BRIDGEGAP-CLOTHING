const signupForm = document.getElementById('signup-form')
const loginform = document.getElementById('login-form')
const resendActivatoinForm = document.getElementById('resend-activation-form')
const requestResetPasswordForm = document.getElementById('request-reset-password-form')
const resetPasswordForm = document.getElementById('reset-password-form')
const alertActionMessage = document.querySelector('.action-message')

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString)

const domain = localStorage.getItem('domain')
let readyToLogin = false
let returnData
let redirect = false


//user is trying to signup
if(signupForm !== null){
    signupForm.addEventListener('submit', function(e){
        e.preventDefault()
     
        
        transitionModal('loading-modal')
        const endpoint = domain +'/api/signup/'
    
        let formData = new FormData(this)
        let requestOk = false
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
                requestOk = true
            }
            return response.json()
        })
        .then(data =>{
            if(requestOk){
                showCoverScreen(data.email)
            }
            else{
            data.message == undefined? alertActionMessage.textContent = 'Fatal: an error occured': alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data)
            }
            
        })
        .catch(error =>{
            alertActionMessage.textContent = 'Something went wrong please try again'
            transitionModal('action-msg-alert-modal')
            console.error('Fetch error: ', error)
            
        })
    
        
    })
}


function showCoverScreen(email){
    transitionModal('none')
    const coverScreen = document.querySelector('.cover-screen')
    const userEmailForConfirmation = document.getElementById('user-email-for-confirmation')

    userEmailForConfirmation.textContent = email

    coverScreen.style.display = 'flex'

    const reqeustSpan = document.getElementById('request-span')
    reqeustSpan.addEventListener('click', function(e){
        resendActivationEmail(email)

    })
}

function resendActivationEmail(email){
    transitionModal('loading-modal')
        //resend confirmation mail
        let resendConfEndpoint = domain + `/api/resendactivationemail?email=${email}`

        fetch(resendConfEndpoint, {
            method: 'POST'
        })
        .then(response =>{
            if(!response.ok){
                console.log('Error resending email')
            }
            
            return response.json()
        })
        .then(data =>{
            data.message == undefined? alertActionMessage.textContent = 'Fatal: an error occured': alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data)
        })
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

//user is trying to login
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

//user is trying to get an activation email
if(resendActivatoinForm !== null){
    resendActivatoinForm.addEventListener('submit', function(e){
        e.preventDefault()
        transitionModal('none')
        const emailInput = document.getElementById('resend-email-input')
        resendEmail = emailInput.value
        resendActivationEmail(resendEmail)

    })
}


//user is trying to get a password reset link
if(requestResetPasswordForm !== null){
    requestResetPasswordForm.addEventListener('submit', function(e){
        e.preventDefault()
        transitionModal('loading-modal')
        let formData = new FormData(this)
        let requestPasswordResetEndpoint = domain + '/api/requestresetpassword/'

        fetch(requestPasswordResetEndpoint, {
            method: 'POST',
            body: formData
        }).then(response => {
            if(!response.ok){
                console.log('error reqeusting reset password')
            }
            return response.json()
        }).then(data => {
            data.message == undefined? alertActionMessage.textContent = 'Fatal: an error occured': alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
            console.log(data)
        }).catch(error => {
            console.error('Fetch error: ', error)
        })
    })
}

//user is trying to reset thier password
if(resetPasswordForm !== null){
    resetPasswordForm.addEventListener('submit', function(e){
        e.preventDefault()
        transitionModal('loading-modal')

        let formData = new FormData(this)
       
        const uidb64 = queryParams.get('uidb64')
        const token = queryParams.get('token')
        const resetpasswordEndpoint = domain + `/api/changeuserpassword?uidb64=${uidb64}&token=${token}`

        fetch(resetpasswordEndpoint, {
            method: 'POST', 
            body: formData
        })
        .then(response =>{
            if(!response.ok){
                console.log('Error changing user password')
            }
            else{
                readyToLogin= true
            }
            return response.json()
        })
        .then(data => {
            data.message == undefined? alertActionMessage.textContent = 'Fatal: an error occured': alertActionMessage.textContent = data.message
            transitionModal('action-msg-alert-modal')
        })
        .catch(error => {
            console.error('Fetch error: ', error)
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