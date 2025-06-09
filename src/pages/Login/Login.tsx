import { Link } from 'react-router';
import { useAuth } from '../../hooks/AuthProvider';

export function Login() {
  const { loginAction } = useAuth();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target);
    loginAction({
      username: formData.get('username'),
      password: formData.get('password')
    });
  }

  return (
    <main className="h-full max-w-full">
      <div className="flex-1 flex h-full w-full px-4 justify-center items-center">
        <form
          className="flex flex-col py-8 w-full max-w-100 px-8 rounded-sm gap-6 bg-gray-900 drop-shadow-sm"
          onSubmit={onSubmit}
        >
          <label>
            <p className="text-xs font-bold uppercase mb-2">Username</p>
            <input
              className="bg-gray-800 w-full p-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              name="username"
              type="text"
              autoComplete="username"
            ></input>
          </label>
          <label>
            <p className="text-xs font-bold uppercase mb-2">Password</p>
            <input
              className="bg-gray-800 w-full p-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
              name="password"
              type="password"
            ></input>
          </label>
          <button
            type="submit"
            className="text-white w-full bg-cyan-700 hover:bg-cyan-800 font-medium rounded-sm text-sm px-5 py-2.5 me-2 mb-2 dark:bg-cyan-700 dark:hover:bg-cyan-800 focus:outline-none cursor-pointer"
          >
            Login
          </button>
          <p>
            Don't have an account yet?{' '}
            <Link className="text-blue-400 hover:underline" to="/signup">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
