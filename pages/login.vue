<template>
  <div class="min-h-screen bg-[#060912] flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <div class="flex items-center justify-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <span class="text-white font-bold text-lg">F</span>
        </div>
        <span class="text-white font-bold text-xl tracking-tight">FlowDesk</span>
      </div>

      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-2xl p-8">
        <h1 class="text-white text-2xl font-bold mb-1">Welcome back</h1>
        <p class="text-gray-500 text-sm mb-6">Sign in to your FlowDesk account</p>

        <div
          v-if="errorMessage"
          class="mb-4 p-3 bg-red-500/10 border border-red-500/20 
                 rounded-lg text-red-400 text-sm"
        >
          {{ errorMessage }}
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-gray-400 text-sm block mb-1.5">Email</label>
            <UInput
              v-model="email"
              type="email"
              placeholder="you@example.com"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </div>

          <div>
            <label class="text-gray-400 text-sm block mb-1.5">Password</label>
            <UInput
              v-model="password"
              type="password"
              placeholder="••••••••"
              size="lg"
              class="w-full"
              :disabled="loading"
            />
          </div>

          <UButton
            :label="loading ? 'Signing in...' : 'Sign in'"
            color="primary"
            size="lg"
            class="w-full justify-center"
            :loading="loading"
            :disabled="loading"
            @click="handleLogin"
          />
        </div>

        <p class="text-center text-gray-500 text-sm mt-6">
          Don't have an account?
          <NuxtLink to="/signup" class="text-indigo-400 hover:underline">
            Sign up free
          </NuxtLink>
        </p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  await navigateTo('/dashboard')
}
</script>