/** this file is used to keep track of the domain variable, it will change depending on if the backend is running on localhost 
 * or in production. the domain variable is utilized through out this project for formation of endpoints
 */


const localDomain = 'http://localhost:8000'
const productionDomain = 'https://bridgegapclothing.com/backend'

localStorage.setItem('domain', productionDomain)