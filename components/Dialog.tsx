import { useEffect } from "react";

interface ModalProps {
  classname?: string;
  children?: React.ReactNode;
}

const Dialog: React.FC<ModalProps> = ({ classname, children }) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div
      className={`fixed w-full px-3 md:px-0 h-full flex flex-col justify-center items-center bg-black bg-opacity-60 z-50 top-0 left-0 ${classname}`}
    >
      {children}
    </div>
  );
};

export default Dialog;
