<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ConversionForm from './components/ConversionForm.vue';
import ResultDisplay from './components/ResultDisplay.vue';

const conversionData = ref<any>(null);
const isHealthy = ref(false);
const isVerifying = ref(true);
const currentRateData = ref<any>(null);

const verifyHealth = async () => {
    try {
        const res = await fetch('/health');
        if (!res.ok) throw new Error('Unhealthy');
        const data = await res.json();
        if (data.status === 'ok') {
            isHealthy.value = true;
            currentRateData.value = data.lastKnownRate;
        } else {
            isHealthy.value = false;
        }
    } catch (e) {
        isHealthy.value = false;
    } finally {
        isVerifying.value = false;
    }
};

onMounted(() => {
    verifyHealth();
});

const handleConversion = (data: any) => {
    conversionData.value = data;
};
</script>

<template>
  <div class="institutional-card">
    <div class="brand-header">
      <h1>Conversor de Divisas</h1>
      <p>Tipos de cambio e indicadores chilenos actualizados en tiempo real.</p>
    </div>

    <!-- Zero-Trust UI Blocked rendering state -->
    <div v-if="isVerifying" class="verifying-state">
      <span>Conectando con servidor de forma segura...</span>
    </div>

    <div v-else-if="!isHealthy" class="fatal-error-state">
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
         <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
      </svg>
      <strong>Sistema No Disponible</strong>
      <p>El servicio se encuentra temporalmente inactivo. Por favor, intente más tarde.</p>
    </div>
    
    <div v-else class="app-content">
        <ConversionForm @converted="handleConversion" />

        <ResultDisplay 
          v-if="conversionData"
          :result="conversionData.result"
          :originalAmount="conversionData.amount"
          :fromCurrency="conversionData.fromCurrency"
          :targetCurrency="conversionData.toCurrency"
          :rate="conversionData.rateApplied"
          :source="conversionData.source"
        />
    </div>
  </div>
</template>

<style scoped>
.verifying-state {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.875rem;
  padding: var(--space-lg) 0;
}

.fatal-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--space-xl) var(--space-md);
  background-color: oklch(0.98 0.02 15);
  border: 1px solid oklch(0.85 0.05 15);
  border-radius: 8px;
  gap: var(--space-sm);
  color: oklch(0.4 0.1 15);
}

.fatal-error-state svg {
  color: oklch(0.6 0.2 30);
}

.fatal-error-state strong {
  font-size: 1.1rem;
}

.fatal-error-state p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.app-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
