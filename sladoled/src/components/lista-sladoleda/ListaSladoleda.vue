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
        <v-btn color="pink" fab dark fixed bottom right @click="noviOkusModal = true">
        <v-icon>mdi-plus</v-icon>Dodaj novi okus.
      </v-btn>
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
        <v-card class="mx-auto my-12" max-width="374">
          <v-card-title class="white--text" style="background-color: pink">
            <v-img
              cover
              height="100px"
              width="100px"
              :src="okus.imageUrl"
              :alt="okus.name"
              class="mx-auto my-2"
            ></v-img>
          </v-card-title>

          <v-card-item>
            <v-card-title>{{ okus.name }}</v-card-title>
            <v-card-subtitle>
              <v-icon
                color="pink darken-4"
                icon="mdi-ice-cream"
                size="small"
              ></v-icon>
              {{ okus.description }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <div v-if="okus.ingredients && okus.ingredients.length > 0">
              Sastojci: {{ okus.ingredients.join(', ') }}
            </div>
            <div v-else>
              Sastojci: Nema dostupnih sastojaka.
            </div>
            <div class="my-4 text-subtitle-1">Recept: {{ okus.recipe }}</div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="pink" text @click="urediOkusModal = true; urediOkus = okus">
              Uredi
            </v-btn>

            <v-btn color="pink" text @click="obrisiOkus(okus)">
              Obriši
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal za dodavanje novog sladoleda -->
    <v-dialog v-model="noviOkusModal" max-width="600px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5 indigo--text">Dodaj novi sladoled</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="noviOkusForm" @submit.prevent="submitNoviOkus">
            <v-text-field v-model="noviOkus.name" label="Naziv" required></v-text-field>
            <v-text-field v-model="noviOkus.description" label="Opis" required></v-text-field>
            <v-textarea v-model="noviOkus.ingredients" label="Sastojci (odvojeni zarezom)" required></v-textarea>
            <v-textarea v-model="noviOkus.recipe" label="Recept" required></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="noviOkusModal = false">Odustani</v-btn>
          <v-btn color="primary" text @click="submitNoviOkus">Dodaj</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal za uređivanje sladoleda -->
    <v-dialog v-model="urediOkusModal" max-width="600px">
      <v-card>
        <v-card-title>
          <h2 class="text-h5 indigo--text">Uredi sladoled</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="urediOkusForm" @submit.prevent="submitUrediOkus">
            <v-text-field v-model="urediOkus.name" label="Naziv" required></v-text-field>
            <v-text-field v-model="urediOkus.description" label="Opis" required></v-text-field>
            <v-textarea v-model="urediOkus.ingredients" label="Sastojci (odvojeni zarezom)" required></v-textarea>
            <v-textarea v-model="urediOkus.recipe" label="Recept" required></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="urediOkusModal = false">Odustani</v-btn>
          <v-btn color="primary" text @click="submitUrediOkus">Spremi</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      ukupnoOkusa: 0,
      noviOkus: {},
      urediOkus: {},
      noviOkusModal: false,
      urediOkusModal: false,
    };
  },
  computed: {
    ukupnoStranica() {
      return Math.ceil(this.ukupnoOkusa / this.limit);
    },
  },
  methods: {
    dohvatiOkuse() {
      axios
        .get('http://localhost:3000/okusi', {
          params: {
            _page: this.stranica,
            _limit: this.limit,
            q: this.pretraga,
          },
        })
        .then((response) => {
          this.okusi = response.data;
          this.ukupnoOkusa = parseInt(response.headers['x-total-count']);
        });
    },
    dodajOkus() {
      const ingredients = this.noviOkus.ingredients.split(',').map((ingredient) => ingredient.trim());

      const noviOkusObj = {
        name: this.noviOkus.name,
        description: this.noviOkus.description,
        ingredients: ingredients,
        recipe: this.noviOkus.recipe,
      };

      axios
        .post('http://localhost:3000/okusi', noviOkusObj)
        .then(() => {
          alert('Dodali ste novi okus: ' + noviOkusObj.name);
          this.noviOkus = {};
          this.dohvatiOkuse();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  urediOkuse() {
      const ingredients = this.urediOkus.ingredients.split(',').map((ingredient) => ingredient.trim());

      const urediOkusObj = {
        name: this.urediOkus.name,
        description: this.urediOkus.description,
        ingredients: ingredients,
        recipe: this.urediOkus.recipe,
      };

      axios
        .put(`http://localhost:3000/okusi/${this.urediOkus.id}`, urediOkusObj)
        .then(() => {
          alert('Uredili ste okus: ' + urediOkusObj.name);
          this.urediOkus = {}; // Clear the urediOkus object
          this.dohvatiOkuse();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  obrisiOkus(okus) {
      axios
        .delete(`http://localhost:3000/okusi/${okus.id}`)
        .then(() => {
          alert('Obrisali ste okus: ' + okus.name);
          this.dohvatiOkuse();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  submitNoviOkus() {
      if (this.$refs.noviOkusForm.validate()) {
        this.dodajOkus();
        this.noviOkusModal = false;
        this.$refs.noviOkusForm.reset();
      }
    },
  submitUrediOkus() {
      if (this.$refs.urediOkusForm.validate()) {
        this.urediOkuse();
        this.urediOkusModal = false;
        this.$refs.urediOkusForm.reset();
      }
    },
  },
  watch: {
    stranica() {
      this.dohvatiOkuse();
    },
    pretraga() {
      this.dohvatiOkuse();
    },
  },
  created() {
    this.dohvatiOkuse();
  },
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

.v-img {
  margin: auto; /* Centrira sliku */
}
</style>
