import React from 'react';
import './App.css';
class App extends React.Component{
 
  constructor(props){
   super();
   this.state = { 

      public_key: "337b9134-dc78-4ba3-8cb8-0db7d8a3d130",
      app_id: "com.facebook.sparkol",
      token:"",
      created:"",
      pass_luhn_validation_:false,
      encrypted_cvv:"",
      token_type:"",
      created_state:"", 
      bin_number:"",
      

   }


  }
  componentWillMount()
  {

        fetch('https://api.paymentsos.com/tokens', {  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'public_key':this.state.public_key,
            'app_id': this.state.app_id,
            'api-version': "1.2.0",
            'x-payments-os-env': 'test',
            
          },
          body: JSON.stringify({
            "token_type": "credit_card",
            "credit_card_cvv": "123",
            "card_number": "4111111111111111",
            "expiration_date": "10/29",
            "holder_name": "John Mark",
            "public_key" : "625c77a9-f0f9-4884-8062-fcb7c87cbc37",
          })
    
    }).then(function(response){ 
      
      return response.json()})
      .then(function(response){
         
      console.log("sucess tokenization");
      console.log(response);
            
    });
      
      
}
      render(){

        return (
          <div className="App">
            
          </div>
        );
      }
}

export default App;
