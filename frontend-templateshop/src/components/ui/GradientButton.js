import React from "react";

/**
 * Component Button với hiệu ứng gradient và hover mượt mà.
 * @param {object} props
 * @param {function} props.onClick - Hàm xử lý sự kiện click.
 * @param {string} props.className - Các class Tailwind CSS bổ sung.
 * @param {React.ReactNode} props.children - Nội dung bên trong button (text, icon...).
 * @param {'button' | 'submit' | 'reset'} props.type - Loại button.
 */

const GradientButton = ({
  children,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-gradient ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
