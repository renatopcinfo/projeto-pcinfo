import { useContext, useEffect } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
//import { isAdmin } from '../../services/access';
import avatar from '../../assets/avatar.png';

import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import { AiFillPieChart } from 'react-icons/ai';

export default function Header() {
  const { user } = useContext(AuthContext);

  localStorage.setItem('SistemaUser', JSON.stringify(user));

  const userType = JSON.parse(localStorage.getItem('SistemaUser'));

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? avatar : user.avatarUrl}
          alt="Foto avatar"
        />
      </div>
      <Link to="/dashboard">
        <FiHome color="#FFF" size={24} />
        Chamados
      </Link>
      <Link to="/customers">
        <FiUser color="#FFF" size={24} />
        Clientes
      </Link>

      {userType.type ? (
        <Link to="/chart">
          <AiFillPieChart color="#FFF" size={24} />
          Gráfico
        </Link>
      ) : (
        <></>
      )}
      <Link to="/profile">
        <FiSettings color="#FFF" size={24} />
        Configurações
      </Link>
    </div>
  );
}
