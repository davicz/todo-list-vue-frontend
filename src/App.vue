<template>
  <div id="app">
    <!-- 
      Esta tag especial é o espaço reservado do Vue Router.
      Ele irá renderizar o componente da página atual (Login.vue, Dashboard.vue, etc.)
      exatamente aqui.
    -->
    <router-view />
  </div>
</template>

<style>
/* Estes são estilos globais que se aplicarão a toda a sua aplicação.
  É um bom lugar para definir a fonte padrão, cor de fundo, etc.
*/
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f7f6;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#app {
  width: 100%;
  max-width: 1200px;
}
</style>
