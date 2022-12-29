import React,{useState} from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';


function CreateArea(props) {
const [boolstat,changestat] = useState (false)

function opened(){

changestat(true)
}




  return (
    <div>
      <form className="create-note">
        <input name="title" onClick={opened} onChange={props.getingTitle} value={props.titleValue} placeholder={(boolstat)?"Title":"Take a note..."} />
{(boolstat)?<>
<textarea name="content" onChange={props.getingCon} value={props.contectValue} placeholder="Take a note..." rows="3" />
<Zoom in={boolstat}>
<Fab color="primary" onClick={props.Clicked}   aria-label="add">
    <AddIcon />
      </Fab>

</Zoom>

</>:""}
        


        {/* <button onClick={props.Clicked}>
<AddIcon />
</button> */}
      </form>
    </div>
  );
}

export default CreateArea;
