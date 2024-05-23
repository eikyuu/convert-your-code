
export default (nuxtApp: any) => {
  const axios = nuxtApp.$api;
  const getChatGptResponse = async (code : string) => {
    try {
      const response = await axios.post('/chat/completions', 
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
            tu es un expert en développement web avec vuejs et nuxtjs.
            Convertis le code Vue.js ou Nuxt.js utilisant l'API options en utilisant l'API de compositions avec le <script setup lang="ts">.
            Assure-toi d'inclure l'interface Props suivante en adaptant le code en conséquence:
             
            interface Props {
              msg?: string
              labels?: string[]
              title?: String
              likes?: Number
              count?: Number
            }
            
            Utile la déclaration basée sur le type.

            Les type sont en JAVASCRIPT.

            ne rajoute plus au import defineProps et defineEmits, ils sont déjà importés par default.

            Utilise également les fonctions suivantes comme exemple en les adaptant si nécessaire au code fourni:

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

            N'oublie pas le template.
           Fournis uniquement le code converti en réponse, sans aucun texte supplémentaire.`,
          },
          {
            role: "user",
            content: code,
          },
        ],
      },
      );
      return response;
    } catch (error) {
      console.error('An error occurred while fetching data:', error);
      throw error;
    }
  };

  // Ajoutez d'autres méthodes API selon les besoins
  return {
    getChatGptResponse,
  };
};