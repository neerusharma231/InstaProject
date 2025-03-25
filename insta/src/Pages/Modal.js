import React from "react";
import '../css/modal.css'
const Modal =({message, onClose})=>{

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button className="okbtn-cls" onClick={onClose}>OK</button>
                 </div>
        </div>
    );
};
export default Modal;