import { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Text, Image, HStack, Button, Box } from "native-base";

export function ListadoScreen() {
  interface Obra {
    idobra: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url: string;
    idartista: string;
    fecha: string;
  }

  interface Artista {
    idartista: string;
    nombre: string;
    apellidos: string;
  }

  const [error, setError] = useState<string | null>(null);
  const [datos, setDatos] = useState<Obra[]>([]);
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getObras() {
      let response = await fetch("http://localhost:3000/api/obras", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        let data = await response.json();
        setDatos(data.datos);
      }
    }

    async function fetchArtistas() {
      try {
        const response = await fetch("http://localhost:3000/api/artistas");
        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const resultado = await response.json();

        if (resultado.ok) {
          setArtistas(resultado.datos);
        } else {
          throw new Error(resultado.mensaje || "Error al obtener artistas");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
        console.error("Error fetching artistas:", error);
      } finally {
        setLoading(false);
      }
    }

    getObras();
    fetchArtistas();
  }, []); 

  const getNombreArtista = (idartista: string) => {
    const artista = artistas.find((artista) => artista.idartista === idartista);
    return artista ? `${artista.nombre} ${artista.apellidos}` : "Desconocido";
  };

  const borrarObra = async (idobra: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/obras/${idobra}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setDatos((prevDatos) =>
          prevDatos.filter((obra) => obra.idobra !== idobra)
        );
      } else {
        throw new Error("Error al eliminar la obra");
      }
    } catch (error) {
      console.error("Error al eliminar la obra:", error);
    }
  };

  return (
    <ScrollView style={{ flex: 1 , backgroundColor: "#eba146"}}>
      {/* Usamos Flex para manejar la distribución de los cards */}
      <Box
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-evenly"
        padding={4}
      >
        {datos.map((obra) => (
          <Box
            key={obra.idobra}
            width={{
              base: "1fr", // 1 tarjeta por fila en pantallas muy pequeñas
              sm: "2fr",   // 2 tarjetas por fila en pantallas pequeñas
              md: "3fr",    // 3 tarjetas por fila en pantallas medianas
            }}
            padding={2}
          >
            <Card
              className="p-5 rounded-lg max-w-[360px] shadow-lg bg-white"
            >
              <Image
                source={{ uri: obra.imagen_url }}
                className="mb-6 h-[240px] w-full rounded-md aspect-[263/240] bg-gray-200"
                alt="Imagen de la obra"
              />

              <Text className="text-lg font-bold mb-2 text-gray-800 text-center">
                {obra.nombre}
              </Text>
              <Text className="text-sm font-normal mb-2 text-gray-600 text-center">
                {obra.descripcion}
              </Text>
              <Text className="text-sm font-normal mb-2 text-gray-600 text-center">
                <strong>Precio: </strong>{obra.precio} €
              </Text>
              <Text className="text-sm font-normal mb-2 text-gray-600 text-center">
              <strong>Artista:</strong> {getNombreArtista(obra.idartista)}
              </Text>
              <Text className="text-sm font-normal mb-2 text-gray-600 text-center">
              <strong>Fecha de creación:</strong> {obra.fecha}
              </Text>

              <HStack justifyContent="center" mt={4}>
                <Button
                  colorScheme="white"
                  onPress={() => borrarObra(obra.idobra)}
                  variant="outline"
                  style={{ borderColor: "white", backgroundColor: "orange", width: "100%" }}
                >
                  Borrar
                </Button>
              </HStack>
            </Card>
          </Box>
        ))}
      </Box>
    </ScrollView>
  );
}

export default ListadoScreen;