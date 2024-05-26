<template>
  <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl gap-16 sm:gap-y-24 flex flex-col">
    <div class="text-center relative mt-10">
      <h1 class="text-vue-color text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">Vue Composition API Converter</h1>
      <p class="mt-6 text-lg tracking-tight text-gray-600 dark:text-gray-300">
        Convert your Vue 2 Options API code to Vue 3 Composition API with <code>&lt;script setup lang="ts"&gt;</code>.
      </p>
      <!-- <div class="mt-10 flex flex-wrap gap-x-6 gap-y-3 justify-center">

        <Button type="button">
          Get Started
        </Button>

        <Button type="button">
          Learn More
        </Button>

      </div> -->
    </div>
  </div>

  <hr class="my-10" /> 

  <section class="text-gray-600 body-font">

    <div class="flex justify-between px-10">

      <form class="w-1/2 mr-2 space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="code">
          <FormItem>
            <FormControl>
              <Textarea placeholder="Paste your Vue 2 Options API code here" class="h-96 resize-none" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button type="submit">Convertir</Button>
      </form>


      <div class="h-96 w-1/2 bg-slate-50 p-2 ml-2 overflow-auto flex flex-col">
        <Button v-if="convertedCode" class="fixed mt-1 right-16 w-auto" type="button" @click="copy">C/C</Button>
        <div v-if="loading">Loading...</div>
        <p v-if="!loading && !convertedCode" class="text-sm text-gray-600 text-center">Paste your Vue2 Options API code in the left box to see the converted code here</p>
        <Shiki lang="ts" :code="formattedCode" class="mt-10"/>
      </div>

    </div>
  </section>

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { useNuxtApp } from '#app';
import { useForm } from "vee-validate";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import chatGptService from "~/services/chatGptService";


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
const nuxtApp = useNuxtApp(); 

const apiService = chatGptService(nuxtApp);

const convertedCode = ref(``);
const loading = ref(false);
const formattedCode = ref(``);

const formatCode = (code: string) => {
  return code.replace(/```vue/g, "").replace(/```/g, "");
};

const sendCodeConvertToChatGPT = async (code: string) => {
  loading.value = true;
  try {
    const response = await apiService.getChatGptResponse(code);
    if (response.data && response.data.choices.length > 0) {
      convertedCode.value = response.data.choices[0].message.content;
    } else {
      console.error("No data received from API.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
};

const copy = async () => {
  await navigator.clipboard.writeText(convertedCode.value);
  // toast({
  //   title: "Code copied to clipboard",
  //   description: "Your code has been copied to your clipboard. You can paste it anywhere.",
  //   status: "success",
  // });
};

watch(convertedCode, (newValue: any) => {
  formattedCode.value = formatCode(newValue);
});
</script>
