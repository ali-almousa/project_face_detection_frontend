import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from "react-tsparticles";
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
// import Clarifai from 'clarifai';
import './App.css';


const particlesOptions = {
  background: {
    color: {
      value: "#0d47a1",
    },
  },
  fpsLimit: 60,
  interactivity: {
    detectsOn: "canvas",
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: "none",
      enable: true,
      outMode: "bounce",
      random: false,
      speed: 10,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 900,
      },
      value: 90,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "circle",
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
}

const initialState = {
      input: "",
      imageUrl:"",
      box:{},
      route: 'signin',
      isSignedin: false,
      user: {
            id: '',
            name:'',
            email: '',
            entries: 0,
            joined: ''
      }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    const { id, name, email, entries, joined } = data;
    this.setState({user: {
      id: id,
      name: name,
      email: email,
      entries: entries,
      joined: joined
    }})

  }


  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width, height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }


  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch('https://whispering-garden-14883.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then( response => {
      if (response){
      fetch('https://whispering-garden-14883.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })

        .then(response => response.json()).then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
        .catch(console.log)
      }

      this.displayFaceBox(this.calculateFaceLocation(response))
    } 

      ).catch(err => console.log(err));
  }

  onRouteChange = (route) =>{
    if(route === 'signout'){
      this.setState(initialState);
    }else if(route === 'home'){
      this.setState({isSignedin:true});
    }
    this.setState({route: route})
  }


  render(){
    const { isSignedin, imageUrl, route, box } = this.state;

    return (
      <div className="App">
        <Particles className='particles'
        id="tsparticles"
        options={particlesOptions}
      />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange} />

        { this.state.route === 'home' ?

            <div>
              <Logo style={{width:250, height:250}} />
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
      
          : ( route === 'signin' || route === 'signout' ? 
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              :
              <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />

            )}
        
      </div>
    );
  }
}

export default App;
