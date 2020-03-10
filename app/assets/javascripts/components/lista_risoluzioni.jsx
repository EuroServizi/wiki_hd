import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
//VEDI PER OPZIONI
//https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import RestService from './rest_service';

const dominio_corrente = window.location.origin+window.location.pathname;

export default class ListaRisoluzioni extends React.Component {
  
    constructor(props) {
        super(props);
        this.RestService = new RestService();
        this.state = {
            page: 1,
            data: [],
            totalSize: 0,
            sizePerPage: 10
          };
        
        

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

        this.handleTableChange = this.handleTableChange.bind(this);
        this.completaDati = this.completaDati.bind(this);
    }

    completaDati = (dati) => {
        console.log("completo i dati");
        return dati;
    }
        
    async componentDidMount() {
        try
        {
            console.log("Did mount Lista Risoluzioni");
            let dati_json = await this.RestService.call_api(dominio_corrente, "risoluzioni", null, null, { 'page': this.state.page, 'sizePerPage': this.state.sizePerPage }, "json"); 
            console.log("Arrivati dati json");
            if(dati_json.stato == 'ok'){
                console.log("Arrivati dati json con esito ok");
                console.log(dati_json);
                this.setState({data: this.completaDati(dati_json.lista_per_tabella)});
                this.setState({totalSize: dati_json.totale_righe});
                this.setState({page: dati_json.pag_corrente});
            }else{ //ko
                console.log("Errore su chiamata per lista risoluzioni");
                console.log(dati_json);
                //$("#msg_errore").text(res.data.messaggio);
                //$("#msg_errore").removeClass('d-none');
                
            }
        }
        catch(error)
        {
          console.log("Erroreeeee: "+error);
        }
        
    }


    // fetchData(page = this.state.page, sizePerPage = this.state.sizePerPage) {
    //     let dati_json = await this.RestService.call_api(dominio_corrente, "risoluzioni", null, null, { 'page': page, 'sizePerPage': sizePerPage }, "json"); 
    //     this.setState({data: await dati_json.issues});
    //     this.setState({totalSize: await dati_json.total_count});
    //     this.setState({page: await dati_json.sizePerPage});

    // }

    async handleTableChange(type, { page, sizePerPage, sortField, sortOrder }){
        const currentIndex = (page - 1) * sizePerPage;
        try
        {
            //   // Handle column sort
            //   if (sortOrder === 'asc') {
            //     result = result.sort((a, b) => {
            //       if (a[sortField] > b[sortField]) {
            //         return 1;
            //       } else if (b[sortField] > a[sortField]) {
            //         return -1;
            //       }
            //       return 0;
            //     });
            //   } else {
            //     result = result.sort((a, b) => {
            //       if (a[sortField] > b[sortField]) {
            //         return -1;
            //       } else if (b[sortField] > a[sortField]) {
            //         return 1;
            //       }
            //       return 0;
            //     });
            //   }
            console.log("Ricarico Lista Risoluzioni con handleTableChange");
            let dati_json = await this.RestService.call_api(dominio_corrente, "risoluzioni", null, null, { 'page': page, 'sizePerPage': sizePerPage }, "json"); 
            if(dati_json.stato == 'ok'){
                console.log("Arrivati dati json con esito ok");
                console.log(dati_json);
                //console.log(dati_json);
                this.setState({data: this.completaDati(dati_json.lista_per_tabella)});
                this.setState({totalSize: dati_json.totale_righe});
                this.setState({page: dati_json.pag_corrente});
                this.setState({sizePerPage: sizePerPage});
            }else{ //ko
                console.log("Errore su chiamata per lista risoluzioni");
                console.log(dati_json);
                //$("#msg_errore").text(res.data.messaggio);
                //$("#msg_errore").removeClass('d-none');
                
            }
            
            // this.setState(() => ({
            //     page,
            //     data: result.slice(currentIndex, currentIndex + sizePerPage),
            //     totalSize: result.length,
            //     sizePerPage
            // }));
        }
        catch(error)
        {
          console.log("Erroreeeee: "+error);
        }
        
    }
  
    render () {

        const myRowEvents = {
            onClick: (e, row, rowIndex) => {
            console.log("clicked on row: "+row.utenza);
            
            }
        };

        const { SearchBar } = Search;
        const { data, sizePerPage, page, totalSize } = this.state;
        return (
        <div>
            <h3>Lista Risoluzioni</h3>
                <ToolkitProvider
                    keyField="id"
                    data={this.data}
                    columns={this.colonneTab}
                    search
                >
                {
                props => (
                    <div>
                        <h3>Filtra: <SearchBar { ...props.searchProps } /></h3>
                        <hr />
                        <BootstrapTable
                            remote
                            id="table_risoluzioni"
                            keyField="id"
                            striped
                            hover
                            data={ data }
                            columns={this.colonneTab}
                            rowEvents={myRowEvents}
                            pagination={paginationFactory({ page, sizePerPage, totalSize })}
                            onTableChange={this.handleTableChange}
                        />
                    
                    </div>
                )
                }
                </ToolkitProvider>
            
            </div>
        );
    }
}