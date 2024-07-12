import "../shared/Modal.css";

const Modal = ({ children, isOpen, closeModal }) => {
    const handleModalClick = (event) => event.stopPropagation();
    return (
        <article className= {`modal ${isOpen && "is-open"}`} onClick={closeModal}>
            <div className="modal-container" onClick={handleModalClick}>
                {children}
            </div>
        </article>
    );
};

export default Modal;
