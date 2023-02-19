import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";


const Login = () => {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      await axios.post("https://deployed-project.vercel.app/api/login", {
        username,
        password,
      });
      router.push("/admin");
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="h-screen bg-gray-900 pt-20 flex items-center justify-center">
      <div className=" flex flex-col">
        <h1 className="font-bold text-white text-2xl">Admin Dashboard</h1>
        <input
          placeholder="username"
          className="h-[40px] mb-5 px-5 text-black focus:outline-none"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          placeholder="password"
          type="password"
          className="h-[40px] text-black mb-5 px-5 focus:outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleClick} className="border p-5 rounded bg-gray-900 text-white font-semibold">
          Sign In
        </button>
        {error && <span className="text-lg text-red-800 ">Wrong Credentials!</span>}
      </div>
    </div>
  );
};

export default Login;
