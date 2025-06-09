import { MenuSeparator } from '@headlessui/react';

export const Modal = ({
  open = false,
  title = 'Title',
  content = 'Content',
  confirmButtonText = 'Close',
  onClose = () => {}
}) => {
  if (!open) return <></>;

  return (
    <div
      className={`flex justify-center items-center absolute top-0 left-0 w-full h-full`}
    >
      <div
        className="absolute top-0 left-0 w-full h-full bg-black opacity-75"
        onClick={onClose}
      />
      <div
        className={`absolute flex flex-col items-center gap-1 w-full max-w-80 sm:max-w-120 md:max-w-120 max-h-75 md:max-h-90 p-4 rounded-sm bg-gray-800 z-10`}
      >
        <h1 className="font-semibold text-lg">{title}</h1>
        <MenuSeparator className="my-1 w-full h-px bg-gray-700" />
        <p className="text-gray-300 flex-1 overflow-y-auto mb-8">{content}</p>
        <button
          className="bg-indigo-500 rounded-sm p-2 w-full max-h-12 font-semibold hover:bg-indigo-600 hover:cursor-pointer"
          onClick={onClose}
        >
          {confirmButtonText}
        </button>
      </div>
    </div>
  );
};
