import React, { useEffect, useState } from "react";
import {
  VStack,
  HStack,
  FormControl,
  Input,
  Button,
  Text,
  Select,
  Box,
} from "native-base";
import { useNavigation } from "@react-navigation/native";

// Definir interfaces
interface Artista {
  idartista: number;
  nombre: string;
  apellidos: string;
}

interface ObraDatos {
  nombre: string;
  descripcion: string;
  fecha: string;
  precio: string;
  idartista: string;
  imagen_url: string;
}

function AltaScreen() {
  const [datos, setDatos] = useState<ObraDatos>({
    nombre: "",
    descripcion: "",
    fecha: "",
    precio: "",
    idartista: "",
    imagen_url: "",
  });

  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    precio: "",
    imagen_url: "",
    idartista: "",
  });

  useEffect(() => {
    const fetchArtistas = async () => {
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
    };

    fetchArtistas();
  }, []);

  const handleSubmit = async () => {
    try {
      // Convertir la fecha al formato adecuado
      const fechaConvertida = new Date(datos.fecha.split("/").reverse().join("-")).toISOString().split('T')[0];
  
      const obraData = {
        ...datos,
        fecha: fechaConvertida,  // Fecha convertida
        idartista: parseInt(datos.idartista, 10),
      };
  
      const response = await fetch("http://localhost:3000/api/obras", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obraData),
      });
  
      const respuesta = await response.json();
      if (response.ok) {
        alert(respuesta.mensaje);
      } else {
        throw new Error(respuesta.mensaje || "Error al crear la obra");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error desconocido");
      console.error("Error:", error);
    }
  };
  

  return (
    <Box style={{backgroundColor: "#eba146", flex: 1}}>
      <VStack
        space={4}
        p={4}
        bg="white"
        borderRadius="md"
        shadow={2}
        w="90%"
        mx="auto"
        mt={8}
      >
        {/* HStack para el nombre y la fecha */}
        <HStack space={4}>
          {/* Campo Nombre */}
          <FormControl isRequired isInvalid={!!errors.nombre} w="50%">
            <FormControl.Label>Nombre de la obra</FormControl.Label>
            <Input
              value={datos.nombre}
              onChangeText={(value) => setDatos({ ...datos, nombre: value })}
              placeholder="Nombre de la obra"
            />
            <FormControl.ErrorMessage>{errors.nombre}</FormControl.ErrorMessage>
          </FormControl>

          {/* Campo Fecha */}
          <FormControl isRequired isInvalid={!!errors.fecha} w="49%">
            <FormControl.Label>Fecha</FormControl.Label>
            <Input
              value={datos.fecha}
              onChangeText={(value) => setDatos({ ...datos, fecha: value })}
              placeholder="Fecha (DD/MM/AAAA)"
            />
            <FormControl.ErrorMessage>{errors.fecha}</FormControl.ErrorMessage>
          </FormControl>
        </HStack>

        {/* Campo Descripción */}
        <FormControl isRequired isInvalid={!!errors.descripcion}>
          <FormControl.Label>Descripción</FormControl.Label>
          <Input
            value={datos.descripcion}
            onChangeText={(value) => setDatos({ ...datos, descripcion: value })}
            placeholder="Descripción"
          />
          <FormControl.ErrorMessage>
            {errors.descripcion}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Campo Precio */}
        <FormControl isRequired isInvalid={!!errors.precio}>
          <FormControl.Label>Precio</FormControl.Label>
          <Input
            value={datos.precio}
            onChangeText={(value) => setDatos({ ...datos, precio: value })}
            placeholder="Precio"
          />
          <FormControl.ErrorMessage>{errors.precio}</FormControl.ErrorMessage>
        </FormControl>

        {/* Campo Imagen URL */}
        <FormControl isRequired isInvalid={!!errors.imagen_url}>
          <FormControl.Label>Imagen URL</FormControl.Label>
          <Input
            value={datos.imagen_url}
            onChangeText={(value) => setDatos({ ...datos, imagen_url: value })}
            placeholder="URL de la imagen"
          />
          <FormControl.ErrorMessage>
            {errors.imagen_url}
          </FormControl.ErrorMessage>
        </FormControl>

        {/* Campo Artista (Select) */}
        <FormControl isRequired isInvalid={!!errors.idartista}>
          <FormControl.Label>Artista</FormControl.Label>

          {loading ? (
            <Text>Cargando artistas...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <Select
              selectedValue={datos.idartista}
              minWidth="200"
              placeholder="Selecciona artista"
              onValueChange={(itemValue) =>
                setDatos({ ...datos, idartista: itemValue })
              }
              _selectedItem={{
                bg: "teal.600",
              }}
            >
              {artistas.map((artista) => (
                <Select.Item
                  key={artista.idartista.toString()}
                  label={`${artista.nombre} ${artista.apellidos}`}
                  value={artista.idartista.toString()}
                />
              ))}
            </Select>
          )}

          <FormControl.ErrorMessage>
            {errors.idartista}
          </FormControl.ErrorMessage>
        </FormControl>

        <Button
          mt={4}
          onPress={handleSubmit}
          style={{ backgroundColor: "orange" }}
        >
          <Text>Aceptar</Text>
        </Button>
      </VStack>
    </Box>
  );
}

export default AltaScreen;
