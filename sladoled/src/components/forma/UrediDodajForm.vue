<template>
    <v-dialog v-model="dialogVisible" max-width="600px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5 indigo--text">{{ modalTitle }}</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" @submit.prevent="submitForm">
            <v-text-field v-model="localFormValues.name" label="Naziv" required></v-text-field>
            <v-text-field v-model="localFormValues.description" label="Opis" required></v-text-field>
            <v-textarea
              v-model="localFormValues.ingredients"
              label="Sastojci (odvojeni zarezom)"
              required
            ></v-textarea>
            <v-textarea v-model="localFormValues.recipe" label="Recept" required></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="closeModal">Odustani</v-btn>
          <v-btn color="primary" text @click="submitForm">{{ submitButtonText }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
  
<script>
export default {
  props: {
    modalVisible: {
      type: Boolean,
      required: true,
    },
    modalTitle: {
      type: String,
      required: true,
    },
    formValues: {
      type: Object,
      required: true,
    },
    submitButtonText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      localFormValues: {},
    };
  },
  watch: {
    modalVisible(newValue) {
      this.dialogVisible = newValue;
      if (newValue) {
        this.localFormValues = { ...this.formValues };
      }
    },
  },
  methods: {
    submitForm() {
      if (this.$refs.form.validate()) {
        this.$emit('submit', this.localFormValues);
        this.closeModal();
      }
    },
    closeModal() {
      this.dialogVisible = false;
      this.$emit('close');
    },
  },
};
</script>
