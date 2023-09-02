
const webDomain = 'http://localhost:8000/'
const getUserEndpoint = webDomain + 'api/getcurrentuser/'
let user;
let myToken = localStorage.getItem('auth-token')
fetch(getUserEndpoint, {
    method: 'POST',
    headers: {
        Authorization: `Token ${myToken}`
    }
})
.then(response =>{
    if(!response.ok){
        window.location.href = '/denied.html'
        console.log('error getting current user')
    }
    return response.json()
})
.then(data =>{
    user= data.user
    if (!data.user.is_staff){
      
        window.location.href = '/denied.html'
    }
})

