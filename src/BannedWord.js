import React, {Component} from 'react';
import { variables } from './Variables';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

export class BannedWord extends Component{

    constructor(props) {
        super(props);

        this.state = {bannedWords:[],
                        bannedWordsWithoutFilter:[],
                        ModalTitle: "",
                        TitleMessage:"List of Prohibited Words",
                        BannedWordId:0,
                        BannedWordIdFilter:"",
                        Word:"",
                        BannedWordFilter:"",
                        CaseSensitive:false,
                        WholeWordOnly:true,
                        TrimWord:false          
                        }
    }

    refreshList(){
        console.log('fetching data from ' + variables.API_URL+ 'bannedWord');
             fetch(variables.API_URL+ 'bannedWord')
            .then(response => response.json())
            .then(data => {this.setState({bannedWords:data});this.setState({bannedWordsWithoutFilter:data});}) 
            .catch( e => {this.setState({TitleMessage:"The WebApi could not be reached. Please confirm the WebApi is available."})}) ;
            //log e here
    }

    componentDidMount(){
        this.refreshList();
    }
    changeWord = (e) => {
        this.setState({Word:e.target.value});
    }    
    changeCaseSensitive = (e) => {
        this.setState({CaseSensitive:e.target.checked});
    }      
    changeWholeWordOnly = (e) => {
        this.setState({WholeWordOnly:e.target.checked});
    }      
    changeTrimWord = (e) => {
        this.setState({TrimWord:e.target.checked});
    }
    changeBannedWordIdFilter = (e) => {
        this.setState({BannedWordIdFilter:e.target.value});
        this.FilterFn();
    }
    changeBannedWordFilter = (e) => {
        this.setState({BannedWordFilter:e.target.value});
        this.FilterFn();
    }
    

    addClick(){
        this.setState({
            ModalTitle:"Add Word",
            TitleMessage:"",
            BannedWordId:0,
            Word:"",
            CaseSensitive:false,
            WholeWordOnly:true,
            TrimWord:false
        })
    }

    editClick(word){        

        this.setState({
            ModalTitle:"Edit Word",
            TitleMessage:"",
            BannedWordId:word.idKey,
            Word:word.word,
            CaseSensitive:word.caseSensitive,
            WholeWordOnly:word.wholeWordOnly,
            TrimWord:word.trimWord
        })
    }

    createClick(){
        console.log('fetching data from url: ' + variables.API_URL + 'bannedWord');
        fetch(variables.API_URL + 'bannedWord' , {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({Word:this.state.Word,CaseSensitive:this.state.CaseSensitive, WholeWordOnly:this.state.WholeWordOnly, TrimWord:this.state.TrimWord})
        }).then(res=> res.ok ? res.json() : Promise.reject)
        .then(data=>{alert("Updated Successfully"); this.refreshList();}, (error)=>{alert('Failed ' + error)})
    }
    
    updateClick(){
        console.log('fetching data from url: ' + variables.API_URL + 'bannedWord');
        fetch(variables.API_URL + 'bannedWord' , {
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({Idkey:this.state.BannedWordId, Word:this.state.Word, CaseSensitive:this.state.CaseSensitive, WholeWordOnly:this.state.WholeWordOnly, TrimWord:this.state.TrimWord})
        }).then(res=> res.ok ? res.json() : Promise.reject)
        .then(data=>{alert("Updated Successfully"); this.refreshList();}, (error)=>{alert('Failed ' + error)})

    }
    
    deleteClick(word){
        if(window.confirm('Are you sure you wish to delete this bannedWord?'))
        {
        console.log('fetching data from url: ' + variables.API_URL + 'bannedWord');
        fetch(variables.API_URL + 'bannedWord', {
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:word.idKey
        }).then(res=> res.ok ? res.json() : Promise.reject)
        .then(data=>{alert("Deleted Successfully"); this.refreshList();}, (error)=>{alert('Failed ' + error)})
        }
    }
    
    FilterFn(){
        var bannedWordIdFilter = this.state.BannedWordIdFilter;
        var bannedWordFilter = this.state.BannedWordFilter;
        var filteredData = this.state.bannedWordsWithoutFilter.filter(
            function(el){
                    return el.idKey.toString().toLowerCase().includes(
                                bannedWordIdFilter.toString().trim().toLowerCase()
                            )
                            &&
                                el.word.toString().toLowerCase().includes(
                                    bannedWordFilter.toString().trim().toLowerCase()
                            )            
                        }    
               );

               this.setState({bannedWords:filteredData});

    }

