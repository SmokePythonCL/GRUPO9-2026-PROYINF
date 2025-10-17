document.addEventListener('DOMContentLoaded', function() {
    feather.replace();

    // Form step navigation
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const nextStepId = this.getAttribute('data-next');
            const nextStep = document.getElementById(nextStepId);

            currentStep.classList.remove('active');
            nextStep.classList.add('active');

            // Update progress bar
            const progressBar = document.querySelector('.bg-amber-500');
            if (nextStepId === 'step-2') {
                progressBar.style.width = '66%';
            } else if (nextStepId === 'step-3') {
                progressBar.style.width = '100%';
                updateConfirmationData();
            }

            // Update step indicators
            if (nextStepId === 'step-2') {
                document.querySelectorAll('.flex-1:nth-child(2) div').forEach(el => {
                    el.classList.remove('bg-gray-200', 'text-gray-500');
                    el.classList.add('bg-amber-500', 'text-white');
                });
                document.querySelectorAll('.flex-1:nth-child(2) span').forEach(el => {
                    el.classList.remove('text-gray-500');
                    el.classList.add('text-amber-500');
                });
            } else if (nextStepId === 'step-3') {
                document.querySelectorAll('.flex-1:nth-child(3) div').forEach(el => {
                    el.classList.remove('bg-gray-200', 'text-gray-500');
                    el.classList.add('bg-amber-500', 'text-white');
                });
                document.querySelectorAll('.flex-1:nth-child(3) span').forEach(el => {
                    el.classList.remove('text-gray-500');
                    el.classList.add('text-amber-500');
                });
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.form-step');
            const prevStepId = this.getAttribute('data-prev');
            const prevStep = document.getElementById(prevStepId);

            currentStep.classList.remove('active');
            prevStep.classList.add('active');

            // Update progress bar
            const progressBar = document.querySelector('.bg-amber-500');
            if (prevStepId === 'step-1') {
                progressBar.style.width = '33%';
            } else if (prevStepId === 'step-2') {
                progressBar.style.width = '66%';
            }

            // Update step indicators
            if (currentStep.id === 'step-2') {
                document.querySelectorAll('.flex-1:nth-child(2) div').forEach(el => {
                    el.classList.add('bg-gray-200', 'text-gray-500');
                    el.classList.remove('bg-amber-500', 'text-white');
                });
                document.querySelectorAll('.flex-1:nth-child(2) span').forEach(el => {
                    el.classList.add('text-gray-500');
                    el.classList.remove('text-amber-500');
                });
            } else if (currentStep.id === 'step-3') {
                document.querySelectorAll('.flex-1:nth-child(3) div').forEach(el => {
                    el.classList.add('bg-gray-200', 'text-gray-500');
                    el.classList.remove('bg-amber-500', 'text-white');
                });
                document.querySelectorAll('.flex-1:nth-child(3) span').forEach(el => {
                    el.classList.add('text-gray-500');
                    el.classList.remove('text-amber-500');
                });
            }
        });
    });

    // Region and Comuna selection
    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    const comunasPorRegion = {
        'arica': ['Arica', 'Camarones', 'Putre', 'General Lagos'],
        'tarapaca': ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica'],
        'antofagasta': ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena'],
        'atacama': ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco'],
        'coquimbo': ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado'],
        'valparaiso': ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana'],
        'metropolitana': ['Santiago', 'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'Colina', 'Lampa', 'Tiltil', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor'],
        'ohiggins': ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz'],
        'maule': ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas'],
        'nuble': ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ránquil', 'Treguaco', 'San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás'],
        'biobio': ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualpén', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa'],
        'araucania': ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria'],
        'rios': ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno'],
        'lagos': ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena'],
        'aysen': ['Coihaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'O\'Higgins', 'Tortel', 'Chile Chico', 'Río Ibáñez'],
        'magallanes': ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos (Ex Navarino)', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine']
    };

    regionSelect.addEventListener('change', function() {
        comunaSelect.innerHTML = '<option value="" disabled selected>Seleccione comuna</option>';
        
        if (this.value) {
            const comunas = comunasPorRegion[this.value];
            comunas.forEach(comuna => {
                const option = document.createElement('option');
                option.value = comuna.toLowerCase().replace(/\s+/g, '-');
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });

    // File upload preview
    document.getElementById('ci-frente').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.getElementById('confirm-ci-frente').textContent = this.files[0].name;
        }
    });

    document.getElementById('ci-reverso').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.getElementById('confirm-ci-reverso').textContent = this.files[0].name;
        }
    });

    document.getElementById('comprobante').addEventListener('change', function() {
        if (this.files.length > 0) {
            document.getElementById('confirm-comprobante').textContent = this.files[0].name;
        }
    });

    // Form submission
    document.getElementById('CL-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo en breve.');
        // Here you would typically send the form data to your backend
    });

    // Update confirmation data
    function updateConfirmationData() {
        document.getElementById('confirm-nombre').textContent = document.getElementById('nombre').value;
        document.getElementById('confirm-rut').textContent = document.getElementById('rut').value;
        document.getElementById('confirm-email').textContent = document.getElementById('email').value;
        document.getElementById('confirm-telefono').textContent = document.getElementById('telefono').value;
        document.getElementById('confirm-fecha-nacimiento').textContent = document.getElementById('fecha-nacimiento').value;
        document.getElementById('confirm-direccion').textContent = document.getElementById('direccion').value + ', ' + 
            document.querySelector('#region option:checked').textContent + ', ' + 
            document.querySelector('#comuna option:checked').textContent;
    }
});
