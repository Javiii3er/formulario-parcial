import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    const saludo = ['--Ninguno--', 'Sr.', 'Sra.', 'Srta.', 'Otro'];
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
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
        if (!formData.nombre.trim())
            newErrors.nombre = "El nombre es requerido";
        else if (formData.nombre.length < 3)
            newErrors.nombre = "Mínimo 3 caracteres";
        if (!formData.apellido.trim())
            newErrors.apellido = "El apellido es requerido";
        if (!formData.genero)
            newErrors.genero = "Selecciona tu género";
        if (!formData.email)
            newErrors.email = "El email es requerido";
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            newErrors.email = "Email inválido";
        if (!formData.fecha_de_nacimiento) {
            newErrors.fecha_de_nacimiento = "La fecha de nacimiento es requerida";
        }
        else {
            const today = new Date();
            const birthDate = new Date(formData.fecha_de_nacimiento);
            if (birthDate >= today) {
                newErrors.fecha_de_nacimiento = "La fecha de nacimiento no puede ser hoy o en el futuro";
            }
            else {
                const ageYears = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const dayDiff = today.getDate() - birthDate.getDate();
                if (ageYears < 18 || (ageYears === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
                    newErrors.fecha_de_nacimiento = "Debes tener al menos 18 años";
                }
            }
        }
        if (!formData.direccion.trim())
            newErrors.direccion = "La dirección es requerida";
        if (!formData.saludo)
            newErrors.saludo = "El saludo es requerido";
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
        const worksheet = XLSX.utils.json_to_sheet([formData]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(data, `datos-${formData.nombre}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    };
    const handleConfirm = () => {
        setIsSubmitting(true);
        generateExcel();
        setTimeout(() => {
            setIsSubmitting(false);
            setShowModal(false);
            setFormData({
                saludo: '',
                nombre: '',
                apellido: '',
                genero: '',
                email: '',
                fecha_de_nacimiento: '',
                direccion: '',
            });
        }, 1500);
    };
    return (_jsxs(animated.div, { style: fadeIn, className: "container mt-5", children: [_jsxs("div", { className: "glass-card", children: [_jsx("h1", { className: "text-center mb-4", children: "Detalles Personales" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Saludo:" }), _jsxs("select", { className: `form-select ${errors.saludo && 'is-invalid'}`, name: "saludo", value: formData.saludo, onChange: handleChange, children: [_jsx("option", { value: "", children: "Selecciona un tipo de saludo" }), saludo.map((opcion, index) => (_jsx("option", { value: opcion === '--Ninguno--' ? '' : opcion, children: opcion }, index)))] }), errors.saludo && _jsx("div", { className: "invalid-feedback", children: errors.saludo })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Nombre:" }), _jsx("input", { type: "text", className: `form-control ${errors.nombre && 'is-invalid'}`, name: "nombre", value: formData.nombre, onChange: handleChange, placeholder: "Introduce tu nombre" }), errors.nombre && _jsx("div", { className: "invalid-feedback", children: errors.nombre })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Apellido:" }), _jsx("input", { type: "text", className: `form-control ${errors.apellido && 'is-invalid'}`, name: "apellido", value: formData.apellido, onChange: handleChange, placeholder: "Introduce tu apellido" }), errors.apellido && _jsx("div", { className: "invalid-feedback", children: errors.apellido })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "G\u00E9nero:" }), _jsx("div", { className: "d-flex gap-3", children: ['Masculino', 'Femenino', 'No estoy seguro'].map((genero) => (_jsxs("div", { className: "form-check", children: [_jsx("input", { className: "form-check-input", type: "radio", name: "genero", id: `genero-${genero}`, value: genero, checked: formData.genero === genero, onChange: handleChange }), _jsx("label", { className: "form-check-label", htmlFor: `genero-${genero}`, children: genero })] }, genero))) }), errors.genero && _jsx("div", { className: "text-danger small", children: errors.genero })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Fecha de Nacimiento:" }), _jsx("input", { type: "date", className: `form-control ${errors.fecha_de_nacimiento && 'is-invalid'}`, name: "fecha_de_nacimiento", value: formData.fecha_de_nacimiento, onChange: handleChange }), errors.fecha_de_nacimiento && _jsx("div", { className: "invalid-feedback", children: errors.fecha_de_nacimiento })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Email:" }), _jsx("input", { type: "email", className: `form-control ${errors.email && 'is-invalid'}`, name: "email", value: formData.email, onChange: handleChange, placeholder: "Introduce tu email" }), errors.email && _jsx("div", { className: "invalid-feedback", children: errors.email })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "form-label", children: "Direcci\u00F3n:" }), _jsx("textarea", { className: `form-control ${errors.direccion && 'is-invalid'}`, name: "direccion", value: formData.direccion, onChange: handleChange, rows: 3, placeholder: "Introduce tu direcci\u00F3n" }), errors.direccion && _jsx("div", { className: "invalid-feedback", children: errors.direccion })] }), _jsx("button", { type: "submit", className: "btn btn-glass w-100 mt-3", disabled: isSubmitting, children: isSubmitting ? 'Procesando...' : 'Enviar' })] })] }), _jsxs(Modal, { show: showModal, onHide: () => setShowModal(false), className: "modal-glass", children: [_jsx(Modal.Header, { closeButton: true, className: "modal-content-glass", children: _jsx(Modal.Title, { children: "Confirmar Datos" }) }), _jsxs(Modal.Body, { className: "modal-content-glass", children: [_jsxs("p", { children: [_jsx("strong", { children: "Nombre:" }), " ", formData.nombre, " ", formData.apellido] }), _jsxs("p", { children: [_jsx("strong", { children: "Saludo:" }), " ", formData.saludo || 'Ninguno'] }), _jsxs("p", { children: [_jsx("strong", { children: "G\u00E9nero:" }), " ", formData.genero] }), _jsxs("p", { children: [_jsx("strong", { children: "Email:" }), " ", formData.email] }), _jsxs("p", { children: [_jsx("strong", { children: "Fecha de Nacimiento:" }), " ", formData.fecha_de_nacimiento] }), _jsxs("p", { children: [_jsx("strong", { children: "Direcci\u00F3n:" }), " ", formData.direccion] }), _jsx("div", { className: "alert alert-info mt-3", children: "Los datos se guardar\u00E1n y se generar\u00E1 un archivo Excel." })] }), _jsxs(Modal.Footer, { className: "modal-content-glass", children: [_jsx(Button, { variant: "secondary", onClick: () => setShowModal(false), disabled: isSubmitting, children: "Corregir" }), _jsx(Button, { variant: "primary", onClick: handleConfirm, disabled: isSubmitting, children: isSubmitting ? 'Guardando...' : 'Confirmar y Descargar' })] })] })] }));
};
export default Formulario;
