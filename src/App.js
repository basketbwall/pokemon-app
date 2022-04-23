import logo from './logo.svg';
import './App.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { render } from '@testing-library/react';

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

//app needs to be rewritten to hold information about caught pokemon

//pass down a click function to the cards that will add to the inventory in app component
class App extends React.Component{
  constructor(props) {
    super(props);
    var data;
    if (localStorage.getObj('inventory') == null) {
      data = [];
    } else {
      data = localStorage.getObj('inventory');
    }
    this.state = {
      inventory: data,
      selectedName: null,
      selectedImage: null
    };
  }

  updateInventory = (array) => {
    this.setState({
      inventory: array,
    })
    localStorage.setObj('inventory', array);
  }

  render() {
    return (
      <div className="App">
        <div>
          <Card updateInventory={() => this.updateInventory(this.state.inventory)} inventory={this.state.inventory}/>
          <Card updateInventory={() => this.updateInventory(this.state.inventory)} inventory={this.state.inventory}/>
          <Card updateInventory={() => this.updateInventory(this.state.inventory)} inventory={this.state.inventory}/>
        </div>
        <div>
          <CardStorage inventory={this.state.inventory}/>
        </div>
      </div>
    );
  }
}

class CardStorage extends React.Component {
  render() {
    return (
      <div>
        <h1>Pokemon Collected So Far</h1>
        <div>
          {this.props.inventory.map(
            (item) =>
            <div>
              <img src={item.image}></img>
              <p>{item.name}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}



class Card extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: null,
      name: null
    };
  }

  componentDidMount() {
    var pokemonRoute;
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0")
      .then(res => res.json())
      .then(
        (result) => {
          //take random pokemon from results array
          var randomIndex = Math.floor(Math.random() * result.results.length);
          pokemonRoute = result.results[randomIndex].url;
          fetch(pokemonRoute)
            .then(res => res.json())
            .then(
              (result) => {
                this.setState({
                  name: result.name,
                  image: result.sprites.front_default
                });
              }
            );
        }
      );
    
  }

  render() {
    const { image, name } = this.state;
    return (
      <div className="card">
      <div className="card_body">
        <img 
          src={this.state.image}
          className='card_image'>
        </img>
        <p className='card_name'>{this.state.name}</p>
      </div>
      <button className="card_button" class="btn btn-primary" onClick={() => this.addPokemon()}>Catch Pokemon</button>
      </div>
    );
  };

  addPokemon() {
    this.props.inventory.push( { image: this.state.image, name: this.state.name } );
    this.props.updateInventory();
  }
}



export default App;
