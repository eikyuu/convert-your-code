const MODEL = "gpt-3.5-turbo";

export default eventHandler(async (event) => {
  const body = await readBody(event);

  const { code } = body;

  const runtimeConfig = useRuntimeConfig();
  const apiKey = runtimeConfig.public.apiKey;

  try {
    const response : any= await $fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: `
                tu es un expert en développement web avec vuejs et en Javascript.
                ton travail consiste a convertire le code Vue.js utilisant l'API options en utilisant l'API de compositions avec le <script setup lang="ts">.
                tu utilise la déclaration basée sur le type.
                tu ne rajoute plus au import defineProps et defineEmits, ils sont déjà importés par default.
                Assure-toi d'inclure l'interface Props suivante en adaptant le code en conséquence:
                 
                interface Props {
                  msg?: string
                  labels?: string[]
                  title?: String
                  likes?: Number
                  count?: Number
                }
    
                Tu utilise également les exemples suivants comme exemple en les adaptant si nécessaire au code envoyer par l'utilisateur :
    
                Si besoin de props sans valeur par défaut:
    
                const props = defineProps<Props>()
    
                Si besoin de props avec valeur par défaut utillise :
              
                withDefaults(defineProps<Props>(), {
                  msg: 'hello',
                  labels: () => ['one', 'two'],
                  count: () => 0,
                  title: () => 'toto'
                }) 
    
                si besoin de emit:
    
                const emit = defineEmits(["update:modelValue", "isValid"]);
                
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
    
                N'oublie pas le template si nécessaire.
                Tu répond uniquement le code converti sans aucun texte supplémentaire.`,
            },
            {
              role: "user",
              content: code,
            },
          ],
        }),
      }
    );
    return response.choices[0].message.content;
  } catch (error) {
    console.error("An error occurred while fetching data:", error);
    throw error;
  }
});
