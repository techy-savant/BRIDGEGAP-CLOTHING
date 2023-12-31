/**this script ensures that a user is logged in 
 * it the user is not logged in, they are redirected to the login page 
 * 
 * ^get the token from local storage
 * ^if token exists check for token valididy
 * 
 */

const mDomain = localStorage.getItem('domain')

let token = localStorage.getItem('auth-token')
if(token){
    //this means that the token exists in local storage 
    //we need to check if the token is valid 
    const endpoint =  mDomain + '/api/validate-token/'
    fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`
        }
    })
    .then(response =>{
        if(!response.ok){
            //this means that the token is not valid so user is not logged in 
            window.location.href = '/login.html'
            localStorage.setItem('loggedIn', false)
            localStorage.removeItem('auth-token')
        }
        else{
            //this means that the user is logged in
            localStorage.setItem('loggedIn', true) 
        }
        return response.json()
    })
    .then(data =>{
        
    })

}
else{
    //this means token does not exist so user is not logged in 
    window.location.href = '/login.html'
    localStorage.setItem('loggedIn', false)
}

