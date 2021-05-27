import { useContext } from 'react';
import './header.css';
import { AuthContext } from '../../contexts/auth';
import avatarStart from '../../assets/avatar.png';

import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import { AiFillPieChart } from 'react-icons/ai';

export default function Header() {
  const { user  } = useContext(AuthContext);
  //console.log('UserType', user.type)

  // const [avatarUrl, setAvatarUrl] = useState(
  //   (user && user.avatarUrl) || user.photoURL
  // );

  //localStorage.setItem('userInfo', JSON.stringify(user));

  //localStorage.setItem('type', 'Default');
  //const userType = JSON.parse(localStorage.getItem('userInfo'));
  

  return (
    <div className="sidebar">
      <div>
        <img
          src={
            user.avatarUrl === null
              ? avatarStart
              : user.avatarUrl || user.photoURL
          }
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

      {user.type ? (
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
