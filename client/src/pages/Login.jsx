// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// const Login = () => {
//   const [clientId, setClientId] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   console.log(import.meta.env, 'import.meta.env');

//   const baseUrl = import.meta.env.VITE_BASE_URL;
//   console.log(baseUrl, 'baseUrl');
//   const handleSubmit = async (e) => {

//     e.preventDefault();
//     setError('');
//     try {
//       const response = await fetch(`${baseUrl}/api/signature`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ clientId, clientPassword: password })
//       });
//       const data = await response.json();
//       // console.log(data,'from the backend=========================');

//       if (data.success && data.token) {
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('clientId', data.ClientID);
//         localStorage.setItem('tokenTimestamp', Date.now());

//         const response = await fetch(`${baseUrl}/api/websetting`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ClientID: data.ClientID, TUI: data.TUI })
//         });
//         const data2 = await response.json();
//         localStorage.setItem('websetting', JSON.stringify(data2));
//         // console.log(data2, 'from the backend=========================');

//         navigate('/search');

//       } else {
//         setError(data.message || 'Login failed');
//       }
//     } catch (error) {
//       setError('Login failed: ' + error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
//         <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
//         <div className="mb-4">
//           <label className="block mb-1 text-sm font-medium text-gray-700">Client ID</label>
//           <input
//             type="text"
//             value={clientId}
//             onChange={e => setClientId(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>
//         {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
//         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">Login</button>
//       </form>
//     </div>
//   );
// }

// export default Login