import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { flags } from "../assets/flags";
import react from "react";

export default function GameCard({ game, favorito, aoFavoritar }) {
  const jogoDoBrasil = game.sigla_casa === "BRA" || game.sigla_fora === "BRA";

  return (
        <TouchableOpacity
      onPress={aoFavoritar}
      style={[
        styles.jogo,
        jogoDoBrasil && styles.jogoBrasil,
        favorito && styles.jogoFavorito
      ]}
      >
      <Text style={styles.favorito}>
        {favorito ? "★ Favorito" : "☆ Favoritar"}
      </Text>
      <Text style={styles.grupo}>
        GRUPO {game.grupo} {game.confronto}
      </Text>

      <View style={styles.linhaPrincipal}>
        <View style={styles.time}>
          <Image
            style={styles.bandeira}
            source={flags[game.sigla_casa]}
          />
          <Text style={styles.sigla}>{game.sigla_casa}</Text>
        </View>

        <View style={styles.horario}>
          <Text style={styles.hora}>{game.hora_brasilia}</Text>
          <Text style={styles.subTitulo}>VS</Text>
        </View>

        <View style={styles.time}>
          <Text style={styles.sigla}>{game.sigla_fora}</Text>
          <Image
            style={styles.bandeira}
            source={flags[game.sigla_fora]}
          />
        </View>
      </View>

      <View style={styles.local}>
        <Text style={styles.subTitulo}>{game.estadio}</Text>
        <Text style={styles.subTitulo}>
          {game.cidade} • {game.pais}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  jogo: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1e2d3d",
    paddingBottom: 15,
  },
  grupo: {
    color: "#8fa3b8",
    fontSize: 12,
    marginBottom: 10,
  },
  linhaPrincipal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bandeira: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  sigla: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  horario: {
    alignItems: "center",
  },
  hora: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  local: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  subTitulo: {
    color: "#8fa3b8",
    fontSize: 12,
  },

  jogoBrasil: {
  backgroundColor: "#123c2c",
  borderLeftWidth: 4,
  borderLeftColor: "#2ecc71",
  padding: 12,
  borderRadius: 10,
  },

  jogoFavorito: {
  borderWidth: 2,
  borderColor: "#f2cc2f",
  backgroundColor: "#1a2d3f",
},

favorito: {
  color: "#f2cc2f",
  fontSize: 14,
  fontWeight: "bold",
  marginBottom: 8,
  textAlign: "right",
},

});
