

'use strict';

const moment = require('moment')
const bcrypt = require('bcrypt');

// DAO module for accessing courses and exams
// Data Access Object

const sqlite = require('sqlite3');
const db = new sqlite.Database('Auto.sqlite', (err) => {
  if (err) throw err;
});



exports.CheckData = function (id,user) {
  //console.log(RentID);
  let data=moment().format('YYYY-MM-DD');
 //console.log(data);
// console.log(id)
  return new Promise((resolve, reject) => {
    const sql = 'SELECT P.DataInizioNoleggio FROM Prenotazioni P ,NoleggiUser N WHERE P.IDPrenotazione=? AND P.IDPrenotazione=N.IDPrenotazione AND N.IDUser=? ';
    db.get(sql, [id,user], (err,row) => {
      if (err) {

        resolve(false);
        return;
      }
      if(row===undefined)
      {//console.log("UND");
       resolve(false);}
      else
      {//console.log(row)
     if(moment(data).isAfter(GetDataServerComparable(row.DataInizioNoleggio)))
      resolve(false);
      else
      resolve(true);}

    });
  });}
  function GetDataServerComparable(DATA)
  {
      let Data;
      Data=DATA.toString();
      Data=Data.slice(0,4)+"-"+Data.slice(4,6)+"-"+Data.slice(6,8);
      return Data;
  } 

exports.listBrands = function () {
  ////console.log(RentID);
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Marca FROM VeicoliDisponibili GROUP BY Marca ';
    db.all(sql, [], (err,rows) => {
      if (err) {
        reject(err);
        return;
      } 
      const brands=rows.map((b)=>(b.Marca));
      resolve(brands);

    });
  });}

exports.listCars = function (categoria, brand, pagina,record) {
  let parametri=[];
  let CampoBra;
  let CampoCat;
  let vetcat=categoria.split("&");
  let vetbr=brand.split("&");
  //console.log(categoria);
  if (categoria === '.')
   { CampoCat="";}
   else 
   {CampoCat=" AND ( Categoria=?";
   parametri.push(vetcat[0]);
   for(let i=1;i<vetcat.length;i++)
  {CampoCat+=" OR Categoria=? ";
  parametri.push(vetcat[i]);}
  CampoCat+=")";}
  //console.log(brand)
  //console.log(vetbr)
  if (brand === '.')
   { CampoBra="";}
   else 
   {CampoBra="AND ( Marca=?";
   parametri.push(vetbr[0]);
   for(let i=1;i<vetbr.length;i++)
  {CampoBra+=" OR Marca=? ";
  parametri.push(vetbr[i]);}
  CampoBra+=")"}
  //console.log(categoria);
  //console.log(parametri)
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Modello,Marca,Categoria,Targa FROM VeicoliDisponibili '+
    'WHERE Modello IS NOT NULL '+CampoCat+CampoBra+
    ' GROUP BY Modello '+(pagina==="." ? 'ORDER BY Targa;' : 'ORDER BY Categoria;');
    //console.log(sql); 
    db.all(sql,parametri, (err, rows) => {
      if (err) {
         
        reject(err);
        return;
      }
      //console.log(record+" "+pagina);
      let num=rows.length;
      if(pagina===".")
      {pagina=1;}
      rows= rows.slice((pagina-1)*record,pagina*record)
      const cars = rows.map((e) => ({ Modello: e.Modello, Marca: e.Marca, Categoria: e.Categoria }));
      resolve({numcars:num,cars:cars});
    });
  });
};


exports.ValidUsername = function (user) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IDUser FROM user';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
     // //console.log(rows);
     
      const res = rows.map((e) => (e.IDUser)).filter((e)=> (e.localeCompare(user) == 0));
      ////console.log(res.length)
      if (res.length == 1)
        {//console.log("-1");
          resolve(-1);
    }
      else
      { //console.log("1");
        resolve(1);}
    });
  });
};

function isBoolean(n){
  return !!n===n;}


