import axios from 'axios';
import React from 'react';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Alert } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import RestService from './rest_service';

const dominio_corrente = window.location.origin+window.location.pathname;
export default class Risoluzione extends React.Component {
  
    constructor(props){
        super(props);
        // this.state = {
        //     'nuovaRisoluzione': {
        //         'problematica': '',
        //         'testo_soluzione': '',
        //         'tags': ''
        //         //tags: [] da fare, creare array
        //     }
        // }
        this.RestService = new RestService();
        this.state = {
            selectedOption: null,
            tags: [],
            numeroTags: 0,
            valoriCorrenti: {
                problematica: null, 
                testo_soluzione: null,
                tags: [],
                applicazione: null
            },
            //valoriCorrenti: {},
            action: null,
            errori: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.changeVal = this.changeVal.bind(this);
        
    }

    /* Per react select con creazione di nuovi valori vedi */
    /* https://react-select.com/creatable */

    handleChange = selected_option => {
        this.setState({ selectedOption: selected_option });
        console.log("setto valore con handleChange: "+selected_option.label);
    };


    handleChangeMulti = (newValue: any, actionMeta: any) => {
        console.log("setto valore con handleChangeMulti: "+newValue);
        console.group('Value Changed');
        console.log(newValue);
        console.log(`action: ${actionMeta.action}`);
        console.groupEnd();
      };

    handleSubmit(event) {
        event.preventDefault();
        //in event.target.nomecampo.value ho il valore da usare
        console.log("event target!");
        console.log(event.target.problematica);
        console.log(event.target.testo_soluzione);
        //Controllo campi obbligatori
        let array_errori = [];
        if(!event.target.problematica.value){
            array_errori.push("Il campo Problematica non può essere vuoto");
        }
        if(!event.target.testo_soluzione.value){
            array_errori.push("Il campo Testo Soluzione non può essere vuoto");
        }
        if(array_errori.length > 0){
            console.log(array_errori);
            this.setState({errori: array_errori});
        }else{
            let tags = [];
            if(event.target.tags.length > 0){
                event.target.tags.forEach(element => {
                    tags.push(element.value);
                });
            }
            console.log(tags);
            let axiosConfig = {
                headers: {
                    //'Content-Type': 'application/json',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json', //fa vedere a rails che e' una richiesta json!
                },
                responseType: 'json'
            };
            let postData = {
                'problematica': event.target.problematica.value,
                'testo_soluzione': event.target.testo_soluzione.value,
                'tags': tags,
                'applicazione': event.target.applicazione.value
            }
            
            //passo il csrf al controller rails che lo vuole in POST
            var csrf_key = $("meta[name='csrf-param']").attr('content');
            var csrf_val = $("meta[name='csrf-token']").attr('content');
            postData[csrf_key] = csrf_val;
            console.log(JSON.stringify(postData));
            axios.post('salva_risoluzione',postData,axiosConfig).then(create_res => {
                console.log("Creata nuova Risoluzione:", create_res);
                this.props.setMain(true,false,true,null);
            }).catch(err =>{
                alert(err);
            });
        }


        
        
    }
  
    async componentDidMount() {
        try
        {
            console.log("Did mount Risoluzione");
            console.log(this.props);

            let dati_tags = await this.RestService.call_api(dominio_corrente, "tags", null, null, {}, "json"); 
            console.log("Arrivati dati json tags");
            if(dati_tags.stato == 'ok'){
                console.log("Arrivati dati json per tags con esito ok");
                console.log(dati_tags);
                this.setState({action: 'new'});
                this.setState({tags: dati_tags.lista_per_tabella});
                this.setState({numeroTags: dati_tags.totale_righe});
                this.setState({numeroTags: dati_tags.totale_righe});
            }else{ //ko
                console.log("Errore su chiamata per lista risoluzioni");
                console.log(dati_tags);
                //$("#msg_errore").text(res.data.messaggio);
                //$("#msg_errore").removeClass('d-none');
                
            }
            //caso show di una risoluzione
            if(this.props.risoluzione_attiva !== null){ 
                let dati_risoluzione = await this.RestService.call_api(dominio_corrente, "risoluzioni", this.props.risoluzione_attiva, null, {}, "json"); 
                console.log("Arrivati dati json per risoluzione");
                if(dati_risoluzione.stato == 'ok'){
                    console.log("Arrivati dati json per risoluzione con esito ok");
                    console.log(dati_risoluzione);
                    this.setState({valoriCorrenti: {problematica: dati_risoluzione.problematica, 
                                                    testo_soluzione: dati_risoluzione.testo_soluzione,
                                                    tags: dati_risoluzione.tags,
                                                    applicazione: dati_risoluzione.applicazione
                                                    } });
                    this.setState({action: 'show'})
                }else{ //ko
                    console.log("Errore su chiamata risoluzione "+this.props.risoluzione_attiva);
                    console.log(dati_risoluzione);
                    //$("#msg_errore").text(res.data.messaggio);
                    //$("#msg_errore").removeClass('d-none');
                    
                }
            }else{
                //caso new
                console.log("Caso new risoluzione");
                this.setState({valoriCorrenti: {
                                                problematica: null, 
                                                testo_soluzione: null,
                                                tags: [],
                                                applicazione: null } 
                            });
            }
            
        }
        catch(error)
        {
          console.log("Erroreeeee: "+error);
        }
        
    }

    changeVal(event){
        console.log("changeVal fired!: "+event);
    }

    render (selectProps) {
        const selected_option = this.state.selectedOption;
        
        return (
            <Form onSubmit={this.handleSubmit} horizontal>
                
                {this.state.errori.map((value, index) => {
                    return <Alert key={index} bsStyle="danger">{value}</Alert>;
                })}             
               
                <FormGroup controlId="problematica">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Problematica* :
                    </Col>
                    <Col sm={10} lg={8}>
                        <FormControl type="text"
                            name="problematica"
                            placeholder="Segnalazione/Problema"
                            value={this.state.valoriCorrenti.problematica}
                            onChange={this.changeVal} />
                    </Col>
                </FormGroup>
                <FormGroup controlId="testo_soluzione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Info Soluzione* :
                    </Col>
                    <Col lg={8}>
                        <FormControl componentClass="textarea" name="testo_soluzione" placeholder="Testo" value={this.state.valoriCorrenti.testo_soluzione}></FormControl>
                    </Col>
                </FormGroup>
                <FormGroup controlId="tags">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Tags :
                    </Col>
                    <Col lg={8}>
                    {!this.state.valoriCorrenti.problematica && (
                        <CreatableSelect
                            name='tags'
                            isMulti
                            onChange={this.handleChangeMulti}
                            options={this.state.tags}
                        />
                    )}
                    {this.state.valoriCorrenti.problematica && (
                        <FormControl type="text" name="tags" value={this.state.valoriCorrenti.tags} />
                    )}
                    </Col>
                </FormGroup>

                <FormGroup controlId="applicazione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Applicazione :
                    </Col>
                    <Col lg={8}>
                    {!this.state.valoriCorrenti.problematica && (
                    <Select
                        name='applicazione'
                        value={selected_option}
                        onChange={this.handleChange}
                        options={this.props.applicazioni}
                    />
                    )}
                    {this.state.valoriCorrenti.problematica && (
                        <FormControl type="text" name="applicazione" value={this.state.valoriCorrenti.applicazione} />
                    )}
                    </Col>
                </FormGroup>
                
                <br />
                <FormGroup>
                    {!this.state.valoriCorrenti.problematica && (
                    <Col smOffset={1} sm={4} lg={1}>
                        <Button bsStyle="success" type="submit">Salva</Button>
                    </Col>
                    )}
                    {this.state.valoriCorrenti.problematica && (
                    <span>
                        <Col smOffset={1} sm={4} lg={1}>
                            <Button bsStyle="primary" type="button">Modifica</Button>
                        </Col>

                        <Col sm={4} lg={1}>
                            <Button bsStyle="danger" type="button">Elimina</Button>
                        </Col>
                    </span>
                    )}
                </FormGroup>
            </Form>
        );
    }
}