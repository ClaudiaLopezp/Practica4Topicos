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

//Cada cálculo de edad individual se convierte en una Promesa que resuelve después de un retraso
function calcularEdadesConPromesas(
  personas: Persona[]
): Promise<PersonaCalculada[]> {
  // Creamos un arreglo de Promesas, donde cada elemento de este arreglo será una Promesa (del calculo de edad)
  const promesasIndividuales = personas.map((persona) => {
    // Para cada persona, retornamos una nueva Promesa
    // El constructor de la Promesa recibe una función con RESOLVE (que indica que se ejecuto la promesa)
    //y una REJECT (que significa que fallo la promesa)
    return new Promise<PersonaCalculada>((resolve, reject) => {
      setTimeout(() => { //Para simular un retraso
        try {
          // Validamos la fecha de nacimiento. Si es inválida, lanzamos un error
          if (isNaN(new Date(persona.fechaNacimiento).getTime())) {
            throw new Error(`Fecha de nacimiento inválida para ${persona.nombre}`);
          }

          // Utilizamos la función para obtener la edad
          const edad = calcularEdad(persona.fechaNacimiento);

          // Si el cálculo es exitoso, `resolvemos` la Promesa individual, con el objeto de Persona completo
          resolve({ nombre: persona.nombre, edad: edad });
        } catch (e: any) {
          // Si ocurre un error durante el cálculo, `rechazamos` la Promesa individual con un objeto Error
          reject(new Error(e.message || `Error desconocido para ${persona.nombre}`));
        }
      }, 500); // Retraso
    });
  });

  // Promise.all() espera a que todas las Promesas en el arreglo se resuelvan exitosamente
  // - Si todas se resuelven, `Promise.all()` resuelve con un nuevo arreglo
  //   que contiene los resultados de cada Promesa individual (en el mismo orden)
  // - Si alguna Promesa se `rechaza`, `Promise.all()` se `rechaza` inmediatamente
  //   con el error de la primera Promesa que falló
  return Promise.all(promesasIndividuales);
}

// Datos de prueba
const prueba: Persona[] = [
  { nombre: 'Ana', fechaNacimiento: new Date('1990-01-15') },
  { nombre: 'Sofia', fechaNacimiento: new Date('1982-06-20') },
  { nombre: 'Mateo', fechaNacimiento: new Date('2000-11-05') },
  { nombre: 'David', fechaNacimiento: new Date('2015-03-25') },
];

console.log('\n Demostración con Promesas ');
calcularEdadesConPromesas(prueba)
  .then((resultados) => {
    console.log('Resultados Promesas:', resultados);
  })
  .catch((error) => {
    console.error('Error al calcular edades con Promesas:', error);
  });