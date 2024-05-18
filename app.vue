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

<script setup lang="ts">
import { ref, watch } from "vue";

const code = ref("");
const convertedCode = ref(``);
const loading = ref(false);
const formattedCode = ref(``);

const formatCode = (code: string) => {
  return code.replace(/```vue/g, "").replace(/```/g, "");
};

const convert = async () => {
  loading.value = true;
  try {
    const response = await fetch("http://localhost:3333/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: code.value }),
    });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    convertedCode.value = data.response.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    // Provide user-friendly feedback here
  } finally {
    loading.value = false;
  }
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
