//vedi https://dzone.com/articles/consuming-rest-api-with-reactjs
import axios from 'axios';

export default class RestService {
  
    constructor(props){
        this.call_api = this.call_api.bind(this);
    }

    // funzione parametrica per fare chiamate rest
    // base_url è il dominio + root path delle api
    // element_type è la risorsa su cui fare la chiamata rest, es per avere gli utenti -> users
    // id viene usato se si vuole avere l'elemento con quell'id, es: users/125 con id 125 
    // azione indica una azione crud (NEW, CREATE, SHOW)
    // params è un hash con chiave valore che viene convertito in parametri
    // resp format è il tipo di risposta che si vuole avere, json o xml
    // VEDERE COME ESEMPIO https://guides.rubyonrails.org/routing.html#crud-verbs-and-actions
    call_api(base_url, element_type, id, action, params, resp_format) {
        //Per dati in post
        // const data = {
        //     username: username,
        //     password: password
        // }
        let axiosConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
       
        /* Definisco una promise per poter usare async/await o then */
        var promise = new Promise(function(resolve, reject) {
            // do a thing, possibly async, then…
            console.log("RestService call from param");
            //converto l'hashmap in una stringa del tipo chiave=valore&chiave2=valore2
            var full_url_api = base_url+"/"+element_type+"."+resp_format;
            if(id != null){
                full_url_api += "/"+id
            }
            if(action != null){
                full_url_api += "/"+action
            }
            if(params != null){
                var str_params = "?"
                for (var key_par in params)
                {
                    console.log("Key:"+ key_par + ", ");
                    str_params += key_par+"="+params[key_par]+"&";
                }
                console.log("str_params:"+ str_params);
                //rimuovo ultimo carattere & e aggiungo all'url completo
                full_url_api += str_params.slice(0, -1);

            }
            console.log("Full url: "+full_url_api);
            axios.get(full_url_api,axiosConfig)
                .then(response => {
                    if(!response.statusText == 'OK'){
                        console.log("Response non ok");
                        this.handleResponseError(response);
                    }
                    //prende la response e passa avanti il data
                    return response.data;
                })
                .then((data) => {
                    //console.log(data);
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                    //this.handleError(error);
            });

          });
          return promise;
    }
    
    /* Gestione degli errori sulla response */
    handleResponseError(response) {
        throw new Error("HTTP error, status = " + response.status);
    }
  
    handleError(error) {
        console.log(error.message);
        alert("Problema di comunicazione. Ricaricare la pagine e se il problema persiste contattare l'amministratore.")
    }
  
  
    
}