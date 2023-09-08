/** this file is used to keep track of the domain variable, it will change depending on if the backend is running on localhost 
 * or in production
 */


const localDomain = 'http://localhost:3000'
const productionDomain = 'https://bridgegapclothing.com/backend'

localStorage.setItem('domain', productionDomain)