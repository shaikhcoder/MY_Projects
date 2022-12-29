import React ,{useState} from "react";
import Header from "./Header";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Footer from "./Footer";

function App() {
const [titlevalue,settitle] = useState({value:"",name:""})
const [convalue,setcon] = useState({value:"",name:""})
const [hendel,sethendel] = useState([])

function  getingTitle (e){
const {name,value} = e.target
settitle({name:name,value:value,})

}


function  getingcon (e){
const {name,value} = e.target
setcon({name:name,value:value,})

}
function Clicked(e){

const setthing = {[titlevalue.name]:titlevalue.value,[convalue.name]:convalue.value}
if(titlevalue.value !== undefined && titlevalue.value !== "" && convalue.value !== undefined && titlevalue.value !== ""){

sethendel((prevs)=>{
if(  prevs !== [] && prevs !== undefined){
return [...prevs,setthing]
}
else{
return [setthing]
}

})



e.preventDefault();

setcon({value:"",name:""})
settitle({value:"",name:""})

}

}

function deleteNote(id){
sethendel((prevs)=>{
return prevs.filter((value,index)=>{
return (index !== id ) 

})
})

}


  return (
    <div>
  
      <Header />
   <CreateArea  getingTitle={getingTitle}  titleValue={titlevalue.value}   getingCon={getingcon} contectValue={convalue.value}  Clicked={Clicked}/>

{hendel.map((obj,index)=>{

return <Note key={index} id={index} deleteNote={deleteNote} title={obj.title} content={obj.content}/>
})}



<Footer />
    </div>
  );
}

export default App;
