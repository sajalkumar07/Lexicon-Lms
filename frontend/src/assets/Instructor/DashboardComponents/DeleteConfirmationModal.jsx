/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { X } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?",
  detailMessage = "This action cannot be undone.",
  itemName = "",
  confirmButtonText = "Delete",
  cancelButtonText = "Cancel",
  isDeleting = false,
  confirmButtonClass = "bg-red-500 hover:bg-red-600",
  size = "default", // options: 'small', 'default', 'large'
}) => {
  if (!isOpen) return null;

  // Size-based class adjustments
  const modalSizeClasses = {
    small: "max-w-sm",
    default: "max-w-md",
    large: "max-w-lg",
  };

  const modalSize = modalSizeClasses[size] || modalSizeClasses.default;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-lg shadow-md p-6 ${modalSize} w-full mx-4 animate-fadeIn`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-2">
            {message}{" "}
            {itemName && <span className="font-medium">{itemName}</span>}?
          </p>
          <p className="text-sm text-gray-500">{detailMessage}</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
            disabled={isDeleting}
          >
            {cancelButtonText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white ${confirmButtonClass} rounded-md text-sm font-medium`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block"></div>
                Deleting...
              </>
            ) : (
              <>{confirmButtonText}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
