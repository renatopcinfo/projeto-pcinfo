import { useContext } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { Chart } from 'react-google-charts';
import { AiFillPieChart } from 'react-icons/ai';

import { AuthContext } from '../../contexts/auth';

export default function DataChart() {
  const { allChamados } = useContext(AuthContext);

  //data chart
  let totais = {
    Aberto: 0,
    Progresso: 0,
    Atendido: 0,
  };

  allChamados.forEach((doc) => {
    switch (doc.status) {
      case 'Aberto':
        totais.Aberto++;
        break;
      case 'Progresso':
        totais.Progresso++;
        break;
      case 'Atendido':
        totais.Atendido++;
        break;
      // default:
      //   break;
    }
  });

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Gráfico Chamados">
          <AiFillPieChart size={25} />
        </Title>
        <div className="container">
          <div style={{ display: 'flex', maxWidth: 900 }}>
            <Chart
              width={'500px'}
              height={'300px'}
              chartType="PieChart"
              loader={<div>Carregando...</div>}
              data={[
                ['Chamados', 'Quantidade'],
                ['Em Aberto', totais.Aberto],
                ['Em Progresso', totais.Progresso],
                ['Atentido', totais.Atendido],
              ]}
              options={{
                title: 'Chamados',
              }}
              rootProps={{ 'data-testid': '1' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
