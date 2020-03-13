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
            selectedOptionAppl: null,
            selectedOptionTags: null,
            tags: [],
            numeroTags: 0,
            valoriCorrenti: {
                problematica: null, 
                testo_soluzione: null,
                tags: [],
                applicazione: null
            },
            //valoriCorrenti: {},
            action: 'new',
            errori: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.changeVal = this.changeVal.bind(this);
        this.abilitaModifica = this.abilitaModifica.bind(this);
        
    }

    /* Per react select con creazione di nuovi valori vedi */
    /* https://react-select.com/creatable */

    handleChange = selected_app => {
        this.setState({ selectedOptionAppl: selected_app });
        console.log("setto valore con handleChange: "+selected_app.label);
    };


    handleChangeMulti = (newValue: any, actionMeta: any) => {
        console.log("setto valore con handleChangeMulti: "+newValue);
        this.setState({ selectedOptionTags: newValue });
        // console.group('Value Changed');
        // console.log(newValue);
        // console.log(`action: ${actionMeta.action}`);
        // console.groupEnd();
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
                'applicazione': event.target.applicazione.value,
                'id': this.props.risoluzione_attiva
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
            if(this.props.risoluzione_attiva){ 
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
                    this.setState({action: 'show'});

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
                this.setState({action: "new"});
            }
        }
        catch(error)
        {
          console.log("Erroreeeee: "+error);
        }
        
    }

    changeVal(e){
        console.log("changeVal fired!: "+e);
        if(this.state.action == 'edit'){
            const {name, value} = e.target;
            if(name == 'problematica' || name == 'testo_soluzione'){
                this.setState({valoriCorrenti: {[name]: value} });
                // console.log("Attuali valori correnti");
                // console.log(this.state.valoriCorrenti);
            }
            if(name == 'applicazione'){
                console.log("Applicazione selected option");
                console.log(value);
            }
        }
    }

    abilitaModifica(e){
        this.setState({action: 'edit'});
        e.preventDefault();
        console.log("abilitaModifica fired!: "+event.target);
        let self = this;
        let obj_applicazione = this.props.applicazioni.filter(function(value, index, array){
            return value['label'] === self.state.valoriCorrenti.applicazione;
        });
        this.setState({selectedOptionAppl: obj_applicazione});
        let obj_tags = []
        this.state.tags.forEach(function(value, index, array){
            self.state.valoriCorrenti.tags.split(", ").forEach(element => {
                if(value['label'] === element){
                    obj_tags.push(value);
                }
            });
        });
        this.setState({selectedOptionTags: obj_tags});
    }



    render (selectProps) {
        const selected_app = this.state.selectedOptionAppl;
        const selected_tags = this.state.selectedOptionTags;
        
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
                        {((!this.state.valoriCorrenti.problematica && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                        <FormControl type="text"
                            name="problematica"
                            placeholder="Segnalazione/Problema"
                            value={this.state.valoriCorrenti.problematica}
                            onChange={this.changeVal} />
                        )}
                        {this.state.valoriCorrenti.problematica && this.state.action == 'show' && (
                            <span className="form-control no_border">{this.state.valoriCorrenti.problematica}</span>
                        )}
                    </Col>
                </FormGroup>
                <FormGroup controlId="testo_soluzione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Info Soluzione* :
                    </Col>
                    <Col lg={8}>
                        {((!this.state.valoriCorrenti.testo_soluzione && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                            <FormControl onChange={this.changeVal} componentClass="textarea" name="testo_soluzione" placeholder="Testo" value={this.state.valoriCorrenti.testo_soluzione}></FormControl>
                        )}
                        {this.state.valoriCorrenti.testo_soluzione && this.state.action == 'show' && (
                            <span className="form-control no_border">{this.state.valoriCorrenti.testo_soluzione}</span>
                        )} 
                    </Col>
                </FormGroup>
                <FormGroup controlId="tags">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Tags :
                    </Col>
                    <Col lg={8}>
                    {((!this.state.valoriCorrenti.problematica && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                        <CreatableSelect
                            name='tags'
                            isMulti
                            value={selected_tags}
                            onChange={this.handleChangeMulti}
                            options={this.state.tags}
                        />
                    )}
                    {this.state.valoriCorrenti.problematica && this.state.action == 'show' && (
                        <span className="form-control no_border">{this.state.valoriCorrenti.tags}</span>
                    )}
                    </Col>
                </FormGroup>

                <FormGroup controlId="applicazione">
                    <Col componentClass={ControlLabel} sm={2} lg={2}>
                        Applicazione :
                    </Col>
                    <Col lg={8}>
                    {((!this.state.valoriCorrenti.problematica && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                    <Select
                        name='applicazione'
                        value={selected_app}
                        onChange={this.handleChange}
                        options={this.props.applicazioni}
                    />
                    )}
                    {this.state.valoriCorrenti.problematica && this.state.action == 'show' && (
                        <span className="form-control no_border">{this.state.valoriCorrenti.applicazione}</span>
                    )}
                    </Col>
                </FormGroup>
                
                <br />
                <FormGroup>
                    {(this.state.action == 'new' || this.state.action == 'edit') && (
                    <Col smOffset={1} sm={4} lg={1}>
                        <Button bsStyle="success" type="submit">Salva</Button>
                    </Col>
                    )}
                    {this.state.action == 'show' && (
                    <span>
                        <Col smOffset={1} sm={4} lg={1}>
                            <Button bsStyle="primary" onClick={this.abilitaModifica} type="button">Modifica</Button>
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