import axios from 'axios';
import React from 'react';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Alert, Modal, ButtonToolbar, Jumbotron } from 'react-bootstrap';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Editor } from '@tinymce/tinymce-react';
import RestService from './rest_service';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

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
            id_soluzione_corrente: null,
            allegati_soluzione: [],
            //valoriCorrenti: {},
            action: 'new',
            modalCancella: false,
            errori: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeMulti = this.handleChangeMulti.bind(this);
        this.changeVal = this.changeVal.bind(this);
        this.abilitaModifica = this.abilitaModifica.bind(this);
        this.dettaglioRisoluzione = this.dettaglioRisoluzione.bind(this);
        //cancellazione
        this.cancellaRisoluzione = this.cancellaRisoluzione.bind(this);
        this.chiudiModalCancellazione = this.chiudiModalCancellazione.bind(this);
        this.confermaCancellaRisoluzione = this.confermaCancellaRisoluzione.bind(this);
        //editor e testo
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.createMarkup = this.createMarkup.bind(this);
        //gestione file upload
        this.getUploadParams = this.getUploadParams.bind(this);
        this.changeStatusUploadFile = this.changeStatusUploadFile.bind(this);
        
    }

    
    //select con valore singolo per applicazioni
    handleChange = selected_app => {
        this.setState({ selectedOptionAppl: selected_app });
        //console.log("setto valore con handleChange: "+selected_app.label);
    };

    /* Per react select con creazione di nuovi valori vedi */
    /* https://react-select.com/creatable */
    //serve per salvare i valori della select multipla per i tags con creazione
    handleChangeMulti = (newValue: any, actionMeta: any) => {
        //console.log("setto valore con handleChangeMulti: "+newValue);
        this.setState({ selectedOptionTags: newValue });
        // console.group('Value Changed');
        // console.log(newValue);
        // console.log(`action: ${actionMeta.action}`);
        // console.groupEnd();
      };

    //copio il valore dell'editor nel campo di testo per poterlo poi salvare col submit
    handleEditorChange = (content, editor) => {
        //console.log('Content was updated:', content);
        $("#testo_soluzione").val(content);
    }

    //funzione richiamata al submit
    handleSubmit(event) {
        event.preventDefault();
        //in event.target.nomecampo.value ho il valore da usare
        //Controllo campi obbligatori
        let array_errori = [];
        if(!$("#problematica").val()){
            array_errori.push("Il campo Problematica non può essere vuoto");
        }
        if(!$("#testo_soluzione").val()){
            array_errori.push("Il campo Testo Soluzione non può essere vuoto");
        }
        if(array_errori.length > 0){
            console.log(array_errori);
            this.setState({errori: array_errori});
        }else{
            let tags = [];
            if($("input[name='tags']").length > 0){
                $("input[name='tags']").each(function(){
                    if(this.value != ""){
                        tags.push(this.value);
                    }                    
                })
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
                'id': this.props.risoluzione_attiva || this.state.id_soluzione_corrente,
                'allegati': this.state.allegati_soluzione
            }
            
            //passo il csrf al controller rails che lo vuole in POST
            var csrf_key = $("meta[name='csrf-param']").attr('content');
            var csrf_val = $("meta[name='csrf-token']").attr('content');
            postData[csrf_key] = csrf_val;
            console.log(JSON.stringify(postData));
            axios.post(dominio_corrente+'salva_risoluzione',postData,axiosConfig).then(create_res => {
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
                    let array_tags_salvati = [];
                    if(dati_risoluzione.tags != null && dati_risoluzione.tags != ""){
                        array_tags_salvati = dati_risoluzione.tags.split(", ");
                    }
                    this.setState({valoriCorrenti: {problematica: dati_risoluzione.problematica, 
                                                    testo_soluzione: dati_risoluzione.testo_soluzione,
                                                    tags: array_tags_salvati,
                                                    applicazione: dati_risoluzione.applicazione
                                                    } });
                    this.setState({action: 'show'});
                    $("#testo_soluzione").val(dati_risoluzione.testo_soluzione);

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

    //setto i valori correnti nel form
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

    //cambio lo stato per poter modificare i campi
    abilitaModifica(e){
        this.setState({action: 'edit'});
        e.preventDefault();
        //console.log("abilitaModifica fired!: "+event.target);
        let self = this;
        let obj_applicazione = this.props.applicazioni.filter(function(value, index, array){
            return value['label'] === self.state.valoriCorrenti.applicazione;
        });
        this.setState({selectedOptionAppl: obj_applicazione});
        let obj_tags = []
        this.state.tags.forEach(function(value, index, array){
            if(self.state.valoriCorrenti.tags && self.state.valoriCorrenti.tags.length > 0){
                //let array_tags_salvati = self.state.valoriCorrenti.tags.split(", ");
                //if(array_tags_salvati.length > 0){
                    self.state.valoriCorrenti.tags.forEach(element => {
                        if(value['label'] === element){
                            obj_tags.push(value);
                        }
                    });
                //}
                
            }
            
        });
        this.setState({selectedOptionTags: obj_tags});
    }

    //passo alla modalità read only dei dati
    dettaglioRisoluzione(e){
        this.setState({action: 'show'});
        e.preventDefault();
    }

    //mostra la finestra modale per confermare la cancellazione
    cancellaRisoluzione(e){
        e.preventDefault();
        this.setState({modalCancella: true});
    }

    //chiude la finestra modale
    chiudiModalCancellazione(){
        this.setState({modalCancella: false});
    }

    //al click sul conferma nella finestra modale chiama la cancellazione e riporta alla lista
    async confermaCancellaRisoluzione(){
        this.setState({modalCancella: false});
        //passo il csrf al controller rails che lo vuole in POST
        var csrf_key = $("meta[name='csrf-param']").attr('content');
        var csrf_val = $("meta[name='csrf-token']").attr('content');
        let postData = {};
        postData['id'] = this.props.risoluzione_attiva
        postData[csrf_key] = csrf_val;
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json', //fa vedere a rails che e' una richiesta json!
            },
            responseType: 'json'
        };
        axios.post(dominio_corrente+'cancella_risoluzione',postData,axiosConfig).then(dati_cancellazione => {
            if(dati_cancellazione.stato == 'ok'){
                console.log("Arrivati dati json per cancellazione risoluzione con esito ok");
                console.log(dati_cancellazione);
                //ritorno alla lista
                this.props.setMain(true,false,true,null);
            }else{ //ko
                console.log("Errore in cancellazione risoluzione");
                console.log(dati_cancellazione);
                this.setState({errori: ["Errore durante la cancellazione!"]});
            }
            this.props.setMain(true,false,true,null);
        }).catch(err =>{
            this.setState({errori: ["Errore durante la cancellazione!"]});
            console.log("Errore in cancellazione risoluzione: "+err);
            alert(err);
        });
        
        // var csrf_key = $("meta[name='csrf-param']").attr('content');
        // var csrf_val = $("meta[name='csrf-token']").attr('content');
        // let dati_cancellazione = await this.RestService.call_api(dominio_corrente, "cancella_risoluzione", null, null, { 'id': this.props.risoluzione_attiva, csrf_key: csrf_val}, 'json', 'post'); 
        //     console.log("Arrivati dati json per cancellazione risoluzione");
        //     if(dati_cancellazione.stato == 'ok'){
        //         console.log("Arrivati dati json per cancellazione risoluzione con esito ok");
        //         console.log(dati_cancellazione);
        //         //ritorno alla lista
        //         this.props.setMain(true,false,true,null);
        //     }else{ //ko
        //         console.log("Errore in cancellazione risoluzione");
        //         console.log(dati_cancellazione);
        //         this.setState({errori: ["Errore durante la cancellazione!"]});
        //     }
    }

    //Permette di togliere testo html dalla pagina e di interpretarlo senza avere xss
    createMarkup() {
        return {__html: this.state.valoriCorrenti.testo_soluzione};
    }

    getUploadParams(hash){
        let file = hash['file'];
        let meta = hash['meta'];
        //return { url: dominio_corrente+"salva_allegato?id_sol="+this.props.risoluzione_attiva } 
        let body = new FormData();
        let csrf_key = $("meta[name='csrf-param']").attr('content');
        let csrf_val = $("meta[name='csrf-token']").attr('content');
        body.append('fileField', file);
        body.append(csrf_key, csrf_val);
        return { url: dominio_corrente+"/salva_allegato?id_sol="+this.props.risoluzione_attiva, body }
    }

    // const getUploadParams = ({ file, meta }) => {
    //     const body = new FormData()
    //     body.append('fileField', file)
    //     return { url: 'https://httpbin.org/post', body }
    //   }

    changeStatusUploadFile({meta, file}, status, body){ 
        if(status === 'done'){
            let hash_response = JSON.parse(body[0]['xhr']['response']);
            //oggetto del tipo { stato: "ok", esito: "Allegato Salvato", allegato: 4, soluzione: 18 }
            this.setState({id_soluzione_corrente: hash_response['soluzione']});
            let array_allegati_soluzione = this.state.allegati_soluzione;
            array_allegati_soluzione.push(hash_response['allegato']);
            //array univoco
            array_allegati_soluzione = Array.from(new Set(array_allegati_soluzione) );
            this.setState({allegati_soluzione: array_allegati_soluzione});
        }
    }


    render (selectProps) {
        const selected_app = this.state.selectedOptionAppl;
        const selected_tags = this.state.selectedOptionTags;
        const maxSize = 5242880; //5MB per upload file

        // receives array of files that are done uploading when submit button is clicked
        const pulisciFileUpload = (files, allFiles) => {
            console.log(files.map(f => f.meta))
            allFiles.forEach(f => f.remove())
        }

        return (
            <div>
                <Modal show={this.state.modalCancella} onHide={this.chiudiModalCancellazione}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cancellazione!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Sei sicuro di cancellare?</h4>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.chiudiModalCancellazione}>Annulla</Button>
                        <Button bsStyle="primary" onClick={this.confermaCancellaRisoluzione}>Conferma</Button>
                    </Modal.Footer>
                </Modal>
            
                <Form onSubmit={this.handleSubmit} horizontal className="form_risoluzione">
                    
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
                    <FormGroup controlId="testo_soluzione" id="testo_soluzione">
                        <Col componentClass={ControlLabel} sm={2} lg={2}>
                            Info Soluzione* :
                        </Col>
                        <Col lg={8}>
                            {((!this.state.valoriCorrenti.testo_soluzione && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                                <div>
                                    <FormControl componentClass="textarea" name="testo_soluzione" id="testo_soluzione" className="hidden" value={this.state.valoriCorrenti.testo_soluzione} ></FormControl>
                                    <Editor
                                        initialValue={this.state.valoriCorrenti.testo_soluzione}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
                                                alignleft aligncenter alignright alignjustify | \
                                                bullist numlist outdent indent | removeformat | help'
                                        }}
                                        onEditorChange={this.handleEditorChange}
                                    />
                                </div>
                            )}
                            {this.state.valoriCorrenti.testo_soluzione && this.state.action == 'show' && (
                                <span className="form-control no_border" dangerouslySetInnerHTML={this.createMarkup()} ></span>
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
                            <span className="form-control no_border">{this.state.valoriCorrenti.tags.join(", ")}</span>
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
                    {((!this.state.valoriCorrenti.problematica && this.state.action == 'new') || (this.state.action == 'edit'))  && (
                    <Dropzone
                        getUploadParams={this.getUploadParams}
                        onChangeStatus={this.changeStatusUploadFile}
                        //onSubmit={handleSubmit}
                        //accept="image/*,audio/*,video/*"
                        minSize={0}
                        maxSize={maxSize}
                        multiple
                    />
                    // <Dropzone 
                    //     onDrop={acceptedFiles => console.log(acceptedFiles)}
                    //     minSize={0}
                    //     maxSize={maxSize}
                    //     multiple
                    //     >
                    //     {({getRootProps, getInputProps, isDragActive}) => (
                    //         <Jumbotron>
                    //         <div {...getRootProps()}>
                    //             <input {...getInputProps()} />
                    //             <p>{isDragActive ? "Drop it like it's hot!" : 'Click me or drag a file to upload!'}</p>
                    //         </div>
                    //         </Jumbotron>
                    //     )}
                    // </Dropzone>
                    )}
                    <br />
                    {/* <FormGroup>
                        {this.state.action == 'new' && (
                        <Col smOffset={1} sm={4} lg={2} md={2}>
                            <Button bsStyle="success" type="submit">Salva</Button>
                        </Col>
                        )}
                        {(this.state.action == 'edit' || this.state.action == 'remove') && (
                        <Col smOffset={1} sm={4} lg={2} md={2}>
                            <Button type="button" onClick={this.dettaglioRisoluzione} >Annulla</Button>
                        </Col>
                        )}
                        {(this.state.action == 'edit') && (
                        <Col sm={4} lg={2} md={2}>
                            <Button bsStyle="success" type="submit">Salva</Button>
                        </Col>
                        )}
                        {this.state.action == 'show' && (
                        <span>
                            <Col smOffset={1} sm={4} lg={2} md={2}>
                                <Button bsStyle="primary" onClick={this.abilitaModifica} type="button">Modifica</Button>
                            </Col>

                            <Col sm={4} lg={2} md={2}>
                                <Button bsStyle="danger" onClick={this.cancellaRisoluzione} type="button">Elimina</Button>
                            </Col>
                        </span>
                        )}
                    </FormGroup> */}

                    <ButtonToolbar>
                    {this.state.action == 'new' && (
                        
                            <Button bsStyle="success" type="submit">Salva</Button>
                        
                        )}
                        {(this.state.action == 'edit' || this.state.action == 'remove') && (
                        
                            <Button type="button" onClick={this.dettaglioRisoluzione} >Annulla</Button>
                       
                        )}
                        {(this.state.action == 'edit') && (
                       
                            <Button bsStyle="success" type="submit">Salva</Button>
                        
                        )}
                        {this.state.action == 'show' && (
                        <span>
                            
                                <Button bsStyle="primary" onClick={this.abilitaModifica} type="button">Modifica</Button>
                            
                                <Button bsStyle="danger" onClick={this.cancellaRisoluzione} type="button">Elimina</Button>
                            
                        </span>
                        )}
                    </ButtonToolbar>



                </Form>
            </div>
        );
    }
}