exports.CheckParam  = function (rent,ParamPrice) 
{  ////console.log(rent);
  let Categoria=rent.Categoria;
  let datainizio=rent.DataInizio;
   let datafine=rent.DataFine;
   //console.log(ParamPrice)
   let yest=moment().add(-1,'days').format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
  
   
   if(moment(datafine,'YYYY-MM-DD',true).isValid() && moment(datainizio,'YYYY-MM-DD',true).isValid() &&
   (Categoria==="A" || Categoria==="B" ||  Categoria==="C" ||  Categoria==="D" ||  Categoria==="E") && 
   !moment(yest).isAfter(datainizio) && !moment(datainizio).isAfter(datafine))
   { 

   /* rent={Marca:'Kia',Modello:'Sportage',DataInizio:'05/06/2020',DataFine:'15/06/2020',User=XXX,Importo=XXX,Targa=XXX};
    ParamPrice={Categoria:"B",NumDays:3,KmGiornalieri:20,AgeDriver:22,ExtraAss:"true",NumDriverAdd:2,Meno10PCars:"true",User};*/
     if(ParamPrice===null)
     { 
       resolve(null);}
     else
{  if(ParamPrice.Categoria===Categoria && isNumber(ParamPrice.NumDays) && 
  isNumber(ParamPrice.KmGiornalieri) && isNumber(ParamPrice.AgeDriver) &&
     isBoolean(ParamPrice.ExtraAss) && isBoolean(ParamPrice.NumDriverAdd))
     { //console.log("en");
       resolve(null);
    
     }
    else 
    { //console.log("err");
      reject(-1);} }

   }
   else
   { 
     reject(-1);}
   
});} 


exports.ValidEmail = function(val)
{ return new Promise((resolve,reject)=>{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val))
  resolve();
  else
  reject();

});
}

exports.ValidPageRecords = function(page,records)
{ return new Promise((resolve,reject)=>{
  if ( isNumber(page) && isNumber(records))
  resolve();
  else
  reject();

});
}
exports.ValidPayment = function (carta,data,ccv,name,lastname) {
  console.log(carta.length);
  console.log(data.length); //  Number.isInteger(parseInt(carta)) && Number.isInteger(parseInt(ccv)) 
  console.log(ccv.length);
  console.log(name);
  console.log(lastname);
  let datalocal=moment().format('YYYY-MM-DD');
  return new Promise((resolve, reject) => {
      if(data.length==10 && !moment(datalocal).isAfter(data) && carta.length===16 && name.length>=0 && lastname.length>=0
      && isNumber(carta) && isNumber(ccv) && ccv.length===3)
      {resolve(true);
        console.log("true");
      }
      else 
      { console.log("false")
        reject(false);}
     
    });}

    function isNumber(n) {return /^-?[\d.]+(?:e-?\d+)?$/.test(n);}


exports.readRentalsByUser = function (user,past) {
  let data=moment().format('YYYY-MM-DD');
  data=GetDateServerFormat(data);
  console.log(past)
  let vet,string;
  let secondosegno=(past==1 ? '<':'>');
  if(past==1)
   string="AND DataInizioNoleggio < ? ";
  else
  string=" ";
  if(past==1)
   vet=[user,data,data];
  else 
  vet=[user,data];

  //console.log(vet)
  return new Promise((resolve, reject) => {
    console.log(user);
    const sql = 'SELECT N.IDPrenotazione,Targa,Modello,MarcaAuto,DataInizioNoleggio,DataFineNoleggio,Importo FROM NoleggiUser N,Prenotazioni P WHERE N.IDPrenotazione=P.IDPrenotazione AND IDUser=? '
    +string+' AND DataFineNoleggio '+secondosegno+' ?  ORDER BY P.DataInizioNoleggio';
    console.log(sql)
    db.all(sql, vet, (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }
      if(past==1 || past==0)
     {if (rows == undefined) {
        resolve({});
      } else {

        //console.log(rows);
        //console.log(sql)
        //console.log(user);
        const rentals = rows.map((r) => ({
          ID: r.IDPrenotazione, Modello: r.Modello,
          Marca: r.MarcaAuto, DataInizio: r.DataInizioNoleggio, DataFine: r.DataFineNoleggio, Importo: r.Importo, Targa: r.Targa
        }));
        resolve(rentals);
      }
    }
    else reject(0);
    });
  });
};


