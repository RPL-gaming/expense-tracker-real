import React from "react";

type FailedModalProps = {
  onClose: () => void;
};

const FailedModal: React.FC<FailedModalProps> = ({ onClose }) => {
  return (
    <dialog className="modal" open>
      <div className="modal-box relative text-center p-8">
        <h3 className="font-bold text-2xl mb-4 text-red-600">Failed!</h3>
        <p className="text-lg font-semibold mb-2">
          Your Transaction was Unsuccessful
        </p>
        <button onClick={onClose} className="btn btn-primary rounded-full">
          Close
        </button>
      </div>
    </dialog>
  );
};

export default FailedModal;
