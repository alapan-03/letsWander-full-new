import { Check, CircleX } from 'lucide-react';
import React from 'react';
// import './CustomToast.css'   ;

export default function CustomToast(props) {
    return(
        <div className='toast-cont-outer'>
        <div className="toast-container">
            {!props.isError ? <Check color="green"/> : <CircleX color="red"/> }
            <p className="toast-message">{props.message || "No message"}</p>
        </div>
        </div>
    );
}
