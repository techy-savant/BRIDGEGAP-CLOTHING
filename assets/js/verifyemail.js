const loadingInitial= document.querySelector('.loading-initial')

const queryString = window.location.search;
const queryParams = new URLSearchParams(queryString)

const uidb64 = queryParams.get('uidb64')
const token = queryParams.get('token')

const domain = localStorage.getItem('domain')

const validateEndpoint = domain + `/api/validateuser?uidb64=${uidb64}&token=${token}`

fetch(validateEndpoint, {
    method: 'GET'
})
.then(response =>{
    if(!response.ok){
        removeInitalLoading()
        showSection('verf-failed-section')
    }
    else{
        removeInitalLoading()
        showSection('verf-success-section')
    }
})



function removeInitalLoading(){
    loadingInitial.style.display = 'none'
}


function showSection(elementId){
    const section = document.getElementById(elementId)
    
    const allsections = document.querySelectorAll('.acct-con')
    allsections.forEach(function(section){
        section.style.display= 'none'
    })

    section.style.display = 'flex'
}