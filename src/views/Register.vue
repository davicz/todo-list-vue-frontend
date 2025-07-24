<template>
  <div class="register-container">
    <div class="register-box">
      <h1>Crie sua Conta</h1>
      <p>É rápido e fácil.</p>
      
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label for="name">Nome</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            placeholder="Seu nome completo"
          />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="seu@email.com"
          />
        </div>
        
        <div class="input-group">
          <label for="password">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div class="input-group">
          <label for="password_confirmation">Confirme sua Senha</label>
          <input 
            type="password" 
            id="password_confirmation" 
            v-model="password_confirmation" 
            required 
            placeholder="Repita a senha"
          />
        </div>
        
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
        
        <button type="submit" class="register-button">Registrar</button>
      </form>
      
      <div class="login-link">
        <p>Já tem uma conta? <router-link to="/login">Faça o login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';

const name = ref('');
const email = ref('');
const password = ref('');
const password_confirmation = ref('');
const errorMessage = ref(null);
const successMessage = ref(null);

const router = useRouter();

const handleRegister = async () => {
  errorMessage.value = null;
  successMessage.value = null;

  if (password.value !== password_confirmation.value) {
    errorMessage.value = 'As senhas não correspondem.';
    return;
  }

  try {
    await apiClient.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: password_confirmation.value,
    });

    successMessage.value = 'Registro realizado com sucesso! Redirecionando para o login...';
    
    // Espera 2 segundos e redireciona para a página de login
    setTimeout(() => {
      router.push('/login');
    }, 2000);

  } catch (error) {
    if (error.response && error.response.data.errors) {
      // Pega a primeira mensagem de erro da API
      const errors = error.response.data.errors;
      const firstErrorKey = Object.keys(errors)[0];
      errorMessage.value = errors[firstErrorKey][0];
    } else {
      errorMessage.value = 'Ocorreu um erro no registro. Tente novamente.';
    }
    console.error('Registration failed:', error);
  }
};
</script>

<style scoped>
/* Usando os mesmos estilos do Login para consistência */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-box {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-button {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #218838;
}

.error-message {
  color: #d93025;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.login-link {
  margin-top: 1.5rem;
}

.login-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
