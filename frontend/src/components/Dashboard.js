import React,{useState, useEffect} from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
        getUsers();
    });

    const refreshToken = async() => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if(error.response){
                navigate("/")
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async(config) => {
        const currentDate = new Date();
        if(expire * 1000 < currentDate.getTime()){
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getUsers = async() => {
        const response = await axiosJWT.get('http://localhost:5000/users', {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        setUsers(response.data)
    }

    const deleteUser = async (id) =>{
        try {
            await axios.delete(`http://localhost:5000/users/${id}`, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            getUsers();
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className='container mt-5'>
        <h1 className='title is-3'>Selamat datang {name} !</h1>
        <table className='table is-danger is-fullwidth mt-3'>
            <thead>
                <tr>
                    <th>No. </th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                <tr key={user.id}>
                   <td>{index + 1}</td>
                   <td>{user.name}</td>
                   <td>{user.email}</td>
                    <td>
                        <Link to={`/edit/${user.id}`} className='button is-small is-primary mr-3'>Edit</Link>
                        <button onClick={()=> deleteUser(user.id)} className='button is-small is-warning'>Hapus</button>
                    </td>
                </tr> 
                ))}
            </tbody>
        </table>
<h2 className='title is-6 is-family-code'>{token}</h2>
    </div>
  )
}

export default Dashboard