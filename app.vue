<template>



  <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
    <div class="text-center relative z-[1]">
      <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">Vue options to Vue
        compositions</h1>
      <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
        Convert your Vue API options code to Vue API compositions with <code>&lt;script setup lang="ts"&gt;</code>.
      </p>
      <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">

        <Button type="button">
          Get Started
        </Button>

        <Button type="button">
          What is Nuxt?
        </Button>

      </div>
    </div>
  </div>




  <section class="text-gray-600 body-font">
    <h1 class="text-center mt-10">Convertir le code Vue API options en code Vue API de compositions</h1>
    <div v-if="loading">Loading...</div>

    <div class="flex p-10 justify-between">
      <form class="w-1/2 space-y-6 pr-5" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormControl>
              <Textarea placeholder="code à convertir" class="h-64" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit"> Convertir </Button>
      </form>
      <pre class="w-full pl-5">
    <code>
      {{ formattedCode }}
    </code>
  </pre>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import axios from "axios";
import { useForm } from "vee-validate";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = toTypedSchema(
  z.object({
    code: z.string().min(10, {
      message: "Code must be at least 10 characters long.",
    }),
  })
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit((values: any): void => {
  console.log(values.code);
  sendCodeConvertToChatGPT(values.code);
});
const config = useRuntimeConfig();

const convertedCode = ref(``);
const loading = ref(false);
const formattedCode = ref(``);

const formatCode = (code: string) => {
  return code.replace(/```vue/g, "").replace(/```/g, "");
};

const sendCodeConvertToChatGPT = async (code: string) => {
  loading.value = true;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
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

watch(convertedCode, (newValue: any) => {
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
