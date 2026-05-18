import { StyleSheet, Text, View, Image, ImageBackground, } from 'react-native';
import { useState } from 'react';
import GameCard from './components/GameCard';
import dados from './assets/dados.json'
import { SectionList } from 'react-native-web';

export default function App() {

  const [favoritos, setFavoritos] = useState([]);
  
  const jogos = dados.jogos
  
  const agruparPorData = (jogos) => {
    
    return jogos.reduce((acc, jogo) => {

      const data = jogo.data_brasilia;

      if (!acc[data]) {
        acc[data] = [];
      }
      
      acc[data].push(jogo);

      return acc;

    }, {});
  }

    const jogosAgrupados = agruparPorData(jogos);
    
   const jogosTratados = Object.keys(jogosAgrupados).map(data => {
  return {
    title: data,
    data: [...jogosAgrupados[data]].sort((a, b) =>
      a.hora_brasilia.localeCompare(b.hora_brasilia)
    )
  };
});

    const obterDataAtual = () => {
      const hoje = new Date();

      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");

      return `${ano}-${mes}-${dia}`;
    };

    const dataAtual = obterDataAtual();

    const alternarFavorito = (idJogo) => {
  if (favoritos.includes(idJogo)) {
    setFavoritos(favoritos.filter(id => id !== idJogo));
  } else {
    setFavoritos([...favoritos, idJogo]);
  }
};


  return (
    <ImageBackground style={styles.container}
      source={require('./assets/bg-overlay.png')}>
      <Image style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

    <SectionList
  sections={jogosTratados}
  keyExtractor={(item, index) => item + index}
  renderItem={() => null}
  renderSectionHeader={({ section }) => {
    const diaAtual = section.title === dataAtual;

    return (
      <View style={[styles.card, diaAtual && styles.cardDiaAtual]}>

        <Text style={[styles.data, diaAtual && styles.textoDiaAtual]}>
          {section.title}
        </Text>

        {diaAtual && (
          <Text style={styles.avisoDiaAtual}>Jogos de hoje</Text>
        )}

        {
          section.data.map(jogo => (
        <GameCard
          key={jogo.id}
          game={jogo}
          favorito={favoritos.includes(jogo.id)}
          aoFavoritar={() => alternarFavorito(jogo.id)}
        />
      ))
        
        }

      </View>
    );
  }}
/>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#040b13',
    alignItems: 'center',
  },
  logo: {
    marginTop: 20,
    width: 200,
    height: 50,
    resizeMode: 'contain'
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
  },
  card: {
    marginTop: 20,
    backgroundColor: '#0c1b2a',
    width: 320,
    borderRadius: 12,
    padding: 15,
  },
  data: {
    color: '#f2cc2f',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  cardDiaAtual: {
    borderWidth: 2,
    borderColor: "#f2cc2f",
    backgroundColor: "#10263a",
  },

  textoDiaAtual: {
    color: "#f2cc2f",
  },

  avisoDiaAtual: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
  },

});