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
          Learn More
        </Button>

      </div>
    </div>
  </div>

  <section class="text-gray-600 body-font">
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


      <div class="w-full pl-5">
        <Button type="button" @click="copy">C/C</Button>
        <pre>
          <code>
            {{ formattedCode }}
          </code>
        </pre>
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
  convertedCode.value = "";
  try {
    const response = await apiService.getChatGptResponse(code);

    convertedCode.value = response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    // Provide user-friendly feedback here
  } finally {
    loading.value = false;
  }
};

const copy = () => {
  navigator.clipboard.writeText(convertedCode.value);
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
