// Definicion de interfaces
 //Representa la estructura de los objetos de entrada para cada persona
interface Persona {
  nombre: string;
  fechaNacimiento: Date;
}

// Representa la estructura de los objetos de salida después de calcular la edad
interface PersonaCalculada{
  nombre: string;
  edad: number;
}

// Para Calcular la edad actual de una persona 
//Devuelve la edad
function calcularEdad(fechaNacimiento: Date): number {
  const hoy = new Date(); // Obtenemos la fecha actual
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear(); // Calculamos la diferencia de años
  const mes = hoy.getMonth() - fechaNacimiento.getMonth(); // Obtenemos la diferencia de meses

  // Ajustamos la edad si la persona aún no ha cumplido años (Si todavia no cambia su edad)
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
}

//Calcula las edades de un arreglo de personas utilizando el patrón async/await.
//El async funciona como una promesa que se espera el resultado al momento
async function calcularEdadesConAsyncAwait( personas: Persona[]): Promise<PersonaCalculada[]> {
  const resultados: PersonaCalculada[] = []; // Almacenará los resultados finales

  // con un retraso en una Promesa. Esto es lo que `await` puede "esperar".
  const obtenerEdadConRetraso = (persona: Persona): Promise<PersonaCalculada> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => { //Retraso
        try {
          // Validamos la fecha de nacimiento, para evitar errores
          if (isNaN(new Date(persona.fechaNacimiento).getTime())) {
            throw new Error(`Fecha de nacimiento inválida para ${persona.nombre}`);
          }

          // Uso de la función calcular edad
          const edad = calcularEdad(persona.fechaNacimiento);
          resolve({ nombre: persona.nombre, edad: edad });
        } catch (e: any) {
          reject(new Error(e.message || `Error desconocido para ${persona.nombre}`));
        }
      }, 500); // Retraso simulado 
    });
  };

  // Usamos un bucle `for...of` para iterar sobre cada persona. Dentro del bucle, la palabra clave `await` 
  //pausará la ejecución de esta función `async` hasta que la Promesa devuelta por `obtenerEdadConRetraso`
 //se resuelva o se rechace.
  for (const persona of personas) {
    try {
      // `await` espera por el resultado de la Promesa individual.
      const resultadoPersona = await obtenerEdadConRetraso(persona);
      resultados.push(resultadoPersona); // Añadimos el resultado al arreglo final
    } catch (error: any) {
      // Si alguna de las Promesas individuales se rechaza, el `catch` lo captura e imprime
      console.error(`Ocurrió un error al procesar a ${persona.nombre}:`,
        error.message || error
      );
      // Lanzamos el error nuevamente para que la función `calcularEdadesConAsyncAwait`
      // también se rechace y el llamador pueda manejarlo
      throw error;
    }
  }
  return resultados; // Retornamos el arreglo donde se cargaron los resultados una vez que todas las operaciones han terminado
}

// Datos de prueba
const prueba: Persona[] = [
  { nombre: 'Ana', fechaNacimiento: new Date('1990-01-15') },
  { nombre: 'Sofia', fechaNacimiento: new Date('1982-06-20') },
  { nombre: 'Mateo', fechaNacimiento: new Date('2000-11-05') },
  { nombre: 'David', fechaNacimiento: new Date('2015-03-25') },
];

console.log('\nDemostración con Async/Await ');
// Usamos una IIFE (Immediately Invoked Function Expression - Función Ejecutada Inmediatamente)
// para poder usar `await` en el nivel superior del script
(async () => {
  try {
    const resultadosAsyncAwait = await calcularEdadesConAsyncAwait(prueba);
    console.log('Resultados Async/Await:', resultadosAsyncAwait);
  } catch (error) {
    console.error('Error al calcular edades con Async/Await:', error);
  }
})();