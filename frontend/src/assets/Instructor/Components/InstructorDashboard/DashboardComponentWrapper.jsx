/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";

/**
 * DashboardComponentWrapper - A reusable wrapper for dashboard components
 * that maintains consistent styling and alignment
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component content to be wrapped
 * @param {string} props.title - The title of the component
 * @param {string} [props.subtitle] - Optional subtitle for additional context
 * @param {boolean} [props.loading=false] - Whether the component is in loading state
 * @param {string} [props.error=null] - Error message if there's an error state
 * @param {React.ReactNode} [props.headerAction] - Optional action element for the header (button, dropdown, etc.)
 * @param {string} [props.className] - Additional CSS classes to apply to the component
 */
const DashboardComponentWrapper = ({
  children,
  title,
  subtitle,
  loading = false,
  error = null,
  headerAction,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {headerAction && (
          <div className="flex items-center">{headerAction}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
            <button
              className="text-red-600 hover:text-red-800 underline text-sm mt-2"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DashboardComponentWrapper;
