/**this script checks if the user is logged in  
 * it sets the localstorage variable loggedIn to true or false 
 * it doesnt redirect to the login page if user is not logged in 
 * if you want to redirect to the login page when the user is not loggedin, use the login-required.js file
 * 
 * ^get the token from local storage
 * ^if token exists check for token valididy
 * 
 */

const validateLoginDomain = localStorage.getItem('domain')

let token = localStorage.getItem('auth-token')
if(token){
    //this means that the token exists in local storage 
    //we need to check if the token is valid 
    const endpoint =  validateLoginDomain + '/api/validate-token/'
    fetch(endpoint, {
        method: 'POST',
        headers: {
            Authorization: `Token ${token}`
        }
    })
    .then(response =>{
        if(!response.ok){
            //this means that the token exists but is not valid so user is not logged in 
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
    localStorage.setItem('loggedIn', false)
}

