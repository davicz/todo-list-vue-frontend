<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <p>Acesse sua conta para ver suas tarefas.</p>
      
      <form @submit.prevent="handleLogin">
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
            placeholder="Sua senha"
          />
        </div>
        
        <!-- Mensagem de erro que só aparece se houver um erro -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        
        <button type="submit" class="login-button">Entrar</button>
      </form>
      
      <div class="register-link">
        <p>Não tem uma conta? <router-link to="/register">Registre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api'; 
import { store } from '../store'; 

const email = ref('');
const password = ref('');
const errorMessage = ref(null);

const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = null; 
  try {

    const response = await apiClient.post('/login', {
      email: email.value,
      password: password.value,
    });

    const { access_token, user } = response.data;
    store.setAuth(access_token, user);

    router.push('/');

  } catch (error) {
    if (error.response && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Ocorreu um erro. Tente novamente mais tarde.';
    }
    console.error('Login failed:', error);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-box {
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

.login-button {
  width: 100%;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #d93025;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 1.5rem;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}
</style>
