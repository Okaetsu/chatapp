export const AlertWithActions = ({
  open = false,
  title = 'Title',
  content = 'Content',
  confirmButtonText = 'Close',
  onClose = () => {}
}) => {
  return (
    <div className="hidden absolute bottom-2 left-0 md:flex justify-center w-full px-2">
      <div
        className={`flex items-center gap-4 w-full max-w-160 p-3 rounded-sm border-gray-600 border-1 bg-gray-900`}
      >
        <p className="flex-1">Save changes?</p>
        <button
          type="submit"
          className="px-8 py-1 rounded-sm bg-green-700 hover:bg-green-600 hover:cursor-pointer"
        >
          Yes
        </button>
        <button className="px-8 py-1 rounded-sm bg-rose-700 hover:bg-rose-600 hover:cursor-pointer">
          No
        </button>
      </div>
    </div>
  );
};
