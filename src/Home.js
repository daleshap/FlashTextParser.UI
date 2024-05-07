import React, {Component} from 'react';
import { variables } from './Variables';

export class Home extends Component{


    sanitizeText(){
        let textToSanitize = document.getElementsByName("textarea1")[0].value;

        if(textToSanitize.length !== 0)
          {
        console.log(textToSanitize);

        console.log('fetching data from url: ' + variables.API_URL + 'bannedWord/SanitizeText');
        console.log("text to sanitize" + JSON.stringify(textToSanitize));
        fetch(variables.API_URL + 'bannedWord/SanitizeText' , {
            method:'POST',
            mode: 'cors',
            credentials: 'same-origin' ,
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body: JSON.stringify(textToSanitize)
        }).then(res=> res.ok ? res.json() : Promise.reject)
        .then(data=>{document.getElementsByName("textarea2")[0].value = data.value;}, (error)=>{alert('Failed ' + error)})
      }
      else{
        alert("Please input text to sanitize.")
      }

    }

      render() {
        return (
          <div>
            <label>Input text to be sanitized : </label>
            <div class="input-group">
              <textarea class="form-control" name="textarea1" rows={10} placeholder="Input text here" ></textarea>
            </div>

            <button type='button' className='btn btn-primary float-start' onClick={()=>this.sanitizeText()}>Sanitize Text</button>

            <div class="input-group">
              <textarea class="form-control" name="textarea2" rows={10}></textarea>
            </div>
          </div>
        );
      }
}


export default Home;
