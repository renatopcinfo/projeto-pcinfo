import { useContext } from 'react';

import { Chart } from 'react-google-charts';

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
    }
  });

  return (
    <div style={{ display: 'flex', maxWidth: 900 }}>
      <Chart
        width={'500px'}
        height={'300px'}
        chartType="PieChart"
        loader={<div>Loading Chart</div>}
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
  );
}
