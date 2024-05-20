<template>
  <textarea v-model="code" rows="10" cols="50"></textarea>
  <button @click="sendCodeConvertToChatGPT">Convertir</button>

  <pre>
      <code>
        {{ formattedCode }}
      </code>
    </pre>
  <p v-if="loading">Loading...</p>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from 'axios';
const config = useRuntimeConfig()

const code = ref("");
const convertedCode = ref(``);
const loading = ref(false);
const formattedCode = ref(``);

const formatCode = (code: string) => {
  return code.replace(/```vue/g, "").replace(/```/g, "");
};

const sendCodeConvertToChatGPT = async () => {
  loading.value = true;
  try {
    const response = await axios.post("https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
            tu es un expert en développement web avec vuejs et nuxtjs.
            Convertis le code Vue.js ou Nuxt.js utilisant l'API options en utilisant l'API de compositions avec le <script setup lang="ts">.
            Assure-toi d'inclure si nécessaire l'interface Props suivante en adaptant le code en conséquence:
             
            interface Props {
              msg?: string
              labels?: string[]
              title?: String
              likes?: Number
              count?: Number
            }
            
            Utile la déclaration basée sur le type.

            Utilise également les fonctions suivantes comme exemple en les adaptant si nécessaire au code fourni:

            Si besoin de props sans valeur par défaut:

            const props = defineProps<{
              foo: string
              bar?: number
            }>()

            Si besoin de props avec valeur par défaut:
          
            withDefaults(defineProps<Props>(), {
              msg: 'hello',
              labels: () => ['one', 'two'],
              count: () => 0,
              title: () => 'toto'
            }) 
            
            si besoin de watch et onMounted:
            watch(count, (newCount) => {
              // yes, console.log() is a side effect
              console.log(\`new count is: \${newCount}\`)
            })
            
            onMounted(() => {
              message.value = 'on mounted'
            })
            
            si besoin de ref:
            ref('Hello World!')

           Fournis uniquement le code converti en réponse, sans aucun texte supplémentaire.`,

          },
          {
            role: "user",
            content: code.value,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.public.apiKey}`,
        },
      }
    );

    convertedCode.value = response.data.choices[0].message.content;
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

onMounted(() => {
  code.value = `function withDefaults(defineProps<Props>(), {
    msg: 'hello',
    labels: () => ['one', 'two'],
    count: () => 0,
    title: () => 'toto'
  })`;
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
