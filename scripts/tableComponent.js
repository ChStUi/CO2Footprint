const { createApp, defineComponent } = Vue;

const DataTable = defineComponent({
    props: ['daten', 'sErrorMessage'],
    emits: ['sort'],
    template: `
    <div>
        <p v-if="sErrorMessage" class="error-message">{{ sErrorMessage }}</p>
        <table>
            <thead>
                <tr>
                    <th @click="$emit('sort', 'Land')">Land ⬆⬇</th>
                    <th @click="$emit('sort', 'Unternehmen')">Unternehmen ⬆⬇</th>
                    <th @click="$emit('sort', 'Emissionen')">CO2-Emissionen</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in daten" :key="item.Land + item.Unternehmen">
                    <td>{{ item.Land }}</td>
                    <td>{{ item.Unternehmen }}</td>
                    <td>{{ item.Emissionen }}</td>
                </tr>
                <tr v-if="!daten.length">
                    <td colspan="3" class="no-results">Keine Ergebnisse gefunden</td>
                </tr>
            </tbody>
        </table>
    </div>`
});

const app = createApp({
    components: {
        'data-table': DataTable
    },
    data() {
        return {
            sFilterLand: '',
            sFilterUnternehmen: '',
            sSortFeld: 'Land',
            nSortRichtung: 1,
            aDaten: [],
            sErrorMessage: '',
            oInputError: { sFilterLand: false, sFilterUnternehmen: false }
        };
    },
    computed: {
        gefilterteDaten() {
            const gefiltert = this.aDaten
                .filter(oEintrag => 
                    this.isValidInput('sFilterLand', this.sFilterLand) &&
                    this.isValidInput('sFilterUnternehmen', this.sFilterUnternehmen) &&
                    oEintrag.Land.toLowerCase().includes(this.sanitizeInput(this.sFilterLand).toLowerCase()) &&
                    oEintrag.Unternehmen.toLowerCase().includes(this.sanitizeInput(this.sFilterUnternehmen).toLowerCase())
                )
                .sort((a, b) => {
                    if (a[this.sSortFeld] < b[this.sSortFeld]) return -1 * this.nSortRichtung;
                    if (a[this.sSortFeld] > b[this.sSortFeld]) return 1 * this.nSortRichtung;
                    return 0;
                });
            
            this.sErrorMessage = gefiltert.length ? '' : "Keine Daten gefunden! Bitte überprüfen Sie Ihre Eingabe.";
            return gefiltert;
        }
    },
    methods: {
        sanitizeInput(sInput) {
            return sInput.replace(/[^a-zA-Z äöüÄÖÜß-]/g, '');
        },
        
        isValidInput(sField, sInput) {
            if (!sInput) {
                this.oInputError[sField] = false;
                return true;
            }
            if (/[^a-zA-Z äöüÄÖÜß-]/.test(sInput)) {
                this.sErrorMessage = "Keine Daten gefunden! Bitte überprüfen Sie Ihre Eingabe.";
                this.oInputError[sField] = true;
                return false;
            }
            this.oInputError[sField] = false;
            return true;
        },
        sortBy(sFeld) {
            this.nSortRichtung = this.sSortFeld === sFeld ? -this.nSortRichtung : 1;
            this.sSortFeld = sFeld;
        },
        
        async fetchDaten() {
            try {
                const response = await fetch('../public/data/emissions.json');
                this.aDaten = await response.json();
            } catch (error) {
                console.error('Fehler beim Laden der Daten:', error);
                this.sErrorMessage = "Fehler beim Laden der Daten.";
            }
        }
    },
    mounted() {
        this.fetchDaten();
    }
});

app.mount('#app');
