# Quality Issues
## 1. beneficios/page.js

* Ubicación: Proyecto/frontend/src/app/beneficios/page.js
* Tipo : Mantenibilidad
* Impacto: Alto
* Severidad: Critico
* Problema : Las funciones no deben tener más de 4 niveles de profundidad de funciones anidadas.
* Solución: Refactorizar
* Función Afectada: 
```javascript
                        //Nest 1
export default function Beneficios() {
             //Nest 2
  useEffect(() => {
                          //Nest 3
    const loadScript = (src) => new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
                   //Nest 4
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.head.appendChild(s);
    });

    ...

}
```

## 2. controllers/userController.js
* Ubicación: Proyecto/frontend/src/app/mi_cuenta/ajustes/page.jsx
* Tipo : Fiabilidad
* Impacto: Medio
* Severidad: Importante
* Problema : Un formulario de tipo label debe estar asociado a un controlador
* Solución: Agregar un controlador.
* Función Afectada: 
```HTML
const handleSubmit = async (e) => {

  	...
  
  	return (

		...

			<label className="font-medium">Nombre</label>
			<input
				type="text"
				className="w-full border p-2 rounded"
				value={nombre}
				onChange={(e) => setNombre(e.target.value)}
			/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label className="font-medium">Apellido paterno</label>
				<input
				type="text"
				className="w-full border p-2 rounded"
				value={apellidoPaterno}
				onChange={(e) => setApellidoPaterno(e.target.value)}
				/>
			</div>

			<div>
				<label className="font-medium">Apellido materno</label>
				<input
				type="text"
				className="w-full border p-2 rounded"
				value={apellidoMaterno}
				onChange={(e) => setApellidoMaterno(e.target.value)}
				/>
			</div>
			</div>

		...

		</div>
	);
```

# Recomendaciones

La plataforma presenta varias recomendaciones en Fiabilidad y Mantenibilidad, estos deben ser abordados con el suficiente cuidado dado que si no se hace así podríamos generar que la página deje de funcionar y cuando queramos realizar mejoras de la plataforma no podremos realizarla en buen tiempo porque no se entiende el código.

Uno de los problemas más repetidos en fiabilidad es la necesidad de agregar un controlador a un formulario tipo label. Y en mantenibilidad recomienda cambios de utilización de variables por modos acortados, por ejemplo: Preferir `globalThis.window` sobre `window`.