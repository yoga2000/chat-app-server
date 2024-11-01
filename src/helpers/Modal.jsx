import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-xl text-center text-gray-700 font-semibold">
            {" "}
            User Name:
            <span className="text-xl font-bold tracking-wider text-black uppercase">
              {title}
            </span>{" "}
          </h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 text-black text-center text-xl tracking-widest">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
