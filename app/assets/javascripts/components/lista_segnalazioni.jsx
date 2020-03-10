import React from 'react';
import RestService from './rest_service';
import BootstrapTable from 'react-bootstrap-table-next';



export default class ListaSegnalazioni extends React.Component {
  
  constructor(props) {
    super(props);
    this.RestService = new RestService();
    this.state = {
      segnalazioni: [],
      numSegnalazioni: 0
    }

    this.colonneTab = [
      {
        dataField: "id",
        text: "Id",
        hidden: true
      },
      {
        dataField: "problematica",
        text: "Problematica"
      },
      {
        dataField: "applicazione",
        text: "Applicazione"
      }
    ];


  }


  
  async componentDidMount() {
    try
    {
      console.log("Did mount Lista segnalazioni");
      //status_id: 1 = nuova,
      // linked_custom_fields_id=251 -> area Open Web 
      
      let dati_json = await this.RestService.call_api("https://servizipa.dedagroup.it/redmine", "issues", null, null, { 'project_id': 'hd', 'linked_custom_fields_id': '251', 'status_id': '1', 'key': '56db112289fae0be5eaa88f737d42d0c95ac408c' }, "json"); 
      this.setState({segnalazioni: await dati_json.issues});
      this.setState({numSegnalazioni: await dati_json.total_count});
      
    
    }
    catch(error)
    {
      console.log("Erroreeeee: "+error);
    }
    
    //Arriva oggetto del tipo
//                 issues: Array(16) [ 
//                     {
//                         "id": 497951,
//                         "project": {
//                           "id": 14,
//                           "name": "Help Desk"
//                         },
//                         "tracker": {
//                           "id": 4,
//                           "name": "Segnalazione HD"
//                         },
//                         "status": {
//                           "id": 1,
//                           "name": "Nuova"
//                         },
//                         "priority": {
//                           "id": 4,
//                           "name": "Normale"
//                         },
//                         "author": {
//                           "id": 1078,
//                           "name": "MARCO MEALLI (TERRANUOVA BRACCIOLINI)"
//                         },
//                         "subject": "Open Web - Aggancio estrazioni cig",
//                         "description": "vi allego i file che abbiamo prodotto ma che non riusciamo a importare (restituisce errore a ogni riga).\r\nfateci sapere come procedere, grazie ",
//                         "start_date": "2020-01-20",
//                         "done_ratio": 0,
//                         "custom_fields": [
//                           {
//                             "id": 3,
//                             "name": "Versione applicativo",
//                             "value": ""
//                           },
//                           {
//                             "id": 4,
//                             "name": "SHD",
//                             "value": ""
//                           },
//                           {
//                             "id": 23,
//                             "name": "WBS",
//                             "value": ""
//                           },
//                           {
//                             "id": 27,
//                             "name": "Cliente",
//                             "value": "TERRANUOVA BRACCIOLINI Comune di"
//                           },
//                           {
//                             "id": 90,
//                             "name": "Cliente Partner",
//                             "value": ""
//                           },
//                           {
//                             "id": 28,
//                             "name": "E-mail di risposta",
//                             "value": "ict@comune.terranuova-bracciolini.ar.it"
//                           },
//                           {
//                             "id": 29,
//                             "name": "Telefono",
//                             "value": "0559194787"
//                           },
//                           {
//                             "id": 53,
//                             "name": "E-mail di risposta Cc",
//                             "value": ""
//                           },
//                           {
//                             "id": 35,
//                             "name": "lab",
//                             "value": "0"
//                           },
//                           {
//                             "id": 36,
//                             "name": "Motivazione chiusura",
//                             "value": ""
//                           },
//                           {
//                             "id": 38,
//                             "name": "Metodologia chiusura",
//                             "value": ""
//                           },
//                           {
//                             "id": 43,
//                             "name": "Risposta con FAQ",
//                             "value": "No"
//                           },
//                           {
//                             "id": 45,
//                             "name": "Intervento manuale (SQL etc)",
//                             "value": "0"
//                           },
//                           {
//                             "id": 77,
//                             "name": "Installazione Patch",
//                             "value": ""
//                           },
//                           {
//                             "id": 131,
//                             "name": "EVENTO",
//                             "value": ""
//                           }
//                         ],
//                         "created_on": "2020-01-20T12:39:14Z",
//                         "updated_on": "2020-01-20T12:39:14Z"
//                       }
                    
//                     , {…}, {…}, … ]
// ​
//                 limit: 25
//                 ​
//                 offset: 0
//                 ​
//                 total_count: 16
//  }
  
   
  }

  

  
  render () {
    return (
      <span>Comp Lista Segnalazioni: Totali {this.state.numSegnalazioni}</span>
    );
  }
}