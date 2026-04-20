<template>
    <form @submit.prevent="submitForm" class="conversion-form">
        <div class="form-group">
            <label for="amount">Monto a convertir</label>
            <InputNumber 
                id="amount" 
                v-model="amount" 
                mode="decimal" 
                :minFractionDigits="0" 
                :maxFractionDigits="4"
                :disabled="isLoading"
                placeholder="0.00"
                autocomplete="off"
                fluid
            />
        </div>

        <div class="currency-selectors">
            <div class="form-group flex-1">
                <label for="fromCurrency">De</label>
                <Select 
                    id="fromCurrency"
                    v-model="fromCurrency" 
                    :options="fromDropdownOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    optionDisabled="disabled"
                    :disabled="isLoading"
                    fluid
                />
            </div>
            
            <div class="swap-action">
                <Button 
                    type="button" 
                    severity="secondary" 
                    variant="text" 
                    rounded 
                    aria-label="Invertir divisas"
                    @click="swapCurrencies"
                    :disabled="isLoading || !fromCurrency || !toCurrency"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </Button>
            </div>
            
            <div class="form-group flex-1">
                <label for="toCurrency">A</label>
                <Select 
                    id="toCurrency"
                    v-model="toCurrency" 
                    :options="toDropdownOptions" 
                    optionLabel="label" 
                    optionValue="value"
                    optionDisabled="disabled"
                    :disabled="isLoading"
                    fluid
                />
            </div>
        </div>

        <div class="action-wrapper">
            <Button 
                type="submit" 
                label="Calcular Conversión" 
                :loading="isLoading" 
                :disabled="!isValid"
                severity="primary"
                fluid
            />
        </div>

        <div v-if="error" class="institutional-error-banner">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <span>{{ error }}</span>
        </div>
    </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Button from 'primevue/button';

const emit = defineEmits<{
    (e: 'converted', data: any): void;
}>();

const amount = ref<number | null>(null);
const fromCurrency = ref<string>('UF');
const toCurrency = ref<string>('CLP');
const isLoading = ref(false);
const error = ref<string | null>(null);

const currencyOptions = ref<{label: string, value: string}[]>([]);

const topologyMatrix = ref<Record<string, string[]>>({});

onMounted(async () => {
    try {
        const response = await fetch('/api/currencies');
        if (response.ok) {
            const data = await response.json();
            currencyOptions.value = data.currencies.map((currency: string) => ({
                label: currency,
                value: currency
            }));
            topologyMatrix.value = data.matrix;
        }
    } catch (e) {
        // Fallback or leave empty
    }
});

const isValid = computed(() => {
    return amount.value !== null && amount.value > 0 && fromCurrency.value !== toCurrency.value && currencyOptions.value.length > 0;
});

const fromDropdownOptions = computed(() => {
    if (Object.keys(topologyMatrix.value).length === 0) return currencyOptions.value;
    return currencyOptions.value.map(opt => {
        // ¿Si el usuario eligiera esta divisa como FROM, tendría a "toCurrency" como una opción válida de destino?
        const allowedTargets = topologyMatrix.value[opt.value] || [];
        const canReachTarget = allowedTargets.includes(toCurrency.value);
        return { ...opt, disabled: !canReachTarget && opt.value !== fromCurrency.value };
    });
});

const toDropdownOptions = computed(() => {
    if (Object.keys(topologyMatrix.value).length === 0) return currencyOptions.value;
    return currencyOptions.value.map(opt => {
        // ¿Dado nuestro fromCurrency actual, es esta opción un destino válido?
        const allowedTargets = topologyMatrix.value[fromCurrency.value] || [];
        const isAllowed = allowedTargets.includes(opt.value);
        return { ...opt, disabled: !isAllowed && opt.value !== toCurrency.value };
    });
});

import { watch } from 'vue';

// Si el usuario fuerza un cambio que deja el grafo en estado inválido, nos autocorregimos al instante
watch(toCurrency, (newTo) => {
    const allowedTargets = topologyMatrix.value[fromCurrency.value] || [];
    if (!allowedTargets.includes(newTo) && allowedTargets.length > 0) {
        toCurrency.value = allowedTargets[0];
    }
});

watch(fromCurrency, (newFrom) => {
    const allowedTargets = topologyMatrix.value[newFrom] || [];
    if (!allowedTargets.includes(toCurrency.value) && allowedTargets.length > 0) {
        toCurrency.value = allowedTargets[0];
    }
});

const swapCurrencies = () => {
    // Solo permitimos invertir si la inversión es topológicamente inválida de antemano el watcher lo corregirá, 
    // pero idealmente evitamos que se tranque.
    const tempTo = toCurrency.value;
    const tempFrom = fromCurrency.value;
    
    // Asignar provocará auto-correccion, pero la UI intentará cruzar.
    fromCurrency.value = tempTo;
    // El watcher actuará aquí si es necesario
    toCurrency.value = tempFrom;
};

const submitForm = async () => {
    if (!isValid.value || isLoading.value) return;
    
    // UI lock previene doble envio (USR.RS.01.MIX)
    isLoading.value = true;
    error.value = null;

    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount.value,
                fromCurrency: fromCurrency.value,
                toCurrency: toCurrency.value
            })
        });

        if (!response.ok) {
            let errorMsg = "No se pudo completar la conversión.";
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMsg = errorData.error;
                    if (errorData.details) {
                         errorMsg += `: ${errorData.details}`;
                    }
                } else if (errorData.message) {
                    errorMsg = errorData.message;
                }
            } catch (e) {
                // Si el backend no arroja JSON (ej. 502 Bad Gateway del proxy), fallback genérico
            }
            throw new Error(errorMsg);
        }

        const data = await response.json();
        emit('converted', data);
    } catch (e: any) {
        error.value = e.message || "Error de conexión con el servicio backend.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
.conversion-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
}

.currency-selectors {
    display: flex;
    gap: var(--space-md);
    align-items: flex-end;
}

.swap-action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 4px;
}

.flex-1 {
    flex: 1;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
}

.action-wrapper {
    margin-top: var(--space-sm);
}

.institutional-error-banner {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: var(--space-sm);
    padding: 0.75rem 1rem;
    background-color: oklch(0.97 0.02 15);
    border-left: 4px solid oklch(0.6 0.2 30);
    border-radius: 4px;
    color: oklch(0.3 0.1 15);
    font-size: 0.875rem;
    font-weight: 500;
}
.institutional-error-banner svg {
    flex-shrink: 0;
    color: oklch(0.6 0.2 30);
}
</style>
