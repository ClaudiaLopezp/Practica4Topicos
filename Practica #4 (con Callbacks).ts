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

//Ahora, calculamos las edades de un arreglo de personas utilizando callbacks
//El callback que se ejecutará una vez que todas las edades hayan sido calculadas
//Recibe un posible mensaje de error o el arreglo de resultados

function calcularEdadesConCallbacks(
  personas: Persona[],
  callback: (error: string | null, resultados?: PersonaCalculada[]) => void
): void {
  const resultados: PersonaCalculada[] = []; // Almacenará los resultados finales
  let operacionesCompletadas = 0; // Contador para rastrear las operaciones asíncronas finalizadas

  // Si el arreglo de personas está vacío, no hay nada que calcular.
  // Llamamos al callback inmediatamente con un arreglo vacío para no bloquearlo.
  if (personas.length === 0) {
    callback(null, []);
    return;
  }

  // Iteramos sobre cada persona en el arreglo de entrada
  personas.forEach((persona, index) => {
    // Simulamos un retraso para cada cálculo de edad con TimeOut, imitando la operacion de E/S
    setTimeout(() => {
      try {
        // Primero, verificamos si la fecha de nacimiento es valida
        if (isNaN(new Date(persona.fechaNacimiento).getTime())) {
          // Si es inválida, lanzamos un error 
          throw new Error(`Fecha de nacimiento inválida para ${persona.nombre}`);
        }

        // Si la fecha es válida, usamos la función
        const edad = calcularEdad(persona.fechaNacimiento); //Extraemos la edad

        // Guardamos el resultado en la posición correcta del arreglo resultados, para mantener el orden
        resultados[index] = { nombre: persona.nombre, edad: edad };
      } catch (e: any) {
        // Si ocurre un error, llamamos al callback principal y detenemos el procesamiento para esta rama.
        callback(e.message || "Error desconocido al calcular edad");
        return; // Salimos de este `setTimeout` para no seguir procesando
      }

      // Incrementamos el contador cada vez que una operación individual se completa.
      operacionesCompletadas++;

      // Una vez que todas las operaciones individuales han terminado, el contador debe ser igual 
      // al número total de personas 
      if (operacionesCompletadas === personas.length) {//Validamos que sean iguales
        callback(null, resultados); // null indica que no hubo error
      }
    }, 500); // Retraso 
  });
}

// Datos de prueba
const prueba: Persona[] = [
  { nombre: 'Ana', fechaNacimiento: new Date('1990-01-15') },
  { nombre: 'Sofia', fechaNacimiento: new Date('1982-06-20') },
  { nombre: 'Mateo', fechaNacimiento: new Date('2000-11-05') },
  { nombre: 'David', fechaNacimiento: new Date('2015-03-25') },
];

console.log('Demostración con Callbacks');
calcularEdadesConCallbacks(prueba, (error, resultados) => {
  if (error) {
    console.error('Error al calcular edades con Callbacks:', error);
  } else {
    console.log('Resultados Callbacks:', resultados);
  }
});