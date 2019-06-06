import React from 'react';
import './App.css';


class App extends React.Component{
 
  constructor(props){
   super();
   this.state = { 

      public_key: "d4874e4e-522d-4361-b699-cf021b735c81",
      private_key:"75c320b4-03a2-401f-a028-25d699074627",
      app_id: "com.facebook.sparkol-india-unosoft",
      token:"",
      type:"",
      payment_id:"",
      possible_next_action:"",
      possible_next_action_href_charge:"",
      possible_next_action_href_authorize:"",
      possible_next_action_href_capture:"",
      created:"",
      pass_luhn_validation_:false,
      encrypted_cvv:"",
      token_type:"credit_card",
      created_state:"", 
      bin_number:"",
      holder_name:"delicouschef",
      card_number:"4863370083176698",
      expiration_date:"07/24",
      ccv:"851", 
      amount:4097,
      currency:"EUR",
      paymentsOsEnv:'test',
      idempotency_key:'123456789'
      

   }
   this.handleButtonSubmit = this.handleButtonSubmit.bind(this);
   this.tokenize = this.tokenize.bind(this);
   this.createPayment = this.createPayment.bind(this);
   this.authorize = this.authorize.bind(this);
   this.charges = this.charges.bind(this);
   this.capture =this.capture.bind(this);
   
  }

  
  componentWillMount()
  {

       
      
  }
           //button submit
      handleButtonSubmit(e)
      {
        e.preventDefault();
           //passing the value from the form to state
      /*this.setState({
        holder_name:e.target.holder_name.value, 
        card_number:e.target.card_number.value,
        expiration_date:e.target.expiration_date.value,
        cvv:e.target.cvv.value
      });*/

       //calling the tokenize
       this.tokenize();
      }
  async tokenize(){
     
     const tokenObj =  await fetch('https://api.paymentsos.com/tokens', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'public_key':this.state.public_key,
          'app_id': this.state.app_id,
          'api-version': "1.2.0",
          'x-payments-os-env': this.state.paymentsOsEnv,
          
        },
        body: JSON.stringify({
          "token_type": this.state.token_type,
          "credit_card_cvv": this.state.cvv,
          "card_number": this.state.card_number,
          "expiration_date": this.state.expiration_date,
          "holder_name": this.state.holder_name
        })

      });

      const data = await tokenObj.json();
      this.setState({token:data.token,type:data.type});
      console.log("Token result is: "+this.state.token + "The type is: "+ this.state.type);
      
     this.createPayment();
    
      
      
        
  }
async createPayment()
  {
    const tokenObj = await fetch('https://api.paymentsos.com/payments', {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key':this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': "1.2.0",
        'x-payments-os-env': this.state.paymentsOsEnv
        
      },
      body: JSON.stringify({
        "amount": this.state.amount,
        "currency": this.state.currency,
      })
      });

       const data = await tokenObj.json();
        
       this.setState({payment_id:data.id, 
        possible_next_action_href_charge:data.possible_next_actions[1].href,
        possible_next_action_href_authorize:data.possible_next_actions[2].href
      });
       console.log(data);
       console.log("charge"+this.state.possible_next_action_href_charge +
                   "authorize: "+this.state.possible_next_action_href_authorize);
    
       this.authorize();  
  }  

  async authorize()
  {
    const tokenObj = await fetch(this.state.possible_next_action_href_authorize, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key':this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': "1.2.0",
        'x-payments-os-env': this.state.paymentsOsEnv,
        'idempotency_key':this.state.idempotency_key
        
      },
      body: JSON.stringify(    {
        "payment_method": {
          "token": this.state.token,
          "type": this.state.type,
          "credit_card_cvv": this.state.ccv
        }, 
        "reconciliation_id": "23434534534"
      
      
      }
      )
      });

       const data = await tokenObj.json();
       console.log(data);
       this.charges();
        
    }

    async capture()
    {

    const tokenObj = await fetch("https://api.paymentsos.com/payments/"+this.state.payment_id+"/captures", {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key':this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': "1.2.0",
        'x-payments-os-env': this.state.paymentsOsEnv,
        'idempotency_key':this.state.idempotency_key
        
      }
      });

       const data = await tokenObj.json();
       console.log(data);
       

  }
  async charges()
  {

    const tokenObj = await fetch(this.state.possible_next_action_href_charge, {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'private_key':this.state.private_key,
        'app_id': this.state.app_id,
        'api-version': "1.2.0",
        'x-payments-os-env': this.state.paymentsOsEnv,
        'idempotency_key':this.state.idempotency_key
        
      },
      body: JSON.stringify({
        "payment_method": {
        "type": this.state.type,
        "token": this.state.token
      }})
      });

       const data = await tokenObj.json();
       console.log(data);
      
  }


      render(){

        return (
          <div className="App">
      
           <form id="payment-form" onSubmit={this.handleButtonSubmit}> 
           
              <label>Holder Name</label>
              <input type="text" name="holder_name"/> 
              <label>card number</label>
              <input type="text" name="card_number"/>
              <label>Expiration date</label>
              <input type="text" name="expiration_date"/> 
              <label>CVV</label>
              <input type="text" name="cvv"/>
             <button type="submit">Pay You</button>
           </form>
        </div>
        );
      }
}

export default App;
