import React from 'react';
import { Form, FormControl, FormGroup, Checkbox, Button, Col, ControlLabel } from 'react-bootstrap';
import $ from 'jquery';
import Risoluzione from '../components/risoluzione';
import ListaRisoluzioni from '../components/lista_risoluzioni';
import LoadingModal from '../components/loading_modal';

//https://reactjs.org/docs/conditional-rendering.html

export default class MainContainer extends React.Component {
  
    constructor(props){
        super(props);
        this.handleNewRisoluzione = this.handleNewRisoluzione.bind(this);
        this.handleListaRisoluzioni = this.handleListaRisoluzioni.bind(this); 
        this.setMain = this.setMain.bind(this);     
        this.state = {
            lista_risoluzioni: true,
            form_risoluzioni: false,
            visibleModal: false,
            risoluzione_attiva: null,
            applicazioni: JSON.parse($("#applicazioni").text())
        }
    }

    /* spengo lo spinner dopo mezzo secondo */
    componentDidUpdate(){
        if (this.state.visibleModal) {
            let self = this;
            console.log("props diverse - chiudo");
            setTimeout(function () { self.setState({visibleModal: false }); }, 500);
        }
    }

    /* apre form della risoluzione: usato per nuova o modifica */
    handleNewRisoluzione(){
        this.setState({lista_risoluzioni: false, form_risoluzioni: true, visibleModal: true, risoluzione_attiva: null });
    }

    /* apre form della risoluzione: usato per nuova o modifica */
    handleListaRisoluzioni(){
        this.setState({lista_risoluzioni: true, form_risoluzioni: false, visibleModal: true, risoluzione_attiva: null });
    }
  
    // Funzione per comandare componente main da figli
    setMain(lista,form,modal,id_risoluzione) {
        if(lista){
            this.setState({lista_risoluzioni: true, form_risoluzioni: false, visibleModal: modal, risoluzione_attiva: id_risoluzione});
        }
        if(form){
            this.setState({lista_risoluzioni: false, form_risoluzioni: true, visibleModal: modal, risoluzione_attiva: id_risoluzione});
        }
    }


    render () {
        if(this.state.lista_risoluzioni === true){
            return (
                <div>
                    <LoadingModal visibleModal={this.state.visibleModal} />
                    <ListaRisoluzioni setMain={this.setMain}/>
                    <Button bsStyle="primary" onClick={this.handleNewRisoluzione}>Nuova</Button>
                </div>
            )
        }else{
            if(this.state.form_risoluzioni === true){
                return (
                    <div>
                        <LoadingModal visibleModal={this.state.visibleModal} />
                        <Risoluzione applicazioni={this.state.applicazioni} setMain={this.setMain} risoluzione_attiva={this.state.risoluzione_attiva}/>
                        <Button bsStyle="primary" onClick={this.handleListaRisoluzioni}>Indietro</Button>
                    </div>
                );
            }
        }

        
    }
}


