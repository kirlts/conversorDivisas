import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';
import App from './App.vue';
import './style.css';

const CorporatePreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#eef4fd',
            100: '#d9e6fa',
            200: '#b6d0f6',
            300: '#83aef0',
            400: '#4d87e6',
            500: '#2665d6', // Pure modern institutional blue
            600: '#1b4fb6', 
            700: '#153e92', 
            800: '#15367a', 
            900: '#162e60',
            950: '#0f1d3c'
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{primary.800}',
                    inverseColor: '#ffffff',
                    hoverColor: '{primary.900}',
                    activeColor: '{primary.950}'
                },
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.100}',
                    color: '{primary.800}',
                    focusColor: '{primary.900}'
                }
            }
        }
    }
});

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: CorporatePreset,
        options: {
            prefix: 'p',
            darkModeSelector: 'none',
            cssLayer: false
        }
    }
});

app.mount('#app');
