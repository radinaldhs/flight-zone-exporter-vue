<template>
  <Card class="p-6">
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">SPK Management</h3>
        <p class="text-sm text-muted-foreground">Check or delete existing SPK data from ArcGIS</p>
      </div>

      <div class="flex gap-2">
        <Button @click="handleCheck" :disabled="!spkNumber || loading" variant="outline">
          <Search class="h-4 w-4" />
          Check SPK
        </Button>

        <Button
          @click="showDeleteConfirm = true"
          :disabled="!spkNumber || loading"
          variant="destructive"
        >
          <Trash2 class="h-4 w-4" />
          Delete SPK
        </Button>
      </div>

      <Alert v-if="checkResult" variant="default">
        <InfoIcon class="h-4 w-4" />
        <div class="ml-2">
          <p class="font-medium">SPK Status</p>
          <p class="text-sm">
            {{ checkResult.exists ? `Found ${checkResult.count} record(s)` : 'No records found' }}
          </p>
        </div>
      </Alert>

      <!-- Delete Confirmation Dialog -->
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click.self="showDeleteConfirm = false"
      >
        <Card class="p-6 max-w-md mx-4">
          <h3 class="text-lg font-semibold mb-2">Confirm Deletion</h3>
          <p class="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete all features for SPK <strong>{{ spkNumber }}</strong>?
            This action cannot be undone.
          </p>
          <div class="flex gap-2 justify-end">
            <Button variant="outline" @click="showDeleteConfirm = false">
              Cancel
            </Button>
            <Button variant="destructive" @click="handleDelete">
              Delete
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Search, Trash2, Info as InfoIcon } from 'lucide-vue-next'
import Card from './ui/Card.vue'
import Button from './ui/Button.vue'
import Alert from './ui/Alert.vue'
import { useFlightZoneStore } from '@/stores/flightZone'
import { storeToRefs } from 'pinia'

const store = useFlightZoneStore()
const { spkNumber, loading, spkCheckResult } = storeToRefs(store)

const showDeleteConfirm = ref(false)
const checkResult = ref(null)

const handleCheck = async () => {
  try {
    const result = await store.checkSPK()
    checkResult.value = result
  } catch (error) {
    console.error('Check failed:', error)
  }
}

const handleDelete = async () => {
  try {
    await store.deleteSPK()
    showDeleteConfirm.value = false
    checkResult.value = null
  } catch (error) {
    console.error('Delete failed:', error)
  }
}
</script>