exports.AddRental = function (rent) {

  console.log(rent);
  const p1 = new Promise((resolve, reject) => {
    const sql = 'INSERT INTO NoleggiUser(IDUser,Importo) VALUES(?,?);';
    db.run(sql, [rent.user,rent.price], (err) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      } else
        resolve(0);

    });
  });
  
  const p2 = new Promise((resolve, reject) => {
    let DataInizio = GetDateServerFormat(rent.DataInizio);
    let DataFine = GetDateServerFormat(rent.DataFine);
    //console.log(DataFine+" "+DataInizio);
    const sql = 'INSERT INTO Prenotazioni(MarcaAuto,Modello,DataInizioNoleggio,DataFineNoleggio,Targa) VALUES(?,?,?,?,?);';
    db.run(sql, [rent.Marca, rent.Modello, DataInizio, DataFine, rent.Targa], (err) => {
      if (err) {
        reject(err);
        console.log("RR2");
        return;
      } else
        resolve(null);

    });
  });
  const p3 = new Promise((resolve, reject) => {
    const sql = 'UPDATE USER SET NumPren=NumPren+1  WHERE IDUser=?';
    db.run(sql, [rent.user], (err) => {
      if (err) {
        reject(err);
        console.log("RR3");
        return;
      } else
        resolve(null);

    });
  });



  return Promise.all([p1, p2, p3]);
};

/**
 * Update an exam given the exam with its course_code
 */

exports.getcarsAvalaible = function (rent, Pagina,record,mod) {
  //console.log(rent);
  let DataFine;
  let random=false;
  let DataInizio = GetDateServerFormat(rent.DataInizio);
  DataFine = GetDateServerFormat(rent.DataFine);

  
//console.log(DataFine);
//console.log(DataInizio)
 
 // console.log(DataFine);
  //console.log(rent);
  return new Promise((resolve, reject) => {
    const string='SELECT COUNT(*) FROM VeicoliDisponibili V1 WHERE V1.Categoria=? AND V1.Targa NOT IN (SELECT P1.TARGA FROM Prenotazioni P1,VeicoliDisponibili V2 WHERE (?>P1.DataInizioNoleggio AND ?<P1.DataFineNoleggio) AND P1.Targa=V2.Targa AND V2.Categoria=?)';
    const sql = 'SELECT Targa,Modello,Marca,Categoria,('+string+') AS TotaleAuto FROM VeicoliDisponibili V WHERE V.Categoria=? AND V.Targa NOT IN (SELECT P.TARGA FROM Prenotazioni P,VeicoliDisponibili V1 WHERE (?>P.DataInizioNoleggio AND ?<P.DataFineNoleggio) AND P.Targa=V1.Targa AND V1.Categoria=?)'+ (mod ? "GROUP BY Modello " : " " )+ "ORDER BY Marca;";
    db.all(sql, [rent.Categoria,DataFine,DataInizio,rent.Categoria,rent.Categoria,DataFine,DataInizio,rent.Categoria], (err, rows) => {
      if (err) {
         console.log("err");
        reject(err);
        return;
      }
      console.log(rows);
      if(rows.length===0)
      { resolve({numerocars:0,cars:[],numnotmodel:0});
 
      }
      else 
     { const numero=rows.length;
      const numnotmodel=rows[0].TotaleAuto;
      rows=rows.slice((Pagina-1)*record,(Pagina*record));
const carsAvailable =rows.map((e) => ({ Modello: e.Modello, Marca: e.Marca, Categoria: e.Categoria}));
       console.log(numero);
resolve({numerocars:numero,cars:carsAvailable,numnotmodel:numnotmodel});}

  
    });
  });
};



exports.getIDcar= function (rent) {
//  console.log(rent);
 let DataInizio = GetDateServerFormat(rent.DataInizio);
  let DataFine = GetDateServerFormat(rent.DataFine);
  return new Promise((resolve, reject) => {
    const sql = 'SELECT Distinct Targa,Modello,Marca,Categoria FROM VeicoliDisponibili V WHERE V.Categoria=?  AND V.Targa NOT IN (SELECT P.TARGA FROM Prenotazioni P WHERE (?>P.DataInizioNoleggio AND ?<P.DataFineNoleggio));';
    db.all(sql, [rent.Categoria, DataFine, DataInizio], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
     console.log(rows);
      const numero=rows.length;
      if(numero===0)
      reject(err);
      const Rent = {user:rent.user,Categoria:rent.Categoria,
        Modello:rows[0].Modello, Marca:rows[0].Marca,DataFine:rent.DataFine,
        DataInizio:rent.DataInizio,Targa:rows[0].Targa}
        //console.log(rent);
      resolve({numerocars:numero,rent:Rent});
    });
  });
};






/**
 * Delete an exam given the course_code
 */
