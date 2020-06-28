import React, { useState, useRef } from 'react';
import { Spinner, Navbar,Container } from 'react-bootstrap';
import {AuthContext} from '../Contexts/Contexts'
import * as moment from 'moment';
function SpinnerPage(props)
{
   return <> <Container className="text-center mt-5 pt-5 pb-5 mb-5 ">
       <div className="text-center mt-5 pt-5 " >
    <Spinner animation="border" className="text-warning" size="sm"/>
               <Spinner animation="border"className="text-warning" size="lg"/>
                <Spinner animation="grow"className="text-warning" size="sm"/>
                <Spinner animation="grow" className="text-warning"/></div></Container></>
}

class rental {
    /**
     * Constructs a new Rental object
     * @param {String} modello 
     * @param {Number} marca 
     * @param {Date} dataInizioNoleggio 
     * @param {Date} dataFineNoleggio 
     * @param {Importo} importo 
     */
    constructor(modello,marca,dataInizioNoleggio,dataFineNoleggio) {
      this.IDPrenotazione=0;
      this.modello = modello;
      this.marca = marca;
      this.dataInizioNoleggio =  dataInizioNoleggio ; // converting string to dates...
      this.dataInizioNoleggio =  dataFineNoleggio ;
      this.importo=0;
    }
    SetPrice(val)
    {this.importo=val;
    }
    SetIDPrenotazione(val)
    {this.IDPrenotazione=val;}
    /**
     * Construct an Exam from a plain object
     * @param {{}} json 
     * @return {Exam} the newly created Exam object
     */
    static from(json) {
      return Object.assign(new rental(), json);
    }
  }
  
  class ParamPrice {
  
    constructor(categoria,dataInizioNoleggio,dataFineNoleggio,KmDay,Age,Extra,AddDriver) {
      this.Categoria=categoria;
      this.NumDays=setNum(dataInizioNoleggio,dataFineNoleggio);
      this.DataInizio= dataInizioNoleggio ;
      this.DataFine= dataFineNoleggio ;
      this.KmGiornalieri=KmDay;
      this.AgeDriver=Age;
      this.ExtraAss=Extra;
      this.NumDriverAdd=AddDriver;
      this.User="";
  
    }
  
    GetCategoria()
    {return this.Categoria;}
    SetCategoria(val)
    {this.Categoria=val;}
    SetUser(val)
    {this.User=val;}
  
    GetNumDays()
    {return this.NumDays;}
    SetDataFine(val)
    { this.DataFine=val;
      this.NumDays=setNum(this.DataInizio,this.DataFine);}
    SetDataInizio(val)
    {  console.log(val);
        this.DataInizio= val;
        this.NumDays=setNum(this.DataInizio,this.DataFine);
     }
    GetDataInizio()
    {return this.DataInizio;}
    GetDataFine()
    {return this.DataFine;}
     SetKmDay(val)
     {
         this.KmGiornalieri=val;
     }
     GetKmDay()
     {return this.KmGiornalieri;}
     SetAge(val)
     {this.AgeDriver=val;}
     GetAge()
     {return this.AgeDriver;}
     SetExtraAss()
     {
         this.ExtraAss=!this.ExtraAss;
     }
     GetExtraAss()
     {
         return this.ExtraAss;
     }
     SetAddDriver()
     {this.NumDriverAdd=!this.NumDriverAdd;}
     GetAddDriver()
     {
         return this.NumDriverAdd;
     }
  
  
   
    static from(json) {
      return Object.assign(new ParamPrice(), json);
    }
  }

  function setNum(datain,dataout)
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
  
 

export {SpinnerPage,ParamPrice,rental,setNum};