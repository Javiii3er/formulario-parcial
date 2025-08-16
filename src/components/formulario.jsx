import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useSpring, animated } from '@react-spring/web';
import { Modal, Button } from 'react-bootstrap';

const Formulario = () => {
    const [formData, setFormData] = useState({
        saludo: '',
        nombre: '',
        apellido: '',
        genero: '',
        email: '',
        fecha_de_nacimiento: '',
        direccion: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Animación con React Spring
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translateY(20px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: { tension: 200, friction: 20 }
    });

    const saludo = ['--Ninguno--', 'Sr.', 'Sra.', 'Srta.',"Otro"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Limpiar errores al cambiar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido";
        else if (formData.nombre.length < 3) newErrors.nombre = "Mínimo 3 caracteres";
        
        if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido";
        
        if (!formData.genero) newErrors.genero = "Selecciona tu género";

        if (!formData.email) newErrors.email = "El email es requerido";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido";
        
        if (!formData.fecha_de_nacimiento) newErrors.fecha_de_nacimiento = "La fecha de nacimiento es requerida";
        else {
            const today = new Date();       
            const birthDate = new Date(formData.fecha_de_nacimiento);
            if (birthDate >= today) {
                newErrors.fecha_de_nacimiento = "La fecha de nacimiento no puede ser hoy o en el futuro";   
            } else {
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    newErrors.fecha_de_nacimiento = "Debes tener al menos 18 años";             
    }
            }
        }

        if (!formData.direccion.trim()) newErrors.direccion = "La dirección es requerida";
        if (!formData.saludo.trim()) newErrors.saludo = "El saludo es requerido";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            setShowModal(true);
        }
    };

    const generateExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([{
            ...formData,
            edad: formData.edad ? 'Sí' : 'No'
        }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        saveAs(data, `datos-${formData.nombre}-${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const handleConfirm = () => {
        saveToGoogleSheets();
    };

    return (
        <animated.div style={fadeIn} className="container mt-5">
            <div className="glass-card">
                <h1 className="text-center mb-4">Detalles Personales</h1>
                <form onSubmit={handleSubmit}>

                   <div className="mb-3">
                        <label className="form-label">Saludo:</label>
                        <select 
                            className={`form-select ${errors.saludo && 'is-invalid'}`}
                            name="saludo" 
                            value={formData.saludo} 
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un tipo de saludo</option>
                            {saludo.map((saludo, index) => (
                                <option key={index} value={saludo}>{saludo}</option>
                            ))}
                        </select>
                        {errors.saludo && <div className="invalid-feedback">{errors.saludo}</div>}
                    </div> 



                    <div className="mb-3">
                        <label className="form-label">Nombre:</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.nombre && 'is-invalid'}`}
                            name="nombre" 
                            value={formData.nombre} 
                            onChange={handleChange} 
                            placeholder="Introduce tu nombre" 
                        />
                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Apellido:</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.apellido && 'is-invalid'}`}
                            name="apellido" 
                            value={formData.apellido} 
                            onChange={handleChange} 
                            placeholder="Introduce tu apellido" 
                        />
                        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                    
        
                    
                    <div className="mb-3">
                        <label className="form-label">Género:</label>
                        <div className="d-flex gap-3">
                            {['Masculino', 'Femenino', 'No estoy seguro'].map((genero) => (
                                <div key={genero} className="form-check">
                                    <input 
                                        className="form-check-input"
                                        type="radio" 
                                        name="genero" 
                                        id={`genero-${genero}`}
                                        value={genero} 
                                        checked={formData.genero === genero} 
                                        onChange={handleChange} 
                                    />
                                    <label className="form-check-label" htmlFor={`genero-${genero}`}>
                                        {genero}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.genero && <div className="text-danger small">{errors.genero}</div>}
                    </div>
                    
        
                    
                    <button 
                        type="submit" 
                        className="btn btn-glass w-100 mt-3"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Procesando...' : 'Guardar cambios'}
                    </button>
                </form>
            </div>

            {/* Modal de Resumen */}
            <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-glass">
                <Modal.Header closeButton className="modal-content-glass">
                    <Modal.Title>Confirmar Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-content-glass">
                    <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p>
                    <p><strong>Saludo:</strong> {formData.saludo}</p>
                    <p><strong>Género:</strong> {formData.genero}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Fecha de Nacimiento:</strong> {formData.fecha_de_nacimiento}</p>
                    <p><strong>Dirección:</strong> {formData.direccion}</p>
            
                    
                    <div className="alert alert-info mt-3">
                        Los datos se guardarán y se generará un archivo Excel.
                    </div>
                </Modal.Body>
                <Modal.Footer className="modal-content-glass">
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                        disabled={isSubmitting}
                    >
                        Corregir
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Confirmar y Descargar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </animated.div>
    );
};

export default Formulario;