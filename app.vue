<template>
  <textarea v-model="code" rows="10" cols="50"></textarea>
  <button @click="convert">Convertir</button>

  <pre>
      <code>
        {{ formattedCode }}
      </code>
    </pre>
  <p v-if="loading">Loading...</p>
</template>

<script setup>
import { ref, watch } from "vue";

const code = ref("");
const convertedCode = ref(``);
const loading = ref(false);
const formattedCode = ref(``);

const formatCode = (code) => {
  return code.replace(/```vue/g, "").replace(/```/g, "");
};

const convert = () => {
  loading.value = true;
  fetch("http://localhost:3333/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code.value }),
  })
    .then((response) => response.json())
    .then((data) => {
      convertedCode.value = data.response.choices[0].message.content;
      loading.value = false;
    })
    .catch((error) => {
      console.error("Error:", error);
      loading.value = false;
    });
};

watch(convertedCode, (newValue) => {
  formattedCode.value = formatCode(newValue);
});
</script>

<style>
textarea {
  width: 100%;
  margin-top: 20px;
}

pre {
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
}

</style>
