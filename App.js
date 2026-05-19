import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import GameCard from './components/GameCard';
import dados from './assets/dados.json';
import { SectionList } from 'react-native-web';
import { supabase } from './utils/supabase';

export default function App() {

  const [jogosBanco, setJogosBanco] = useState([]);
  const [carregandoJogos, setCarregandoJogos] = useState(true);

  const [grupoSelecionado, setGrupoSelecionado] = useState("TODOS");
  
  const jogos = jogosBanco;

  const grupos = ["TODOS", ...new Set(jogos.map(jogo => jogo.grupo))];

  const buscarJogosDoBanco = async () => {
  try {
    const { data, error } = await supabase
      .from("jogos")
      .select("*")
      .order("data_brasilia", { ascending: true });

    if (error) {
      console.log("Erro ao buscar jogos:", error);
      setJogosBanco([]);
      return;
    }

    setJogosBanco(data || []);
  } catch (erro) {
    console.log("Erro inesperado ao buscar jogos:", erro);
    setJogosBanco([]);
  } finally {
    setCarregandoJogos(false);
  }
};

  useEffect(() => {
  buscarJogosDoBanco();
}, []);
  
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

   const alternarFavorito = async (jogo) => {
  const novoValorFavorito = !jogo.favorito;

  const { error } = await supabase
    .from("jogos")
    .update({ favorito: novoValorFavorito })
    .eq("id", jogo.id);

  if (error) {
    console.log("Erro ao atualizar favorito:", error);
    return;
  }

  setJogosBanco(jogosBanco.map(item => {
    if (item.id === jogo.id) {
      return {
        ...item,
        favorito: novoValorFavorito,
      };
    }

    return item;
  }));
};

  const importarJogosParaBanco = async () => {
  try {
    const { error } = await supabase
      .from("jogos")
      .upsert(jogos, {
        onConflict: "id",
      });

    if (error) {
      Alert.alert("Erro", "Não foi possível importar os jogos.");
      console.log(error);
      return;
    }

    Alert.alert("Sucesso", "Jogos importados com sucesso!");
  } catch (erro) {
    Alert.alert("Erro", "Ocorreu um erro inesperado ao importar os jogos.");
    console.log(erro);
  }
};


  return (
    <ImageBackground style={styles.container}
      source={require('./assets/bg-overlay.png')}>
      <Image style={styles.logo}
        source={require('./assets/unicopa.png')}
      />

      <Text style={styles.title}>CALENDÁRIO</Text>

      <TouchableOpacity
  style={styles.botaoImportar}
  onPress={importarJogosParaBanco}
>
  <Text style={styles.textoBotaoImportar}>
    Importar jogos para o banco
  </Text>
</TouchableOpacity>

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

  

    {carregandoJogos ? (
  <View style={styles.cardVazio}>
    <Text style={styles.textoCardVazio}>Carregando jogos...</Text>
  </View>
) : jogos.length === 0 ? (
  <View style={styles.cardVazio}>
    <Text style={styles.textoCardVazio}>Nenhum jogo carregado</Text>
  </View>
) : (
  <SectionList
    sections={jogosTratados}
    keyExtractor={(item, index) => item.id ? String(item.id) : String(index)}
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
                favorito={jogo.favorito}
                aoFavoritar={() => alternarFavorito(jogo)}

              />
            ))
          }

        </View>
      );
    }}
  />
)}

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

botaoImportar: {
  marginTop: 15,
  backgroundColor: "#f2cc2f",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 20,
},

textoBotaoImportar: {
  color: "#040b13",
  fontSize: 14,
  fontWeight: "bold",
},

cardVazio: {
  marginTop: 30,
  backgroundColor: "#0c1b2a",
  width: 320,
  borderRadius: 12,
  padding: 20,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#1e2d3d",
},

textoCardVazio: {
  color: "#f2cc2f",
  fontSize: 18,
  fontWeight: "bold",
  textAlign: "center",
},

});