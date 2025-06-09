import { useState } from "react";
import { UserIcon } from "@heroicons/react/16/solid";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import { ArrowLeft, Circle, CircleX, SaveIcon } from "lucide-react";
import { useAuth } from "../../hooks/AuthProvider";
import { AlertWithActions } from "../../components/AlertWithActions";

export const SettingsPage = ({ onClose = () => {} }) => {
    const [page, setPage] = useState('Profile');
    const [unsavedChanged, setUnsavedChanges] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logOut, updateUser } = useAuth();

    const onSubmitProfile = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        fetch('/api/me/profile', {
            method: 'PATCH',
            body: formData,
            credentials: 'include'
        })
        .then(async (res) => {
            return res.json();
        })
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            updateUser(data.user);
            setUnsavedChanges(false);
        })
        .catch((err) => {
            console.error(err);
        });
    };

    const onChange = (e) => {
        setUnsavedChanges(true);
    }

    const openPage = (pageName: string) => {
        setSidebarOpen(false);
        setPage(pageName);
    }

    return (
        <div className="absolute flex top-0 left-0 w-full h-full z-50 bg-gray-800">
            <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex min-w-full md:min-w-75 flex-col gap-8 md:flex-1/5 p-4`}>
                <div className="md:hidden flex items-center">
                    <h1 className="flex-1 text-xl">Settings</h1>
                    <button onClick={onClose}>
                        <CircleX className="w-8 h-8" />
                    </button>
                </div>
                <div className="flex flex-col flex-1 w-full">
                    <p className="mb-2 text-sm font-semibold uppercase">User Settings</p>
                    <button className={`flex items-center gap-4 self-stretch p-4 md:p-2 rounded-sm text-left bg-gray-900 shadow-md md:shadow-none hover:cursor-pointer text-gray-200 ${page === 'Profile' ? 'bg-gray-900 md:bg-gray-700' : ''} hover:bg-gray-600`} onClick={() => openPage('Profile')}>
                        <UserIcon className="w-5 h-5" />
                        Profile
                    </button>
                </div>
                <button className="flex items-center gap-4 self-stretch p-4 md:p-2 rounded-sm text-left font-semibold md:font-normal shadow-md md:shadow-none hover:cursor-pointer text-red-400 hover:bg-gray-700 bg-gray-900 md:bg-transparent" onClick={() => {
                    logOut();
                    onClose();
                }}>
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                    Log Out
                </button>
            </div>
            <div className={`relative ${sidebarOpen ? 'hidden' : 'flex'} md:flex flex-col md:min-w-80 min-w-full max-w-full md:max-w-90 flex-1 md:flex-2/5 bg-gray-700`}>
                <div className="flex w-full h-4 items-center p-6 md:p-4.5 md:mt-2 mb-8 bg-gray-800 md:bg-transparent">
                    <button className="absolute md:hidden text-gray-100 hover:text-gray-300 hover:cursor-pointer" onClick={() => setSidebarOpen(true)}>
                        <ArrowLeft className="w-8 h-8"/>
                    </button>
                    <h3 className="flex-1 text-xl font-semibold text-center md:text-left">{page}</h3>
                    <button className="hidden md:block text-gray-100 hover:text-gray-300 hover:cursor-pointer" onClick={onClose}>
                        <CircleX className="w-8 h-8"/>
                    </button>
                </div>
                {page === 'Profile' && <div className="flex flex-col gap-7 mx-4">
                    <form onSubmit={onSubmitProfile} encType="multipart/form-data">
                        <ul className="flex flex-col gap-5 max-w-80">
                            <li className="flex flex-col gap-1">
                                <label className="ml-0.5 font-semibold">Display Name</label>
                                <input type="text" name="displayName" defaultValue={user.displayName} className="flex items-center w-full bg-gray-800 p-2 rounded-sm border-1 border-gray-700 transition-colors transition duration-300 outline-0 focus:border-sky-300" onChange={onChange}/>
                            </li>
                            <li className="flex flex-col gap-1">
                                <label className="ml-0.5 font-semibold">Avatar</label>
                                <div className="relative flex justify-center items-center h-10 rounded-sm font-semibold transition-colors bg-indigo-500 hover:bg-indigo-600">
                                    <input type="file" accept="image/png" name="avatar" title="" className="absolute w-full h-full bg-indigo-600 z-20 opacity-0 hover:cursor-pointer" onChange={onChange} />
                                    <p className="absolute w-full ml-4">Change Avatar</p>
                                </div>
                            </li>
                            <li className="flex flex-col gap-1">
                                {unsavedChanged && <AlertWithActions />}
                                {unsavedChanged && 
                                <div className="absolute bottom-4 right-4 md:hidden flex items-center w-fit p-4 rounded-full bg-indigo-500">
                                    <button type="submit">
                                        <SaveIcon />
                                    </button>
                                </div>
                                }
                            </li>
                        </ul>
                    </form>
                </div>}
            </div>
            <div className="hidden relative md:flex flex-col flex-4/5 p-4 bg-gray-700"></div>
        </div>
    )
}