import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import Title from '../../components/Title';
import { Chart } from 'react-google-charts';
import { AiFillPieChart } from 'react-icons/ai';

import firebase from '../../services/firebaseConnection';

export default function DataChart() {
  const [allChamados, setAllChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    loadAllChamados();
  }, []);

  async function loadAllChamados() {
    await firebase
      .firestore()
      .collection('chamados')
      .orderBy('created', 'desc')
      .get()
      .then((snapshot) => {
        updateStateAll(snapshot);
      })

      .catch((err) => {
        console.log('Deu algum erro: ', err);
      });

    setLoading(false);
  }

  //format data chamados
  async function updateStateAll(snapshot) {
    const isCollectionEmpty = snapshot.size === 0;

    if (!isCollectionEmpty) {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });
      setAllChamados((allChamados) => [...allChamados, ...lista]);
    } else {
      setEmpty(true);
    }
  }

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
