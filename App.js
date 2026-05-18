import { useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';
import GameCard from './components/GameCard';
import dados from './assets/dados.json';
import { SectionList } from 'react-native-web';

export default function App() {

  const [favoritos, setFavoritos] = useState([]);

  const [grupoSelecionado, setGrupoSelecionado] = useState("TODOS");
  
  const jogos = dados.jogos

  const grupos = ["TODOS", ...new Set(jogos.map(jogo => jogo.grupo))];
  
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

    const jogosFiltrados = grupoSelecionado === "TODOS"
  ? jogos
  : jogos.filter(jogo => jogo.grupo === grupoSelecionado);

    const jogosAgrupados = agruparPorData(jogosFiltrados);
    
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

      <View style={styles.filtros}>
  {grupos.map(grupo => (
    <TouchableOpacity
      key={grupo}
      onPress={() => setGrupoSelecionado(grupo)}
      style={[
        styles.botaoFiltro,
        grupoSelecionado === grupo && styles.botaoFiltroAtivo
      ]}
    >
      <Text
        style={[
          styles.textoFiltro,
          grupoSelecionado === grupo && styles.textoFiltroAtivo
        ]}
      >
        {grupo === "TODOS" ? "Todos" : `Grupo ${grupo}`}
      </Text>
    </TouchableOpacity>
  ))}
</View>

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

  filtros: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 15,
  gap: 8,
  paddingHorizontal: 10,
},

botaoFiltro: {
  backgroundColor: "#0c1b2a",
  borderWidth: 1,
  borderColor: "#1e2d3d",
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
},

botaoFiltroAtivo: {
  backgroundColor: "#f2cc2f",
  borderColor: "#f2cc2f",
},

textoFiltro: {
  color: "#ffffff",
  fontSize: 14,
  fontWeight: "bold",
},

textoFiltroAtivo: {
  color: "#040b13",
},

});