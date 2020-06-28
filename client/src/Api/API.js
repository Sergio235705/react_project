
import Car from "../Content/Car";

const baseURL = '/api';

async function isAuthenticated(){
  let url = "/user";
  const response = await fetch(baseURL + url);
  const userJson = await response.json();
  if(response.ok){
      return userJson;
  } else {
      let err = {status: response.status, errObj:userJson};
      throw err;  // An object with the error coming from the server
  }
}

async function getCarsByFilter(filter) {
    let string;
    string="/filter/category=.&brand=./record=14&offset=1";
    
  let url = "/cars"+ (filter.length==1 ? string : filter);
  const response = await fetch(baseURL + url);
  const carsJson = await response.json();
  
  const numcars=carsJson.numcars;
  const cars=carsJson.cars;
  if(response.ok){console.log(response);
     return {numcars:numcars,cars:cars.map((c) => new Car(c.Modello,c.Marca,c.Categoria))}
  } else {
      let err = {status: response.status, errObj:carsJson};
      throw err;  // An object with the error coming from the server
  }
}

async function getBrands() {
  let url = "/cars/brands";
  const response = await fetch(baseURL + url);
  const brands = await response.json();
  console.log(brands);
  if(response.ok){
     return brands;
  } else {
      let err = {status: response.status, errObj:brands};
      throw err;  // An object with the error coming from the server
  }
}

async function getAvalaibleCars(filter,user) {

  console.log(filter);
  let url = "/users/"+ user + filter;
  const response = await fetch(baseURL + url);
  console.log(response)
  const carsJson = await response.json();
  console.log(carsJson);
  const numcars=carsJson.numerocars;
  const cars=carsJson.cars;
  const numnotmodel=carsJson.numnotmodel;
  if(response.ok){
     return {numcars:numcars,numnotmodel:numnotmodel,cars:cars.map((c) => new Car(c.Modello,c.Marca,c.Categoria))}
  } else {
      let err = {status: response.status, errObj:carsJson};
      console.log("ah");

      throw err;  // An object with the error coming from the server
  }
}





async function getRentalsByUser(filter,username) {

    console.log(username)
    console.log(filter);
    let user=username.split('@')[0];
  let url = "/users/"+user +"/rentals"+filter;
 
  const response = await fetch(baseURL + url);
  const rentalsJson = await response.json();
  if(response.ok){
        return rentalsJson;
  } else {
      let err = {status: response.status, errObj:rentalsJson};
      throw err;  // An object with the error coming from the server
  }
}
async function ValidUser(username) {
  let url = "/newusername"
    return new Promise((resolve, reject) => {
        fetch(baseURL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username}),
        }).then((response) => {
            if (response.ok) {
                response.json().then((result) => {
                    resolve(result);
                });
            } else {
                response.json()
                    .then((obj) => { reject(obj); }) // error in result object
                    .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}
async function SendPay(dati,price,user) {
    let carta=dati.carta;
    let data=dati.data;
    let ccv=dati.ccv;
    let name=dati.name;
    let lastname=dati.lastname;
    console.log(user);
    let url = "/users/"+user+"/newrental/validpayment"
      return new Promise((resolve, reject) => {
          fetch(baseURL + url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({carta:carta,data:data,ccv:ccv,name:name,lastname:lastname}),
          }).then((response) => {
              if (response.ok) {
                  response.json().then((result) => {
                      resolve(result);
                  });
              } else {
                  response.json()
                      .then((obj) => { reject(obj); }) // error in result object
                      .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
              }
          }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
      });
  }
async function GetPrice(filter,paramPrice,user) {
  return new Promise((resolve, reject) => {
      fetch(baseURL + "/users/"+ user + filter, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(paramPrice),
      }).then( (response) => {
          if(response.ok) {
              response.json()
              .then((obj)=>
              {    console.log(obj)
                   resolve(obj);
              });
           
             

          } else {
              // analyze the cause of error
              response.json()
              .then( (obj) => {reject(obj);} ) // error msg in the response body
              .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
          }
      }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}
async function InsertNewRental(rent,paramPrice,user,dati) {
    console.log(user);
  return new Promise((resolve, reject) => {
      fetch(baseURL + "/users/"+ user +"/addrental", {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({Price:paramPrice,rent:rent,dati:dati}),
      }).then( (response) => {
          if(response.ok) {
            response.json()
            .then((obj)=>
            {    console.log(obj)
                 resolve(obj);
            });

          } else {
              // analyze the cause of error
              response.json()
              .then( (obj) => {reject(obj);} ) // error msg in the response body
              .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
          }
      }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}
async function DeleteRental(idRent,username) {
    let user=username.split("@")[0];
  return new Promise((resolve, reject) => {
      fetch(baseURL +"/users/"+user+ "/rentals/delete=" + idRent, {
          method: 'DELETE'}).then( (response) => {
          if(response.ok) {
              resolve(response.json());
          } else {
              // analyze the cause of error
              response.json()
              .then( (obj) => {reject(obj);} ) // error msg in the response body
              .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
          }
      }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}




async function userLogin(username, password) {
    
  return new Promise((resolve, reject) => {
      fetch(baseURL + '/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: username, password: password}),
      }).then((response) => {
          if (response.ok) {
              response.json().then((user) => {
                  resolve(user);
              });
          } else {
              console.log(response.status);
              reject(response.status)
              // analyze the cause of error
             //response.json()
              //    .then((obj) => { console.log(obj); reject(obj); }) // error msg in the response body
              //    .catch(() => {  reject(response.status) }); // something else
          }
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}


async function userRegister(username,name,password) {
  return new Promise((resolve, reject) => {
      fetch(baseURL + '/registration', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: username, password: password,nome: name}),
      }).then((response) => {
          if (response.ok) {
             resolve(null);
          } else {
              // analyze the cause of error
              response.json()
                  .then((obj) => { reject(obj); }) // error msg in the response body
                  .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
          }
      }).catch((err) => { reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
  });
}

async function userLogout(username, password) {
  return new Promise((resolve, reject) => {
      fetch(baseURL + '/logout', {
          method: 'POST',
      }).then((response) => {
          if (response.ok) {
              resolve(null);
          } else {
              // analyze the cause of error
              response.json()
                  .then((obj) => { reject(obj); }) // error msg in the response body
                  .catch((err) => { reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
          }
      });
  });
}

const API = { isAuthenticated,getBrands, getCarsByFilter,SendPay, getAvalaibleCars, getRentalsByUser,ValidUser,DeleteRental,InsertNewRental,GetPrice,userRegister, userLogin, userLogout} ;
export default API;