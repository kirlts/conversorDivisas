<template>
  <div v-if="result !== null" class="result-display">
    <div class="result-amount">
      {{ formattedResult }}
    </div>
    
    <div class="result-metadata">
      <div class="meta-item">
        <span class="meta-label">Tasa Aplicada</span>
        <span class="meta-value">{{ formattedRateString }}</span>
      </div>
      <div class="meta-item text-right">
        <span class="meta-label">Estado del dato</span>
        <span class="meta-value"><span :class="sourceClass(source)" class="source-badge">{{ userFriendlySource(source) }}</span></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    result: number | null;
    originalAmount: number | null;
    fromCurrency: string;
    targetCurrency: string;
    rate: number;
    source: string;
}>();

const formattedResult = computed(() => {
    if (props.result === null) return '';
    const isBaseClp = props.targetCurrency === 'CLP';
    
    // Usamos es-CL para respetar la convencion chilena tradicional (coma decimal, punto de miles)
    const formatter = new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: isBaseClp ? 0 : 2,
        maximumFractionDigits: isBaseClp ? 2 : 6,
    });
    
    const formattedNum = formatter.format(props.result);
    // Para CLP, anteponer $. Para otros, usar sufijo natural.
    return isBaseClp ? `$${formattedNum}` : `UF ${formattedNum}`.replace('UF', props.targetCurrency);
});

const formattedRateString = computed(() => {
    if (!props.originalAmount || props.originalAmount === 0 || props.result === null) return '';
    const unitRate = props.result / props.originalAmount;
    
    const formatter = new Intl.NumberFormat('es-CL', {
        minimumFractionDigits: 0,
        maximumFractionDigits: props.targetCurrency === 'CLP' ? 2 : 6
    });
    
    return `1 ${props.fromCurrency} = ${formatter.format(unitRate)} ${props.targetCurrency}`;
});

const userFriendlySource = (src: string) => {
    switch (src?.toLowerCase()) {
        case 'api': return 'Actualizado en línea';
        case 'cache': return 'Valor vigente del día';
        case 'fallback': return 'Dato histórico de respaldo';
        default: return src;
    }
};

const sourceClass = (src: string) => `source-${src?.toLowerCase() || 'unknown'}`;
</script>

<style scoped>
.result-display {
    background-color: oklch(0.98 0.01 260);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: var(--space-md) var(--space-lg);
}

.result-amount {
    font-size: 2.25rem;
    font-weight: 700;
    color: var(--corporate-blue);
    text-align: center;
    margin-bottom: var(--space-md);
    letter-spacing: -0.02em;
}

.result-metadata {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    padding-top: var(--space-sm);
    font-size: 0.75rem;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.meta-item.text-right {
    align-items: flex-end;
}

.meta-label {
    color: var(--text-muted);
    font-weight: 500;
}

.meta-value {
    color: var(--text-primary);
    font-weight: 600;
}

.source-badge {
    text-transform: uppercase;
    font-size: 0.65rem;
    padding: 3px 6px;
    border-radius: 4px;
    letter-spacing: 0.05em;
    font-weight: 700;
}

.source-cache {
    background-color: oklch(0.6 0.15 150 / 0.1);
    color: var(--success-green);
}

.source-api {
    background-color: oklch(0.35 0.1 260 / 0.1);
    color: var(--corporate-blue);
}

.source-fallback {
    background-color: oklch(0.6 0.2 30 / 0.1);
    color: oklch(0.6 0.2 30);
}
</style>