exports.deleteRent = function (RentID, UserID) {
  

  //console.log(UserID);
  const p1 = new Promise((resolve, reject) => {
    const sql = 'DELETE FROM NoleggiUser WHERE IDPrenotazione=? AND IDUser=?';
    db.run(sql, [RentID,UserID], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);

    });
  });

  const p2 = new Promise((resolve, reject) => {
    const sql = 'DELETE FROM Prenotazioni WHERE IDPrenotazione=?';
    db.run(sql, [RentID], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve();

    });
  });
  const p3 = new Promise((resolve, reject) => {
    const sql = 'UPDATE USER SET NumPren=NumPren-1  WHERE IDUser=?';
    db.run(sql, [UserID], (err) => {
      if (err) {
        reject(err);
        return;
      } else

        resolve(null);

    });
  });


  return Promise.all([p1, p2, p3]);


};



exports.checkUserPass = function (user, pass) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IDUser, passwordhash,NumPren,name FROM user WHERE IDUser = ?';
    // execute query and get all results into `rows`
    db.all(sql, [user], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        reject(null);
        return;
      }
      const passwordHashDb = rows[0].passwordhash;
      // bcrypt.compare might be computationally heavy, thus it call a callback function when completed
      bcrypt.compare(pass, passwordHashDb, function (err, res) {
        if (err)
          reject(err);
        else {
          if (res) {//console.log(rows[0]);
            resolve(
            {   username: rows[0].IDUser,
              name: rows[0].name,
              Premium: (rows[0].NumPren>=3 ? true : false)
            });
            return;
          } else {
            reject(null);
            return;
          }
        }
      });
    });
  });
}

exports.loadUserInfo = function (userID) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT IDUser,name,NumPren FROM user WHERE IDUser = ?';
    // execute query and get all results into `rows`
    db.all(sql, [userID], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      if (rows.length === 0) {
        reject(null);
        return;
      }
      resolve({
        username: rows[0].IDUser,
        name: rows[0].name,
        Premium: (rows[0].NumPren>=3 ? true : false)
      });
      return;
    });
  });
}

exports.StoreUserPass = function (user, pass, nome) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pass, 10, function (err, hash) {
      if (err) { reject(err) }
      else {
        const param = { user: user, pass: hash, nome: nome };
        // console.log(param);
        resolve(param);

      }

    });
  }).then((value) => (StoreDb(value)))
};


async function StoreDb(param) {
  //console.log(param);
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO user(IDUSer,passwordhash,name,NumPren) VALUES(?,?,?,?);';
    // execute query and get all results into `rows`
    db.run(sql, [param.user, param.pass, param.nome, 0], (err) => {
      if (err) {
        console.log("errore2");
        reject(err);
        return;
      } else
        resolve(null);


    });
  });
};

function GetDateServerFormat(DATA) {
  let Data;
  Data = DATA.split('-');
  //console.log(Data);
  Data = Data[0] + Data[1] + Data[2];
  //console.log(Data);
  return Data;
}
function GetDateClientFormat(DATA) {
  let Data;
  Data = DATA.slice(6, 8) + "-" + DATA.slice(4, 6) + "-" + DATA.slice(0, 4);
  return Data;

}

const GetTab = function () {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM TabellaPrezzi';
    db.all(sql, [], (err, rows) => {
      if (err) {
        //console.log("err in tab")
        reject(err);
        return;
      }

      const tab = rows.map((e) => ({
        Elemento: e.Elemento, PrezzoGiorno: e.PrezzoGiorno,
        PrezzoMaggiorato: e.PrezzoMaggiorato
      }));
      resolve(tab);
    });
  });
};

const GetPrice = function (tab, paramPrice, paramCars, mod) {
  //console.log(paramCars);
 // console.log(tab);
      console.log(paramPrice);
      console.log(paramCars);
// console.log(tab)
  const p1 = new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS Response FROM USER U WHERE U.NumPren>=3 AND IDUser=? ';
    db.get(sql, [paramPrice.User], (err, row) => {
      if (err) {
        reject(err);
        console.log("err1");
        return;
      } else
        console.log(row.Response)
        // transform 'rows' of query results into an array of objects
        resolve(row.Response);
    });
  });
  const p2 = new Promise((resolve, reject) => {
    const sql = 'SELECT COUNT(*) AS NUMERO FROM VeicoliDisponibili WHERE Categoria=? ';
    db.get(sql, [paramPrice.Categoria], (err, row) => {
      if (err) {
        reject(err);
        console.log("err2");
        return;
      } else
        // transform 'rows' of query results into an array of objects
        row = 100*paramCars.numerocars / row.NUMERO;
       console.log(row);
      resolve(row);
    });
  }); return Promise.all([p1, p2]).then(values=>
    { 
       if(mod==="info")
      return InternalGetPrice(tab,values,paramPrice,mod,0,0);
    else 
    { 
      const OneCarAvailable = {user:paramCars.rent.user,Categoria:paramCars.rent.Categoria,
       Modello:paramCars.rent.Modello, Marca:paramCars.rent.Marca,
       DataFine:paramCars.rent.DataFine,
       DataInizio:paramCars.rent.DataInizio,Targa:paramCars.rent.Targa,price:InternalGetPrice(tab,values,paramPrice,mod,paramCars.rent.DataInizio,paramCars.rent.DataFine)}

      console.log("A");
    return OneCarAvailable;}
     });
}