    sortResult(prop,asc){
         var sortedData = this.state.bannedWords.sort(function(a,b){
            if(asc){
            return(a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
                    }
            else{
            return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
        }});


        console.log(sortedData);
        this.setState({bannedWords:sortedData});
    }
    
    render() {
        const {bannedWords,
                ModalTitle,
                TitleMessage,
                BannedWordId,
                Word,
                CaseSensitive,
                WholeWordOnly,
                TrimWord,} = this.state;
        return (
            <>
            <div>
                <h3>{TitleMessage}</h3>
                <button type='button' className='btn btn-primary m-2 float-start' data-bs-toggle='modal' data-bs-target='#modal1' onClick={()=>this.addClick()}>Add New Banned Word</button>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th>
                            <div className='d-flex flex-row'>
                                <input className='form-control m-2' 
                                onChange={this.changeBannedWordIdFilter} 
                                placeholder="Filter"/>
                                <button type='button' className='btn btn-light'
                                onClick={()=> (this.sortResult('idKey',true))}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                    <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                    </svg>
                                </button>
                                <button type='button' className='btn btn-light'
                                onClick={()=> (this.sortResult('idKey',false))}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                                    <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                </svg>
                                </button>

                                </div>
                                Id
                            </th>
                            <th>
                            <div className='d-flex flex-row'>
                            <input className='form-control m-2' 
                                onChange={this.changeBannedWordFilter} 
                                placeholder="Filter"/>
                                <button type='button' className='btn btn-light'
                                onClick={()=> (this.sortResult('word',true))}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-down" viewBox="0 0 16 16">
                                    <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                    </svg>
                                </button>
                                <button type='button' className='btn btn-light'
                                onClick={()=> (this.sortResult('word',false))}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-up" viewBox="0 0 16 16">
                                    <path d="M3.5 12.5a.5.5 0 0 1-1 0V3.707L1.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.5.5 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 3.707zm3.5-9a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
                                </svg>
                                </button>
                                </div>
                                Banned Word
                            </th>
                            <th>
                                Case Sensitive?
                            </th>
                            <th>
                                Whole Word Only?
                            </th>
                            <th>
                                Trim Word?
                            </th>
                           <th>
                                Edit
                            </th>
                            <th>
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bannedWords.map(word =>
                        <tr key={word.idKey}>
                            <td>{word.idKey}</td>
                            <td>{word.word}</td>
                            <td>{Number(word.caseSensitive)}</td>
                            <td>{Number(word.wholeWordOnly)}</td>
                            <td>{Number(word.trimWord)}</td>
                            <td>
                            <button type='button' className='btn btn-light mr-1' data-bs-toggle='modal' data-bs-target='#modal1' onClick={()=>this.editClick(word)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                </svg>
                            </button>
                            </td>
                            <td>
                            <button type='button' className='btn btn-light mr-1' onClick={()=>this.deleteClick(word)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                            </button>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='modal fade' id='modal1' tabIndex='-1' aria-hidden='true'>
                <div className='modal-dialog modal-lg modal-dialog-centered'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                        <h5 className='modal-title'>{ModalTitle}</h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'>X
                        </button>
                        </div>

                        <div className='modal-body'>
                            <div className='d-flex flex-row bd-highlight mb-3'>

                                <div className='p-2 w-8 bd-highlight'> 
                                <span className='input-group-text'>Word</span>
                                <input type='text' className='form-control' value={Word} onChange={this.changeWord}/>
                                </div>
                                <div className='p-2 w-8 bd-highlight'> 
                                <span className='input-group-text'>Case Sensitive?</span>
                                <input class="form-check-input" type="checkbox" name='casesensitive-checkbox' checked={CaseSensitive && true} value="casesensitive" onChange={this.changeCaseSensitive} />
                                </div>
                                <div className='p-2 w-8 bd-highlight'> 
                                <span className='input-group-text'>Whole Word Only?</span>
                                <input class="form-check-input" type="checkbox" name='wholewordonly-checkbox' checked={WholeWordOnly && true} value="wholewordonly" onChange={this.changeWholeWordOnly} />
                                </div>
                                <div className='p-2 w-8 bd-highlight'> 
                                <span className='input-group-text'>Trim Word?</span>
                                <input class="form-check-input" type="checkbox" name='trimword-checkbox' checked={TrimWord && true} value="trimword" onChange={this.changeTrimWord} />
                                </div>
                            </div>

                            </div>
                            {BannedWordId===0?
                            <button type='button' className='btn btn-primary float-start' data-bs-toggle='modal1'onClick={()=>this.createClick()}>
                                Create</button>
                            :null}

                            {BannedWordId!==0?
                            <button type='button' className='btn btn-primary float-start' data-bs-toggle='modal1'onClick={()=>this.updateClick()}>
                                Update</button>
                            :null}
                            
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
