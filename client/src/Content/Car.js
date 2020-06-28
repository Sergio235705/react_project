
class Car {
  
  constructor(modello,marca,categoria) {
    this.Modello = modello;
    this.Marca = marca;
    this.Categoria = categoria;
  }

  
  static from(json) {
    return Object.assign(new Car(), json);
  }

}

export default Car;