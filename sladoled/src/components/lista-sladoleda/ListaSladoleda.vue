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
        <v-btn color="pink" fab dark fixed bottom right @click="openNewModal">
          <v-icon>mdi-plus</v-icon>Dodaj novi okus.
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
          <v-alert v-model="prikaziAlert" :type="alertTip" closable>
                  {{ alertPoruka }}
          </v-alert>
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
            <v-icon
                color="pink"
                icon="mdi-ice-cream"
                size="x-large"
              ></v-icon>
          </v-card-title>

          <v-card-item>
            <v-card-title>{{ okus.name }}</v-card-title>
            <v-card-subtitle>
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
            <v-btn color="pink" text @click="openEditModal(okus)">
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
  <uredi-dodaj-form
    :modal-visible="noviOkusModal"
    modal-title="Dodaj novi sladoled"
    :form-values="noviOkus"
    submit-button-text="Dodaj"
    @submit="submitNoviOkus"
    @close="noviOkusModal = false"
  ></uredi-dodaj-form>

  <!-- Modal za uređivanje sladoleda -->
  <uredi-dodaj-form
    :modal-visible="urediOkusModal"
    modal-title="Uredi sladoled"
    :form-values="urediOkus"
    submit-button-text="Spremi"
    @submit="submitUrediOkus"
    @close="urediOkusModal = false"
  ></uredi-dodaj-form>
  </v-container>
</template>

<script>
import axios from 'axios';
import UrediDodajForm from '../forma/UrediDodajForm.vue';

export default {
  components: {
    UrediDodajForm,
  },
  data() {
    return {
      prikaziAlert: false,
      alertPoruka: '',
      alertTip: 'success',
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
        .get('https://grizzly-first-clave.glitch.me/okusi', {
          params: {
            _page: this.stranica,
            _limit: this.limit,
            q: this.pretraga,
          },
        })
        .then((response) => {
          this.okusi = response.data.map((okus) => {
            if (typeof okus.ingredients === 'string') {
              okus.ingredients = okus.ingredients.split(',').map((ingredient) => ingredient.trim());
            }
            return okus;
          });
          this.ukupnoOkusa = parseInt(response.headers['x-total-count']);
        });
    },
    dodajOkus() {
      axios
        .post('https://grizzly-first-clave.glitch.me/okusi', this.noviOkus)
        .then(() => {
          this.alertPoruka = 'Dodali ste novi okus: ' + this.noviOkus.name;
          this.alertTip = 'success';
          this.prikaziAlert = true;
          this.noviOkus = {};
          this.dohvatiOkuse();
        })
        .catch((error) => {
          this.alertPoruka = 'Došlo je do greške';
          this.alertTip = 'error';
          this.prikaziAlert = true;
          console.log(error);
        });
    },
    urediOkuse() {
      axios
        .put(`https://grizzly-first-clave.glitch.me/okusi/${this.urediOkus.id}`, this.urediOkus)
        .then(() => {
          this.alertPoruka = 'Uredili ste okus: ' + this.urediOkus.name;
          this.alertTip = 'info';
          this.prikaziAlert = true;
          this.noviOkus = {};
          this.urediOkus = {};
          this.dohvatiOkuse();
        })
        .catch((error) => {
          this.alertPoruka = 'Došlo je do greške';
          this.alertTip = 'error';
          this.prikaziAlert = true;
          console.log(error);
        });
    },
    obrisiOkus(okus) {
      axios
        .delete(`https://grizzly-first-clave.glitch.me/okusi/${okus.id}`)
        .then(() => {
          this.alertPoruka = 'Obrisali ste okus: ' + okus.name;
          this.alertTip = 'warning';
          this.prikaziAlert = true;
          this.dohvatiOkuse();
        })
        .catch((error) => {
          this.alertPoruka = 'Došlo je do greške';
          this.alertTip = 'error';
          this.prikaziAlert = true;
          console.log(error);
        });
    },
    submitNoviOkus(noviOkus) {
      this.noviOkus = {
        ...noviOkus,
        ingredients: noviOkus.ingredients.split(',').map((ingredient) => ingredient.trim())
      };
      this.dodajOkus();
      this.noviOkusModal = false;
    },
    submitUrediOkus(urediOkus) {
      this.urediOkus = {
        ...urediOkus,
        ingredients: urediOkus.ingredients.split(',').map((ingredient) => ingredient.trim())
      };
      this.urediOkuse();
      this.urediOkusModal = false;
    },
    openNewModal() {
      this.noviOkusModal = true;
      this.noviOkus = {};
    },
    openEditModal(okus) {
      this.urediOkusModal = true;
      this.urediOkus = { ...okus };
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
