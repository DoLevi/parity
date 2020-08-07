import React from "react";
import Modal from "react-modal";


const ParityModal = ({children, isOpen, onRequestClose}) => (
    <Modal isOpen={isOpen}
           onRequestClose={onRequestClose}
           style = {{
                overlay: {
                    backgroundColor: 'rgba(0,0,0,0.64)',
                    opacity: 1,
                    zIndex: 400
                },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)'
                }
               }}>
        { children }
    </Modal>
);

export default ParityModal;