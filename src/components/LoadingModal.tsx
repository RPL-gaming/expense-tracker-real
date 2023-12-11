import React from "react";


const LoadingModal = () => {
  return (
    <dialog className="modal" open>
      <div className="modal-box relative text-center p-8">
        <h3 className="font-bold text-2xl mb-4 text-yellow-500">Loading</h3>
        <p className="text-lg font-semibold mb-2">Sit Tight while We Create Your Google Meet URL</p>
          <span className="loading loading-dots loading-md"></span>
      </div>
    </dialog>
  );
};

export default LoadingModal;