/* ParamPrice ={Categoria=X,NumDays=X,KmGiornalieri=X,AgeDriver=X,ExtraAss=True/False,NumDriverAdd=X,Meno10PCars=true/false,User=X}*/



exports.newrental = function ( paramPrice,paramCars, mod) {
// console.log(paramCars);
// console.log(paramPrice);
  return GetTab()
      .then((tab) =>
       {return GetPrice(tab, paramPrice, paramCars, mod)})
      .catch() };
  //

  function InternalGetPrice(tab, values, ParamPrice,mod,datain,dataout) {
    let price = 0;
    let NumDays=0;
    console.log(values);
    const prices = tab.map((e) => ({
      Elemento: e.Elemento,
      PrezzoGiorno: e.PrezzoGiorno, PrezzoMaggiorato: e.PrezzoMaggiorato
    }));

    const IsFreq = values[0];
    const Meno10perc=values[1];
    if(mod==="info")
    NumDays=ParamPrice.NumDays;
    else 
    NumDays=setDays(datain,dataout);
    //console.log(users);
    //console.log(ParamPrice);
    let Maggiorato = 1;
    let string;

    string = 'AUTO ' + ParamPrice.Categoria;
    let PrezzoBase = (NumDays) * prices.filter(
      (r) => ((r.Elemento.localeCompare(string) == 0)))[0].PrezzoGiorno;
    //console.log(Maggiorato); 
    if (ParamPrice.KmGiornalieri < 50)
      string = '<50km';
    else if (ParamPrice.KmGiornalieri >= 50 && ParamPrice.KmGiornalieri < 150)
      string = '<150km';
    else
      string = '>150km';
    Maggiorato = Maggiorato * GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare(string) == 0))[0].PrezzoMaggiorato);
    //console.log(Maggiorato);
    if (ParamPrice.AgeDriver < 25 | ParamPrice.AgeDriver > 65) {
      if (ParamPrice.AgeDriver < 25)
        string = 'Eta<25';
      else if (ParamPrice.AgeDriver > 65)
        string = 'Eta>65';
      Maggiorato = Maggiorato * GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare(string) == 0))[0].PrezzoMaggiorato);
    }
    //console.log(Maggiorato);
    if (ParamPrice.ExtraAss) { Maggiorato = Maggiorato * GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare("AssExtra") == 0))[0].PrezzoMaggiorato); }
    //console.log(Maggiorato);
    if (ParamPrice.NumDriverAdd)
      Maggiorato = GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare("NumGuidatori") == 0))[0].PrezzoMaggiorato) * Maggiorato;
    //console.log(Maggiorato);
    if (Meno10perc <10.0)
      Maggiorato = Maggiorato * GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare("<10PercCategoria") == 0))[0].PrezzoMaggiorato);
    //console.log(Maggiorato);
    if (IsFreq == 1) 
    Maggiorato = Maggiorato * GetPercentuale(prices.filter((r) => (r.Elemento.localeCompare("UserFreq") == 0))[0].PrezzoMaggiorato); 

   

    price = PrezzoBase*Maggiorato;
    console.log(price);
    return price.toFixed(2);

  }
  function GetPercentuale(num)
  { let n=num+100;
    n=n/100;
    return n;

  }

  function setDays(datain,dataout)
  { let second=1000;
    let minute=second*60;
    let hour=minute*60;
    let day=hour*24;

    let date1=new Date(datain).getTime();
    let date2=new Date(dataout).getTime();
    let timediff=date2-date1;
    console.log("......");
    return Math.floor(timediff/day);

  }
