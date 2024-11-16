import React, { useEffect, useState } from 'react';
import './cadastro2-varianteA.css';
import './cadastro2-varianteB.css';
import { Link, useNavigate } from 'react-router-dom';

function CadastroAuth() {
    const navigate = useNavigate();
    const [variant, setVariant] = useState('A');
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        // Escolhe aleatoriamente entre 'A' e 'B'
        const randomVariant = Math.random() < 0.5 ? 'A' : 'B';
        setVariant(randomVariant);

        // Cria uma tag <link> para carregar o CSS apropriado
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = randomVariant === 'A' ? '/path/to/cadastro-variantA.css' : '/path/to/cadastro-variantB.css';
        document.head.appendChild(link);

        // Adiciona a classe ao body
        document.body.classList.add(`variant-${randomVariant}`);

        // Limpa o link e a classe quando o componente é desmontado
        return () => {
            document.head.removeChild(link);
            document.body.classList.remove(`variant-${randomVariant}`);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));

        // Verificação em tempo real das senhas
        if (name === 'senha' || name === 'confirmSenha') {
            if (name === 'senha' && formData.confirmSenha && value !== formData.confirmSenha) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmSenha: 'As senhas não coincidem'
                }));
            } else if (name === 'confirmSenha' && formData.senha && value !== formData.senha) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmSenha: 'As senhas não coincidem'
                }));
            } else {
                setErrors((prevErrors) => {
                    const { confirmSenha, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'E-mail é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'E-mail inválido';
        } else if (!formData.email.endsWith('@fatec.sp.gov.br')) {
            newErrors.email = 'E-mail deve ser @fatec.sp.gov.br';
        }
        if (!formData.senha) {
            newErrors.senha = 'Senha é obrigatória';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.senha)) {
            newErrors.senha = 'Senha deve ter no mínimo 8 caracteres, pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial';
        }
        if (!formData.confirmSenha) {
            newErrors.confirmSenha = 'Confirmação de senha é obrigatória';
        } else if (formData.senha !== formData.confirmSenha) {
            newErrors.confirmSenha = 'As senhas não coincidem';
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        console.log('Form Data:', formData);

        // Cria uma cópia do formData sem o campo confirmSenha
        const { confirmSenha, ...dataToSubmit } = formData;

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/cadastro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSubmit)
            });
            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className={`container variant-${variant}`}>
            <img
                className={`logo-rachai1 variant-${variant}`}
                src={variant === 'A' ? '/assets/img/rachai.png' : '/assets/img/rachai2.png'}
                alt="Logo Rachaí"
            />
            <form onSubmit={handleSubmit}>
                <div className={`input-container variant-${variant}`}>
                    <i className="fas fa-envelope"></i>
                    <input
                        className={`input-field variant-${variant}`}
                        type="email"
                        name="email"
                        placeholder="E-mail: usuario@fatec.sp.gov.br"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                {errors.email && <span className={`error variant-${variant}`}>{errors.email}</span>}
                <div className={`input-container variant-${variant}`}>
                    <input
                        className={`input-field variant-${variant}`}
                        type={showPassword ? "text" : "password"}
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleChange}
                    />
                    <i
                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                        onClick={togglePasswordVisibility}
                    ></i>
                </div>
                {errors.senha && <span className={`error variant-${variant}`}>{errors.senha}</span>}
                <div className={`input-container variant-${variant}`}>
                    <input
                        className={`input-field variant-${variant}`}
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmSenha"
                        placeholder="Confirme a Senha"
                        value={formData.confirmSenha}
                        onChange={handleChange}
                    />
                    <i
                        className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} password-toggle`}
                        onClick={toggleConfirmPasswordVisibility}
                    ></i>
                </div>
                {errors.confirmSenha && <span className={`error variant-${variant}`}>{errors.confirmSenha}</span>}
                <br />
                <div className={`botoes-acoes variant-${variant}`}>
                    <button className={`button-button-cadastro variant-${variant}`} onClick={() => navigate(-1)}>Voltar</button>
                    <button type="submit" className={`button-button-cadastro variant-${variant}`}>
                        Cadastrar-se
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CadastroAuth;