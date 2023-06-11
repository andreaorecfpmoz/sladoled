<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center indigo--text text--accent-4">Lista Sladoleda</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="pretraga"
          @input="dohvatiOkuse"
          label="Pretraži okuse..."
          filled
          color="indigo accent-4"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-pagination
          v-model="stranica"
          :length="ukupnoStranica"
          @input="dohvatiOkuse"
          color="indigo accent-4"
        ></v-pagination>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="okus in okusi" :key="okus.id" cols="12" sm="6" md="4">
        <v-card color="pink lighten-5" class="mb-4" style="height: 100%;">
          <v-img :src="okus.imageUrl" :alt="okus.name" width="100px" height="150px" style="padding: 10px;"></v-img>
          <v-card-title class="pink--text text--darken-4">{{ okus.name }}</v-card-title>
          <v-card-text class="grey--text text--darken-1">{{ okus.description }}</v-card-text>
          <v-card-text class="grey--text text--darken-1">Sastojci: {{ okus.ingredients.join(', ') }}</v-card-text>
          <v-card-text class="grey--text text--darken-1">Recept: {{ okus.recipe }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      okusi: [],
      pretraga: '',
      stranica: 1,
      limit: 6,
      ukupnoOkusa: 0
    }
  },
  computed: {
    ukupnoStranica() {
      return Math.ceil(this.ukupnoOkusa / this.limit);
    }
  },
  methods: {
    dohvatiOkuse() {
      axios
        .get('http://localhost:3000/okusi', {
          params: {
            _page: this.stranica,
            _limit: this.limit,
            q: this.pretraga
          }
        })
        .then(response => {
          this.okusi = response.data;
          this.ukupnoOkusa = parseInt(response.headers['x-total-count']);
        });
    }
  },
  watch: {
    stranica() {
      this.dohvatiOkuse();
    },
    pretraga() {
      this.dohvatiOkuse();
    }
  },
  created() {
    this.dohvatiOkuse();
  }
};
</script>



<style scoped>
.v-card__title,
.v-card__text {
  min-height: 100px;
}

.v-row {
  margin-right: -8px; /* Uklanja unutarnji prostor između stupaca */
}

.v-col {
  padding-right: 8px; /* Dodaje razmak između stupaca */
}
</style>
