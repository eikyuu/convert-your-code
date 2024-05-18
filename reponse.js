const mock = {
    "response": {
        "id": "chatcmpl-9PnQ7oGy9ejjZ4pOItG4XRYNxpZjZ",
        "object": "chat.completion",
        "created": 1715935199,
        "model": "gpt-3.5-turbo-0125",
        "choices": [
            {
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": "```vue\n<script setup lang=\"ts\">\nimport { ref, defineProps, defineEmits, watch } from 'vue';\nimport InputBase from './InputBase.vue';\n\ninterface Props {\n  label: string;\n  helpText: string;\n  unit: string;\n  modelValue: string;\n  placeholder: string;\n  ariaLabel: string;\n  inputId: string;\n  isError: boolean;\n  isSuccess: boolean;\n  isWarning: boolean;\n  isDisabled: boolean;\n  regex: RegExp;\n  maxValue: number;\n  minValue: number;\n}\n\nconst props = defineProps<Props>();\n\nconst emits = defineEmits(['update:modelValue', 'isValid']);\n\nconst isTextError = ref(props.isError);\nconst isTextSuccess = ref(props.isSuccess);\nconst isTextWarning = ref(props.isWarning);\nconst isTextDisabled = ref(props.isDisabled);\n\nconst checkValue = (e: KeyboardEvent) => {\n  checkInputValue((e.target as HTMLInputElement).value);\n};\n\nconst checkInputValue = (data: string) => {\n  emits('update:modelValue', data);\n\n  const expression: RegExp = props.regex;\n  const result: boolean = expression.test(data);\n\n  resetState();\n\n  if (result && parseInt(data.replace(' ', '')) <= props.maxValue && parseInt(data.replace(' ', '')) >= props.minValue) {\n    isTextSuccess.value = true;\n  } else {\n    isTextError.value = true;\n  }\n\n  if (data.length === 0) {\n    resetState();\n  }\n\n  isValid(isTextSuccess.value);\n};\n\nconst resetState = () => {\n  isTextError.value = false;\n  isTextSuccess.value = false;\n  isTextWarning.value = false;\n  isTextDisabled.value = false;\n};\n\nconst isValid = (isValid: boolean) => {\n  emits('isValid', isValid);\n};\n\nwatch(props.modelValue, () => {\n  checkInputValue(props.modelValue as string);\n});\n\nwatch(props.isSuccess, (newValue) => {\n  isTextSuccess.value = newValue as boolean;\n});\n\nwatch(props.isDisabled, (newValue) => {\n  isTextDisabled.value = newValue as boolean;\n});\n\nwatch(props.isError, (newValue) => {\n  isTextError.value = newValue as boolean;\n});\n\nwatch(props.isWarning, (newValue) => {\n  isTextWarning.value = newValue as boolean;\n});\n\nexport { isTextError, isTextSuccess, isTextWarning, isTextDisabled, checkValue, checkInputValue };\n</script>\n\n<template>\n  <InputBase\n    input-type=\"text\"\n    css-classes=\"inputTextWithUnit noValidationIcons\"\n    :label=\"props.label\"\n    :help-text=\"props.helpText\"\n    :default-value=\"props.modelValue\"\n    :placeholder=\"props.placeholder\"\n    :aria-label=\"props.ariaLabel\"\n    :input-id=\"props.inputId\"\n    :is-error=\"isTextError\"\n    :is-success=\"isTextSuccess\"\n    :is-warning=\"isTextWarning\"\n    :is-disabled=\"isTextDisabled\"\n    :add-on-text=\"props.unit\"\n    :input-size-attribute=\"15\"\n    @keyup=\"checkValue\"\n  />\n</template>\n\n<style lang=\"scss\">\n@import '../../assets/components/textWithUnitInput';\n</style>\n```"
                },
                "logprobs": null,
                "finish_reason": "stop"
            }
        ],
        "usage": {
            "prompt_tokens": 798,
            "completion_tokens": 672,
            "total_tokens": 1470
        },
        "system_fingerprint": null
    }
}

export default mock;